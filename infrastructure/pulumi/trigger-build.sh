#!/bin/bash
# Trigger CodeBuild and monitor progress

set -e

AWS_REGION="us-east-1"
PROJECT_NAME="taskjuggler"
ENVIRONMENT="production"
BUILD_PROJECT_NAME="$PROJECT_NAME-$ENVIRONMENT-build"
S3_BUCKET="taskjuggler-build-source"

echo "=========================================="
echo "Triggering CodeBuild"
echo "=========================================="
echo ""

# Step 1: Upload latest source
echo "Step 1: Uploading latest source code..."
cd /Users/johnshine/Dropbox/Fibonacco/taskjuggler/Code

TEMP_DIR=$(mktemp -d)
cp -r taskjuggler-api "$TEMP_DIR/"
cd "$TEMP_DIR"
tar -czf source.tar.gz taskjuggler-api/
aws s3 cp source.tar.gz "s3://$S3_BUCKET/source.tar.gz" --region $AWS_REGION
rm -rf "$TEMP_DIR"
echo "✓ Source uploaded"
echo ""

# Step 2: Start build
echo "Step 2: Starting CodeBuild..."
BUILD_ID=$(aws codebuild start-build \
    --project-name "$BUILD_PROJECT_NAME" \
    --region $AWS_REGION \
    --source-version "source.tar.gz" \
    --query 'build.id' \
    --output text)

echo "✓ Build started: $BUILD_ID"
echo ""

# Step 3: Monitor build
echo "Step 3: Monitoring build progress..."
echo "This may take 10-15 minutes..."
echo ""

MAX_WAIT=900  # 15 minutes
ELAPSED=0
INTERVAL=30

while [ $ELAPSED -lt $MAX_WAIT ]; do
    BUILD_STATUS=$(aws codebuild batch-get-builds \
        --ids "$BUILD_ID" \
        --region $AWS_REGION \
        --query 'builds[0].buildStatus' \
        --output text 2>/dev/null || echo "UNKNOWN")
    
    BUILD_PHASE=$(aws codebuild batch-get-builds \
        --ids "$BUILD_ID" \
        --region $AWS_REGION \
        --query 'builds[0].currentPhase' \
        --output text 2>/dev/null || echo "UNKNOWN")
    
    if [ "$BUILD_STATUS" = "SUCCEEDED" ]; then
        echo ""
        echo "✓ Build completed successfully!"
        break
    elif [ "$BUILD_STATUS" = "FAILED" ]; then
        echo ""
        echo "✗ Build failed!"
        echo ""
        echo "To check logs:"
        echo "  ./check-build-logs.sh"
        echo ""
        echo "Or view logs directly:"
        echo "  aws logs tail /aws/codebuild/$BUILD_PROJECT_NAME --follow --region $AWS_REGION"
        exit 1
    elif [ "$BUILD_STATUS" = "IN_PROGRESS" ]; then
        echo "⏳ [$BUILD_PHASE] - $(date +%H:%M:%S)"
    else
        echo "⚠ Status: $BUILD_STATUS | Phase: $BUILD_PHASE"
    fi
    
    sleep $INTERVAL
    ELAPSED=$((ELAPSED + INTERVAL))
done

if [ "$BUILD_STATUS" != "SUCCEEDED" ]; then
    echo ""
    echo "⚠ Build did not complete within timeout"
    echo "Check status manually:"
    echo "  aws codebuild batch-get-builds --ids $BUILD_ID --region $AWS_REGION"
    exit 1
fi

echo ""
echo "=========================================="
echo "Build Complete!"
echo "=========================================="
echo ""
echo "Next steps:"
echo "1. Verify image in ECR:"
echo "   aws ecr describe-images --repository-name $PROJECT_NAME-$ENVIRONMENT --region $AWS_REGION"
echo ""
echo "2. Update ECS services:"
echo "   ./update-ecs-services.sh"
echo ""
