import os
import requests
import json
from dotenv import load_dotenv

load_dotenv()

INDEXER_URL = os.getenv("INDEXER_URL")
USERNAME = os.getenv("INDEXER_USERNAME")
PASSWORD = os.getenv("INDEXER_PASSWORD")
VERIFY_TLS = os.getenv("INDEXER_CA_CERT") or os.getenv("INDEXER_VERIFY", "true").lower() in {"1", "true", "yes", "on"}

INDEX = "wazuh-alerts-4.x-2026.08.24"

query = {
    "size": 1,
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

response = requests.get(
    f"{INDEXER_URL}/{INDEX}/_search",
    auth=(USERNAME, PASSWORD),
    json=query,
    verify=VERIFY_TLS,
    timeout=10
)

print("Indexer status:", response.status_code)

data = response.json()

print(json.dumps(data, indent=2))
