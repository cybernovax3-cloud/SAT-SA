# ============================================================
# SAT-SA Execution Gap Detection -- In-Memory Action Store
# ============================================================
# Stores analyst actions per incident_id for this server session.
# Completely isolated from Wazuh alert data.

from datetime import datetime, timezone
from threading import Lock
from typing import Dict, List, Optional


class GapActionStore:
    """Thread-safe in-memory store for execution gap analyst actions."""

    def __init__(self):
        self._store: Dict[str, List[dict]] = {}  # incident_id -> list of actions
        self._lock = Lock()

    def record_action(
        self,
        incident_id: str,
        action: str,
        analyst: str = "SOC Analyst",
        notes: Optional[str] = None,
    ) -> dict:
        """Record a new analyst action for an incident."""
        entry = {
            "action": action.lower(),
            "analyst": analyst,
            "notes": notes or "",
            "timestamp": datetime.now(timezone.utc).isoformat(),
        }
        with self._lock:
            if incident_id not in self._store:
                self._store[incident_id] = []
            existing = {a["action"] for a in self._store[incident_id]}
            if action.lower() not in existing:
                self._store[incident_id].append(entry)
        return entry

    def get_actions(self, incident_id: str) -> List[dict]:
        """Return all recorded actions for an incident."""
        with self._lock:
            return list(self._store.get(incident_id, []))

    def get_completed_action_names(self, incident_id: str) -> List[str]:
        """Return a list of completed action names (lowercase) for an incident."""
        return [a["action"] for a in self.get_actions(incident_id)]

    def list_all_incident_ids(self) -> List[str]:
        """Return all incident IDs that have at least one recorded action."""
        with self._lock:
            return list(self._store.keys())


# Singleton instance
gap_store = GapActionStore()
