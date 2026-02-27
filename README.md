# 🚀 ML Prediction API – Complete DevOps Pipeline

A **production-grade, end-to-end Machine Learning deployment system** featuring a Heart Disease Prediction API with a complete DevOps pipeline: Docker, Kubernetes, Jenkins CI/CD, Terraform IaC, and Prometheus/Grafana monitoring.

---

## 📐 Architecture

```
┌─────────────┐     ┌──────────────┐     ┌─────────────────┐     ┌──────────────────┐
│   Developer  │────▶│   GitHub     │────▶│    Jenkins      │────▶│   DockerHub      │
│   (Push)     │     │   (Source)   │     │   (CI/CD)       │     │   (Registry)     │
└─────────────┘     └──────────────┘     └────────┬────────┘     └────────┬─────────┘
                                                   │                       │
                                                   ▼                       ▼
                                          ┌────────────────┐     ┌──────────────────┐
                                          │   Terraform    │────▶│   Kubernetes     │
                                          │   (Provision)  │     │   (EKS Cluster)  │
                                          └────────────────┘     └────────┬─────────┘
                                                                          │
                                                          ┌───────────────┼───────────────┐
                                                          ▼               ▼               ▼
                                                   ┌────────────┐ ┌────────────┐ ┌────────────┐
                                                   │  Pod (API) │ │  Pod (API) │ │  Pod (API) │
                                                   │  Replica 1 │ │  Replica 2 │ │  Replica 3 │
                                                   └─────┬──────┘ └─────┬──────┘ └─────┬──────┘
                                                         │               │               │
                                                         └───────┬───────┘               │
                                                                 ▼                       │
                                                        ┌────────────────┐               │
                                                        │  Prometheus    │◀──────────────┘
                                                        │  (Metrics)    │
                                                        └───────┬───────┘
                                                                │
                                                                ▼
                                                        ┌────────────────┐
                                                        │   Grafana      │
                                                        │  (Dashboards)  │
                                                        └────────────────┘
```

---

## 📁 Project Structure

```
APDD/
├── app/                          # FastAPI Application
│   ├── __init__.py
│   ├── main.py                   # API endpoints (/health, /predict, /metrics)
│   ├── config.py                 # Environment-based configuration
│   ├── logger.py                 # Structured JSON logging
│   ├── analytics.py              # Real-time analytics & model comparison
│   └── schemas.py                # Pydantic request/response models
│
├── ml/                           # Machine Learning Pipeline
│   ├── __init__.py
│   ├── train.py                  # Training pipeline (data → model.pkl)
│   ├── evaluate.py               # Model evaluation & metrics report
│   ├── predict.py                # Prediction utility with lazy-load cache
│   ├── compare.py                # Multi-model comparison (RF, XGBoost, SVM)
│   └── outlier.py                # Outlier / anomaly detection
│
├── models/                       # Serialised model artifacts
│   ├── model.pkl                 # Trained model
│   └── scaler.pkl                # Fitted StandardScaler
│
├── frontend/                     # React (Vite) Frontend
│   ├── src/
│   │   ├── App.jsx               # Main app with Predict + Dashboard tabs
│   │   ├── components/           # UI components (HeartForm, ResultCard, etc.)
│   │   └── index.css             # Global styling (glassmorphism, ECG bg)
│   └── package.json
│
├── tests/                        # Test Suites
│   ├── conftest.py               # Shared fixtures
│   ├── test_api.py               # API endpoint tests
│   ├── test_model.py             # Model validation tests
│   ├── test_analytics.py         # Analytics engine tests
│   └── selenium/                 # Selenium UI tests
│       └── test_frontend.py      # Frontend form & dashboard tests
│
├── docs/                         # Documentation (syllabus-aligned)
│   ├── sdlc/                     # Week 1 – Waterfall & Agile
│   │   ├── waterfall-phases.md
│   │   ├── agile-backlog.md
│   │   ├── sprint-plans.md
│   │   └── burndown-chart.md
│   ├── scrum/                    # Week 2 – Scrum Framework
│   │   ├── scrum-roles.md
│   │   ├── sprint-backlog.md
│   │   ├── sprint-review.md
│   │   └── sprint-retrospective.md
│   ├── git/                      # Week 3 – Version Control
│   │   ├── branching-strategy.md
│   │   └── tagging-strategy.md
│   └── k8s/                      # Week 7–8 – Kubernetes
│       └── rolling-update-strategy.md
│
├── ansible/                      # Week 9 – Configuration Management
│   ├── inventory.ini             # Server inventory (web, CI, monitoring)
│   └── playbook.yml              # Setup Docker, Jenkins, deploy container
│
├── k8s/                          # Kubernetes manifests
│   ├── deployment.yaml           # 3-replica Deployment (envFrom ConfigMap/Secret)
│   ├── service.yaml              # LoadBalancer Service
│   ├── ingress.yaml              # NGINX Ingress
│   ├── hpa.yaml                  # Horizontal Pod Autoscaler
│   ├── configmap.yaml            # Non-sensitive environment config
│   └── secret.yaml               # Sensitive values (base64-encoded)
│
├── terraform/                    # Infrastructure as Code (AWS – Modular)
│   ├── main.tf                   # Root config (calls modules, S3 backend)
│   ├── variables.tf              # Input variables (with validation)
│   ├── outputs.tf                # Output values
│   ├── terraform.tfvars.example  # Example variable values
│   └── modules/
│       ├── network/              # VPC, subnets, IGW, NAT, routes
│       ├── eks/                  # EKS cluster, node group, IAM
│       └── jenkins/              # EC2 instance, security group
│
├── monitoring/                   # Observability
│   ├── prometheus.yaml           # Prometheus scrape configuration
│   ├── grafana-dashboard.json    # Grafana dashboard (6 panels)
│   └── alert-rules.yaml          # Prometheus alert rules
│
├── Dockerfile                    # Multi-stage production image
├── docker-compose.yml            # Local dev stack (API + Prometheus + Grafana)
├── .dockerignore                 # Docker build exclusions
├── Jenkinsfile                   # CI/CD pipeline (parallel tests, SonarQube, Selenium)
├── requirements.txt              # Python dependencies
├── start-all.ps1                 # Start backend + frontend (Windows)
├── .env.example                  # Environment variable template
├── .gitignore                    # Git exclusions
└── README.md                     # This file
```

---

## 🛠 Setup Instructions

### Prerequisites

| Tool       | Version   | Purpose                |
|------------|-----------|------------------------|
| Python     | ≥ 3.11    | ML pipeline & API      |
| Docker     | ≥ 24.0    | Containerisation       |
| kubectl    | ≥ 1.29    | Kubernetes management  |
| Terraform  | ≥ 1.5     | Infrastructure         |
| Jenkins    | ≥ 2.400   | CI/CD                  |

### 1. Clone & Install

```bash
git clone https://github.com/your-username/APDD.git
cd APDD

# Create virtual environment
python -m venv venv
source venv/bin/activate   # macOS/Linux
# venv\Scripts\activate    # Windows

# Install dependencies
pip install -r requirements.txt
```

### 2. Train the Model

```bash
python -m ml.train
```

Expected output:
```
[INFO] Loading Heart Disease dataset …
[INFO] Dataset shape: (303, 13)
[INFO] Train size: 242 | Test size: 61
[INFO] Training RandomForestClassifier …
[INFO] Training complete.
[INFO] Model saved  → models/model.pkl
[INFO] Scaler saved → models/scaler.pkl
[INFO] Training accuracy: 0.XXXX
[INFO] Test accuracy:     0.XXXX
✅ Training pipeline completed successfully.
```

### 3. Evaluate the Model

```bash
python -m ml.evaluate
```

### 4. Run the API Locally

```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

API will be available at:
- **Swagger UI**: http://localhost:8000/docs
- **Health**: http://localhost:8000/health
- **Metrics**: http://localhost:8000/metrics

### 5. Run Tests

```bash
python -m pytest tests/ -v
```

---

## 🐳 Docker

### Build & Run

```bash
# Build
docker build -t ml-prediction-api:latest .

# Run
docker run -p 8000:8000 ml-prediction-api:latest
```

### Local Stack (API + Prometheus + Grafana)

```bash
docker-compose up -d
```

| Service     | URL                       |
|-------------|---------------------------|
| API         | http://localhost:8000      |
| Prometheus  | http://localhost:9090      |
| Grafana     | http://localhost:3000      |

> Grafana default credentials: `admin` / `admin`

### Image Tagging Strategy

```
ml-prediction-api:latest              # Latest build
ml-prediction-api:<build>-<sha7>      # Jenkins build: BUILD_NUMBER + short commit SHA
ml-prediction-api:v1.0.0              # Semantic version for releases
```

---

## 🔄 CI/CD Pipeline (Jenkins)

The `Jenkinsfile` defines a declarative pipeline with parallel testing, code quality, and Selenium stages:

```
┌──────────┐   ┌──────────┐   ┌─────────────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐
│ Checkout │──▶│  Code    │──▶│  Tests (parallel)│──▶│  Build   │──▶│   Push   │──▶│  Deploy  │──▶│ Selenium │
│          │   │ Quality  │   │ Unit │ Lint     │   │  Docker  │   │ DockerHub│   │  to K8s  │   │  Tests   │
└──────────┘   │(SonarQube│   └──────┴─────────┘   └──────────┘   └──────────┘   └──────────┘   └──────────┘
               │placeholder│                                                           │
               └──────────┘                                                  On failure ▼
                                                                              ┌──────────┐
                                                                              │ Rollback │
                                                                              └──────────┘
```

### Key Features
- **Parallel test execution** – Unit tests and lint checks run simultaneously
- **Code quality** – SonarQube placeholder stage for static analysis
- **Docker image tagging** – Tagged with `BUILD_NUMBER-GIT_SHA` for traceability
- **Selenium tests** – Automated frontend testing post-deployment
- **Auto-rollback** on deployment failure via `kubectl rollout undo`
- **Post-build cleanup** – Docker images pruned, workspace cleaned
- **Console notifications** – Detailed success/failure build reports

### Jenkins Setup
1. Install plugins: Pipeline, Git, Docker Pipeline
2. Add credentials:
   - `dockerhub-credentials` – DockerHub username/password
   - `kubeconfig` – Kubernetes cluster config file
3. Create pipeline job pointing to `Jenkinsfile`
4. Configure GitHub webhook → `http://<jenkins-url>/github-webhook/`

---

## ☸️ Kubernetes Deployment

### Deploy Manually

```bash
# Create namespace
kubectl create namespace ml-production

# Apply manifests
kubectl apply -f k8s/ -n ml-production

# Check status
kubectl get pods -n ml-production
kubectl get svc -n ml-production
```

### Configuration Highlights

| Feature               | Value             |
|----------------------|-------------------|
| Replicas             | 3                 |
| CPU Request/Limit    | 100m / 500m       |
| Memory Request/Limit | 256Mi / 512Mi     |
| Liveness Probe       | GET /health       |
| Readiness Probe      | GET /health       |
| HPA Min/Max          | 3 / 10 pods       |
| HPA CPU Target       | 70%               |
| Rolling Update       | maxSurge=1        |
| Image Pull Policy    | Always            |

---

## 🏗 Terraform – Infrastructure Provisioning

### Resources Provisioned (AWS)

| Resource            | Description                         |
|---------------------|-------------------------------------|
| VPC                 | /16 CIDR with DNS support           |
| Public Subnets (×2) | For load balancers & NAT gateway    |
| Private Subnets (×2)| For EKS worker nodes                |
| Internet Gateway    | Public internet access              |
| NAT Gateway         | Private subnet egress               |
| EKS Cluster         | Managed Kubernetes cluster          |
| EKS Node Group      | Auto-scaling worker nodes           |
| EC2 Instance        | Jenkins CI/CD server (Ubuntu 22.04) |
| IAM Roles           | EKS cluster & node roles            |
| Security Groups     | Jenkins (SSH + 8080), EKS (443)     |

### Usage

```bash
cd terraform

# Copy and edit variables
cp terraform.tfvars.example terraform.tfvars
# Edit terraform.tfvars with your values

# Initialize
terraform init

# Plan
terraform plan

# Apply
terraform apply

# Get kubectl config
$(terraform output -raw configure_kubectl)
```

---

## 📊 Monitoring

### Prometheus

Scrapes the `/metrics` endpoint every 10 seconds. Metrics include:

| Metric                          | Type      | Description                    |
|---------------------------------|-----------|--------------------------------|
| `api_request_total`             | Counter   | Total API requests by endpoint |
| `api_request_latency_seconds`   | Histogram | Request latency distribution   |
| `prediction_total`              | Counter   | Predictions by result type     |

### Grafana Dashboard

Import `monitoring/grafana-dashboard.json` → 6 panels:

1. **Request Rate** – req/s by endpoint
2. **Error Rate** – 5xx percentage with thresholds
3. **Latency** – p50, p90, p99 percentiles
4. **Predictions** – Disease vs. No Disease count
5. **CPU Usage** – Process CPU utilisation
6. **Memory Usage** – RSS and Virtual memory

### Alert Rules

| Alert              | Condition                    | Severity |
|--------------------|------------------------------|----------|
| HighErrorRate      | >5% errors for 5min          | Critical |
| HighLatency        | p95 >1s for 5min             | Warning  |
| APIDown            | Target unreachable for 2min  | Critical |
| HighMemoryUsage    | >512MB RSS for 10min         | Warning  |
| NoPredictions      | Zero predictions for 30min   | Info     |

---

## 🧪 Testing

```bash
# Run all tests
python -m pytest tests/ -v

# Run with coverage
python -m pytest tests/ -v --tb=short
```

### Test Coverage

| Module         | Tests | Description                           |
|----------------|-------|---------------------------------------|
| `test_api.py`  | 15    | Health, predict, metrics, root, errors|
| `test_model.py`| 10    | Loading, prediction, batch, features  |

---

## 🌿 Git Branching Strategy

```
main ─────────────────────────────────── (production releases)
  │
  ├── develop ────────────────────────── (integration branch)
  │     │
  │     ├── feature/add-model-v2 ─────  (feature branches)
  │     ├── feature/add-logging ──────
  │     └── feature/update-dashboard ─
  │
  ├── hotfix/fix-prediction-bug ──────  (emergency fixes)
  │
  └── release/v1.1.0 ────────────────  (release prep)
```

| Branch       | Purpose                                    | Merges Into  |
|--------------|--------------------------------------------|--------------|
| `main`       | Production-ready code                      | –            |
| `develop`    | Integration of completed features          | `main`       |
| `feature/*`  | Individual feature development             | `develop`    |
| `hotfix/*`   | Emergency production fixes                 | `main` + `develop` |
| `release/*`  | Release stabilisation and version bumping  | `main` + `develop` |

---

## 📋 Agile Sprint Planning – Sample

### Sprint 1 (Week 1–2): Foundation
| Task                             | Story Points | Status |
|----------------------------------|:------------:|--------|
| Set up project structure         | 2            | ✅     |
| Build ML training pipeline       | 5            | ✅     |
| Create FastAPI endpoints         | 5            | ✅     |
| Write unit tests                 | 3            | ✅     |

### Sprint 2 (Week 3–4): Containerisation & CI/CD
| Task                             | Story Points | Status |
|----------------------------------|:------------:|--------|
| Create Dockerfile                | 3            | ✅     |
| Set up Docker Compose            | 2            | ✅     |
| Build Jenkins pipeline           | 5            | ✅     |
| Configure GitHub webhook         | 2            | ✅     |

### Sprint 3 (Week 5–6): Infrastructure & Monitoring
| Task                             | Story Points | Status |
|----------------------------------|:------------:|--------|
| Write Terraform scripts          | 8            | ✅     |
| Create K8s manifests             | 5            | ✅     |
| Set up Prometheus + Grafana      | 5            | ✅     |
| Configure alert rules            | 3            | ✅     |

### Sprint 4 (Week 7–8): Polish & Documentation
| Task                             | Story Points | Status |
|----------------------------------|:------------:|--------|
| Write comprehensive README       | 3            | ✅     |
| Performance testing              | 3            | 🔲     |
| Security hardening               | 3            | 🔲     |
| Final demo preparation           | 2            | 🔲     |

---

## 🚀 Demo Instructions

### Quick Start (Local)
```bash
# 1. Clone and install
git clone https://github.com/your-username/APDD.git && cd APDD
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt

# 2. Train the model
python -m ml.train

# 3. Run the API
uvicorn app.main:app --host 0.0.0.0 --port 8000

# 4. Test a prediction (open new terminal)
curl -X POST http://localhost:8000/predict \
  -H "Content-Type: application/json" \
  -d '{
    "age": 52, "sex": 1, "cp": 0, "trestbps": 125,
    "chol": 212, "fbs": 0, "restecg": 1, "thalach": 168,
    "exang": 0, "oldpeak": 1.0, "slope": 2, "ca": 2, "thal": 3
  }'
```

### Full Stack Demo (Docker Compose)
```bash
# 1. Train model first
python -m ml.train

# 2. Launch everything
docker-compose up -d

# 3. Access services
open http://localhost:8000/docs      # API Swagger UI
open http://localhost:9090           # Prometheus
open http://localhost:3000           # Grafana (admin/admin)
```

### Screenshots

> 📸 *Add screenshots here after running the demo:*
> - Swagger UI with /predict endpoint
> - Grafana dashboard with real-time metrics
> - Jenkins pipeline execution
> - Kubernetes pod status
> - Terraform apply output

---

## 📄 License

This project is developed for academic purposes as part of a DevOps & AI course.

---

## 👤 Author

**Suryansh Saraf**

---

*Built with ❤️ using Python, FastAPI, Docker, Kubernetes, Jenkins, Terraform, Prometheus & Grafana.*
