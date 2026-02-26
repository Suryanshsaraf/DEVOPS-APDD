// ─────────────────────────────────────────────────────────────────
// Jenkins Declarative Pipeline – ML Prediction API CI/CD
// ─────────────────────────────────────────────────────────────────
// Stages: Checkout → Test → Build → Push → Deploy → Rollback
// Trigger: GitHub webhook on push to main branch
// ─────────────────────────────────────────────────────────────────

pipeline {
    agent any

    // ── Environment Variables ────────────────────────────────────
    environment {
        DOCKER_REGISTRY     = 'docker.io'
        DOCKER_IMAGE        = "${DOCKER_REGISTRY}/your-dockerhub-username/ml-prediction-api"
        DOCKER_CREDENTIALS  = credentials('dockerhub-credentials')    // Jenkins credential ID
        KUBE_CONFIG         = credentials('kubeconfig')               // Jenkins credential ID
        IMAGE_TAG           = "${BUILD_NUMBER}-${GIT_COMMIT.take(7)}"
        KUBE_NAMESPACE      = 'ml-production'
        PYTHON_VERSION      = '3.11'
    }

    // ── Trigger on GitHub push ──────────────────────────────────
    triggers {
        githubPush()
    }

    // ── Pipeline Options ────────────────────────────────────────
    options {
        timeout(time: 30, unit: 'MINUTES')
        disableConcurrentBuilds()
        buildDiscarder(logRotator(numToKeepStr: '10'))
        timestamps()
    }

    stages {
        // ── Stage 1: Checkout ───────────────────────────────────
        stage('Checkout') {
            steps {
                echo '📥 Checking out source code...'
                checkout scm
                script {
                    env.GIT_COMMIT_MSG = sh(
                        script: 'git log -1 --pretty=%B',
                        returnStdout: true
                    ).trim()
                }
                echo "Commit: ${env.GIT_COMMIT_MSG}"
            }
        }

        // ── Stage 2: Install Dependencies ───────────────────────
        stage('Install Dependencies') {
            steps {
                echo '📦 Installing Python dependencies...'
                sh '''
                    python${PYTHON_VERSION} -m venv venv
                    . venv/bin/activate
                    pip install --upgrade pip
                    pip install -r requirements.txt
                '''
            }
        }

        // ── Stage 3: Run Unit Tests ─────────────────────────────
        stage('Run Tests') {
            steps {
                echo '🧪 Running unit tests...'
                sh '''
                    . venv/bin/activate
                    python -m ml.train
                    python -m pytest tests/ -v --tb=short --junitxml=test-results.xml
                '''
            }
            post {
                always {
                    junit allowEmptyResults: true, testResults: 'test-results.xml'
                }
            }
        }

        // ── Stage 4: Build Docker Image ─────────────────────────
        stage('Build Docker Image') {
            steps {
                echo "🐳 Building Docker image: ${DOCKER_IMAGE}:${IMAGE_TAG}"
                sh """
                    docker build \
                        -t ${DOCKER_IMAGE}:${IMAGE_TAG} \
                        -t ${DOCKER_IMAGE}:latest \
                        --build-arg BUILD_DATE=\$(date -u +'%Y-%m-%dT%H:%M:%SZ') \
                        --build-arg VCS_REF=${GIT_COMMIT} \
                        .
                """
            }
        }

        // ── Stage 5: Push to DockerHub ──────────────────────────
        stage('Push to DockerHub') {
            steps {
                echo '📤 Pushing image to DockerHub...'
                sh '''
                    echo "${DOCKER_CREDENTIALS_PSW}" | docker login \
                        -u "${DOCKER_CREDENTIALS_USR}" \
                        --password-stdin ${DOCKER_REGISTRY}
                '''
                sh """
                    docker push ${DOCKER_IMAGE}:${IMAGE_TAG}
                    docker push ${DOCKER_IMAGE}:latest
                """
            }
        }

        // ── Stage 6: Deploy to Kubernetes ───────────────────────
        stage('Deploy to Kubernetes') {
            steps {
                echo "🚀 Deploying to Kubernetes namespace: ${KUBE_NAMESPACE}"
                sh """
                    export KUBECONFIG=${KUBE_CONFIG}

                    # Update the image tag in the deployment manifest
                    sed -i 's|image: .*ml-prediction-api.*|image: ${DOCKER_IMAGE}:${IMAGE_TAG}|g' \
                        k8s/deployment.yaml

                    # Apply Kubernetes manifests
                    kubectl apply -f k8s/deployment.yaml -n ${KUBE_NAMESPACE}
                    kubectl apply -f k8s/service.yaml    -n ${KUBE_NAMESPACE}
                    kubectl apply -f k8s/ingress.yaml    -n ${KUBE_NAMESPACE}
                    kubectl apply -f k8s/hpa.yaml        -n ${KUBE_NAMESPACE}

                    # Wait for rollout to complete
                    kubectl rollout status deployment/ml-prediction-api \
                        -n ${KUBE_NAMESPACE} --timeout=120s
                """
            }
        }
    }

    // ── Post Actions ────────────────────────────────────────────
    post {
        success {
            echo '✅ Pipeline completed successfully!'
            sh """
                echo "Deployed ${DOCKER_IMAGE}:${IMAGE_TAG} to ${KUBE_NAMESPACE}"
            """
        }

        failure {
            echo '❌ Pipeline failed! Initiating rollback...'
            sh """
                export KUBECONFIG=${KUBE_CONFIG}

                # Rollback to the previous deployment revision
                kubectl rollout undo deployment/ml-prediction-api \
                    -n ${KUBE_NAMESPACE} || true

                echo "⏪ Rollback initiated for ml-prediction-api"
            """
        }

        always {
            // Clean up Docker images to save disk space
            sh """
                docker rmi ${DOCKER_IMAGE}:${IMAGE_TAG} || true
                docker rmi ${DOCKER_IMAGE}:latest || true
            """
            cleanWs()
        }
    }
}
