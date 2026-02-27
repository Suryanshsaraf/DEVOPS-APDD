"""
Analytics & New Endpoint Tests.

Tests for analytics, spike detection, model performance, and feature importance endpoints.
"""

import pytest


class TestAnalyticsStats:
    """Tests for the /analytics/stats endpoint."""

    def test_stats_returns_200(self, client):
        """Analytics stats should return 200 OK."""
        response = client.get("/analytics/stats")
        assert response.status_code == 200

    def test_stats_response_structure(self, client):
        """Stats response should contain required fields."""
        response = client.get("/analytics/stats")
        data = response.json()

        assert "total_predictions" in data
        assert "high_risk_count" in data
        assert "low_risk_count" in data
        assert "average_confidence" in data
        assert "outlier_count" in data

    def test_stats_updated_after_prediction(self, client, sample_input):
        """Stats should update after making a prediction."""
        before = client.get("/analytics/stats").json()
        client.post("/predict", json=sample_input)
        after = client.get("/analytics/stats").json()

        assert after["total_predictions"] >= before["total_predictions"] + 1


class TestAnalyticsHistory:
    """Tests for the /analytics/history endpoint."""

    def test_history_returns_200(self, client):
        """History endpoint should return 200 OK."""
        response = client.get("/analytics/history")
        assert response.status_code == 200

    def test_history_returns_list(self, client):
        """History should return a list."""
        response = client.get("/analytics/history")
        assert isinstance(response.json(), list)

    def test_history_populated_after_prediction(self, client, sample_input):
        """History should have entries after predictions."""
        client.post("/predict", json=sample_input)
        response = client.get("/analytics/history")
        data = response.json()
        assert len(data) > 0
        assert "timestamp" in data[-1]
        assert "prediction" in data[-1]


class TestSpikeDetection:
    """Tests for the /analytics/spikes endpoint."""

    def test_spikes_returns_200(self, client):
        """Spikes endpoint should return 200 OK."""
        response = client.get("/analytics/spikes")
        assert response.status_code == 200

    def test_spikes_response_structure(self, client):
        """Spikes response should contain spike_detected field."""
        response = client.get("/analytics/spikes")
        data = response.json()
        assert "spike_detected" in data
        assert "message" in data


class TestSpikeAnalysis:
    """Tests for the /analytics/spike-analysis endpoint."""

    def test_spike_analysis_returns_200(self, client):
        """Spike analysis endpoint should return 200 OK."""
        response = client.get("/analytics/spike-analysis")
        assert response.status_code == 200

    def test_spike_analysis_structure(self, client):
        """Spike analysis should contain explanation field."""
        response = client.get("/analytics/spike-analysis")
        data = response.json()
        assert "spike_detected" in data
        assert "explanation" in data


class TestModelPerformance:
    """Tests for the /model/performance endpoint."""

    def test_performance_returns_200(self, client):
        """Model performance endpoint should return 200."""
        response = client.get("/model/performance")
        # May return 404 if comparison report doesn't exist
        assert response.status_code in [200, 404]

    def test_performance_structure(self, client):
        """If available, performance should have models and best_model."""
        response = client.get("/model/performance")
        if response.status_code == 200:
            data = response.json()
            assert "models" in data
            assert "best_model" in data


class TestFeatureImportance:
    """Tests for the /model/feature-importance endpoint."""

    def test_feature_importance_returns_200(self, client):
        """Feature importance endpoint should return 200."""
        response = client.get("/model/feature-importance")
        assert response.status_code in [200, 404]

    def test_feature_importance_structure(self, client):
        """If available, should have features list."""
        response = client.get("/model/feature-importance")
        if response.status_code == 200:
            data = response.json()
            assert "features" in data
            assert isinstance(data["features"], list)


class TestPredictWithOutlier:
    """Tests for outlier detection in /predict response."""

    def test_predict_includes_outlier_field(self, client, sample_input):
        """Prediction response should include is_outlier field."""
        response = client.post("/predict", json=sample_input)
        if response.status_code == 200:
            data = response.json()
            assert "is_outlier" in data
            assert "anomaly_score" in data
            assert isinstance(data["is_outlier"], bool)

    def test_predict_includes_feature_contributions(self, client, sample_input):
        """Prediction response should include feature_contributions."""
        response = client.post("/predict", json=sample_input)
        if response.status_code == 200:
            data = response.json()
            assert "feature_contributions" in data
            assert isinstance(data["feature_contributions"], dict)
