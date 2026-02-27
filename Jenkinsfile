pipeline {
    agent any

    environment {
        APP_NAME = "ml-devops-app"
        DOCKER_IMAGE = "suryanshsaraf/ml-devops-app"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Docker Test') {
            steps {
                sh 'docker --version'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t $DOCKER_IMAGE:latest .'
            }
        }
    }

    post {
        success {
            echo "Docker build successful!"
        }
        failure {
            echo "Pipeline failed."
        }
    }
}