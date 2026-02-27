"""
Outlier Detection Module.

Uses IsolationForest to detect anomalous clinical inputs. The detector
is trained during ``ml.train`` and saved alongside the model artifacts.

Usage::

    from ml.outlier import detect_outlier, is_detector_loaded
    result = detect_outlier({"age": 52, "sex": 1, ...})
"""

import os

import joblib
import numpy as np
import pandas as pd
from sklearn.ensemble import IsolationForest

from ml.train import FEATURE_NAMES, MODEL_DIR

OUTLIER_DETECTOR_PATH = os.path.join(MODEL_DIR, "outlier_detector.pkl")

# Module-level cache
_detector = None


def train_outlier_detector(X: pd.DataFrame) -> IsolationForest:
    """Fit an IsolationForest on the training data.

    Args:
        X: Feature DataFrame used for training.

    Returns:
        Fitted IsolationForest instance.
    """
    print("[INFO] Training IsolationForest outlier detector …")
    detector = IsolationForest(
        n_estimators=100,
        contamination=0.05,
        random_state=42,
        n_jobs=-1,
    )
    detector.fit(X)
    joblib.dump(detector, OUTLIER_DETECTOR_PATH)
    print(f"[INFO] Outlier detector saved → {OUTLIER_DETECTOR_PATH}")
    return detector


def _load_detector() -> None:
    """Lazy-load the outlier detector."""
    global _detector
    if _detector is not None:
        return
    if not os.path.exists(OUTLIER_DETECTOR_PATH):
        return  # Gracefully degrade if not trained
    _detector = joblib.load(OUTLIER_DETECTOR_PATH)


def detect_outlier(features: dict) -> dict:
    """Check whether a single observation is an outlier.

    Args:
        features: Dictionary with keys matching ``FEATURE_NAMES``.

    Returns:
        ``{"is_outlier": bool, "anomaly_score": float}``
    """
    _load_detector()
    if _detector is None:
        return {"is_outlier": False, "anomaly_score": 0.0}

    df = pd.DataFrame([features])[FEATURE_NAMES]
    score = float(_detector.decision_function(df)[0])
    is_outlier = bool(_detector.predict(df)[0] == -1)

    return {
        "is_outlier": is_outlier,
        "anomaly_score": round(score, 4),
    }


def is_detector_loaded() -> bool:
    """Check if the outlier detector can be loaded."""
    try:
        _load_detector()
        return _detector is not None
    except Exception:
        return False
