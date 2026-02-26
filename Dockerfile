# ──────────────────────────────────────────────────
# ML Prediction API – Production Dockerfile
# ──────────────────────────────────────────────────
# Multi-stage-ready, slim base, non-root user,
# layer-optimised, health-checked.
# ──────────────────────────────────────────────────

FROM python:3.11-slim AS base

# ── Metadata ──────────────────────────────────────
LABEL maintainer="sunil.saraf@example.com"
LABEL description="Heart Disease Prediction API"
LABEL version="1.0.0"

# ── Environment ───────────────────────────────────
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1 \
    APP_HOST=0.0.0.0 \
    APP_PORT=8000

# ── System dependencies ──────────────────────────
RUN apt-get update && \
    apt-get install -y --no-install-recommends curl && \
    rm -rf /var/lib/apt/lists/*

# ── Create non-root user ─────────────────────────
RUN groupadd --gid 1000 appuser && \
    useradd --uid 1000 --gid appuser --shell /bin/bash --create-home appuser

# ── Working directory ─────────────────────────────
WORKDIR /app

# ── Install Python dependencies (layer cache) ────
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# ── Copy application code ────────────────────────
COPY app/ ./app/
COPY ml/ ./ml/
COPY models/ ./models/

# ── Set ownership ─────────────────────────────────
RUN chown -R appuser:appuser /app

# ── Switch to non-root user ──────────────────────
USER appuser

# ── Expose port ───────────────────────────────────
EXPOSE 8000

# ── Health check ──────────────────────────────────
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD curl -f http://localhost:8000/health || exit 1

# ── Entrypoint ────────────────────────────────────
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "2"]
