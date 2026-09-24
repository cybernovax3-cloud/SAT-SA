class FindingGenerator:
	def generate(self, alerts, behaviour, correlation, attention, resilience, risk):
		alerts_by_id = {
			alert.get("event_id"): alert for alert in alerts if alert.get("event_id")
		}
		profiles = {
			profile.get("event_id"): profile
			for profile in behaviour.get("profiles", [])
		}
		findings = []
		covered_events = set()

		for cluster in correlation.get("clusters", []):
			event_ids = [
				event_id for event_id in cluster.get("event_ids", [])
				if event_id in alerts_by_id
			]
			if not event_ids:
				continue
			covered_events.update(event_ids)
			entity = cluster.get("entity", {})
			maximum_severity = self._number(cluster.get("maximum_severity"))
			severity = "high" if maximum_severity >= 10 else "medium" if maximum_severity >= 7 else "low"
			findings.append(self._build_finding(
				f"cluster-{entity.get('agent_id', 'unknown')}",
				"Correlated security activity requires supervisory review",
				severity,
				risk.get("overall_risk_score", 0),
				entity.get("agent_name") or entity.get("agent_id", "unknown"),
				[alerts_by_id[event_id] for event_id in event_ids],
				["correlated_evidence", "repeated_events"],
				f"{len(event_ids)} Wazuh event(s) were correlated for the same entity; maximum severity was {round(maximum_severity)}.",
				"Review the correlated events, validate containment, and document the supervisory response.",
				attention,
				resilience,
			))

		for event_id, alert in alerts_by_id.items():
			profile = profiles.get(event_id, {})
			severity_value = self._number(alert.get("rule", {}).get("severity"))
			if event_id in covered_events or (
				profile.get("behaviour") != "unusual" and severity_value < 7
			):
				continue
			reasons = list(profile.get("reasons", []))
			if severity_value >= 7:
				reasons.append("High-severity Wazuh event")
			findings.append(self._build_finding(
				f"event-{event_id}",
				"Unusual or high-severity security event",
				"high" if severity_value >= 10 else "medium",
				risk.get("overall_risk_score", 0),
				alert.get("agent", {}).get("name") or alert.get("agent", {}).get("id", "unknown"),
				[alert],
				reasons or ["event_activity"],
				"The event is directly supported by normalized Wazuh evidence and warrants examiner review.",
				"Validate the event context and record whether corrective action is required.",
				attention,
				resilience,
			))

		return {"total_findings": len(findings), "findings": findings}

	def _build_finding(self, finding_id, title, severity, risk_score, entity,
					   evidence, factors, explanation, recommendation,
					   attention, resilience):
		return {
			"finding_id": finding_id,
			"title": title,
			"severity": severity,
			"risk_score": risk_score,
			"affected_entity": entity,
			"evidence": evidence,
			"evidence_references": [
				item.get("event_id") for item in evidence if item.get("event_id")
			],
			"contributing_factors": factors,
			"explanation": explanation,
			"recommendation": recommendation,
			"confidence": self._confidence(evidence, attention, resilience),
		}

	@staticmethod
	def _number(value):
		try:
			return float(value)
		except (TypeError, ValueError):
			return 0

	@classmethod
	def _confidence(cls, evidence, attention, resilience):
		evidence_strength = min(0.4, len(evidence) * 0.1)
		attention_strength = min(0.3, cls._number(attention.get("attention_score")) / 100 * 0.3)
		resilience_strength = min(0.3, max(0, 100 - cls._number(resilience.get("resilience_score", 100))) / 100 * 0.3)
		return round(min(1, evidence_strength + attention_strength + resilience_strength), 2)
