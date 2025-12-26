#!/bin/bash
# Update CodeBuild project to use inline buildspec that downloads from S3

set -e

AWS_REGION="us-east-1"
PROJECT_NAME="taskjuggler-production-build"

# Create temporary JSON file with inline buildspec
cat > /tmp/codebuild-update.json << 'EOF'
{
  "source": {
    "type": "NO_SOURCE",
    "buildspec": "version: 0.2\nphases:\n  pre_build:\n    commands:\n      - echo Logging in to Amazon ECR...\n      - aws ecr get-login-password --region $AWS_DEFAULT_REGION | docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.$AWS_DEFAULT_REGION.amazonaws.com\n      - REPOSITORY_URI=$AWS_ACCOUNT_ID.dkr.ecr.$AWS_DEFAULT_REGION.amazonaws.com/$IMAGE_REPO_NAME\n      - echo Downloading source from S3...\n      - aws s3 cp s3://taskjuggler-build-source/source.tar.gz /tmp/source.tar.gz\n      - cd /tmp && tar -xzf source.tar.gz\n      - pwd\n      - ls -la\n      - |\n        if [ -d \"taskjuggler-api\" ]; then\n          cd taskjuggler-api\n        else\n          DOCKERFILE_DIR=$(find . -name \"Dockerfile\" -type f | head -1 | xargs dirname)\n          if [ -n \"$DOCKERFILE_DIR\" ]; then\n            cd \"$DOCKERFILE_DIR\"\n          fi\n        fi\n      - pwd\n      - ls -la\n  build:\n    commands:\n      - echo \"Build started\"\n      - echo Building the Docker image...\n      - docker build -t $IMAGE_REPO_NAME:$IMAGE_TAG .\n      - docker tag $IMAGE_REPO_NAME:$IMAGE_TAG $REPOSITORY_URI:$IMAGE_TAG\n      - docker tag $IMAGE_REPO_NAME:$IMAGE_TAG $REPOSITORY_URI:latest\n  post_build:\n    commands:\n      - echo \"Build completed\"\n      - echo Pushing the Docker images...\n      - docker push $REPOSITORY_URI:$IMAGE_TAG\n      - docker push $REPOSITORY_URI:latest\n      - echo Image URI: $REPOSITORY_URI:latest"
  }
}
EOF

# Update the project
aws codebuild update-project \
  --name $PROJECT_NAME \
  --region $AWS_REGION \
  --cli-input-json file:///tmp/codebuild-update.json \
  --query 'project.name' \
  --output text

echo "✓ CodeBuild project updated"

# Trigger new build
echo "Triggering new build..."
BUILD_ID=$(aws codebuild start-build \
  --project-name $PROJECT_NAME \
  --region $AWS_REGION \
  --query 'build.id' \
  --output text)

echo "✓ Build triggered: $BUILD_ID"
echo ""
echo "Monitor build:"
echo "aws codebuild batch-get-builds --ids $BUILD_ID --region $AWS_REGION"
echo ""
echo "View logs:"
echo "aws logs tail /aws/codebuild/taskjuggler-production-build --follow --region $AWS_REGION"
