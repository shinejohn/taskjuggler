#!/bin/bash
# Build Docker image using AWS CodeBuild

set -e

AWS_REGION="us-east-1"
PROJECT_NAME="taskjuggler"
ENVIRONMENT="production"
BUILD_PROJECT="$PROJECT_NAME-$ENVIRONMENT-build"

echo "Starting CodeBuild project: $BUILD_PROJECT"

# Start build
BUILD_ID=$(aws codebuild start-build \
    --project-name $BUILD_PROJECT \
    --region $AWS_REGION \
    --source-type NO_SOURCE \
    --query 'build.id' \
    --output text)

echo "Build started: $BUILD_ID"
echo "Monitoring build progress..."

# Wait for build to complete
aws codebuild batch-get-builds \
    --ids $BUILD_ID \
    --region $AWS_REGION \
    --query 'builds[0].buildStatus' \
    --output text

echo ""
echo "View build logs:"
echo "aws logs tail /aws/codebuild/$BUILD_PROJECT --follow --region $AWS_REGION"
