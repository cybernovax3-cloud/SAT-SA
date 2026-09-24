import pytest
from unittest.mock import patch

from app.ingestion.wazuh_client import WazuhIndexer


class DummyResponse:
    status_code = 200

    @staticmethod
    def json():
        return {"hits": {"hits": []}}


@patch("app.ingestion.wazuh_client.requests.get")
def test_get_latest_alerts_returns_empty_hits_when_indexer_unavailable(mock_get):
    mock_get.side_effect = Exception("connection failed")

    indexer = WazuhIndexer()
    indexer.url = "https://localhost:9200"
    indexer.username = "admin"
    indexer.password = "secret"

    result = indexer.get_latest_alerts(limit=10)

    assert result == {"hits": {"hits": []}}
