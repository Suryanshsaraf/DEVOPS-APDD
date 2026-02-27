"""
FastAPI Application – CardioAnalytics API v2.0.

Endpoints:
    GET  /health                    – Liveness / readiness probe.
    POST /predict                   – Heart disease prediction (+ outlier + SHAP).
    GET  /metrics                   – Prometheus metrics.
    GET  /analytics/stats           – Real-time prediction statistics.
    GET  /analytics/history         – Prediction timeline.
    GET  /analytics/spikes          – Spike detection.
    GET  /analytics/spike-analysis  – Feature-shift explanation.
    GET  /model/performance         – Multi-model comparison metrics.
    GET  /model/feature-importance  – SHAP-based feature importance.

Usage::

    uvicorn app.main:app --host 0.0.0.0 --port 8000
"""

import json
import os
import time
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import PlainTextResponse
from prometheus_client import (
    Counter,
    Histogram,
    generate_latest,
    CONTENT_TYPE_LATEST,
)

from app.config import settings
from app.logger import get_logger
from app.schemas import (
    HeartDiseaseInput,
    HealthResponse,
    PredictionResponse,
    AnalyticsStatsResponse,
    SpikeDetectionResponse,
    SpikeAnalysisResponse,
)
from ml.predict import is_model_loaded, predict, get_feature_importance

# ──────────────────────────────────────────────
# Logger
# ──────────────────────────────────────────────
logger = get_logger(__name__)

# ──────────────────────────────────────────────
# Prometheus Metrics
# ──────────────────────────────────────────────
REQUEST_COUNT = Counter(
    "api_request_total",
    "Total API requests",
    ["method", "endpoint", "status"],
)
REQUEST_LATENCY = Histogram(
    "api_request_latency_seconds",
    "Request latency in seconds",
    ["method", "endpoint"],
    buckets=[0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1.0, 2.5, 5.0],
)
PREDICTION_COUNT = Counter(
    "prediction_total",
    "Total predictions made",
    ["result"],
)
OUTLIER_COUNT = Counter(
    "outlier_total",
    "Total outlier predictions detected",
)
SPIKE_COUNT = Counter(
    "spike_detected_total",
    "Total spike detection events",
)


# ──────────────────────────────────────────────
# Lifespan (startup / shutdown)
# ──────────────────────────────────────────────
@asynccontextmanager
async def lifespan(application: FastAPI):
    """Application startup and shutdown lifecycle."""
    logger.info("Starting %s v%s", settings.APP_NAME, settings.APP_VERSION)

    # Pre-load model on startup
    try:
        if is_model_loaded():
            logger.info("ML model loaded successfully.")
        else:
            logger.warning("ML model not found – /predict will return 503.")
    except Exception as exc:
        logger.error("Failed to load model: %s", exc)

    yield

    logger.info("Shutting down %s", settings.APP_NAME)


# ──────────────────────────────────────────────
# FastAPI App
# ──────────────────────────────────────────────
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="Intelligent, analytics-driven Heart Disease Prediction API with real-time monitoring.",
    lifespan=lifespan,
)

# ── CORS Middleware ───────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ──────────────────────────────────────────────
# Middleware – Prometheus instrumentation
# ──────────────────────────────────────────────
@app.middleware("http")
async def prometheus_middleware(request: Request, call_next):
    """Record request count and latency for every request."""
    if request.url.path == "/metrics":
        return await call_next(request)

    start = time.perf_counter()
    response = await call_next(request)
    elapsed = time.perf_counter() - start

    REQUEST_COUNT.labels(
        method=request.method,
        endpoint=request.url.path,
        status=response.status_code,
    ).inc()
    REQUEST_LATENCY.labels(
        method=request.method,
        endpoint=request.url.path,
    ).observe(elapsed)

    return response


# ──────────────────────────────────────────────
# Core Endpoints
# ──────────────────────────────────────────────
@app.get("/health", response_model=HealthResponse, tags=["System"])
async def health_check():
    """Liveness / readiness probe for Kubernetes."""
    return HealthResponse(
        status="healthy",
        version=settings.APP_VERSION,
        model_loaded=is_model_loaded(),
    )


@app.post("/predict", response_model=PredictionResponse, tags=["Prediction"])
async def make_prediction(payload: HeartDiseaseInput):
    """Run heart disease prediction with outlier detection and SHAP explanation."""
    logger.info("Prediction request received: %s", payload.model_dump())

    if not is_model_loaded():
        logger.error("Model not available for prediction.")
        raise HTTPException(
            status_code=503,
            detail="Model not loaded. Please train the model first.",
        )

    try:
        result = predict(payload.model_dump())

        # ── Record analytics ──────────────────
        from app.analytics import tracker
        tracker.record_prediction(
            prediction=result["prediction"],
            probability=result["probability"],
            is_outlier=result["is_outlier"],
            features=payload.model_dump(),
        )

        # ── Update Prometheus counters ────────
        PREDICTION_COUNT.labels(
            result="disease" if result["prediction"] == 1 else "no_disease"
        ).inc()

        if result["is_outlier"]:
            OUTLIER_COUNT.inc()
            logger.warning("Outlier input detected: %s", payload.model_dump())

        # ── Check for spikes ──────────────────
        spike = tracker.detect_spike()
        if spike.get("spike_detected"):
            SPIKE_COUNT.inc()
            logger.warning("Spike detected! Score: %s", spike["spike_score"])

        logger.info("Prediction result: %s", result)

        return PredictionResponse(
            prediction=result["prediction"],
            probability=result["probability"],
            is_outlier=result["is_outlier"],
            anomaly_score=result["anomaly_score"],
            feature_contributions=result["feature_contributions"],
        )
    except Exception as exc:
        logger.exception("Prediction failed: %s", exc)
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(exc)}")


@app.get("/metrics", tags=["Monitoring"])
async def metrics():
    """Expose Prometheus metrics."""
    return PlainTextResponse(
        content=generate_latest().decode("utf-8"),
        media_type=CONTENT_TYPE_LATEST,
    )


# ──────────────────────────────────────────────
# Analytics Endpoints
# ──────────────────────────────────────────────
@app.get("/analytics/stats", response_model=AnalyticsStatsResponse, tags=["Analytics"])
async def analytics_stats():
    """Real-time aggregated prediction statistics."""
    from app.analytics import tracker
    return tracker.get_stats()


@app.get("/analytics/history", tags=["Analytics"])
async def analytics_history(limit: int = 200):
    """Prediction history over time (most recent first)."""
    from app.analytics import tracker
    return tracker.get_history(limit=limit)


@app.get("/analytics/spikes", response_model=SpikeDetectionResponse, tags=["Analytics"])
async def analytics_spikes():
    """Detect spikes in high-risk predictions."""
    from app.analytics import tracker
    return tracker.detect_spike()


@app.get("/analytics/spike-analysis", response_model=SpikeAnalysisResponse, tags=["Analytics"])
async def analytics_spike_analysis():
    """Analyze feature distribution shifts during a spike."""
    from app.analytics import tracker
    return tracker.analyze_spike()


# ──────────────────────────────────────────────
# Model Endpoints
# ──────────────────────────────────────────────
@app.get("/model/performance", tags=["Model"])
async def model_performance():
    """Multi-model comparison metrics and ROC data."""
    from ml.compare import COMPARISON_REPORT_PATH
    if not os.path.exists(COMPARISON_REPORT_PATH):
        raise HTTPException(
            status_code=404,
            detail="Comparison report not found. Run `python -m ml.train` first.",
        )
    with open(COMPARISON_REPORT_PATH, "r") as f:
        return json.load(f)


@app.get("/model/feature-importance", tags=["Model"])
async def model_feature_importance():
    """SHAP-based global feature importance."""
    importance = get_feature_importance()
    if not importance:
        raise HTTPException(
            status_code=404,
            detail="Feature importance not available. Run `python -m ml.train` first.",
        )
    # Sort by importance descending
    sorted_features = sorted(importance.items(), key=lambda x: x[1], reverse=True)
    return {
        "features": [{"name": k, "importance": v} for k, v in sorted_features],
    }


# ──────────────────────────────────────────────
# Root
# ──────────────────────────────────────────────
@app.get("/", tags=["System"])
async def root():
    """API root – welcome message."""
    return {
        "message": f"Welcome to {settings.APP_NAME}",
        "version": settings.APP_VERSION,
        "docs": "/docs",
    }
