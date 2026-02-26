"""
Heart Disease Prediction – Model Evaluation.

Loads the trained model and scaler, runs predictions on the test set,
and prints a full classification report with confusion matrix.

Usage::

    python -m ml.evaluate
"""

import os

import joblib
import numpy as np
import pandas as pd
from sklearn.metrics import (
    accuracy_score,
    classification_report,
    confusion_matrix,
    f1_score,
    precision_score,
    recall_score,
)
from sklearn.model_selection import train_test_split

from ml.train import FEATURE_NAMES, MODEL_PATH, SCALER_PATH, load_data, preprocess


def evaluate() -> dict:
    """Run full evaluation and return metrics dictionary."""
    # ── Load artifacts ────────────────────────
    if not os.path.exists(MODEL_PATH):
        raise FileNotFoundError(
            f"Trained model not found at {MODEL_PATH}. Run `python -m ml.train` first."
        )

    model = joblib.load(MODEL_PATH)
    scaler = joblib.load(SCALER_PATH)
    print("[INFO] Model and scaler loaded.")

    # ── Load & split data (same seed as training) ─
    X, y = load_data()
    _, X_test, _, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y,
    )

    # ── Predict ───────────────────────────────
    X_test_scaled, _ = preprocess(X_test, fit=False, scaler=scaler)
    y_pred = model.predict(X_test_scaled)
    y_proba = model.predict_proba(X_test_scaled)[:, 1]

    # ── Metrics ───────────────────────────────
    acc = accuracy_score(y_test, y_pred)
    prec = precision_score(y_test, y_pred, zero_division=0)
    rec = recall_score(y_test, y_pred, zero_division=0)
    f1 = f1_score(y_test, y_pred, zero_division=0)
    cm = confusion_matrix(y_test, y_pred)

    print("\n" + "=" * 50)
    print("       MODEL EVALUATION REPORT")
    print("=" * 50)
    print(f"  Accuracy  : {acc:.4f}")
    print(f"  Precision : {prec:.4f}")
    print(f"  Recall    : {rec:.4f}")
    print(f"  F1-Score  : {f1:.4f}")
    print("-" * 50)
    print("  Confusion Matrix:")
    print(f"    TN={cm[0][0]}  FP={cm[0][1]}")
    print(f"    FN={cm[1][0]}  TP={cm[1][1]}")
    print("-" * 50)
    print("\n  Classification Report:")
    print(classification_report(y_test, y_pred, target_names=["No Disease", "Disease"]))
    print("=" * 50)

    return {
        "accuracy": acc,
        "precision": prec,
        "recall": rec,
        "f1_score": f1,
        "confusion_matrix": cm.tolist(),
    }


if __name__ == "__main__":
    evaluate()
