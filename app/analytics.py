"""
Real-Time Analytics Engine.

Thread-safe, in-memory tracker for prediction analytics including:
- Running statistics (total, high/low risk, avg confidence)
- Prediction history over time
- Spike detection via rolling window analysis
- Feature distribution shift analysis for spike explanation
"""

import json
import os
import threading
from collections import deque
from datetime import datetime, timezone
from typing import Optional

from ml.train import METADATA_PATH, FEATURE_NAMES


class AnalyticsTracker:
    """Singleton analytics tracker for real-time prediction monitoring."""

    _instance = None
    _lock = threading.Lock()

    # ── Configuration ────────────────────────
    HISTORY_MAX = 500        # Max prediction records kept
    SPIKE_WINDOW = 20        # Recent window size for spike detection
    SPIKE_THRESHOLD = 2.0    # Spike if high-risk rate > threshold × baseline

    def __new__(cls):
        if cls._instance is None:
            with cls._lock:
                if cls._instance is None:
                    cls._instance = super().__new__(cls)
                    cls._instance._initialised = False
        return cls._instance

    def __init__(self):
        if self._initialised:
            return
        self._initialised = True

        self.total = 0
        self.high_risk = 0
        self.low_risk = 0
        self.outlier_count = 0
        self.confidence_sum = 0.0
        self.history = deque(maxlen=self.HISTORY_MAX)
        self._data_lock = threading.Lock()

        # Load baseline stats from training metadata
        self.baseline_stats = {}
        self.baseline_high_risk_rate = 0.5  # Default 50%
        self._load_baseline()

    def _load_baseline(self) -> None:
        """Load dataset baseline stats for shift analysis."""
        if os.path.exists(METADATA_PATH):
            try:
                with open(METADATA_PATH, "r") as f:
                    metadata = json.load(f)
                self.baseline_stats = metadata.get("baseline_stats", {})
            except Exception:
                pass

    def record_prediction(
        self,
        prediction: int,
        probability: float,
        is_outlier: bool,
        features: dict,
    ) -> None:
        """Record a new prediction event."""
        with self._data_lock:
            self.total += 1
            if prediction == 1:
                self.high_risk += 1
            else:
                self.low_risk += 1
            if is_outlier:
                self.outlier_count += 1
            self.confidence_sum += probability

            self.history.append({
                "timestamp": datetime.now(timezone.utc).isoformat(),
                "prediction": prediction,
                "probability": round(probability, 4),
                "is_outlier": is_outlier,
                "features": {k: features.get(k) for k in FEATURE_NAMES},
            })

    def get_stats(self) -> dict:
        """Return real-time aggregated statistics."""
        with self._data_lock:
            avg_conf = (
                round(self.confidence_sum / self.total, 4)
                if self.total > 0
                else 0.0
            )
            return {
                "total_predictions": self.total,
                "high_risk_count": self.high_risk,
                "low_risk_count": self.low_risk,
                "high_risk_rate": round(
                    self.high_risk / self.total, 4
                ) if self.total > 0 else 0.0,
                "average_confidence": avg_conf,
                "outlier_count": self.outlier_count,
            }

    def get_history(self, limit: int = 200) -> list[dict]:
        """Return recent prediction history."""
        with self._data_lock:
            items = list(self.history)
            return items[-limit:]

    def detect_spike(self) -> dict:
        """Detect a spike in high-risk predictions using rolling window."""
        with self._data_lock:
            items = list(self.history)

        if len(items) < self.SPIKE_WINDOW:
            return {
                "spike_detected": False,
                "spike_score": 0.0,
                "message": "Insufficient data for spike detection.",
                "window_size": len(items),
                "required": self.SPIKE_WINDOW,
            }

        # Recent window high-risk rate
        recent = items[-self.SPIKE_WINDOW:]
        recent_hr = sum(1 for r in recent if r["prediction"] == 1) / len(recent)

        # Overall baseline high-risk rate
        if len(items) > self.SPIKE_WINDOW:
            older = items[:-self.SPIKE_WINDOW]
            baseline_hr = (
                sum(1 for r in older if r["prediction"] == 1) / len(older)
                if older
                else self.baseline_high_risk_rate
            )
        else:
            baseline_hr = self.baseline_high_risk_rate

        # Avoid division by zero
        if baseline_hr == 0:
            baseline_hr = 0.01

        spike_score = round(recent_hr / baseline_hr, 4)
        spike_detected = spike_score >= self.SPIKE_THRESHOLD

        return {
            "spike_detected": spike_detected,
            "spike_score": spike_score,
            "recent_high_risk_rate": round(recent_hr, 4),
            "baseline_high_risk_rate": round(baseline_hr, 4),
            "window_size": self.SPIKE_WINDOW,
            "message": (
                "⚠️ Spike detected! High-risk rate is significantly elevated."
                if spike_detected
                else "No spike detected. Prediction patterns are normal."
            ),
        }

    def analyze_spike(self) -> dict:
        """Analyze feature distribution shifts when a spike is detected."""
        spike_info = self.detect_spike()
        if not spike_info["spike_detected"]:
            return {
                "spike_detected": False,
                "explanation": "No spike detected — no analysis needed.",
                "shifting_features": [],
            }

        with self._data_lock:
            items = list(self.history)

        recent = items[-self.SPIKE_WINDOW:]

        # Compare recent feature means vs baseline
        shifting_features = []
        for feature in FEATURE_NAMES:
            recent_vals = [
                r["features"].get(feature, 0) for r in recent
                if r["features"].get(feature) is not None
            ]
            if not recent_vals:
                continue

            recent_mean = sum(recent_vals) / len(recent_vals)
            baseline = self.baseline_stats.get(feature, {})
            baseline_mean = baseline.get("mean", recent_mean)
            baseline_std = baseline.get("std", 1.0)

            if baseline_std == 0:
                baseline_std = 1.0

            shift = abs(recent_mean - baseline_mean) / baseline_std

            if shift > 0.5:  # Meaningful shift threshold
                shifting_features.append({
                    "feature": feature,
                    "shift_magnitude": round(shift, 4),
                    "recent_mean": round(recent_mean, 4),
                    "baseline_mean": round(baseline_mean, 4),
                    "direction": "↑ increased" if recent_mean > baseline_mean else "↓ decreased",
                })

        # Sort by shift magnitude
        shifting_features.sort(key=lambda x: x["shift_magnitude"], reverse=True)

        # Build explanation
        if shifting_features:
            top = shifting_features[:3]
            feature_strs = [
                f"{f['feature']} ({f['direction']})" for f in top
            ]
            explanation = (
                f"Spike correlated with changes in: {', '.join(feature_strs)}. "
                f"These features show the largest deviation from training baseline."
            )
        else:
            explanation = "Spike detected but no significant feature distribution shifts found."

        return {
            "spike_detected": True,
            "explanation": explanation,
            "shifting_features": shifting_features[:5],
            "spike_info": spike_info,
        }


# Singleton access
tracker = AnalyticsTracker()
