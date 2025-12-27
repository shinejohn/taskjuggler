#!/bin/bash
# Complete AWS Deployment and Run Comprehensive Tests
# This script completes deployment and then runs all platform tests

set -e

AWS_REGION="us-east-1"
PROJECT_NAME="taskjuggler"
ENVIRONMENT="production"
CLUSTER_NAME="$PROJECT_NAME-$ENVIRONMENT-cluster"

echo "=========================================="
echo "Task Juggler - Complete Deployment & Testing"
echo "=========================================="
echo ""

# Step 1: Monitor latest build
echo "Step 1: Checking latest build status..."
LATEST_BUILD=$(aws codebuild list-builds-for-project \
  --project-name taskjuggler-production-build \
  --region $AWS_REGION \
  --sort-order DESCENDING \
  --max-items 1 \
  --query 'ids[0]' \
  --output text)

if [ -z "$LATEST_BUILD" ] || [ "$LATEST_BUILD" = "None" ]; then
  echo "⚠ No builds found. Starting new build..."
  LATEST_BUILD=$(aws codebuild start-build \
    --project-name taskjuggler-production-build \
    --region $AWS_REGION \
    --query 'build.id' \
    --output text)
  echo "✓ Build started: $LATEST_BUILD"
fi

echo "Monitoring build: $LATEST_BUILD"
echo "This may take 10-15 minutes..."

MAX_WAIT=900  # 15 minutes
ELAPSED=0
INTERVAL=30

while [ $ELAPSED -lt $MAX_WAIT ]; do
  BUILD_STATUS=$(aws codebuild batch-get-builds \
    --ids "$LATEST_BUILD" \
    --region $AWS_REGION \
    --query 'builds[0].buildStatus' \
    --output text 2>/dev/null || echo "UNKNOWN")
  
  if [ "$BUILD_STATUS" = "SUCCEEDED" ]; then
    echo "✓ Build completed successfully!"
    break
  elif [ "$BUILD_STATUS" = "FAILED" ]; then
    echo "✗ Build failed. Check logs:"
    echo "aws logs tail /aws/codebuild/taskjuggler-production-build --follow --region $AWS_REGION"
    echo ""
    echo "Retrying build..."
    LATEST_BUILD=$(aws codebuild start-build \
      --project-name taskjuggler-production-build \
      --region $AWS_REGION \
      --query 'build.id' \
      --output text)
    echo "New build: $LATEST_BUILD"
    ELAPSED=0
  elif [ "$BUILD_STATUS" = "IN_PROGRESS" ]; then
    echo "⏳ Build in progress... ($(date +%H:%M:%S))"
  else
    echo "⚠ Build status: $BUILD_STATUS"
  fi
  
  sleep $INTERVAL
  ELAPSED=$((ELAPSED + INTERVAL))
done

if [ "$BUILD_STATUS" != "SUCCEEDED" ]; then
  echo "⚠ Build did not complete successfully within timeout."
  echo "Please check build status manually and retry."
  exit 1
fi

echo ""

# Step 2: Verify image in ECR
echo "Step 2: Verifying Docker image in ECR..."
sleep 10

IMAGE_EXISTS=$(aws ecr describe-images \
  --repository-name taskjuggler-production \
  --region $AWS_REGION \
  --image-ids imageTag=latest \
  --query 'imageDetails[0].imageTags' \
  --output text 2>/dev/null || echo "None")

if [ "$IMAGE_EXISTS" = "None" ]; then
  echo "⚠ Image not found. Waiting 30 seconds..."
  sleep 30
  IMAGE_EXISTS=$(aws ecr describe-images \
    --repository-name taskjuggler-production \
    --region $AWS_REGION \
    --image-ids imageTag=latest \
    --query 'imageDetails[0].imageTags' \
    --output text 2>/dev/null || echo "None")
fi

if [ "$IMAGE_EXISTS" != "None" ]; then
  echo "✓ Image found in ECR: taskjuggler-production:latest"
else
  echo "✗ Image not found in ECR. Deployment cannot proceed."
  exit 1
fi

echo ""

# Step 3: Wait for ECS services
echo "Step 3: Waiting for ECS services to start..."
echo "This may take 5-10 minutes..."

MAX_WAIT=600
ELAPSED=0
INTERVAL=30

while [ $ELAPSED -lt $MAX_WAIT ]; do
  SERVICES=$(aws ecs describe-services \
    --cluster $CLUSTER_NAME \
    --services $PROJECT_NAME-$ENVIRONMENT-api $PROJECT_NAME-$ENVIRONMENT-worker \
    --region $AWS_REGION \
    --query 'services[*].{Name:serviceName,Running:runningCount,Desired:desiredCount}' \
    --output json)
  
  API_RUNNING=$(echo $SERVICES | python3 -c "import sys, json; data=json.load(sys.stdin); print(data[0]['Running'])" 2>/dev/null || echo "0")
  WORKER_RUNNING=$(echo $SERVICES | python3 -c "import sys, json; data=json.load(sys.stdin); print(data[1]['Running'])" 2>/dev/null || echo "0")
  API_DESIRED=$(echo $SERVICES | python3 -c "import sys, json; data=json.load(sys.stdin); print(data[0]['Desired'])" 2>/dev/null || echo "2")
  WORKER_DESIRED=$(echo $SERVICES | python3 -c "import sys, json; data=json.load(sys.stdin); print(data[1]['Desired'])" 2>/dev/null || echo "2")
  
  echo "API: $API_RUNNING/$API_DESIRED | Worker: $WORKER_RUNNING/$WORKER_DESIRED ($(date +%H:%M:%S))"
  
  if [ "$API_RUNNING" -ge "$API_DESIRED" ] && [ "$WORKER_RUNNING" -ge "$WORKER_DESIRED" ]; then
    echo "✓ All services are running!"
    break
  fi
  
  sleep $INTERVAL
  ELAPSED=$((ELAPSED + INTERVAL))
done

if [ $ELAPSED -ge $MAX_WAIT ]; then
  echo "⚠ Services did not start within timeout. Check ECS console."
  exit 1
fi

echo ""

# Step 4: Run migrations
echo "Step 4: Running database migrations..."
if [ -f "./run-migrations.sh" ]; then
  ./run-migrations.sh
  echo "✓ Migrations completed"
else
  echo "⚠ Migration script not found. Skipping migrations."
fi
echo ""

# Step 5: Deployment complete
echo "=========================================="
echo "Deployment Complete!"
echo "=========================================="
echo "Build: SUCCEEDED"
echo "Docker Image: Available in ECR"
echo "API Service: $API_RUNNING/$API_DESIRED tasks"
echo "Worker Service: $WORKER_RUNNING/$WORKER_DESIRED tasks"
echo ""

# Step 6: Run comprehensive tests
echo "=========================================="
echo "Running Comprehensive Platform Tests"
echo "=========================================="
echo ""

cd /Users/johnshine/Dropbox/Fibonacco/taskjuggler/Code/taskjuggler-api

# Check if tests directory exists
if [ ! -d "tests" ]; then
  echo "⚠ Tests directory not found. Creating test structure..."
  mkdir -p tests/{Unit/{Core,Tasks,Processes,Projects},Feature/{Core,Tasks,Processes,Projects},Integration,E2E}
fi

# Run PHPUnit tests
echo "Running PHPUnit tests..."
if command -v php &> /dev/null && [ -f "vendor/bin/phpunit" ]; then
  echo "Running Unit Tests..."
  php artisan test --testsuite=Unit-Core || echo "⚠ Unit-Core tests failed"
  php artisan test --testsuite=Unit-Tasks || echo "⚠ Unit-Tasks tests failed"
  php artisan test --testsuite=Unit-Processes || echo "⚠ Unit-Processes tests failed"
  php artisan test --testsuite=Unit-Projects || echo "⚠ Unit-Projects tests failed"
  
  echo "Running Feature Tests..."
  php artisan test --testsuite=Feature-Core || echo "⚠ Feature-Core tests failed"
  php artisan test --testsuite=Feature-Tasks || echo "⚠ Feature-Tasks tests failed"
  php artisan test --testsuite=Feature-Processes || echo "⚠ Feature-Processes tests failed"
  php artisan test --testsuite=Feature-Projects || echo "⚠ Feature-Projects tests failed"
  
  echo "Running Integration Tests..."
  php artisan test --testsuite=Integration || echo "⚠ Integration tests failed"
  
  echo ""
  echo "✓ PHPUnit tests completed"
else
  echo "⚠ PHPUnit not available. Skipping PHP tests."
fi

# Run Playwright E2E tests
echo ""
echo "Running Playwright E2E tests..."
if command -v npx &> /dev/null && [ -d "tests/E2E" ]; then
  cd tests/E2E
  npx playwright test || echo "⚠ Playwright tests failed"
  cd ../..
else
  echo "⚠ Playwright not configured. Skipping E2E tests."
fi

echo ""
echo "=========================================="
echo "Testing Complete!"
echo "=========================================="
echo ""
echo "Next steps:"
echo "1. Review test results above"
echo "2. Fix any failing tests"
echo "3. Configure HTTPS when certificate is validated"
echo "4. Verify application endpoints"
echo ""
