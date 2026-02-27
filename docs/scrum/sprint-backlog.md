# Sprint Backlog – CardioAnalytics Sprint 2

> Detailed task breakdown for Sprint 2: Containerisation & CI/CD.

---

## Sprint Goal
> Containerise the ML API using Docker, build a CI/CD pipeline with Jenkins, and deliver a React frontend for clinicians.

**Sprint Duration:** 2 weeks (10 working days)  
**Team Capacity:** 18 story points

---

## Sprint Backlog Items

### 1. Docker Containerisation (US-301)

| Task ID | Task | Est. Hours | Owner | Status |
|---------|------|:----------:|-------|--------|
| T-201 | Write multi-stage Dockerfile | 3h | Suryansh | ✅ Done |
| T-202 | Create .dockerignore file | 0.5h | Suryansh | ✅ Done |
| T-203 | Add HEALTHCHECK instruction | 0.5h | Suryansh | ✅ Done |
| T-204 | Write docker-compose.yml (API + Prometheus + Grafana) | 2h | Suryansh | ✅ Done |
| T-205 | Test `docker build` and `docker-compose up` | 1h | QA | ✅ Done |

### 2. Jenkins CI/CD Pipeline (US-302)

| Task ID | Task | Est. Hours | Owner | Status |
|---------|------|:----------:|-------|--------|
| T-206 | Write declarative Jenkinsfile | 3h | Suryansh | ✅ Done |
| T-207 | Add parallel test execution stage | 1h | Suryansh | ✅ Done |
| T-208 | Add SonarQube code quality stage | 1h | Suryansh | ✅ Done |
| T-209 | Configure Docker image tagging (BUILD_NUMBER) | 1h | Suryansh | ✅ Done |
| T-210 | Add post-build cleanup and notifications | 1h | Suryansh | ✅ Done |

### 3. React Frontend (US-202)

| Task ID | Task | Est. Hours | Owner | Status |
|---------|------|:----------:|-------|--------|
| T-211 | Set up Vite + React project | 1h | Frontend | ✅ Done |
| T-212 | Build patient assessment form (HeartForm) | 4h | Frontend | ✅ Done |
| T-213 | Build result card component | 2h | Frontend | ✅ Done |
| T-214 | Build analytics dashboard | 3h | Frontend | ✅ Done |
| T-215 | Add glassmorphism styling | 2h | Frontend | ✅ Done |

---

## Definition of Done (DoD)

- [x] Code is committed to feature branch
- [x] All existing unit tests pass
- [x] Docker image builds successfully
- [x] Code is peer-reviewed
- [x] Documentation is updated

---

## Burndown Summary

| Day | Remaining Points | Notes |
|:---:|:----------------:|-------|
| D1  | 18 | Sprint planning completed |
| D3  | 14 | Dockerfile + docker-compose done |
| D5  | 10 | Jenkinsfile created |
| D7  | 6  | Frontend form built |
| D9  | 2  | Dashboard + styling |
| D10 | 0  | All items completed ✅ |
