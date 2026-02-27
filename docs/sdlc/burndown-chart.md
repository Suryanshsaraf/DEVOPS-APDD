# Burndown Chart – CardioAnalytics Sprint 1

> A burndown chart tracks remaining work (story points) over time within a sprint.

---

## What is a Burndown Chart?

A **burndown chart** plots the total remaining story points (Y-axis) against the sprint timeline (X-axis). The **ideal line** shows a steady linear decrease from total points to zero. The **actual line** shows real daily progress.

- If actual is **above** the ideal line → the team is **behind schedule**
- If actual is **below** the ideal line → the team is **ahead of schedule**

---

## Sprint 1 Burndown (16 Story Points, 10 Working Days)

```
Points
Remaining
  16 │ ●·····
     │  ╲  ●
  14 │   ╲   ·····
     │    ╲       ●
  12 │     ╲       ·····
     │      ╲           ●
  10 │       ╲           ╲
     │        ╲           ╲
   8 │         ╲       ●···╲
     │          ╲     ╱     ╲
   6 │           ╲   ╱       ╲
     │            ╲ ╱         ●
   4 │             ●           ╲
     │              ╲           ╲
   2 │               ╲           ●
     │                ╲         ╱
   0 │─────────────────●───────●
     └──┬──┬──┬──┬──┬──┬──┬──┬──┬──┬
       D1 D2 D3 D4 D5 D6 D7 D8 D9 D10

     ── Ideal burndown (dashed)
     ●  Actual progress (dots connected)
```

### Daily Data

| Day | Ideal Remaining | Actual Remaining | Notes |
|:---:|:---------------:|:----------------:|-------|
| D1  | 14.4 | 16 | Sprint planning, no tasks completed |
| D2  | 12.8 | 14 | Dataset preparation completed (1 pt) |
| D3  | 11.2 | 12 | Started training pipeline |
| D4  | 9.6  | 10 | Training pipeline + evaluation done (5 pts) |
| D5  | 8.0  | 8  | On track – API endpoints started |
| D6  | 6.4  | 8  | Blocker: model accuracy below threshold |
| D7  | 4.8  | 6  | Fixed with hyperparameter tuning |
| D8  | 3.2  | 4  | Schemas + validation done |
| D9  | 1.6  | 2  | Unit tests written |
| D10 | 0.0  | 0  | All tasks completed ✅ |

---

## Key Observations

1. **Days 1–2:** Slow start due to sprint planning overhead — common pattern
2. **Day 6:** Actual went above ideal (blocker on model accuracy) — identified in daily standup
3. **Day 7:** Recovery after resolving the blocker
4. **Day 10:** Sprint completed successfully — all 16 points delivered

> **Takeaway:** The burndown chart helped identify the Day 6 blocker early. Without daily tracking, this could have derailed the sprint.
