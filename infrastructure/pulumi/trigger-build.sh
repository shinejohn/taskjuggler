#!/bin/bash
# Trigger CodeBuild to build Docker image

set -e

AWS_REGION="us-east-1"
PROJECT_NAME="taskjuggler-production-build"

echo "Starting CodeBuild project: $PROJECT_NAME"

# Start build with S3 source
BUILD_ID=$(aws codebuild start-build \
    --project-name $PROJECT_NAME \
    --source-type-override S3 \
    --source-location-override s3://taskjuggler-build-source/source.tar.gz \
    --region $AWS_REGION \
    --query 'build.id' \
    --output text 2>&1)

if [ $? -eq 0 ]; then
    echo "✓ Build started: $BUILD_ID"
    echo ""
    echo "Monitor build:"
    echo "aws codebuild batch-get-builds --ids $BUILD_ID --region $AWS_REGION"
    echo ""
    echo "View logs:"
    echo "aws logs tail /aws/codebuild/$PROJECT_NAME --follow --region $AWS_REGION"
else
    echo "✗ Failed to start build"
    echo "Creating CodeBuild project first..."
    exit 1
fi
