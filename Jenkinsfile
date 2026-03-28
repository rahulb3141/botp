pipeline {
    agent any

    environment {
        AWS_REGION = "us-east-1"
        AWS_CREDENTIALS = "aws-credentials"          // Jenkins stored credential ID
        ECR_REPO = "941960167356.dkr.ecr.us-east-1.amazonaws.com/eks-webapp"
        IMAGE_TAG = "latest"
    }

    stages {

        stage("Checkout Code") {
            steps {
                git branch: 'main', url: 'https://github.com/rahulb3141/botp.git'
            }
        }

        stage("Install Dependencies") {
            steps {
                sh 'npm --prefix app install'
            }
        }

        stage("Build Docker Image") {
            steps {
                withAWS(credentials: AWS_CREDENTIALS, region: AWS_REGION) {
                    sh '''
                        echo "Logging in to ECR..."
                        aws ecr get-login-password --region $AWS_REGION | \
                        docker login --username AWS --password-stdin $ECR_REPO

                        echo "Building Docker image..."
                        docker build -t eks-webapp .

                        echo "Tagging image..."
                        docker tag eks-webapp:latest $ECR_REPO:$IMAGE_TAG
                    '''
                }
            }
        }

        stage("Push Image to ECR") {
            steps {
                sh '''
                    echo "Pushing image to ECR..."
                    docker push $ECR_REPO:$IMAGE_TAG
                '''
            }
        }

        stage("Deploy to EKS") {
            steps {
                withAWS(credentials: AWS_CREDENTIALS, region: AWS_REGION) {
                    sh '''
                        echo "Updating kubeconfig..."
                        aws eks update-kubeconfig --region $AWS_REGION --name eks-cluster

                        echo "Updating Kubernetes deployment image..."
                        kubectl set image deployment/eks-webapp-deploy \
                          webapp=$ECR_REPO:$IMAGE_TAG --record

                        echo "Waiting for rollout to complete..."
                        kubectl rollout status deployment/eks-webapp-deploy
                    '''
                }
            }
        }
    }

    post {
        success {
            echo "✅ Deployment successful! Rolling update completed."
        }
        failure {
            echo "❌ Deployment failed!"
        }
    }
}
