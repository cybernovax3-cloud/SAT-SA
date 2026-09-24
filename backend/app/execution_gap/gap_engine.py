# ============================================================
# SAT-SA Execution Gap Detection -- Core Engine
# ============================================================
# Isolated from Wazuh alert processing. Reads normalized alerts
# from the existing pipeline (read-only) and compares expected
# vs observed analyst actions.

from typing import List, Optional
from .gap_rules import get_severity_tier, get_expected_workflow
from .gap_store import GapActionStore


class ExecutionGapEngine:

    def __init__(self, store: GapActionStore):
        self._store = store

    def analyze_incident(
        self,
        incident_id: str,
        alert_type: str,
        severity_level,
        activity_type: Optional[str] = None,
    ) -> dict:
        """
        Compare the expected SOC workflow for this alert against
        the analyst actions recorded in the gap store.
        Returns a structured execution-gap result.
        """
        severity_tier = get_severity_tier(severity_level)
        expected = get_expected_workflow(severity_tier)
        completed = self._store.get_completed_action_names(incident_id)
        completed_set = set(completed)

        missing = [a for a in expected if a not in completed_set]
        has_gap = bool(missing)
        gap_types = self._classify_gap_types(severity_tier, expected, completed_set, missing)

        return {
            "incident_id": incident_id,
            "alert_type": alert_type,
            "activity_type": activity_type or alert_type,
            "severity": severity_tier,
            "severity_level": int(severity_level or 0),
            "expected_actions": expected,
            "completed_actions": [a for a in expected if a in completed_set],
            "missing_actions": missing,
            "execution_gap": has_gap,
            "gap_types": gap_types,
            "recorded_actions": self._store.get_actions(incident_id),
        }

    def _classify_gap_types(self, severity_tier, expected, completed_set, missing) -> List[str]:
        """Classify which gap types apply based on workflow analysis."""
        types = []

        if "investigate" in expected and "investigate" not in completed_set:
            if "acknowledge" in completed_set:
                types.append("ALERT_NOT_INVESTIGATED")

        if severity_tier == "critical" and "escalate" not in completed_set:
            if "investigate" in completed_set:
                types.append("CRITICAL_ALERT_NOT_ESCALATED")

        if "close" in completed_set and missing:
            other_missing = [m for m in missing if m != "close"]
            if other_missing:
                types.append("ALERT_CLOSED_WITHOUT_REQUIRED_ACTION")

        if missing and not types:
            types.append("REQUIRED_CONTROL_NOT_OBSERVED")

        return types

    def build_statistics(self, all_results: List[dict]) -> dict:
        """Aggregate statistics across all analyzed incidents."""
        total = len(all_results)
        gaps = sum(1 for r in all_results if r["execution_gap"])
        critical_gaps = sum(1 for r in all_results if r["execution_gap"] and r["severity"] == "critical")
        missing_investigations = sum(1 for r in all_results if "ALERT_NOT_INVESTIGATED" in r["gap_types"])
        missing_escalations = sum(1 for r in all_results if "CRITICAL_ALERT_NOT_ESCALATED" in r["gap_types"])
        missing_remediations = sum(1 for r in all_results if "remediate" in r["missing_actions"])

        return {
            "total_incidents_assessed": total,
            "execution_gaps_detected": gaps,
            "critical_gaps": critical_gaps,
            "missing_investigations": missing_investigations,
            "missing_escalations": missing_escalations,
            "missing_remediations": missing_remediations,
            "gap_rate_percent": round(gaps / total * 100, 1) if total > 0 else 0,
        }
