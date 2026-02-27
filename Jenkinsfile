// ──────────────────────────────────────────────────
// Jenkins Declarative Pipeline – CardioAnalytics
// ──────────────────────────────────────────────────
// Stages: Checkout → Quality → Test (parallel) →
//         Build → Push → Deploy → Selenium → Notify
// ──────────────────────────────────────────────────

pipeline {
    agent any

    environment {
        APP_NAME       = "ml-devops-app"
        DOCKER_IMAGE   = "suryanshsaraf/ml-devops-app"
        IMAGE_TAG      = "${BUILD_NUMBER}-${GIT_COMMIT.take(7)}"
        VENV_DIR       = "${WORKSPACE}/venv"
    }

    options {
        timeout(time: 30, unit: 'MINUTES')
        disableConcurrentBuilds()
        buildDiscarder(logRotator(numToKeepStr: '10'))
    }

    stages {

        // ── Stage 1: Checkout ────────────────────
        stage('Checkout') {
            steps {
                checkout scm
                echo "📥 Checked out commit: ${GIT_COMMIT}"
            }
        }

        // ── Stage 2: Code Quality (SonarQube) ────
        stage('Code Quality') {
            steps {
                echo "🔍 Running code quality analysis..."
                // Placeholder: uncomment when SonarQube is configured
                // withSonarQubeEnv('SonarQube') {
                //     sh '''
                //         sonar-scanner \
                //           -Dsonar.projectKey=cardioanalytics \
                //           -Dsonar.sources=app/,ml/ \
                //           -Dsonar.python.version=3.11
                //     '''
                // }
                echo "✅ Code quality stage completed (SonarQube placeholder)"
            }
        }

        // ── Stage 3: Parallel Tests ──────────────
        stage('Tests') {
            parallel {

                stage('Unit Tests') {
                    steps {
                        echo "🧪 Running unit tests..."
                        sh '''
                            python -m venv ${VENV_DIR} || true
                            . ${VENV_DIR}/bin/activate
                            pip install -q -r requirements.txt
                            python -m pytest tests/ -v --tb=short --junitxml=reports/unit-tests.xml
                        '''
                    }
                    post {
                        always {
                            junit allowEmptyResults: true, testResults: 'reports/unit-tests.xml'
                        }
                    }
                }

                stage('Lint Check') {
                    steps {
                        echo "🔎 Running lint checks..."
                        sh '''
                            python -m venv ${VENV_DIR}-lint || true
                            . ${VENV_DIR}-lint/bin/activate
                            pip install -q flake8
                            flake8 app/ ml/ --max-line-length=120 --statistics || true
                        '''
                        echo "✅ Lint check completed"
                    }
                }
            }
        }

        // ── Stage 4: Build Docker Image ──────────
        stage('Build Docker Image') {
            steps {
                echo "🐳 Building Docker image: ${DOCKER_IMAGE}:${IMAGE_TAG}"
                sh """
                    docker build \
                        -t ${DOCKER_IMAGE}:${IMAGE_TAG} \
                        -t ${DOCKER_IMAGE}:latest \
                        .
                """
                echo "✅ Docker image built successfully"
            }
        }

        // ── Stage 5: Push to DockerHub ───────────
        stage('Push to DockerHub') {
            when {
                branch 'main'
            }
            steps {
                echo "📤 Pushing image to DockerHub..."
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-credentials',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    sh '''
                        echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin
                        docker push ${DOCKER_IMAGE}:${IMAGE_TAG}
                        docker push ${DOCKER_IMAGE}:latest
                    '''
                }
                echo "✅ Image pushed: ${DOCKER_IMAGE}:${IMAGE_TAG}"
            }
        }

        // ── Stage 6: Deploy to Kubernetes ────────
        stage('Deploy to K8s') {
            when {
                branch 'main'
            }
            steps {
                echo "☸️ Deploying to Kubernetes..."
                withCredentials([file(credentialsId: 'kubeconfig', variable: 'KUBECONFIG')]) {
                    sh """
                        kubectl set image deployment/ml-prediction-api \
                            ml-prediction-api=${DOCKER_IMAGE}:${IMAGE_TAG} \
                            -n ml-production
                        kubectl rollout status deployment/ml-prediction-api \
                            -n ml-production --timeout=120s
                    """
                }
                echo "✅ Deployment successful"
            }
        }

        // ── Stage 7: Selenium Tests ──────────────
        stage('Selenium Tests') {
            when {
                branch 'main'
            }
            steps {
                echo "🌐 Running Selenium tests..."
                sh '''
                    python -m venv ${VENV_DIR}-selenium || true
                    . ${VENV_DIR}-selenium/bin/activate
                    pip install -q selenium
                    python -m pytest tests/selenium/ -v --tb=short --junitxml=reports/selenium-tests.xml || true
                '''
            }
            post {
                always {
                    junit allowEmptyResults: true, testResults: 'reports/selenium-tests.xml'
                }
            }
        }
    }

    // ── Post-Build Actions ───────────────────────
    post {
        always {
            echo "🧹 Cleaning up workspace and Docker images..."
            sh """
                docker rmi ${DOCKER_IMAGE}:${IMAGE_TAG} || true
                docker rmi ${DOCKER_IMAGE}:latest || true
                docker system prune -f || true
            """
            cleanWs()
        }

        success {
            echo """
            ══════════════════════════════════════════
            ✅ BUILD SUCCESSFUL
            ══════════════════════════════════════════
            📦 Image:  ${DOCKER_IMAGE}:${IMAGE_TAG}
            🔗 Build:  ${BUILD_URL}
            ⏱  Duration: ${currentBuild.durationString}
            ══════════════════════════════════════════
            """
        }

        failure {
            echo """
            ══════════════════════════════════════════
            ❌ BUILD FAILED
            ══════════════════════════════════════════
            🔗 Build:  ${BUILD_URL}
            📋 Check console output for details.
            ══════════════════════════════════════════
            """
            // Auto-rollback on deployment failure
            sh '''
                kubectl rollout undo deployment/ml-prediction-api \
                    -n ml-production 2>/dev/null || true
            '''
        }

        unstable {
            echo "⚠️ Build is UNSTABLE – some tests may have failed."
        }
    }
}