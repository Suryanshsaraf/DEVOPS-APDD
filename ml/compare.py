"""
Multi-Model Comparison Engine.

Trains RandomForest, LogisticRegression, and XGBoost on the Heart Disease
dataset, evaluates each, and selects the best model by F1-score.

Usage::

    from ml.compare import compare_models
    report = compare_models(X_train, X_test, y_train, y_test)
"""

import json
import os

import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import (
    accuracy_score,
    confusion_matrix,
    f1_score,
    precision_score,
    recall_score,
    roc_auc_score,
    roc_curve,
)
from xgboost import XGBClassifier

from ml.train import MODEL_DIR

COMPARISON_REPORT_PATH = os.path.join(MODEL_DIR, "comparison_report.json")


def _evaluate_model(model, X_test, y_test):
    """Evaluate a single model and return metrics dict."""
    y_pred = model.predict(X_test)
    y_proba = model.predict_proba(X_test)[:, 1]

    fpr, tpr, _ = roc_curve(y_test, y_proba)

    return {
        "accuracy": round(float(accuracy_score(y_test, y_pred)), 4),
        "precision": round(float(precision_score(y_test, y_pred, zero_division=0)), 4),
        "recall": round(float(recall_score(y_test, y_pred, zero_division=0)), 4),
        "f1_score": round(float(f1_score(y_test, y_pred, zero_division=0)), 4),
        "roc_auc": round(float(roc_auc_score(y_test, y_proba)), 4),
        "confusion_matrix": confusion_matrix(y_test, y_pred).tolist(),
        "roc_curve": {
            "fpr": [round(float(x), 4) for x in fpr[::max(1, len(fpr) // 50)]],
            "tpr": [round(float(x), 4) for x in tpr[::max(1, len(tpr) // 50)]],
        },
    }


def compare_models(
    X_train: np.ndarray,
    X_test: np.ndarray,
    y_train,
    y_test,
) -> dict:
    """Train and compare multiple models.

    Returns:
        A report dict with per-model metrics and the best model name.
    """
    models = {
        "RandomForest": RandomForestClassifier(
            n_estimators=100, max_depth=10, random_state=42, n_jobs=-1,
        ),
        "LogisticRegression": LogisticRegression(
            max_iter=1000, random_state=42,
        ),
        "XGBoost": XGBClassifier(
            n_estimators=100, max_depth=6, learning_rate=0.1,
            random_state=42, use_label_encoder=False, eval_metric="logloss",
        ),
    }

    report = {"models": {}, "best_model": None}
    best_f1 = -1.0

    for name, model in models.items():
        print(f"[INFO] Training {name} …")
        model.fit(X_train, y_train)
        metrics = _evaluate_model(model, X_test, y_test)
        report["models"][name] = metrics

        print(
            f"  → Accuracy={metrics['accuracy']:.4f}  "
            f"F1={metrics['f1_score']:.4f}  "
            f"AUC={metrics['roc_auc']:.4f}"
        )

        if metrics["f1_score"] > best_f1:
            best_f1 = metrics["f1_score"]
            report["best_model"] = name

    print(f"\n[INFO] Best model: {report['best_model']} (F1={best_f1:.4f})")

    # Persist report
    os.makedirs(MODEL_DIR, exist_ok=True)
    with open(COMPARISON_REPORT_PATH, "w") as f:
        json.dump(report, f, indent=2)
    print(f"[INFO] Comparison report saved → {COMPARISON_REPORT_PATH}")

    return report
