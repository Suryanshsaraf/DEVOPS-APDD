"""
Heart Disease Prediction – Prediction Utility.

Provides a reusable ``predict()`` function that loads the serialised model
and scaler once and returns predictions with outlier detection and SHAP
feature contributions.

Usage::

    from ml.predict import predict
    result = predict({"age": 52, "sex": 1, ...})
"""

import json
import os

import joblib
import numpy as np
import pandas as pd

from ml.train import FEATURE_NAMES, MODEL_PATH, SCALER_PATH, METADATA_PATH

# ──────────────────────────────────────────────
# Module-level cache (loaded once per process)
# ──────────────────────────────────────────────
_model = None
_scaler = None
_shap_explainer = None
_feature_importance = None


def _load_artifacts() -> None:
    """Lazy-load model and scaler into module-level cache."""
    global _model, _scaler, _feature_importance

    if _model is not None:
        return

    if not os.path.exists(MODEL_PATH):
        raise FileNotFoundError(
            f"Model not found at {MODEL_PATH}. Run `python -m ml.train` first."
        )

    _model = joblib.load(MODEL_PATH)
    _scaler = joblib.load(SCALER_PATH)

    # Load feature importance from training metadata
    if os.path.exists(METADATA_PATH):
        with open(METADATA_PATH, "r") as f:
            metadata = json.load(f)
        _feature_importance = metadata.get("feature_importance", {})


def _get_shap_explainer():
    """Lazy-load SHAP TreeExplainer."""
    global _shap_explainer
    if _shap_explainer is not None:
        return _shap_explainer

    _load_artifacts()
    try:
        import shap
        _shap_explainer = shap.TreeExplainer(_model)
    except Exception:
        _shap_explainer = None
    return _shap_explainer


def predict(features: dict) -> dict:
    """Return prediction, probability, outlier info, and feature contributions.

    Args:
        features: Dictionary with keys matching ``FEATURE_NAMES``.

    Returns:
        Dict with prediction, probability, outlier status, and
        feature contributions.
    """
    _load_artifacts()

    df = pd.DataFrame([features])[FEATURE_NAMES]
    X_scaled = _scaler.transform(df)

    prediction = int(_model.predict(X_scaled)[0])
    probability = float(_model.predict_proba(X_scaled)[0][1])

    # ── Outlier detection ─────────────────────
    from ml.outlier import detect_outlier
    outlier_result = detect_outlier(features)

    # ── SHAP feature contributions ────────────
    feature_contributions = {}
    try:
        explainer = _get_shap_explainer()
        if explainer is not None:
            shap_values = explainer.shap_values(X_scaled)
            # For binary classification, shap_values may be a list of 2 arrays
            if isinstance(shap_values, list):
                values = shap_values[1][0]  # class 1 (disease)
            else:
                values = shap_values[0]
            feature_contributions = {
                name: round(float(val), 4)
                for name, val in zip(FEATURE_NAMES, values)
            }
    except Exception:
        pass  # Graceful degradation

    return {
        "prediction": prediction,
        "probability": round(probability, 4),
        "is_outlier": outlier_result["is_outlier"],
        "anomaly_score": outlier_result["anomaly_score"],
        "feature_contributions": feature_contributions,
    }


def get_feature_importance() -> dict:
    """Return the global feature importance from training."""
    _load_artifacts()
    return _feature_importance or {}


def is_model_loaded() -> bool:
    """Check whether the model artefacts can be loaded."""
    try:
        _load_artifacts()
        return True
    except Exception:
        return False
