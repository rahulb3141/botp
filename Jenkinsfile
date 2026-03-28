pipeline {
    agent any

    environment {
        AWS_REGION = "us-east-1"
        ECR_REPO   = "941960167356.dkr.ecr.us-east-1.amazonaws.com/eks-webapp"
        IMAGE_TAG  = "latest"
    }

    stages {

        stage("Checkout Code") {
            steps {
                echo "Pulling code from GitHub..."
                git branch: 'main', url: 'https://github.com/rahulb3141/botp.git'
            }
        }

        stage("Docker Build") {
            steps {
                echo "Building Docker image..."
                withCredentials([[$class: 'AmazonWebServicesCredentialsBinding',
                                  credentialsId: 'aws-credentials']]) {
                    sh '''
                        echo "Logging into ECR..."
                        aws ecr get-login-password --region $AWS_REGION | \
                        docker login --username AWS --password-stdin $ECR_REPO

                        echo "Building image..."
                        docker build -t eks-webapp .

                        echo "Tagging image..."
                        docker tag eks-webapp:latest $ECR_REPO:$IMAGE_TAG
                    '''
                }
            }
        }

        stage("Push to ECR") {
            steps {
                echo "Pushing Docker image to ECR..."
                sh '''
                    docker push $ECR_REPO:$IMAGE_TAG
                '''
            }
        }

        stage("Deploy to EKS") {
            steps {
                echo "Deploying to EKS cluster..."
                withCredentials([[$class: 'AmazonWebServicesCredentialsBinding',
                                  credentialsId: 'aws-credentials']]) {
                    sh '''
                        echo "Setting kubeconfig..."
                        aws eks update-kubeconfig --region $AWS_REGION --name eks-cluster

                        echo "Updating deployment image..."
                        kubectl set image deployment/eks-webapp-deploy \
                          webapp=$ECR_REPO:$IMAGE_TAG --record

                        echo "Waiting for rollout..."
                        kubectl rollout status deployment/eks-webapp-deploy
                    '''
                }
            }
        }
    }

    post {
        success {
            echo "✅ SUCCESS: App deployed successfully to EKS!"
        }
        failure {
            echo "❌ FAILURE: Check Jenkins logs for details."
        }
    }
}
