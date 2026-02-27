"""
Heart Disease Prediction – Model Evaluation.

Loads the trained model and scaler, runs predictions on the test set,
and produces a full evaluation report with classification metrics,
confusion matrix, and ROC curve data.

Usage::

    python -m ml.evaluate
"""

import json
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
    roc_auc_score,
    roc_curve,
)
from sklearn.model_selection import train_test_split

from ml.train import FEATURE_NAMES, MODEL_DIR, MODEL_PATH, SCALER_PATH, load_data, preprocess

EVALUATION_REPORT_PATH = os.path.join(MODEL_DIR, "evaluation_report.json")


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
    auc = roc_auc_score(y_test, y_proba)
    cm = confusion_matrix(y_test, y_pred)
    fpr, tpr, _ = roc_curve(y_test, y_proba)

    print("\n" + "=" * 50)
    print("       MODEL EVALUATION REPORT")
    print("=" * 50)
    print(f"  Accuracy  : {acc:.4f}")
    print(f"  Precision : {prec:.4f}")
    print(f"  Recall    : {rec:.4f}")
    print(f"  F1-Score  : {f1:.4f}")
    print(f"  ROC-AUC   : {auc:.4f}")
    print("-" * 50)
    print("  Confusion Matrix:")
    print(f"    TN={cm[0][0]}  FP={cm[0][1]}")
    print(f"    FN={cm[1][0]}  TP={cm[1][1]}")
    print("-" * 50)
    print("\n  Classification Report:")
    print(classification_report(y_test, y_pred, target_names=["No Disease", "Disease"]))
    print("=" * 50)

    report = {
        "accuracy": round(float(acc), 4),
        "precision": round(float(prec), 4),
        "recall": round(float(rec), 4),
        "f1_score": round(float(f1), 4),
        "roc_auc": round(float(auc), 4),
        "confusion_matrix": cm.tolist(),
        "roc_curve": {
            "fpr": [round(float(x), 4) for x in fpr[::max(1, len(fpr) // 50)]],
            "tpr": [round(float(x), 4) for x in tpr[::max(1, len(tpr) // 50)]],
        },
    }

    # Persist report
    with open(EVALUATION_REPORT_PATH, "w") as f:
        json.dump(report, f, indent=2)
    print(f"[INFO] Evaluation report saved → {EVALUATION_REPORT_PATH}")

    return report


if __name__ == "__main__":
    evaluate()
