"""
Pydantic Schemas for Request / Response Validation.

Defines the input features for heart disease prediction and the API response
models, including analytics, outlier, and SHAP contribution schemas.
"""

from pydantic import BaseModel, Field
from typing import Optional


# ──────────────────────────────────────────────
# Prediction Schemas
# ──────────────────────────────────────────────

class HeartDiseaseInput(BaseModel):
    """Input schema for heart disease prediction.

    All 13 clinical features from the UCI Heart Disease dataset.
    """

    age: float = Field(..., ge=0, le=120, description="Age in years")
    sex: int = Field(..., ge=0, le=1, description="Sex (1 = male, 0 = female)")
    cp: int = Field(
        ..., ge=0, le=3,
        description="Chest pain type (0-3)",
    )
    trestbps: float = Field(
        ..., ge=0, le=300,
        description="Resting blood pressure (mm Hg)",
    )
    chol: float = Field(
        ..., ge=0, le=600,
        description="Serum cholesterol (mg/dl)",
    )
    fbs: int = Field(
        ..., ge=0, le=1,
        description="Fasting blood sugar > 120 mg/dl (1 = true, 0 = false)",
    )
    restecg: int = Field(
        ..., ge=0, le=2,
        description="Resting ECG results (0-2)",
    )
    thalach: float = Field(
        ..., ge=0, le=300,
        description="Maximum heart rate achieved",
    )
    exang: int = Field(
        ..., ge=0, le=1,
        description="Exercise-induced angina (1 = yes, 0 = no)",
    )
    oldpeak: float = Field(
        ..., ge=0, le=10,
        description="ST depression induced by exercise relative to rest",
    )
    slope: int = Field(
        ..., ge=0, le=2,
        description="Slope of the peak exercise ST segment (0-2)",
    )
    ca: int = Field(
        ..., ge=0, le=4,
        description="Number of major vessels colored by fluoroscopy (0-4)",
    )
    thal: int = Field(
        ..., ge=0, le=3,
        description="Thalassemia (0 = normal, 1 = fixed defect, 2 = reversible defect, 3 = other)",
    )

    class Config:
        json_schema_extra = {
            "example": {
                "age": 52,
                "sex": 1,
                "cp": 0,
                "trestbps": 125,
                "chol": 212,
                "fbs": 0,
                "restecg": 1,
                "thalach": 168,
                "exang": 0,
                "oldpeak": 1.0,
                "slope": 2,
                "ca": 2,
                "thal": 3,
            }
        }


class PredictionResponse(BaseModel):
    """API response for a prediction request."""

    prediction: int = Field(
        ..., description="0 = No disease, 1 = Disease detected"
    )
    probability: float = Field(
        ..., ge=0, le=1, description="Confidence probability"
    )
    is_outlier: bool = Field(
        default=False, description="Whether the input is an anomalous outlier"
    )
    anomaly_score: float = Field(
        default=0.0, description="Outlier anomaly score (lower = more anomalous)"
    )
    feature_contributions: dict = Field(
        default_factory=dict,
        description="SHAP-based feature contribution values",
    )
    status: str = Field(default="success")


class HealthResponse(BaseModel):
    """API response for the health endpoint."""

    status: str = Field(default="healthy")
    version: str
    model_loaded: bool


# ──────────────────────────────────────────────
# Analytics Schemas
# ──────────────────────────────────────────────

class AnalyticsStatsResponse(BaseModel):
    """Real-time prediction statistics."""

    total_predictions: int = 0
    high_risk_count: int = 0
    low_risk_count: int = 0
    high_risk_rate: float = 0.0
    average_confidence: float = 0.0
    outlier_count: int = 0


class SpikeDetectionResponse(BaseModel):
    """Spike detection analysis result."""

    spike_detected: bool = False
    spike_score: float = 0.0
    message: str = ""
    recent_high_risk_rate: Optional[float] = None
    baseline_high_risk_rate: Optional[float] = None
    window_size: int = 0


class SpikeAnalysisResponse(BaseModel):
    """Feature-shift explanation for detected spikes."""

    spike_detected: bool = False
    explanation: str = ""
    shifting_features: list = Field(default_factory=list)
    spike_info: Optional[dict] = None
