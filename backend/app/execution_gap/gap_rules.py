# ============================================================
# SAT-SA Execution Gap Detection -- Workflow Rules
# ============================================================
# Isolated configuration for expected SOC workflows by severity.
# Add or modify rules here without touching other modules.

from typing import List, Dict

# Severity thresholds (Wazuh rule level integers)
CRITICAL_LEVEL = 12
HIGH_LEVEL = 7
MEDIUM_LEVEL = 4

# Ordered list of expected actions per severity tier
WORKFLOW_RULES: Dict[str, List[str]] = {
    "critical": ["acknowledge", "investigate", "escalate", "remediate", "close"],
    "high":     ["acknowledge", "investigate", "remediate", "close"],
    "medium":   ["acknowledge", "investigate", "close"],
    "low":      ["acknowledge", "close"],
}

# Gap type identifiers -- add new types here
GAP_TYPES = {
    "ALERT_NOT_INVESTIGATED":              "Alert was not investigated after acknowledgement.",
    "CRITICAL_ALERT_NOT_ESCALATED":        "Critical severity alert was not escalated as required.",
    "ALERT_CLOSED_WITHOUT_REQUIRED_ACTION":"Alert was closed before completing required workflow steps.",
    "REPEATED_ALERT_WITHOUT_REMEDIATION":  "Alert type has recurred without remediation being recorded.",
    "REQUIRED_CONTROL_NOT_OBSERVED":       "A required control action was not observed in the workflow.",
}


def get_severity_tier(level) -> str:
    """Map a numeric Wazuh rule level to a severity tier string."""
    try:
        lvl = int(level or 0)
    except (ValueError, TypeError):
        lvl = 0
    if lvl >= CRITICAL_LEVEL:
        return "critical"
    if lvl >= HIGH_LEVEL:
        return "high"
    if lvl >= MEDIUM_LEVEL:
        return "medium"
    return "low"


def get_expected_workflow(severity_tier: str) -> List[str]:
    """Return the ordered expected workflow for a given severity tier."""
    return WORKFLOW_RULES.get(severity_tier, WORKFLOW_RULES["low"])
