# Git Branching Strategy – CardioAnalytics

> Git-flow based branching model for the ML DevOps project.

---

## Branch Structure

```
main ─────────────────────────────────── (production releases)
  │
  ├── develop ────────────────────────── (integration branch)
  │     │
  │     ├── feature/add-model-v2 ─────  (feature branches)
  │     ├── feature/add-dashboard ─────
  │     ├── feature/selenium-tests ────
  │     └── feature/ecg-background ────
  │
  ├── hotfix/fix-prediction-bug ──────  (emergency production fixes)
  │
  └── release/v1.1.0 ────────────────  (release preparation)
```

---

## Branch Types

| Branch | Pattern | Created From | Merges Into | Purpose |
|--------|---------|-------------|-------------|---------|
| `main` | `main` | – | – | Production-ready code |
| `develop` | `develop` | `main` | `main` | Integration of completed features |
| Feature | `feature/<name>` | `develop` | `develop` | Individual feature development |
| Hotfix | `hotfix/<name>` | `main` | `main` + `develop` | Emergency production fixes |
| Release | `release/v<x.y.z>` | `develop` | `main` + `develop` | Release stabilisation |

---

## Feature Branch Naming Convention

```
feature/<category>-<short-description>
```

### Categories

| Prefix | Area | Examples |
|--------|------|---------|
| `ml-` | Machine learning | `feature/ml-xgboost-model` |
| `api-` | Backend API | `feature/api-batch-predict` |
| `ui-` | Frontend | `feature/ui-ecg-background` |
| `devops-` | CI/CD & infra | `feature/devops-parallel-tests` |
| `docs-` | Documentation | `feature/docs-scrum-roles` |
| `test-` | Testing | `feature/test-selenium-suite` |

### Examples
```
feature/ml-model-comparison
feature/api-analytics-endpoint
feature/ui-dashboard-charts
feature/devops-terraform-modules
feature/test-selenium-frontend
hotfix/fix-cors-header
release/v1.1.0
```

---

## Workflow Rules

1. **Never push directly to `main`** — all changes go through PRs
2. **Feature branches are short-lived** — merge within 1 sprint (2 weeks max)
3. **Squash merge** feature branches to keep `main` history clean
4. **Delete branches** after merging
5. **Hotfixes** are the only exception to the develop → main flow
6. **Tag every release** on `main` with semantic version

---

## Pull Request Process

1. Developer creates feature branch from `develop`
2. Developer pushes commits and opens a PR to `develop`
3. At least 1 reviewer approves the PR
4. CI pipeline (Jenkins) must pass — all tests green
5. Squash merge into `develop`
6. Delete the feature branch
7. At sprint end, merge `develop` → `main` via release branch
