#!/bin/bash
# Update CodeBuild project to use inline buildspec

set -e

AWS_REGION="us-east-1"
PROJECT_NAME="taskjuggler-production-build"

# Read buildspec and convert to JSON
BUILDSPEC_JSON=$(python3 << 'EOF'
import json
import yaml
import sys

with open('buildspec.yml', 'r') as f:
    buildspec = yaml.safe_load(f)
print(json.dumps(buildspec))
EOF
)

# Update CodeBuild project
aws codebuild update-project \
  --name $PROJECT_NAME \
  --source type=NO_SOURCE \
  --source buildspec="$BUILDSPEC_JSON" \
  --region $AWS_REGION \
  --query 'project.name' \
  --output text

echo "✓ CodeBuild project updated to use inline buildspec"

# Now trigger build with S3 source override
echo "Triggering build with S3 source..."
BUILD_ID=$(aws codebuild start-build \
  --project-name $PROJECT_NAME \
  --source-type-override S3 \
  --source-location-override taskjuggler-build-source/source.tar.gz \
  --region $AWS_REGION \
  --query 'build.id' \
  --output text)

echo "✓ Build triggered: $BUILD_ID"
echo "Monitor: aws codebuild batch-get-builds --ids $BUILD_ID --region $AWS_REGION"
