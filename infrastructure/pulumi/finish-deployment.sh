#!/bin/bash
# Complete AWS Deployment Script
# Monitors build, waits for services, runs migrations, configures HTTPS

set -e

AWS_REGION="us-east-1"
PROJECT_NAME="taskjuggler"
ENVIRONMENT="production"
CLUSTER_NAME="$PROJECT_NAME-$ENVIRONMENT-cluster"
CERT_ARN="arn:aws:acm:us-east-1:195430954683:certificate/4689482e-252f-4056-98dc-8ac924872b47"
BUILD_ID="${1:-}"

echo "=========================================="
echo "Task Juggler AWS Deployment Completion"
echo "=========================================="
echo ""

# Step 1: Wait for build to complete
if [ -n "$BUILD_ID" ]; then
  echo "Step 1: Monitoring build: $BUILD_ID"
  echo "Waiting for build to complete (this may take 10-15 minutes)..."
  
  while true; do
    BUILD_STATUS=$(aws codebuild batch-get-builds \
      --ids $BUILD_ID \
      --region $AWS_REGION \
      --query 'builds[0].buildStatus' \
      --output text 2>/dev/null || echo "UNKNOWN")
    
    if [ "$BUILD_STATUS" = "SUCCEEDED" ]; then
      echo "✓ Build completed successfully!"
      break
    elif [ "$BUILD_STATUS" = "FAILED" ]; then
      echo "✗ Build failed. Check logs:"
      echo "aws logs tail /aws/codebuild/taskjuggler-production-build --follow --region $AWS_REGION"
      exit 1
    elif [ "$BUILD_STATUS" = "IN_PROGRESS" ]; then
      echo "⏳ Build in progress... ($(date +%H:%M:%S))"
      sleep 30
    else
      echo "⚠ Build status: $BUILD_STATUS"
      sleep 10
    fi
  done
else
  echo "Step 1: Checking for latest build..."
  LATEST_BUILD=$(aws codebuild list-builds-for-project \
    --project-name taskjuggler-production-build \
    --region $AWS_REGION \
    --sort-order DESCENDING \
    --max-items 1 \
    --query 'ids[0]' \
    --output text)
  
  if [ -n "$LATEST_BUILD" ] && [ "$LATEST_BUILD" != "None" ]; then
    BUILD_STATUS=$(aws codebuild batch-get-builds \
      --ids $LATEST_BUILD \
      --region $AWS_REGION \
      --query 'builds[0].buildStatus' \
      --output text 2>/dev/null || echo "UNKNOWN")
    
    if [ "$BUILD_STATUS" = "SUCCEEDED" ]; then
      echo "✓ Latest build succeeded: $LATEST_BUILD"
    else
      echo "⚠ Latest build status: $BUILD_STATUS ($LATEST_BUILD)"
      echo "Waiting for successful build..."
      exit 0
    fi
  else
    echo "⚠ No builds found. Trigger a build first."
    exit 1
  fi
fi

echo ""

# Step 2: Verify image in ECR
echo "Step 2: Verifying Docker image in ECR..."
sleep 5  # Give ECR a moment to update

IMAGE_EXISTS=$(aws ecr describe-images \
  --repository-name taskjuggler-production \
  --region $AWS_REGION \
  --image-ids imageTag=latest \
  --query 'imageDetails[0].imageTags' \
  --output text 2>/dev/null || echo "None")

if [ "$IMAGE_EXISTS" = "None" ] || [ -z "$IMAGE_EXISTS" ]; then
  echo "⚠ Image not found in ECR yet. Waiting..."
  sleep 10
  
  IMAGE_EXISTS=$(aws ecr describe-images \
    --repository-name taskjuggler-production \
    --region $AWS_REGION \
    --image-ids imageTag=latest \
    --query 'imageDetails[0].imageTags' \
    --output text 2>/dev/null || echo "None")
  
  if [ "$IMAGE_EXISTS" = "None" ]; then
    echo "✗ Image still not found. Check ECR manually."
    exit 1
  fi
fi

echo "✓ Image found in ECR: taskjuggler-production:latest"
echo ""

# Step 3: Wait for ECS services to start
echo "Step 3: Waiting for ECS services to start..."
echo "This may take 5-10 minutes..."

MAX_WAIT=600  # 10 minutes
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
  echo "⚠ Migration script not found. Run manually:"
  echo "./run-migrations.sh"
fi
echo ""

# Step 5: Check SSL certificate
echo "Step 5: Checking SSL certificate status..."
CERT_STATUS=$(aws acm describe-certificate \
  --certificate-arn $CERT_ARN \
  --region $AWS_REGION \
  --query 'Certificate.Status' \
  --output text)

echo "Certificate Status: $CERT_STATUS"

if [ "$CERT_STATUS" = "PENDING_VALIDATION" ]; then
  echo "⏳ Certificate is pending validation."
  echo "DNS validation records should be in Route53."
  echo "Once status is 'ISSUED', run: ./configure-https.sh taskjuggler.com"
elif [ "$CERT_STATUS" = "ISSUED" ]; then
  echo "✓ Certificate is issued"
  echo ""
  
  # Step 6: Configure HTTPS Listener
  echo "Step 6: Configuring HTTPS listener..."
  if [ -f "./configure-https.sh" ]; then
    ./configure-https.sh taskjuggler.com
    echo "✓ HTTPS listener configured"
  else
    echo "⚠ HTTPS configuration script not found. Run manually:"
    echo "./configure-https.sh taskjuggler.com"
  fi
else
  echo "⚠ Certificate status: $CERT_STATUS"
fi

echo ""
echo "=========================================="
echo "Deployment Summary"
echo "=========================================="
echo "Build: SUCCEEDED"
echo "Docker Image: Available in ECR"
echo "API Service: $API_RUNNING/$API_DESIRED tasks"
echo "Worker Service: $WORKER_RUNNING/$WORKER_DESIRED tasks"
echo "SSL Certificate: $CERT_STATUS"
echo ""
echo "Next steps:"
echo "1. Verify application: curl http://[ALB_DNS]/api/health"
echo "2. Check CloudWatch logs for any errors"
echo "3. Test API endpoints"
echo ""
