"""
Heart Disease Prediction – Prediction Utility.

Provides a reusable ``predict()`` function that loads the serialised model
and scaler once and returns predictions from raw feature dictionaries.

Usage::

    from ml.predict import predict
    result = predict({"age": 52, "sex": 1, ...})
"""

import os

import joblib
import numpy as np
import pandas as pd

from ml.train import FEATURE_NAMES, MODEL_PATH, SCALER_PATH

# ──────────────────────────────────────────────
# Module-level cache (loaded once per process)
# ──────────────────────────────────────────────
_model = None
_scaler = None


def _load_artifacts() -> None:
    """Lazy-load model and scaler into module-level cache."""
    global _model, _scaler

    if _model is not None:
        return

    if not os.path.exists(MODEL_PATH):
        raise FileNotFoundError(
            f"Model not found at {MODEL_PATH}. Run `python -m ml.train` first."
        )

    _model = joblib.load(MODEL_PATH)
    _scaler = joblib.load(SCALER_PATH)


def predict(features: dict) -> dict:
    """Return prediction and probability for a single observation.

    Args:
        features: Dictionary with keys matching ``FEATURE_NAMES``.

    Returns:
        ``{"prediction": int, "probability": float}``
    """
    _load_artifacts()

    df = pd.DataFrame([features])[FEATURE_NAMES]
    X_scaled = _scaler.transform(df)

    prediction = int(_model.predict(X_scaled)[0])
    probability = float(_model.predict_proba(X_scaled)[0][1])

    return {
        "prediction": prediction,
        "probability": round(probability, 4),
    }


def is_model_loaded() -> bool:
    """Check whether the model artefacts can be loaded."""
    try:
        _load_artifacts()
        return True
    except Exception:
        return False
