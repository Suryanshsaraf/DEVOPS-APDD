"""
FastAPI Application – ML Prediction API.

Endpoints:
    GET  /health   – Liveness / readiness probe.
    POST /predict  – Heart disease prediction.
    GET  /metrics  – Prometheus metrics.

Usage::

    uvicorn app.main:app --host 0.0.0.0 --port 8000
"""

import time
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import PlainTextResponse
from prometheus_client import (
    Counter,
    Histogram,
    generate_latest,
    CONTENT_TYPE_LATEST,
)

from app.config import settings
from app.logger import get_logger
from app.schemas import HeartDiseaseInput, HealthResponse, PredictionResponse
from ml.predict import is_model_loaded, predict

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
    description="Production-grade Heart Disease Prediction API with DevOps pipeline.",
    lifespan=lifespan,
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
# Endpoints
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
    """Run heart disease prediction on the supplied clinical features."""
    logger.info("Prediction request received: %s", payload.model_dump())

    if not is_model_loaded():
        logger.error("Model not available for prediction.")
        raise HTTPException(
            status_code=503,
            detail="Model not loaded. Please train the model first.",
        )

    try:
        result = predict(payload.model_dump())

        PREDICTION_COUNT.labels(
            result="disease" if result["prediction"] == 1 else "no_disease"
        ).inc()

        logger.info("Prediction result: %s", result)

        return PredictionResponse(
            prediction=result["prediction"],
            probability=result["probability"],
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
