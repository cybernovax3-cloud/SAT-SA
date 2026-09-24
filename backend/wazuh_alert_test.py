import os
import requests
import json
from dotenv import load_dotenv

load_dotenv()

WAZUH_URL = os.getenv("WAZUH_URL", "https://127.0.0.1:55000")
USERNAME = os.getenv("WAZUH_USERNAME")
PASSWORD = os.getenv("WAZUH_PASSWORD")
VERIFY_TLS = os.getenv("WAZUH_CA_CERT") or os.getenv("WAZUH_VERIFY", "true").lower() in {"1", "true", "yes", "on"}

# Authenticate
auth_response = requests.post(
    f"{WAZUH_URL}/security/user/authenticate",
    auth=(USERNAME, PASSWORD),
    verify=VERIFY_TLS,
    timeout=10
)

auth_response.raise_for_status()

token = auth_response.json()["data"]["token"]

print("Authentication: SUCCESS")

# Get alerts
headers = {
    "Authorization": f"Bearer {token}"
}

response = requests.get(
    f"{WAZUH_URL}/alerts",
    headers=headers,
    verify=VERIFY_TLS,
    timeout=10
)

print("Alerts API status:", response.status_code)

data = response.json()

print("\nRaw response:")
print(json.dumps(data, indent=2))
