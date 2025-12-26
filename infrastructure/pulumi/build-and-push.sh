#!/bin/bash
# Build and push Docker image to ECR

set -e

AWS_REGION="us-east-1"
AWS_ACCOUNT_ID="195430954683"
ECR_REPO="taskjuggler-production"
IMAGE_TAG="latest"

# Get ECR login
echo "Logging into ECR..."
aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com

# Get ECR repository URI
ECR_URI=$(aws ecr describe-repositories --repository-names $ECR_REPO --region $AWS_REGION --query 'repositories[0].repositoryUri' --output text)
FULL_IMAGE_URI="$ECR_URI:$IMAGE_TAG"

echo "Building Docker image..."
cd /Users/johnshine/Dropbox/Fibonacco/taskjuggler/Code/taskjuggler-api
docker build -t $ECR_REPO:$IMAGE_TAG .
docker tag $ECR_REPO:$IMAGE_TAG $FULL_IMAGE_URI

echo "Pushing image to ECR..."
docker push $FULL_IMAGE_URI

echo "Image pushed successfully: $FULL_IMAGE_URI"
echo "Update ECS services to use this image."
