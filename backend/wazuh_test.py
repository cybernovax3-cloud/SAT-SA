import os
import requests
from dotenv import load_dotenv

load_dotenv()

WAZUH_URL = os.getenv("WAZUH_URL", "https://127.0.0.1:55000")
USERNAME = os.getenv("WAZUH_USERNAME")
PASSWORD = os.getenv("WAZUH_PASSWORD")
VERIFY_TLS = os.getenv("WAZUH_CA_CERT") or os.getenv("WAZUH_VERIFY", "true").lower() in {"1", "true", "yes", "on"}

# 1. Authenticate
auth_response = requests.post(
    f"{WAZUH_URL}/security/user/authenticate",
    auth=(USERNAME, PASSWORD),
    verify=VERIFY_TLS,
    timeout=10
)

auth_response.raise_for_status()

token = auth_response.json()["data"]["token"]

print("Authentication: SUCCESS")
print("Token received: YES")

# 2. Request Wazuh manager information
headers = {
    "Authorization": f"Bearer {token}"
}

response = requests.get(
    f"{WAZUH_URL}/manager/info",
    headers=headers,
    verify=VERIFY_TLS,
    timeout=10
)

print("API status:", response.status_code)
print("Wazuh response:")
print(response.json())
