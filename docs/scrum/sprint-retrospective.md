# Sprint Retrospective – CardioAnalytics Sprint 2

> Continuous improvement review after the Containerisation & CI/CD sprint.

---

## Meeting Details

| Field | Value |
|-------|-------|
| **Sprint** | Sprint 2 – Containerisation & CI/CD |
| **Date** | Week 4, Friday (after Sprint Review) |
| **Facilitator** | Suryansh Saraf (Scrum Master) |
| **Duration** | 1 hour |
| **Format** | Start / Stop / Continue |

---

## 🟢 What Went Well (Continue)

1. **Docker setup was smooth** — Multi-stage build worked on first attempt, image size is lean (~280MB)
2. **Parallel testing saved time** — Running unit and lint tests in parallel reduced pipeline time by 35%
3. **Frontend delivered ahead of schedule** — React form and dashboard were completed 1 day early
4. **Good communication** — Daily standups caught the CORS issue on Day 3, fixed by Day 4
5. **Clean Git workflow** — Feature branches + PRs kept main stable throughout

---

## 🔴 What Didn't Go Well (Stop)

1. **CORS bug in API** — Not caught until frontend integration; should have been in acceptance criteria
2. **Late docker-compose testing** — Combined stack wasn't tested until Day 7; should be earlier
3. **Jenkins agent configuration** — Took 3 hours to debug Docker permissions; should document setup
4. **Inconsistent env vars** — Docker-compose and K8s had different env var names

---

## 🟡 What to Improve (Start)

1. **Add integration tests** — Test frontend → API flow before sprint review
2. **Document Jenkins setup** — Create a setup guide so new agents work immediately
3. **Standardise env vars** — Use ConfigMap/Secret as single source of truth
4. **Add Selenium tests** — Automate frontend testing to catch UI regressions

---

## Action Items

| # | Action | Owner | Due |
|---|--------|-------|-----|
| 1 | Add CORS test to API test suite | QA | Sprint 3 Day 2 |
| 2 | Write Jenkins agent setup doc | Suryansh | Sprint 3 Day 1 |
| 3 | Create K8s ConfigMap for env vars | DevOps | Sprint 3 |
| 4 | Add Selenium test stage to pipeline | QA | Sprint 3 |
| 5 | Test docker-compose on Day 3 of future sprints | All | Ongoing |

---

## Team Happiness

```
😊 ████████████████████ 4.2 / 5.0
```

> Team morale is high. The sprint was productive and all items were delivered on time. Main concern is avoiding integration issues in future sprints.
