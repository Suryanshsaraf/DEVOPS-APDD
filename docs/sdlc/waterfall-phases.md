# Waterfall SDLC – Phase Breakdown for CardioAnalytics

> Traditional sequential approach applied to the ML Heart Disease Prediction project.

---

## Phase 1: Requirements Gathering (Week 1–2)

**Objective:** Define what the system must do.

| Requirement ID | Description | Priority |
|---------------|-------------|----------|
| REQ-001 | System shall predict heart disease from 13 clinical features | Must |
| REQ-002 | REST API with JSON input/output | Must |
| REQ-003 | Model accuracy ≥ 80% on test data | Must |
| REQ-004 | Response time < 500ms per prediction | Should |
| REQ-005 | Containerised deployment via Docker | Must |
| REQ-006 | CI/CD pipeline with automated tests | Must |
| REQ-007 | Kubernetes orchestration with auto-scaling | Should |
| REQ-008 | Real-time monitoring and alerting | Should |
| REQ-009 | Infrastructure as Code for cloud provisioning | Could |

**Deliverables:** Requirements Specification Document (this table), stakeholder sign-off.

---

## Phase 2: System Design (Week 3–4)

**Objective:** Architect the solution.

### High-Level Design
```
User → React Frontend → FastAPI Backend → ML Model (RandomForest)
                              ↓
                        Prometheus → Grafana
```

### Component Design
- **ML Pipeline:** `ml/train.py` → `ml/evaluate.py` → `ml/predict.py`
- **API Layer:** FastAPI with Pydantic validation, structured JSON logging
- **Infrastructure:** Docker → Kubernetes (EKS) → Terraform provisioning
- **CI/CD:** Jenkins declarative pipeline with 6 stages
- **Monitoring:** Prometheus scraping `/metrics`, Grafana dashboards

**Deliverables:** Architecture diagram, API schema, infrastructure topology.

---

## Phase 3: Implementation (Week 5–9)

**Objective:** Build all components.

| Sub-Phase | Component | Key Files |
|-----------|-----------|-----------|
| 3a | ML pipeline | `ml/train.py`, `ml/evaluate.py`, `ml/predict.py` |
| 3b | FastAPI API | `app/main.py`, `app/schemas.py`, `app/config.py` |
| 3c | Docker setup | `Dockerfile`, `docker-compose.yml` |
| 3d | CI/CD | `Jenkinsfile` |
| 3e | Kubernetes | `k8s/deployment.yaml`, `k8s/service.yaml`, `k8s/hpa.yaml` |
| 3f | Terraform | `terraform/main.tf`, `terraform/variables.tf` |
| 3g | Monitoring | `monitoring/prometheus.yaml`, `monitoring/grafana-dashboard.json` |

**Deliverables:** Working code, trained model, all configuration files.

---

## Phase 4: Testing (Week 10–11)

**Objective:** Verify the system works correctly.

| Test Type | Scope | Tool |
|-----------|-------|------|
| Unit Tests | API endpoints, model predictions | Pytest |
| Integration Tests | API + model pipeline | Pytest + httpx |
| Selenium Tests | Frontend form submission and response | Selenium WebDriver |
| Load Testing | API throughput under stress | curl / locust |
| Infrastructure Tests | Terraform plan validation | `terraform plan` |

**Deliverables:** Test reports, coverage metrics, bug fixes.

---

## Phase 5: Deployment (Week 12)

**Objective:** Release to production.

- Docker image built and pushed to DockerHub
- Terraform provisions AWS infrastructure (VPC, EKS, Jenkins EC2)
- Kubernetes manifests applied to EKS cluster
- Jenkins pipeline triggers on `git push`
- Prometheus + Grafana monitoring active

**Deliverables:** Production deployment, deployment runbook.

---

## Phase 6: Maintenance (Ongoing)

**Objective:** Keep the system healthy.

- Monitor Grafana dashboards for anomalies
- Respond to Prometheus alerts (HighErrorRate, HighLatency)
- Retrain model with new data periodically
- Apply security patches
- Scale infrastructure as needed via HPA and Terraform

**Deliverables:** Incident reports, model retraining logs, change requests.

---

## Waterfall Limitations Observed

| Issue | Impact |
|-------|--------|
| Late testing discovery | ML model accuracy issues found late in Phase 4 |
| No iterative feedback | Stakeholder couldn't see the UI until Phase 5 |
| Rigid change process | Adding a new feature required restarting from Phase 2 |
| Long delivery cycle | 12 weeks before first working demo |

> **Conclusion:** These limitations motivated the transition to Agile (see [agile-backlog.md](agile-backlog.md)).
