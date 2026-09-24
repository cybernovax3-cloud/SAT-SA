class RiskAnalytics:
	"""Deterministic risk scoring, kept replaceable for a future ML model."""

	def calculate(self, alerts, behaviour, correlation, resilience):
		if not alerts:
			return {
				"overall_risk_score": 0,
				"risk_level": "low",
				"contributing_factors": [],
				"evidence_references": [],
				"explanation": "No normalized Wazuh evidence was available for assessment.",
			}

		profiles = behaviour.get("profiles", [])
		clusters = correlation.get("clusters", [])
		severities = [
			self._number(alert.get("rule", {}).get("severity"))
			for alert in alerts
		]
		high_severity = [
			alert for alert, severity in zip(alerts, severities) if severity >= 7
		]
		unusual = [
			profile for profile in profiles
			if profile.get("behaviour") == "unusual"
		]
		references = [alert.get("event_id") for alert in alerts]
		factors = [self._factor(
			"alert_severity",
			min(30, sum(severities) / len(severities) / 10 * 30),
			f"Average alert severity is {sum(severities) / len(severities):.1f}/10.",
			references,
		), self._factor(
			"event_frequency",
			min(15, len(alerts) / 10 * 15),
			f"{len(alerts)} event(s) were observed in the requested evidence window.",
			references,
		)]

		if high_severity:
			factors.append(self._factor(
				"high_severity_activity",
				min(15, len(high_severity) * 3),
				f"{len(high_severity)} event(s) have Wazuh severity 7 or higher.",
				[alert.get("event_id") for alert in high_severity],
			))
		if unusual:
			factors.append(self._factor(
				"behavioural_deviation",
				min(15, len(unusual) / len(alerts) * 15),
				f"{len(unusual)} event(s) deviate from the observed entity baseline.",
				[profile.get("event_id") for profile in unusual],
			))
		if clusters:
			cluster_references = [
				event_id for cluster in clusters
				for event_id in cluster.get("event_ids", [])
			]
			factors.append(self._factor(
				"correlated_evidence",
				min(15, len(clusters) * 5),
				f"{len(clusters)} correlated cluster(s) show repeated entity activity.",
				cluster_references,
			))

		resilience_score = self._number(
			resilience.get("resilience_score", 100), default=100
		)
		if resilience_score < 100:
			factors.append(self._factor(
				"operational_weakness",
				min(10, (100 - resilience_score) / 10),
				f"Resilience is {round(resilience_score)}/100.",
				references,
			))

		score = min(100, round(sum(factor["score"] for factor in factors)))
		level = "high" if score >= 70 else "medium" if score >= 40 else "low"
		evidence_references = list(dict.fromkeys(
			reference for factor in factors
			for reference in factor["evidence_references"]
			if reference
		))
		return {
			"overall_risk_score": score,
			"risk_level": level,
			"contributing_factors": factors,
			"evidence_references": evidence_references,
			"explanation": (
				f"Risk is {level} at {score}/100, based on alert severity, event activity, "
				"behavioural deviation, correlated evidence, and resilience indicators."
			),
		}

	@staticmethod
	def _number(value, default=0):
		try:
			return float(value)
		except (TypeError, ValueError):
			return default

	@staticmethod
	def _factor(name, score, explanation, references):
		return {
			"factor": name,
			"score": round(score, 2),
			"explanation": explanation,
			"evidence_references": [reference for reference in references if reference],
		}
