# Scrum Roles – CardioAnalytics Project

> Scrum role assignments for the ML DevOps platform team.

---

## Product Owner

**Name:** Prof. Sharma (Academic Supervisor)

**Responsibilities:**
- Defines and prioritises the product backlog
- Accepts or rejects sprint deliverables
- Represents end-user (clinician) interests
- Makes scope decisions (must-have vs. nice-to-have features)

**Key Decisions Made:**
- Prediction accuracy ≥ 80% is a must-have requirement
- Frontend dashboard is a should-have, not must-have
- Kubernetes + Terraform are required for the course syllabus

---

## Scrum Master

**Name:** Suryansh Saraf

**Responsibilities:**
- Facilitates daily standups, sprint planning, reviews, and retrospectives
- Removes blockers (e.g., environment setup issues, dependency conflicts)
- Ensures the team follows Scrum practices
- Shields the team from external interruptions

**Blockers Resolved:**
- Docker build failing due to incompatible NumPy version → pinned to `2.2.2`
- Jenkins agent missing Docker permissions → added `jenkins` user to `docker` group
- Terraform state conflict → configured S3 remote backend with DynamoDB locking

---

## Development Team

| Member | Role | Primary Area |
|--------|------|-------------|
| Suryansh Saraf | Full-Stack / DevOps | API, Docker, Jenkins, K8s, Terraform |
| Team Member 2 | ML Engineer | Training pipeline, model evaluation |
| Team Member 3 | Frontend Developer | React UI, dashboard components |
| Team Member 4 | QA / SRE | Testing, monitoring, alerting |

**Team Characteristics:**
- **Size:** 4 members (within recommended 3–9)
- **Cross-functional:** Covers ML, backend, frontend, DevOps, and QA
- **Self-organising:** Team decides how to accomplish sprint goals
- **Collocated:** Working in the same lab environment

---

## Scrum Events Schedule

| Event | Frequency | Duration | Day/Time |
|-------|-----------|----------|----------|
| Sprint Planning | Every 2 weeks | 2 hours | Monday, 10:00 AM |
| Daily Standup | Daily | 15 min | 9:30 AM |
| Sprint Review | Every 2 weeks | 1 hour | Friday, 3:00 PM |
| Sprint Retrospective | Every 2 weeks | 1 hour | Friday, 4:00 PM |
| Backlog Refinement | Weekly | 1 hour | Wednesday, 2:00 PM |
