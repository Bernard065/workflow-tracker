from unittest.mock import patch

import pytest
from django.core.cache import cache
from django.test import Client, override_settings


@pytest.fixture
def client():
    return Client()


@pytest.fixture(autouse=True)
def clear_cache():
    cache.clear()
    yield
    cache.clear()


@pytest.mark.django_db
@override_settings(
    API_RATE_LIMIT_REQUESTS=2,
    API_RATE_LIMIT_WINDOW_SECONDS=60,
)
def test_api_rate_limit_returns_429_after_limit_is_exceeded(client):
    first_response = client.get("/api/applications")
    second_response = client.get("/api/applications")
    third_response = client.get("/api/applications")

    assert first_response.status_code == 200
    assert second_response.status_code == 200
    assert third_response.status_code == 429
    assert third_response.json()["detail"] == (
        "Rate limit exceeded. Please try again later."
    )


@pytest.mark.django_db
@override_settings(
    API_RATE_LIMIT_REQUESTS=1,
    API_RATE_LIMIT_WINDOW_SECONDS=60,
)
def test_api_docs_are_not_rate_limited(client):
    first_response = client.get("/api/docs")
    second_response = client.get("/api/docs")

    assert first_response.status_code in [200, 301, 302]
    assert second_response.status_code in [200, 301, 302]


@pytest.mark.django_db
@override_settings(
    API_RATE_LIMIT_REQUESTS=100,
    API_RATE_LIMIT_WINDOW_SECONDS=60,
)
def test_api_request_logging_records_request(client):
    with patch("applications.middleware.logger.info") as mock_logger_info:
        response = client.get("/api/applications")

    assert response.status_code == 200

    mock_logger_info.assert_called_once()

    log_message = mock_logger_info.call_args.args[0]
    log_args = mock_logger_info.call_args.args[1:]

    assert log_message == (
        "API request method=%s path=%s status=%s duration_ms=%.2f ip=%s"
    )
    assert log_args[0] == "GET"
    assert log_args[1] == "/api/applications"
    assert log_args[2] == 200
    assert isinstance(log_args[3], float)
    assert log_args[4] == "127.0.0.1"
