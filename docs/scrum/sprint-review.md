# Sprint Review – CardioAnalytics Sprint 2

> Summary of the Sprint 2 Demo held at the end of the Containerisation & CI/CD sprint.

---

## Meeting Details

| Field | Value |
|-------|-------|
| **Sprint** | Sprint 2 – Containerisation & CI/CD |
| **Date** | Week 4, Friday |
| **Attendees** | Product Owner, Scrum Master, Dev Team |
| **Duration** | 1 hour |

---

## Demo Summary

### What Was Demonstrated

1. **Docker Build & Run**
   - Showed `docker build -t ml-prediction-api:latest .` executing successfully
   - Demonstrated multi-stage build reducing image size by ~40%
   - Ran `docker-compose up -d` and showed all 3 services healthy

2. **Jenkins Pipeline**
   - Triggered pipeline via `git push`
   - Showed 6 stages executing: Checkout → Install → Test → Build → Push → Deploy
   - Demonstrated parallel test execution (unit + lint)
   - Showed Docker image tagged with `BUILD_NUMBER-GIT_SHA`

3. **React Frontend**
   - Opened http://localhost:5173 and filled in patient data form
   - Submitted prediction and showed the result card with probability
   - Switched to Dashboard tab showing analytics charts

---

## Stakeholder Feedback

| Feedback | Action |
|----------|--------|
| "Can we add feature importance to the results?" | Added to backlog (US-205) |
| "Dashboard needs model comparison view" | Added to Sprint 3 |
| "Docker image should use non-root user" | ✅ Already implemented |
| "Jenkins notifications should include build time" | Added to backlog |

---

## Sprint Metrics

| Metric | Value |
|--------|-------|
| **Planned Points** | 18 |
| **Completed Points** | 18 |
| **Velocity** | 18 pts/sprint |
| **Carry-over Items** | 0 |
| **Bugs Found** | 1 (CORS issue — fixed mid-sprint) |

---

## Items Completed

- [x] US-301: Docker containerisation (3 pts)
- [x] US-302: Jenkins CI/CD pipeline (5 pts)
- [x] US-202: React frontend form (5 pts)
- [x] US-204: Analytics dashboard (3 pts)
- [x] Docker image tagging strategy (2 pts)

## Items Not Completed
- None — all sprint backlog items were delivered.
