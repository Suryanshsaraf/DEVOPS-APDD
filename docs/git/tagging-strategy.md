# Tagging Strategy – CardioAnalytics

> Semantic versioning for model releases and application versions.

---

## Semantic Versioning Format

```
v<MAJOR>.<MINOR>.<PATCH>
```

| Component | When to Increment | Example |
|-----------|------------------|---------|
| **MAJOR** | Breaking API changes, model architecture change | `v2.0.0` |
| **MINOR** | New features, new model algorithm added | `v1.1.0` |
| **PATCH** | Bug fixes, hyperparameter tuning, documentation | `v1.0.1` |

---

## Model Version Tags

| Tag | Description | Model | Accuracy |
|-----|-------------|-------|----------|
| `v1.0.0` | Initial release – RandomForest model | RandomForest | 85.2% |
| `v1.1.0` | Added XGBoost + model comparison | XGBoost + RF | 87.1% |
| `v1.2.0` | Added outlier detection + SHAP | XGBoost + RF | 87.1% |
| `v1.3.0` | Analytics dashboard + ECG background | XGBoost + RF | 87.1% |
| `v2.0.0` | *(future)* Deep learning model | Neural Net | TBD |

---

## How to Create Tags

```bash
# Create annotated tag
git tag -a v1.1.0 -m "Release v1.1.0: Added XGBoost model comparison"

# Push tag to remote
git push origin v1.1.0

# Push all tags
git push origin --tags

# List all tags
git tag -l "v*"

# View tag details
git show v1.1.0
```

---

## Docker Image Tags

Docker images follow a parallel tagging scheme:

```
suryanshsaraf/ml-devops-app:latest              # Latest build
suryanshsaraf/ml-devops-app:42-a1b2c3d          # Jenkins BUILD_NUMBER + short commit SHA
suryanshsaraf/ml-devops-app:v1.1.0              # Semantic version for releases
```

### Tag Lifecycle
1. Every CI build → `:<BUILD_NUMBER>-<GIT_SHA>`
2. On release branch merge → `:v<x.y.z>` + `:latest`
3. Old images cleaned up after 30 days

---

## Guidelines

1. **Always use annotated tags** (`-a` flag) — includes tagger name, date, message
2. **Tag on `main` only** — after merge from release branch
3. **Never delete published tags** — downstream systems may reference them
4. **Update CHANGELOG** when creating a new version tag
5. **Model artifacts** (`.pkl` files) should be versioned alongside code tags
