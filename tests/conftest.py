"""
Test Configuration – Shared Fixtures.

Provides reusable test fixtures for the API and model test suites.
"""

import os
import sys
import pytest
from fastapi.testclient import TestClient

# Ensure project root is on the path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.main import app


@pytest.fixture
def client():
    """Create a FastAPI TestClient instance."""
    with TestClient(app) as c:
        yield c


@pytest.fixture
def sample_input():
    """Return a valid heart disease prediction input."""
    return {
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


@pytest.fixture
def invalid_input():
    """Return an invalid input with missing fields."""
    return {
        "age": 52,
        "sex": 1,
        # Missing required fields
    }


@pytest.fixture
def out_of_range_input():
    """Return an input with out-of-range values."""
    return {
        "age": 200,     # Max is 120
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
