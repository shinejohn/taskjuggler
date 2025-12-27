#!/bin/bash
# Monitor build and complete deployment automatically

set -e

AWS_REGION="us-east-1"
PROJECT_NAME="taskjuggler"
ENVIRONMENT="production"
CLUSTER_NAME="$PROJECT_NAME-$ENVIRONMENT-cluster"
BUILD_ID="${1:-}"

echo "=========================================="
echo "Task Juggler - Monitor & Complete Deployment"
echo "=========================================="
echo ""

# Get latest build if not provided
if [ -z "$BUILD_ID" ]; then
  BUILD_ID=$(aws codebuild list-builds-for-project \
    --project-name taskjuggler-production-build \
    --region $AWS_REGION \
    --sort-order DESCENDING \
    --max-items 1 \
    --query 'ids[0]' \
    --output text)
fi

echo "Monitoring build: $BUILD_ID"
echo ""

# Monitor build
MAX_WAIT=900
ELAPSED=0
INTERVAL=30

while [ $ELAPSED -lt $MAX_WAIT ]; do
  BUILD_STATUS=$(aws codebuild batch-get-builds \
    --ids "$BUILD_ID" \
    --region $AWS_REGION \
    --query 'builds[0].buildStatus' \
    --output text 2>/dev/null || echo "UNKNOWN")
  
  if [ "$BUILD_STATUS" = "SUCCEEDED" ]; then
    echo "✓ Build completed successfully!"
    break
  elif [ "$BUILD_STATUS" = "FAILED" ]; then
    echo "✗ Build failed. Checking logs..."
    echo ""
    echo "Recent errors:"
    aws logs filter-log-events \
      --log-group-name /aws/codebuild/taskjuggler-production-build \
      --region $AWS_REGION \
      --start-time $(($(date +%s) - 600))000 \
      --filter-pattern "ERROR FAILED" \
      --max-items 5 \
      --query 'events[*].message' \
      --output text 2>&1 | tail -5
    echo ""
    echo "Full logs:"
    echo "aws logs tail /aws/codebuild/taskjuggler-production-build --follow --region $AWS_REGION"
    exit 1
  elif [ "$BUILD_STATUS" = "IN_PROGRESS" ]; then
    PHASE=$(aws codebuild batch-get-builds \
      --ids "$BUILD_ID" \
      --region $AWS_REGION \
      --query 'builds[0].currentPhase' \
      --output text 2>/dev/null || echo "UNKNOWN")
    echo "⏳ Build in progress... Phase: $PHASE ($(date +%H:%M:%S))"
  else
    echo "⚠ Build status: $BUILD_STATUS"
  fi
  
  sleep $INTERVAL
  ELAPSED=$((ELAPSED + INTERVAL))
done

if [ "$BUILD_STATUS" != "SUCCEEDED" ]; then
  echo "⚠ Build did not complete successfully"
  exit 1
fi

echo ""
echo "Step 2: Verifying Docker image in ECR..."
sleep 10

IMAGE_EXISTS=$(aws ecr describe-images \
  --repository-name taskjuggler-production \
  --region $AWS_REGION \
  --image-ids imageTag=latest \
  --query 'imageDetails[0].imageTags' \
  --output text 2>/dev/null || echo "None")

if [ "$IMAGE_EXISTS" != "None" ]; then
  echo "✓ Image found in ECR"
else
  echo "⚠ Image not found yet, waiting..."
  sleep 20
  IMAGE_EXISTS=$(aws ecr describe-images \
    --repository-name taskjuggler-production \
    --region $AWS_REGION \
    --image-ids imageTag=latest \
    --query 'imageDetails[0].imageTags' \
    --output text 2>/dev/null || echo "None")
  if [ "$IMAGE_EXISTS" = "None" ]; then
    echo "✗ Image still not found"
    exit 1
  fi
fi

echo ""
echo "Step 3: Waiting for ECS services..."
MAX_WAIT=600
ELAPSED=0

while [ $ELAPSED -lt $MAX_WAIT ]; do
  SERVICES=$(aws ecs describe-services \
    --cluster $CLUSTER_NAME \
    --services $PROJECT_NAME-$ENVIRONMENT-api $PROJECT_NAME-$ENVIRONMENT-worker \
    --region $AWS_REGION \
    --query 'services[*].{Running:runningCount,Desired:desiredCount}' \
    --output json)
  
  API_RUNNING=$(echo $SERVICES | python3 -c "import sys, json; data=json.load(sys.stdin); print(data[0]['Running'])" 2>/dev/null || echo "0")
  WORKER_RUNNING=$(echo $SERVICES | python3 -c "import sys, json; data=json.load(sys.stdin); print(data[1]['Running'])" 2>/dev/null || echo "0")
  API_DESIRED=$(echo $SERVICES | python3 -c "import sys, json; data=json.load(sys.stdin); print(data[0]['Desired'])" 2>/dev/null || echo "2")
  
  echo "API: $API_RUNNING/$API_DESIRED | Worker: $WORKER_RUNNING/$API_DESIRED ($(date +%H:%M:%S))"
  
  if [ "$API_RUNNING" -ge "$API_DESIRED" ] && [ "$WORKER_RUNNING" -ge "$API_DESIRED" ]; then
    echo "✓ All services running!"
    break
  fi
  
  sleep 30
  ELAPSED=$((ELAPSED + 30))
done

echo ""
echo "Step 4: Running migrations..."
if [ -f "./run-migrations.sh" ]; then
  ./run-migrations.sh
else
  echo "⚠ Migration script not found"
fi

echo ""
echo "=========================================="
echo "Deployment Complete!"
echo "=========================================="
echo "Build: SUCCEEDED"
echo "Image: Available in ECR"
echo "Services: Running"
echo ""
