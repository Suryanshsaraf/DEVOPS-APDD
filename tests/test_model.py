"""
Model Validation Tests.

Tests for model loading, prediction shape, and value ranges.
"""

import os
import sys

import joblib
import numpy as np
import pytest

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from ml.train import MODEL_PATH, SCALER_PATH, FEATURE_NAMES


class TestModelLoading:
    """Tests for model artifact loading."""

    def test_model_file_exists(self):
        """Trained model file should exist."""
        assert os.path.exists(MODEL_PATH), (
            f"Model not found at {MODEL_PATH}. Run `python -m ml.train` first."
        )

    def test_scaler_file_exists(self):
        """Scaler file should exist."""
        assert os.path.exists(SCALER_PATH), (
            f"Scaler not found at {SCALER_PATH}. Run `python -m ml.train` first."
        )

    def test_model_is_loadable(self):
        """Model should be deserializable via joblib."""
        model = joblib.load(MODEL_PATH)
        assert model is not None

    def test_scaler_is_loadable(self):
        """Scaler should be deserializable via joblib."""
        scaler = joblib.load(SCALER_PATH)
        assert scaler is not None


class TestModelPrediction:
    """Tests for model prediction behaviour."""

    @pytest.fixture(autouse=True)
    def load_model(self):
        """Load model and scaler before each test."""
        self.model = joblib.load(MODEL_PATH)
        self.scaler = joblib.load(SCALER_PATH)

    def test_prediction_shape(self):
        """Prediction output should match input sample count."""
        sample = np.array([[52, 1, 0, 125, 212, 0, 1, 168, 0, 1.0, 2, 2, 3]])
        scaled = self.scaler.transform(sample)
        predictions = self.model.predict(scaled)

        assert predictions.shape == (1,)

    def test_prediction_values(self):
        """Predictions should be 0 or 1."""
        sample = np.array([[52, 1, 0, 125, 212, 0, 1, 168, 0, 1.0, 2, 2, 3]])
        scaled = self.scaler.transform(sample)
        predictions = self.model.predict(scaled)

        for pred in predictions:
            assert pred in [0, 1]

    def test_probability_output(self):
        """Probability predictions should be between 0 and 1."""
        sample = np.array([[52, 1, 0, 125, 212, 0, 1, 168, 0, 1.0, 2, 2, 3]])
        scaled = self.scaler.transform(sample)
        probabilities = self.model.predict_proba(scaled)

        assert probabilities.shape == (1, 2)
        assert np.all(probabilities >= 0)
        assert np.all(probabilities <= 1)
        assert np.allclose(probabilities.sum(axis=1), 1.0)

    def test_batch_prediction(self):
        """Model should handle batch predictions correctly."""
        samples = np.array([
            [52, 1, 0, 125, 212, 0, 1, 168, 0, 1.0, 2, 2, 3],
            [45, 0, 1, 130, 250, 1, 0, 150, 1, 2.3, 1, 0, 2],
            [68, 1, 2, 180, 300, 0, 2, 120, 0, 0.5, 0, 3, 1],
        ])
        scaled = self.scaler.transform(samples)
        predictions = self.model.predict(scaled)

        assert predictions.shape == (3,)

    def test_feature_count(self):
        """Model should expect exactly 13 features."""
        assert len(FEATURE_NAMES) == 13

    def test_scaler_feature_count(self):
        """Scaler should be fitted on 13 features."""
        assert self.scaler.n_features_in_ == 13
