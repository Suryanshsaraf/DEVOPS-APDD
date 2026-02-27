# Agile Product Backlog – CardioAnalytics

> User stories prioritised by business value for iterative ML system delivery.

---

## Epic 1: Core ML Prediction

| ID | User Story | Priority | Story Points |
|----|-----------|----------|:------------:|
| US-101 | As a **clinician**, I want to submit patient data and receive a heart disease prediction, so I can assist in diagnosis. | Must | 8 |
| US-102 | As a **clinician**, I want to see the probability of heart disease, not just yes/no, so I can assess risk severity. | Must | 3 |
| US-103 | As a **data scientist**, I want the model accuracy to be ≥ 80%, so predictions are clinically meaningful. | Must | 5 |
| US-104 | As a **data scientist**, I want to compare multiple algorithms (RF, XGBoost, SVM), so I can choose the best model. | Should | 5 |

## Epic 2: API & Frontend

| ID | User Story | Priority | Story Points |
|----|-----------|----------|:------------:|
| US-201 | As a **developer**, I want a REST API with proper input validation, so the system rejects bad data gracefully. | Must | 5 |
| US-202 | As a **clinician**, I want a web-based form to enter patient data, so I don't need to use command-line tools. | Must | 8 |
| US-203 | As a **user**, I want the API to respond within 500ms, so the system feels responsive. | Should | 3 |
| US-204 | As a **user**, I want to see an analytics dashboard with prediction statistics, so I can track system usage. | Could | 5 |

## Epic 3: DevOps & Infrastructure

| ID | User Story | Priority | Story Points |
|----|-----------|----------|:------------:|
| US-301 | As a **DevOps engineer**, I want the application containerised with Docker, so deployments are reproducible. | Must | 3 |
| US-302 | As a **DevOps engineer**, I want a CI/CD pipeline that runs tests on every push, so bugs are caught early. | Must | 5 |
| US-303 | As a **DevOps engineer**, I want Kubernetes orchestration with auto-scaling, so the system handles traffic spikes. | Should | 8 |
| US-304 | As a **DevOps engineer**, I want infrastructure provisioned via Terraform, so environments are consistent. | Should | 8 |
| US-305 | As a **DevOps engineer**, I want Ansible playbooks for server configuration, so setup is automated and repeatable. | Could | 5 |

## Epic 4: Monitoring & Quality

| ID | User Story | Priority | Story Points |
|----|-----------|----------|:------------:|
| US-401 | As an **SRE**, I want Prometheus metrics and Grafana dashboards, so I can monitor system health. | Should | 5 |
| US-402 | As an **SRE**, I want automated alerts for high error rates and latency, so I'm notified of issues. | Should | 3 |
| US-403 | As a **QA engineer**, I want Selenium tests for the frontend, so UI regressions are caught automatically. | Could | 5 |

---

## Backlog Summary

| Priority | Stories | Total Points |
|----------|:-------:|:------------:|
| Must     | 6       | 32           |
| Should   | 6       | 32           |
| Could    | 3       | 15           |
| **Total**| **15**  | **79**       |

> **Velocity assumption:** ~25 story points per 2-week sprint → ~3 sprints to deliver all Must + Should items.
