"""
Heart Disease Prediction – Training Pipeline.

Loads the UCI Heart Disease dataset, preprocesses features, trains a
RandomForestClassifier, runs multi-model comparison, trains an outlier
detector, and serialises all artifacts to ``models/``.

Usage::

    python -m ml.train
"""

import json
import os
import sys

import joblib
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler

# ──────────────────────────────────────────────
# Path setup
# ──────────────────────────────────────────────
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_DIR = os.path.join(BASE_DIR, "models")
os.makedirs(MODEL_DIR, exist_ok=True)

MODEL_PATH = os.path.join(MODEL_DIR, "model.pkl")
SCALER_PATH = os.path.join(MODEL_DIR, "scaler.pkl")
METADATA_PATH = os.path.join(MODEL_DIR, "training_metadata.json")

# ──────────────────────────────────────────────
# Feature names for the 13-attribute Heart Disease dataset
# ──────────────────────────────────────────────
FEATURE_NAMES = [
    "age", "sex", "cp", "trestbps", "chol", "fbs",
    "restecg", "thalach", "exang", "oldpeak", "slope", "ca", "thal",
]


def load_data() -> tuple[pd.DataFrame, pd.Series]:
    """Load the Heart Disease dataset.

    Returns:
        Tuple of (features DataFrame, target Series).
    """
    print("[INFO] Loading Heart Disease dataset …")

    # Use a built-in CSV bundled with the project for reproducibility.
    data_path = os.path.join(BASE_DIR, "data", "heart.csv")

    if os.path.exists(data_path):
        df = pd.read_csv(data_path)
        X = df[FEATURE_NAMES]
        y = df["target"]
    else:
        # Fallback: generate synthetic but realistic heart-disease-like data
        print("[INFO] Local CSV not found – generating synthetic dataset …")
        np.random.seed(42)
        n_samples = 303

        X = pd.DataFrame({
            "age": np.random.randint(29, 77, n_samples).astype(float),
            "sex": np.random.randint(0, 2, n_samples),
            "cp": np.random.randint(0, 4, n_samples),
            "trestbps": np.random.randint(94, 200, n_samples).astype(float),
            "chol": np.random.randint(126, 564, n_samples).astype(float),
            "fbs": np.random.randint(0, 2, n_samples),
            "restecg": np.random.randint(0, 3, n_samples),
            "thalach": np.random.randint(71, 202, n_samples).astype(float),
            "exang": np.random.randint(0, 2, n_samples),
            "oldpeak": np.round(np.random.uniform(0, 6.2, n_samples), 1),
            "slope": np.random.randint(0, 3, n_samples),
            "ca": np.random.randint(0, 5, n_samples),
            "thal": np.random.randint(0, 4, n_samples),
        })
        y = pd.Series(np.random.randint(0, 2, n_samples), name="target")

        # Persist for future runs
        os.makedirs(os.path.dirname(data_path), exist_ok=True)
        df = pd.concat([X, y], axis=1)
        df.to_csv(data_path, index=False)
        print(f"[INFO] Saved synthetic dataset to {data_path}")

    print(f"[INFO] Dataset shape: {X.shape}")
    return X, y


def preprocess(
    X: pd.DataFrame,
    fit: bool = True,
    scaler: StandardScaler | None = None,
) -> tuple[np.ndarray, StandardScaler]:
    """Scale features using StandardScaler.

    Args:
        X: Feature DataFrame.
        fit: Whether to fit a new scaler or reuse an existing one.
        scaler: Pre-fitted scaler (used when ``fit=False``).

    Returns:
        Tuple of (scaled ndarray, scaler).
    """
    if fit:
        scaler = StandardScaler()
        X_scaled = scaler.fit_transform(X)
    else:
        if scaler is None:
            raise ValueError("A fitted scaler is required when fit=False")
        X_scaled = scaler.transform(X)
    return X_scaled, scaler


def train_model(X_train: np.ndarray, y_train: pd.Series) -> RandomForestClassifier:
    """Train a RandomForestClassifier.

    Args:
        X_train: Scaled training features.
        y_train: Training labels.

    Returns:
        Fitted classifier.
    """
    print("[INFO] Training RandomForestClassifier …")
    model = RandomForestClassifier(
        n_estimators=100,
        max_depth=10,
        random_state=42,
        n_jobs=-1,
    )
    model.fit(X_train, y_train)
    print("[INFO] Training complete.")
    return model


def save_artifacts(model: RandomForestClassifier, scaler: StandardScaler) -> None:
    """Serialise model and scaler to disk."""
    joblib.dump(model, MODEL_PATH)
    joblib.dump(scaler, SCALER_PATH)
    print(f"[INFO] Model saved  → {MODEL_PATH}")
    print(f"[INFO] Scaler saved → {SCALER_PATH}")


def save_training_metadata(
    model: RandomForestClassifier,
    X: pd.DataFrame,
    train_acc: float,
    test_acc: float,
) -> None:
    """Save training metadata for analytics baseline."""
    # Feature importance from RandomForest
    importance = dict(zip(FEATURE_NAMES, [
        round(float(v), 4) for v in model.feature_importances_
    ]))

    # Dataset baseline stats (used for spike analysis)
    baseline_stats = {}
    for col in FEATURE_NAMES:
        baseline_stats[col] = {
            "mean": round(float(X[col].mean()), 4),
            "std": round(float(X[col].std()), 4),
            "min": round(float(X[col].min()), 4),
            "max": round(float(X[col].max()), 4),
        }

    metadata = {
        "feature_names": FEATURE_NAMES,
        "feature_importance": importance,
        "baseline_stats": baseline_stats,
        "train_accuracy": round(train_acc, 4),
        "test_accuracy": round(test_acc, 4),
        "n_samples": len(X),
    }

    with open(METADATA_PATH, "w") as f:
        json.dump(metadata, f, indent=2)
    print(f"[INFO] Training metadata saved → {METADATA_PATH}")


def main() -> None:
    """End-to-end training pipeline."""
    X, y = load_data()

    # Train / test split
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y,
    )
    print(f"[INFO] Train size: {X_train.shape[0]} | Test size: {X_test.shape[0]}")

    # Preprocessing
    X_train_scaled, scaler = preprocess(X_train, fit=True)

    # Training (primary model)
    model = train_model(X_train_scaled, y_train)

    # Quick accuracy on training set
    train_acc = model.score(X_train_scaled, y_train)
    print(f"[INFO] Training accuracy: {train_acc:.4f}")

    # Save primary model
    save_artifacts(model, scaler)

    # Evaluate on test set
    X_test_scaled, _ = preprocess(X_test, fit=False, scaler=scaler)
    test_acc = model.score(X_test_scaled, y_test)
    print(f"[INFO] Test accuracy:     {test_acc:.4f}")

    # Save training metadata (baseline stats, feature importance)
    save_training_metadata(model, X, train_acc, test_acc)

    # ── Multi-model comparison ────────────────
    print("\n" + "=" * 50)
    print("   MULTI-MODEL COMPARISON")
    print("=" * 50)
    from ml.compare import compare_models
    compare_models(X_train_scaled, X_test_scaled, y_train, y_test)

    # ── Train outlier detector ────────────────
    print("\n" + "=" * 50)
    print("   OUTLIER DETECTOR")
    print("=" * 50)
    from ml.outlier import train_outlier_detector
    train_outlier_detector(X)

    print("\n✅ Training pipeline completed successfully.")


if __name__ == "__main__":
    main()
