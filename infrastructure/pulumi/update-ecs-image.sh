#!/bin/bash
# Update ECS task definitions with new Docker image

set -e

AWS_REGION="us-east-1"
PROJECT_NAME="taskjuggler"
ENVIRONMENT="production"
ECR_REPO="taskjuggler-production"
IMAGE_TAG="${1:-latest}"

ECR_URI="195430954683.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_REPO:$IMAGE_TAG"

echo "Updating ECS services with image: $ECR_URI"

# Update API service
echo "Updating API service..."
aws ecs update-service \
    --cluster $PROJECT_NAME-$ENVIRONMENT-cluster \
    --service $PROJECT_NAME-$ENVIRONMENT-api \
    --force-new-deployment \
    --region $AWS_REGION \
    --query 'service.serviceName' \
    --output text

# Update Worker service
echo "Updating Worker service..."
aws ecs update-service \
    --cluster $PROJECT_NAME-$ENVIRONMENT-cluster \
    --service $PROJECT_NAME-$ENVIRONMENT-worker \
    --force-new-deployment \
    --region $AWS_REGION \
    --query 'service.serviceName' \
    --output text

echo "Services updated. New deployments in progress..."
echo "Monitor deployments: aws ecs describe-services --cluster $PROJECT_NAME-$ENVIRONMENT-cluster --services $PROJECT_NAME-$ENVIRONMENT-api $PROJECT_NAME-$ENVIRONMENT-worker --region $AWS_REGION"
