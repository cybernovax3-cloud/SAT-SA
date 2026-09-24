import os
import requests
from dotenv import load_dotenv

load_dotenv()


class WazuhIndexerError(RuntimeError):
    """Raised when the SAT-SA backend cannot read Wazuh Indexer data."""


class WazuhIndexer:

    def __init__(self):
        self.url = os.getenv("INDEXER_URL")
        self.username = os.getenv("INDEXER_USERNAME")
        self.password = os.getenv("INDEXER_PASSWORD")
        self.ca_cert = os.getenv("INDEXER_CA_CERT")
        self.verify_tls = os.getenv("INDEXER_VERIFY", "true").lower() in {
            "1", "true", "yes", "on"
        }

    def get_latest_alerts(self, limit=10):

        missing = [
            name for name, value in {
                "INDEXER_URL": self.url,
                "INDEXER_USERNAME": self.username,
                "INDEXER_PASSWORD": self.password,
            }.items() if not value
        ]
        if missing:
            raise WazuhIndexerError(
                "Missing required environment variable(s): " + ", ".join(missing)
            )

        index = "wazuh-alerts-4.x-*"

        query = {
            "size": limit,
            "sort": [
                {
                    "timestamp": {
                        "order": "desc"
                    }
                }
            ],
            "query": {
                "match_all": {}
            }
        }

        try:
            response = requests.get(
                f"{self.url.rstrip('/')}/{index}/_search",
                auth=(self.username, self.password),
                json=query,
                verify=self.ca_cert or self.verify_tls,
                timeout=10
            )
            response.raise_for_status()
        except requests.exceptions.RequestException as exc:
            # Keep the SAT-SA backend operational even when the external indexer is
            # unreachable. The UI can still render with empty datasets instead of
            # failing the entire service.
            return {"hits": {"hits": []}}

        return response.json()

