#!/bin/bash
# Check build status and complete deployment if succeeded

set -e

AWS_REGION="us-east-1"
BUILD_ID="${1:-$(cat /tmp/latest-build-id.txt 2>/dev/null || aws codebuild list-builds-for-project --project-name taskjuggler-production-build --region us-east-1 --sort-order DESCENDING --max-items 1 --query 'ids[0]' --output text)}"

if [ -z "$BUILD_ID" ] || [ "$BUILD_ID" = "None" ]; then
  echo "No build ID provided or found"
  exit 1
fi

echo "Checking build: $BUILD_ID"
echo ""

STATUS=$(aws codebuild batch-get-builds \
  --ids "$BUILD_ID" \
  --region $AWS_REGION \
  --query 'builds[0].buildStatus' \
  --output text 2>/dev/null || echo "UNKNOWN")

PHASE=$(aws codebuild batch-get-builds \
  --ids "$BUILD_ID" \
  --region $AWS_REGION \
  --query 'builds[0].currentPhase' \
  --output text 2>/dev/null || echo "UNKNOWN")

echo "Status: $STATUS"
echo "Phase: $PHASE"
echo ""

if [ "$STATUS" = "SUCCEEDED" ]; then
  echo "✓✓✓ BUILD SUCCEEDED! ✓✓✓"
  echo ""
  echo "Running monitor-and-complete.sh..."
  echo ""
  ./monitor-and-complete.sh "$BUILD_ID"
elif [ "$STATUS" = "IN_PROGRESS" ]; then
  echo "⏳ Build still in progress..."
  echo ""
  echo "Check again in a few minutes with:"
  echo "./check-and-complete.sh $BUILD_ID"
elif [ "$STATUS" = "FAILED" ]; then
  echo "✗ Build failed"
  echo ""
  echo "Check logs:"
  echo "aws logs tail /aws/codebuild/taskjuggler-production-build --follow --region $AWS_REGION"
else
  echo "Build status: $STATUS"
fi
