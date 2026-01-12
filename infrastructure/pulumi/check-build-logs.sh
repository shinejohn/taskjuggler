#!/bin/bash
# Check CloudWatch logs for CodeBuild to diagnose issues

set -e

AWS_REGION="us-east-1"
PROJECT_NAME="taskjuggler"
ENVIRONMENT="production"
BUILD_PROJECT_NAME="$PROJECT_NAME-$ENVIRONMENT-build"
LOG_GROUP="/aws/codebuild/$BUILD_PROJECT_NAME"

echo "=========================================="
echo "CodeBuild Log Analysis"
echo "=========================================="
echo ""

# Get latest build ID
echo "Step 1: Finding latest build..."
LATEST_BUILD=$(aws codebuild list-builds-for-project \
    --project-name "$BUILD_PROJECT_NAME" \
    --region $AWS_REGION \
    --sort-order DESCENDING \
    --max-items 1 \
    --query 'ids[0]' \
    --output text)

if [ -z "$LATEST_BUILD" ] || [ "$LATEST_BUILD" = "None" ]; then
    echo "⚠ No builds found"
    echo ""
    echo "To start a new build, run:"
    echo "  ./trigger-build.sh"
    exit 0
fi

echo "Latest build: $LATEST_BUILD"
echo ""

# Get build status
BUILD_STATUS=$(aws codebuild batch-get-builds \
    --ids "$LATEST_BUILD" \
    --region $AWS_REGION \
    --query 'builds[0].buildStatus' \
    --output text)

BUILD_PHASE=$(aws codebuild batch-get-builds \
    --ids "$LATEST_BUILD" \
    --region $AWS_REGION \
    --query 'builds[0].currentPhase' \
    --output text)

echo "Build Status: $BUILD_STATUS"
echo "Current Phase: $BUILD_PHASE"
echo ""

# Get log stream
LOG_STREAM="${BUILD_PROJECT_NAME}:$LATEST_BUILD"

echo "Step 2: Fetching recent logs..."
echo "----------------------------------------"

# Check if log stream exists
if aws logs describe-log-streams \
    --log-group-name "$LOG_GROUP" \
    --log-stream-name-prefix "$LATEST_BUILD" \
    --region $AWS_REGION \
    --query 'logStreams[0].logStreamName' \
    --output text 2>/dev/null | grep -q .; then
    
    ACTUAL_STREAM=$(aws logs describe-log-streams \
        --log-group-name "$LOG_GROUP" \
        --log-stream-name-prefix "$LATEST_BUILD" \
        --region $AWS_REGION \
        --query 'logStreams[0].logStreamName' \
        --output text)
    
    echo "Log Stream: $ACTUAL_STREAM"
    echo ""
    
    # Get last 100 log events
    aws logs get-log-events \
        --log-group-name "$LOG_GROUP" \
        --log-stream-name "$ACTUAL_STREAM" \
        --region $AWS_REGION \
        --limit 100 \
        --query 'events[*].message' \
        --output text | tail -50
    
    echo ""
    echo "----------------------------------------"
    echo ""
    echo "To follow logs in real-time:"
    echo "  aws logs tail $LOG_GROUP --follow --region $AWS_REGION"
else
    echo "⚠ Log stream not found yet (build may be starting)"
    echo ""
    echo "To follow logs:"
    echo "  aws logs tail $LOG_GROUP --follow --region $AWS_REGION"
fi

echo ""
echo "Step 3: Common Issues Check..."
echo "----------------------------------------"

# Check build configuration
echo "Checking build configuration..."
CONFIG=$(aws codebuild batch-get-projects \
    --names "$BUILD_PROJECT_NAME" \
    --region $AWS_REGION \
    --query 'projects[0]' \
    --output json)

SOURCE_TYPE=$(echo "$CONFIG" | jq -r '.source.type')
echo "Source Type: $SOURCE_TYPE"

if [ "$SOURCE_TYPE" = "NO_SOURCE" ]; then
    echo "⚠ ISSUE FOUND: Source type is NO_SOURCE"
    echo "  This means CodeBuild has no source code to build"
    echo "  Fix: Run ./fix-codebuild.sh to configure S3 source"
fi

BUILDSPEC=$(echo "$CONFIG" | jq -r '.source.buildspec')
if [ "$BUILDSPEC" != "null" ] && [ -n "$BUILDSPEC" ]; then
    echo "Buildspec: Configured (inline)"
else
    echo "⚠ Buildspec: Not configured"
fi

echo ""
echo "=========================================="
echo "Analysis Complete"
echo "=========================================="
