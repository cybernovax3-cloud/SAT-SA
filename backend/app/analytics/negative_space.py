"""
Negative Space Analytics - SAT-SA
Identifies security evidence GAPS: what is absent, missing, or unexpectedly quiet.

Only uses fields that actually exist in the normalized SAT-SA event structure:
  event_id, timestamp, source, activity_type, agent (id/name/ip),
  rule (id/severity/description), decoder, location, full_log, evidence_quality
"""

from collections import defaultdict
from datetime import datetime, timezone, timedelta


class NegativeSpaceAnalytics:

    # Minimum events per agent to be considered "actively reporting"
    ACTIVE_AGENT_MIN_EVENTS = 3

    # Hours within which an active agent is expected to have produced at least one event
    RECENCY_WINDOW_HOURS = 6

    # Threshold: if the latest complete hour has fewer events than this
    # fraction of the per-hour mean, flag low activity
    LOW_ACTIVITY_FRACTION = 0.25

    # Minimum number of hours needed to establish a reliable hourly baseline
    MIN_HOURS_FOR_BASELINE = 3

    def calculate(self, normalized: list) -> dict:
        """
        Analyse the normalized event list and return Negative Space indicators.
        """

        if not normalized:
            return self._empty_result("No normalized events available to analyze.")

        indicators = []

        # 1. Telemetry gap: agent active in window but silent recently
        telemetry_indicators = self._check_telemetry_gaps(normalized)
        indicators.extend(telemetry_indicators)

        # 2. Low alert activity relative to hourly baseline
        low_activity = self._check_low_alert_activity(normalized)
        if low_activity:
            indicators.append(low_activity)

        # 3. High-severity events with no follow-up activity
        follow_up = self._check_high_severity_silence(normalized)
        if follow_up:
            indicators.append(follow_up)

        # Score: critical=3, high=2, medium=1, low=0
        severity_weights = {"critical": 3, "high": 2, "medium": 1, "low": 0}
        score = sum(severity_weights.get(ind["severity"], 0) for ind in indicators)

        indicator_count = len(indicators)

        if indicator_count == 0:
            status = "normal"
            message = (
                "No significant negative-space indicators identified "
                "from available telemetry."
            )
        elif score >= 6:
            status = "critical"
            message = (
                f"{indicator_count} negative-space indicator(s) require immediate attention."
            )
        else:
            status = "attention_required"
            message = (
                f"{indicator_count} negative-space indicator(s) identified - "
                "review recommended."
            )

        return {
            "negative_space_score": score,
            "indicator_count": indicator_count,
            "status": status,
            "indicators": indicators,
            "message": message,
        }

    def _parse_ts(self, ts_str: str):
        """Return a timezone-aware datetime from an ISO-8601 string, or None."""
        if not ts_str:
            return None
        try:
            ts_str = ts_str.replace("Z", "+00:00")
            if len(ts_str) > 19 and ts_str[-5] in ("+", "-") and ":" not in ts_str[-5:]:
                ts_str = ts_str[:-2] + ":" + ts_str[-2:]
            return datetime.fromisoformat(ts_str)
        except Exception:
            return None

    def _check_telemetry_gaps(self, normalized: list) -> list:
        """
        Find agents that produced enough events over the full window but
        have gone silent in the most recent RECENCY_WINDOW_HOURS hours.
        """
        indicators = []
        agent_info = {}

        for event in normalized:
            agent = event.get("agent") or {}
            aid = agent.get("id") or "unknown"
            name = agent.get("name") or aid
            ip = agent.get("ip") or "unknown"
            ts = self._parse_ts(event.get("timestamp"))

            if aid == "unknown":
                continue

            if aid not in agent_info:
                agent_info[aid] = {
                    "name": name,
                    "ip": ip,
                    "event_count": 0,
                    "last_seen": None,
                }
            agent_info[aid]["event_count"] += 1
            if ts and (agent_info[aid]["last_seen"] is None or ts > agent_info[aid]["last_seen"]):
                agent_info[aid]["last_seen"] = ts

        if not agent_info:
            return indicators

        now_ref = max(
            (info["last_seen"] for info in agent_info.values() if info["last_seen"]),
            default=None
        )
        if now_ref is None:
            return indicators

        cutoff = now_ref - timedelta(hours=self.RECENCY_WINDOW_HOURS)

        for aid, info in agent_info.items():
            if info["event_count"] < self.ACTIVE_AGENT_MIN_EVENTS:
                continue

            last_seen = info["last_seen"]
            if last_seen is None or last_seen < cutoff:
                hours_silent = (
                    (now_ref - last_seen).total_seconds() / 3600
                    if last_seen else float("inf")
                )
                indicators.append({
                    "type": "missing_telemetry",
                    "severity": "critical",
                    "title": f"Agent '{info['name']}' has no recent telemetry",
                    "description": (
                        f"Agent '{info['name']}' (id={aid}, ip={info['ip']}) "
                        f"had {info['event_count']} event(s) in the assessment window "
                        f"but has been silent for approximately "
                        f"{hours_silent:.1f} hour(s)."
                    ),
                    "evidence": (
                        f"Last seen: {last_seen.isoformat() if last_seen else 'unknown'}. "
                        f"Recency threshold: {self.RECENCY_WINDOW_HOURS}h."
                    ),
                })

        return indicators

    def _check_low_alert_activity(self, normalized: list):
        """
        Compare the most recent hour against the per-hour mean.
        Only flag if enough hours exist to establish a baseline.
        """
        hourly = defaultdict(int)
        for event in normalized:
            ts = self._parse_ts(event.get("timestamp"))
            if ts:
                key = ts.strftime("%Y-%m-%dT%H")
                hourly[key] += 1

        if len(hourly) < self.MIN_HOURS_FOR_BASELINE:
            return None

        hours_sorted = sorted(hourly.keys())
        baseline_hours = hours_sorted[:-1]
        baseline_counts = [hourly[h] for h in baseline_hours]
        mean = sum(baseline_counts) / len(baseline_counts)

        latest_hour = hours_sorted[-1]
        latest_count = hourly[latest_hour]

        if mean > 0 and latest_count < mean * self.LOW_ACTIVITY_FRACTION:
            return {
                "type": "low_alert_activity",
                "severity": "medium",
                "title": "Unexpectedly low alert activity in the latest hour",
                "description": (
                    f"The latest observed hour ({latest_hour}) recorded only "
                    f"{latest_count} event(s), compared to a per-hour baseline "
                    f"mean of {mean:.1f}. This may indicate a monitoring gap, "
                    f"agent failure, or suppressed detection."
                ),
                "evidence": (
                    f"Latest hour: {latest_count} events. "
                    f"Baseline mean ({len(baseline_hours)} hours): {mean:.1f} events/hour. "
                    f"Threshold: {self.LOW_ACTIVITY_FRACTION * 100:.0f}% of mean."
                ),
            }
        return None

    def _check_high_severity_silence(self, normalized: list):
        """
        If high-severity events (level >= 7) occurred but none exist in the
        most recent RECENCY_WINDOW_HOURS, flag a potential missing follow-up.
        """
        high_sev_events = []
        for event in normalized:
            severity = event.get("rule", {}).get("severity") or 0
            try:
                severity = int(severity)
            except (ValueError, TypeError):
                severity = 0
            if severity >= 7:
                ts = self._parse_ts(event.get("timestamp"))
                if ts:
                    high_sev_events.append(ts)

        if not high_sev_events:
            return None

        all_ts = [
            self._parse_ts(e.get("timestamp"))
            for e in normalized
            if e.get("timestamp")
        ]
        all_ts = [t for t in all_ts if t]
        if not all_ts:
            return None
        now_ref = max(all_ts)

        latest_high_sev = max(high_sev_events)
        age_hours = (now_ref - latest_high_sev).total_seconds() / 3600

        if age_hours > self.RECENCY_WINDOW_HOURS:
            return {
                "type": "missing_escalation_evidence",
                "severity": "high",
                "title": "High-severity events with no recent follow-up activity",
                "description": (
                    f"{len(high_sev_events)} high-severity Wazuh event(s) "
                    f"were detected in the assessment window, but no high-severity "
                    f"events have occurred in the past {age_hours:.1f} hour(s). "
                    "This may indicate suppressed detection or unresolved escalation."
                ),
                "evidence": (
                    f"Most recent high-severity event: {latest_high_sev.isoformat()}. "
                    f"Reference time: {now_ref.isoformat()}. "
                    f"Gap: {age_hours:.1f} hours."
                ),
            }
        return None

    def _empty_result(self, message: str) -> dict:
        return {
            "negative_space_score": 0,
            "indicator_count": 0,
            "status": "normal",
            "indicators": [],
            "message": message,
        }
