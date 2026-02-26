"""
Application Configuration Module.

Manages all configuration via environment variables with sensible defaults.
Uses pydantic-settings for validation and type coercion.
"""

import os
from pathlib import Path

from pydantic_settings import BaseSettings


# ──────────────────────────────────────────────
# Path Constants
# ──────────────────────────────────────────────
BASE_DIR = Path(__file__).resolve().parent.parent
MODEL_DIR = BASE_DIR / "models"
MODEL_PATH = MODEL_DIR / "model.pkl"
SCALER_PATH = MODEL_DIR / "scaler.pkl"


class Settings(BaseSettings):
    """Application settings loaded from environment variables / .env file."""

    # ── API Settings ──────────────────────────
    APP_NAME: str = "ML Prediction API"
    APP_VERSION: str = "1.0.0"
    APP_HOST: str = "0.0.0.0"
    APP_PORT: int = 8000
    DEBUG: bool = False

    # ── Model Settings ────────────────────────
    MODEL_PATH: str = str(MODEL_PATH)
    SCALER_PATH: str = str(SCALER_PATH)

    # ── Logging ───────────────────────────────
    LOG_LEVEL: str = "INFO"
    LOG_FORMAT: str = "json"

    # ── Prometheus ────────────────────────────
    METRICS_ENABLED: bool = True

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = True


# Singleton instance
settings = Settings()
