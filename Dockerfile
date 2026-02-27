# ──────────────────────────────────────────────────
# ML Prediction API – Multi-Stage Production Dockerfile
# ──────────────────────────────────────────────────
# Stage 1 (builder): Install Python dependencies
# Stage 2 (runtime): Copy only what's needed for a lean image
# ──────────────────────────────────────────────────

# ════════════════════════════════════════════════════
# STAGE 1: Builder – install dependencies
# ════════════════════════════════════════════════════
FROM python:3.11-slim AS builder

# Prevent bytecode + ensure unbuffered output
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1

WORKDIR /build

# Install Python dependencies into a virtual env for easy copy
COPY requirements.txt .
RUN python -m venv /opt/venv && \
    /opt/venv/bin/pip install --no-cache-dir -r requirements.txt

# ════════════════════════════════════════════════════
# STAGE 2: Runtime – lean production image
# ════════════════════════════════════════════════════
FROM python:3.11-slim AS runtime

# ── Metadata ──────────────────────────────────────
LABEL maintainer="sunil.saraf@example.com"
LABEL description="Heart Disease Prediction API – Multi-Stage Build"
LABEL version="1.1.0"

# ── Environment ───────────────────────────────────
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    APP_HOST=0.0.0.0 \
    APP_PORT=8000 \
    PATH="/opt/venv/bin:$PATH"

# ── System dependencies (curl for healthcheck) ───
RUN apt-get update && \
    apt-get install -y --no-install-recommends curl && \
    rm -rf /var/lib/apt/lists/*

# ── Create non-root user ─────────────────────────
RUN groupadd --gid 1000 appuser && \
    useradd --uid 1000 --gid appuser --shell /bin/bash --create-home appuser

# ── Working directory ─────────────────────────────
WORKDIR /app

# ── Copy virtualenv from builder stage ────────────
COPY --from=builder /opt/venv /opt/venv

# ── Copy application code only ───────────────────
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
