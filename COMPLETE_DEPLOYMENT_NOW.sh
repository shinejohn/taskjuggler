#!/bin/bash
# Complete Deployment Script - Check build and complete if succeeded

set +e  # Don't exit on errors

AWS_REGION="us-east-1"

echo "=========================================="
echo "Task Juggler - Complete Deployment"
echo "=========================================="
echo ""

# Get latest build ID
LATEST_BUILD=$(aws codebuild list-builds-for-project \
  --project-name taskjuggler-production-build \
  --region $AWS_REGION \
  --sort-order DESCENDING \
  --max-items 1 \
  --query 'ids[0]' \
  --output text 2>/dev/null)

# Clean up the build ID (remove any trailing "None" or whitespace)
LATEST_BUILD=$(echo "$LATEST_BUILD" | tr -d '\n\r' | sed 's/None$//' | xargs)

if [ -z "$LATEST_BUILD" ] || [ "$LATEST_BUILD" = "None" ] || [ -z "${LATEST_BUILD##*None*}" ]; then
  echo "No builds found. Starting new build..."
  BUILD_ID=$(aws codebuild start-build \
    --project-name taskjuggler-production-build \
    --region $AWS_REGION \
    --query 'build.id' \
    --output text 2>/dev/null)
  echo "Build started: $BUILD_ID"
  echo ""
  echo "Wait 10-15 minutes, then run this script again."
  exit 0
fi

echo "Checking build: $LATEST_BUILD"
echo ""

# Get status directly - wait a moment for build to be queryable
sleep 2

STATUS=$(aws codebuild batch-get-builds \
  --ids "$LATEST_BUILD" \
  --region $AWS_REGION \
  --query 'builds[0].buildStatus' \
  --output text 2>/dev/null)

# Clean status
STATUS=$(echo "$STATUS" | tr -d '\n\r' | xargs)

PHASE=$(aws codebuild batch-get-builds \
  --ids "$LATEST_BUILD" \
  --region $AWS_REGION \
  --query 'builds[0].currentPhase' \
  --output text 2>/dev/null)

PHASE=$(echo "$PHASE" | tr -d '\n\r' | xargs)

# If status is None or empty, try JSON parsing
if [ -z "$STATUS" ] || [ "$STATUS" = "None" ]; then
  BUILD_JSON=$(aws codebuild batch-get-builds \
    --ids "$LATEST_BUILD" \
    --region $AWS_REGION \
    --output json 2>/dev/null)
  
  if [ -n "$BUILD_JSON" ] && [ "$BUILD_JSON" != "null" ]; then
    STATUS=$(echo "$BUILD_JSON" | python3 -c "import sys, json; d=json.load(sys.stdin); b=d.get('builds',[]); print(b[0].get('buildStatus','') if b else '')" 2>/dev/null)
    PHASE=$(echo "$BUILD_JSON" | python3 -c "import sys, json; d=json.load(sys.stdin); b=d.get('builds',[]); print(b[0].get('currentPhase','UNKNOWN') if b else 'UNKNOWN')" 2>/dev/null)
  fi
fi

if [ -z "$STATUS" ] || [ "$STATUS" = "None" ]; then
  echo "Could not determine build status."
  echo "Build ID: $LATEST_BUILD"
  echo ""
  echo "The build may be too new. Wait a moment and try again."
  echo "Or check manually:"
  echo "aws codebuild batch-get-builds --ids \"$LATEST_BUILD\" --region $AWS_REGION"
  exit 0
fi

echo "Status: $STATUS"
echo "Phase: $PHASE"
echo ""

if [ "$STATUS" = "SUCCEEDED" ]; then
  echo "✓✓✓ BUILD SUCCEEDED! ✓✓✓"
  echo ""
  echo "Completing deployment..."
  echo ""
  
  cd "$(dirname "$0")/infrastructure/pulumi"
  if [ -f "./monitor-and-complete.sh" ]; then
    ./monitor-and-complete.sh "$LATEST_BUILD"
  else
    echo "monitor-and-complete.sh not found. Manual steps:"
    echo "1. Verify Docker image in ECR"
    echo "2. Wait for ECS services to start"
    echo "3. Run migrations: ./run-migrations.sh"
    echo "4. Configure HTTPS"
  fi
  
elif [ "$STATUS" = "IN_PROGRESS" ]; then
  echo "⏳ Build still in progress..."
  echo ""
  echo "Builds typically take 10-15 minutes."
  echo "Run this script again in a few minutes:"
  echo "./COMPLETE_DEPLOYMENT_NOW.sh"
  
elif [ "$STATUS" = "FAILED" ]; then
  echo "✗ Build failed"
  echo ""
  echo "Check logs:"
  echo "aws logs tail /aws/codebuild/taskjuggler-production-build --follow --region $AWS_REGION"
  echo ""
  echo "The build is failing due to archive corruption during S3 transfer."
  echo "Possible solutions:"
  echo "1. Use GitHub/CodeCommit as source instead of S3"
  echo "2. Use AWS App Runner (simpler deployment)"
  echo "3. Build Docker image locally and push to ECR"
  echo ""
  echo "Build ID: $LATEST_BUILD"
  
else
  echo "Build status: $STATUS"
fi
