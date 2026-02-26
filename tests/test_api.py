"""
API Endpoint Tests.

Tests for /health, /predict, /metrics, and error handling.
"""

import pytest


class TestHealthEndpoint:
    """Tests for the /health endpoint."""

    def test_health_returns_200(self, client):
        """Health endpoint should return 200 OK."""
        response = client.get("/health")
        assert response.status_code == 200

    def test_health_response_structure(self, client):
        """Health response should contain required fields."""
        response = client.get("/health")
        data = response.json()

        assert "status" in data
        assert "version" in data
        assert "model_loaded" in data
        assert data["status"] == "healthy"

    def test_health_version_present(self, client):
        """Health response should include version string."""
        response = client.get("/health")
        data = response.json()
        assert isinstance(data["version"], str)
        assert len(data["version"]) > 0


class TestPredictEndpoint:
    """Tests for the /predict endpoint."""

    def test_predict_returns_200(self, client, sample_input):
        """Predict endpoint should return 200 with valid input."""
        response = client.post("/predict", json=sample_input)
        assert response.status_code == 200

    def test_predict_response_structure(self, client, sample_input):
        """Predict response should contain prediction and probability."""
        response = client.post("/predict", json=sample_input)
        data = response.json()

        assert "prediction" in data
        assert "probability" in data
        assert "status" in data
        assert data["status"] == "success"

    def test_predict_prediction_values(self, client, sample_input):
        """Prediction should be 0 or 1."""
        response = client.post("/predict", json=sample_input)
        data = response.json()

        assert data["prediction"] in [0, 1]

    def test_predict_probability_range(self, client, sample_input):
        """Probability should be between 0 and 1."""
        response = client.post("/predict", json=sample_input)
        data = response.json()

        assert 0.0 <= data["probability"] <= 1.0

    def test_predict_with_invalid_input(self, client, invalid_input):
        """Predict should return 422 for missing required fields."""
        response = client.post("/predict", json=invalid_input)
        assert response.status_code == 422

    def test_predict_with_out_of_range_input(self, client, out_of_range_input):
        """Predict should return 422 for out-of-range field values."""
        response = client.post("/predict", json=out_of_range_input)
        assert response.status_code == 422

    def test_predict_with_empty_body(self, client):
        """Predict should return 422 for empty request body."""
        response = client.post("/predict", json={})
        assert response.status_code == 422

    def test_predict_with_string_values(self, client):
        """Predict should reject non-numeric field values."""
        bad_input = {
            "age": "not_a_number",
            "sex": 1, "cp": 0, "trestbps": 125, "chol": 212,
            "fbs": 0, "restecg": 1, "thalach": 168, "exang": 0,
            "oldpeak": 1.0, "slope": 2, "ca": 2, "thal": 3,
        }
        response = client.post("/predict", json=bad_input)
        assert response.status_code == 422


class TestMetricsEndpoint:
    """Tests for the /metrics endpoint."""

    def test_metrics_returns_200(self, client):
        """Metrics endpoint should return 200 OK."""
        response = client.get("/metrics")
        assert response.status_code == 200

    def test_metrics_content_type(self, client):
        """Metrics should return Prometheus text format."""
        response = client.get("/metrics")
        assert "text/plain" in response.headers.get("content-type", "")

    def test_metrics_contains_custom_metrics(self, client):
        """Metrics should include our custom API counters."""
        # Generate some traffic first
        client.get("/health")
        response = client.get("/metrics")
        text = response.text

        assert "api_request_total" in text
        assert "api_request_latency_seconds" in text


class TestRootEndpoint:
    """Tests for the / root endpoint."""

    def test_root_returns_200(self, client):
        """Root endpoint should return 200 OK."""
        response = client.get("/")
        assert response.status_code == 200

    def test_root_response_structure(self, client):
        """Root response should contain welcome message."""
        response = client.get("/")
        data = response.json()

        assert "message" in data
        assert "version" in data
        assert "docs" in data
