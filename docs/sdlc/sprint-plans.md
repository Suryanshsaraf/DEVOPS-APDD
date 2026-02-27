# Sprint Plans – CardioAnalytics

> 3 two-week sprints covering the core delivery of the ML DevOps platform.

---

## Sprint 1: ML Pipeline & API Foundation (Week 1–2)

**Sprint Goal:** Deliver a working prediction API with a trained model.

| Task | Story | Points | Owner | Status |
|------|-------|:------:|-------|--------|
| Prepare heart disease dataset | US-101 | 1 | Data Team | ✅ Done |
| Build training pipeline (`ml/train.py`) | US-101 | 3 | ML Engineer | ✅ Done |
| Build evaluation script (`ml/evaluate.py`) | US-103 | 2 | ML Engineer | ✅ Done |
| Create FastAPI endpoints (`/predict`, `/health`) | US-201 | 3 | Backend Dev | ✅ Done |
| Add Pydantic schemas with validation | US-201 | 2 | Backend Dev | ✅ Done |
| Write unit tests (API + model) | US-201 | 3 | QA Engineer | ✅ Done |
| Create prediction utility with caching | US-203 | 2 | Backend Dev | ✅ Done |

**Capacity:** 16 points | **Velocity (actual):** 16 points

### Acceptance Criteria
- [x] `python -m ml.train` produces `models/model.pkl` with ≥ 80% accuracy
- [x] `POST /predict` returns JSON with `prediction` and `probability`
- [x] All 25 unit tests pass

---

## Sprint 2: Containerisation & CI/CD (Week 3–4)

**Sprint Goal:** Containerise the application and automate builds.

| Task | Story | Points | Owner | Status |
|------|-------|:------:|-------|--------|
| Create production Dockerfile (multi-stage) | US-301 | 2 | DevOps | ✅ Done |
| Create docker-compose (API + Prometheus + Grafana) | US-301 | 2 | DevOps | ✅ Done |
| Write Jenkinsfile with 6 stages | US-302 | 3 | DevOps | ✅ Done |
| Configure parallel test execution | US-302 | 2 | DevOps | ✅ Done |
| Build React frontend with prediction form | US-202 | 5 | Frontend Dev | ✅ Done |
| Add analytics dashboard page | US-204 | 3 | Frontend Dev | ✅ Done |
| Set up .dockerignore | US-301 | 1 | DevOps | ✅ Done |

**Capacity:** 18 points | **Velocity (actual):** 18 points

### Acceptance Criteria
- [x] `docker build` succeeds and image runs correctly
- [x] `docker-compose up -d` starts all 3 services
- [x] Jenkins pipeline runs end-to-end on push

---

## Sprint 3: Infrastructure & Monitoring (Week 5–6)

**Sprint Goal:** Deploy to AWS with K8s and set up monitoring.

| Task | Story | Points | Owner | Status |
|------|-------|:------:|-------|--------|
| Write Terraform modules (VPC, EKS, Jenkins) | US-304 | 5 | DevOps | ✅ Done |
| Create K8s manifests (Deployment, Service, HPA) | US-303 | 3 | DevOps | ✅ Done |
| Add ConfigMap and Secret resources | US-303 | 2 | DevOps | ✅ Done |
| Configure Prometheus scrape targets | US-401 | 2 | SRE | ✅ Done |
| Build Grafana dashboard (6 panels) | US-401 | 3 | SRE | ✅ Done |
| Configure alert rules (5 alerts) | US-402 | 2 | SRE | ✅ Done |
| Create Ansible playbook for server config | US-305 | 3 | DevOps | ✅ Done |

**Capacity:** 20 points | **Velocity (actual):** 20 points

### Acceptance Criteria
- [x] `terraform plan` completes without errors
- [x] `kubectl apply -f k8s/` creates all resources
- [x] Grafana dashboard shows live metrics
