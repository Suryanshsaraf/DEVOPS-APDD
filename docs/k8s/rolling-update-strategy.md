# Rolling Update Strategy – CardioAnalytics K8s Deployment

> Zero-downtime deployment strategy for the ML Prediction API.

---

## Strategy Configuration

The deployment uses **RollingUpdate** strategy defined in `k8s/deployment.yaml`:

```yaml
spec:
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1          # Max 1 extra pod during update
      maxUnavailable: 0    # All existing pods stay available
```

---

## How It Works

```
Before Update (3 replicas running v1.0):
  [Pod v1.0] [Pod v1.0] [Pod v1.0]

Step 1 – Create new pod (maxSurge = 1):
  [Pod v1.0] [Pod v1.0] [Pod v1.0] [Pod v1.1 🆕]

Step 2 – New pod passes readiness probe, old pod terminated:
  [Pod v1.0] [Pod v1.0] [Pod v1.1 ✅] [Pod v1.1 🆕]

Step 3 – Continue rolling:
  [Pod v1.0] [Pod v1.1 ✅] [Pod v1.1 ✅] [Pod v1.1 🆕]

Step 4 – Complete:
  [Pod v1.1 ✅] [Pod v1.1 ✅] [Pod v1.1 ✅]
```

---

## Key Parameters

| Parameter | Value | Purpose |
|-----------|-------|---------|
| `maxSurge` | 1 | At most 4 pods exist during rollout (3 + 1) |
| `maxUnavailable` | 0 | Zero downtime – all 3 pods serve traffic |
| `readinessProbe` | `GET /health` every 10s | New pod must be healthy before receiving traffic |
| `livenessProbe` | `GET /health` every 30s | Restart unhealthy pods automatically |
| `terminationGracePeriodSeconds` | 30 | Allow 30s to finish in-flight requests |

---

## Rollback Procedure

### Automatic (Jenkins Pipeline)
If deployment fails, the Jenkinsfile `post.failure` block runs:
```bash
kubectl rollout undo deployment/ml-prediction-api -n ml-production
```

### Manual Rollback
```bash
# View rollout history
kubectl rollout history deployment/ml-prediction-api -n ml-production

# Rollback to previous version
kubectl rollout undo deployment/ml-prediction-api -n ml-production

# Rollback to specific revision
kubectl rollout undo deployment/ml-prediction-api \
    --to-revision=3 -n ml-production

# Check rollback status
kubectl rollout status deployment/ml-prediction-api -n ml-production
```

---

## HPA Interaction

The Horizontal Pod Autoscaler (`k8s/hpa.yaml`) works alongside rolling updates:

- **Min replicas:** 3 → ensures availability during low traffic
- **Max replicas:** 10 → handles traffic spikes
- **Scale-up:** 2 pods per 60s (fast response to load)
- **Scale-down:** 1 pod per 120s with 300s stabilisation (prevents flapping)

During a rolling update, HPA may temporarily scale up to handle the combined load of old and new pods.
