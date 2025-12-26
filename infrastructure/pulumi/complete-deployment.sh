#!/bin/bash
# Complete AWS Deployment Script
# This script monitors and completes the AWS deployment process

set -e

AWS_REGION="us-east-1"
PROJECT_NAME="taskjuggler"
ENVIRONMENT="production"
CLUSTER_NAME="$PROJECT_NAME-$ENVIRONMENT-cluster"
CERT_ARN="arn:aws:acm:us-east-1:195430954683:certificate/4689482e-252f-4056-98dc-8ac924872b47"

echo "=========================================="
echo "Task Juggler AWS Deployment Completion"
echo "=========================================="
echo ""

# Step 1: Check CodeBuild Status
echo "Step 1: Checking CodeBuild status..."
BUILD_IDS=$(aws codebuild list-builds-for-project \
  --project-name taskjuggler-production-build \
  --region $AWS_REGION \
  --sort-order DESCENDING \
  --max-items 1 \
  --query 'ids' \
  --output text)

if [ -z "$BUILD_IDS" ] || [ "$BUILD_IDS" = "None" ]; then
  echo "⚠ No build found. Triggering new build..."
  BUILD_ID=$(aws codebuild start-build \
    --project-name taskjuggler-production-build \
    --source-type-override S3 \
    --source-location-override taskjuggler-build-source/source.tar.gz \
    --region $AWS_REGION \
    --query 'build.id' \
    --output text)
  echo "✓ Build triggered: $BUILD_ID"
else
  BUILD_ID=$(echo $BUILD_IDS | awk '{print $1}')
fi

if [ -n "$BUILD_ID" ] && [ "$BUILD_ID" != "None" ]; then
  BUILD_STATUS=$(aws codebuild batch-get-builds \
    --ids $BUILD_ID \
    --region $AWS_REGION \
    --query 'builds[0].buildStatus' \
    --output text 2>/dev/null || echo "UNKNOWN")
else
  BUILD_STATUS="UNKNOWN"
fi

echo "Build Status: $BUILD_STATUS"
echo "Build ID: $BUILD_ID"

if [ "$BUILD_STATUS" = "IN_PROGRESS" ]; then
  echo "⏳ Build in progress. Waiting for completion..."
  echo "Monitor with: aws codebuild batch-get-builds --ids $BUILD_ID --region $AWS_REGION"
  echo "View logs: aws logs tail /aws/codebuild/taskjuggler-production-build --follow --region $AWS_REGION"
  exit 0
elif [ "$BUILD_STATUS" = "FAILED" ]; then
  echo "✗ Build failed. Check logs:"
  echo "aws logs tail /aws/codebuild/taskjuggler-production-build --follow --region $AWS_REGION"
  exit 1
elif [ "$BUILD_STATUS" != "SUCCEEDED" ]; then
  echo "⚠ Build status: $BUILD_STATUS"
  exit 0
fi

echo "✓ Build completed successfully"
echo ""

# Step 2: Verify Image in ECR
echo "Step 2: Verifying Docker image in ECR..."
IMAGE_EXISTS=$(aws ecr describe-images \
  --repository-name taskjuggler-production \
  --region $AWS_REGION \
  --image-ids imageTag=latest \
  --query 'imageDetails[0].imageTags' \
  --output text 2>/dev/null || echo "None")

if [ "$IMAGE_EXISTS" = "None" ] || [ -z "$IMAGE_EXISTS" ]; then
  echo "⚠ Image not found in ECR. Build may have failed."
  exit 1
fi

echo "✓ Image found in ECR: taskjuggler-production:latest"
echo ""

# Step 3: Check ECS Services
echo "Step 3: Checking ECS services..."
SERVICES=$(aws ecs describe-services \
  --cluster $CLUSTER_NAME \
  --services $PROJECT_NAME-$ENVIRONMENT-api $PROJECT_NAME-$ENVIRONMENT-worker \
  --region $AWS_REGION \
  --query 'services[*].{Name:serviceName,Running:runningCount,Desired:desiredCount}' \
  --output json)

API_RUNNING=$(echo $SERVICES | jq -r '.[0].Running')
WORKER_RUNNING=$(echo $SERVICES | jq -r '.[1].Running')
API_DESIRED=$(echo $SERVICES | jq -r '.[0].Desired')
WORKER_DESIRED=$(echo $SERVICES | jq -r '.[1].Desired')

echo "API Service: $API_RUNNING/$API_DESIRED tasks"
echo "Worker Service: $WORKER_RUNNING/$WORKER_DESIRED tasks"

if [ "$API_RUNNING" -lt "$API_DESIRED" ] || [ "$WORKER_RUNNING" -lt "$WORKER_DESIRED" ]; then
  echo "⏳ Services are starting. This may take a few minutes..."
  echo "Monitor with: aws ecs describe-services --cluster $CLUSTER_NAME --services $PROJECT_NAME-$ENVIRONMENT-api $PROJECT_NAME-$ENVIRONMENT-worker --region $AWS_REGION"
  echo ""
  echo "Once services show $API_DESIRED/$API_DESIRED tasks running, proceed to migrations."
  exit 0
fi

echo "✓ All services running"
echo ""

# Step 4: Run Migrations
echo "Step 4: Running database migrations..."
if [ -f "./run-migrations.sh" ]; then
  ./run-migrations.sh
  echo "✓ Migrations completed"
else
  echo "⚠ Migration script not found. Run manually:"
  echo "./run-migrations.sh"
fi
echo ""

# Step 5: Check SSL Certificate
echo "Step 5: Checking SSL certificate status..."
CERT_STATUS=$(aws acm describe-certificate \
  --certificate-arn $CERT_ARN \
  --region $AWS_REGION \
  --query 'Certificate.Status' \
  --output text)

echo "Certificate Status: $CERT_STATUS"

if [ "$CERT_STATUS" = "PENDING_VALIDATION" ]; then
  echo "⏳ Certificate is pending validation."
  echo "DNS validation records should be in Route53. Waiting for validation..."
  echo "Check status: aws acm describe-certificate --certificate-arn $CERT_ARN --region $AWS_REGION"
  echo ""
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
echo "Deployment Status Summary"
echo "=========================================="
echo "Build: $BUILD_STATUS"
echo "API Service: $API_RUNNING/$API_DESIRED tasks"
echo "Worker Service: $WORKER_RUNNING/$WORKER_DESIRED tasks"
echo "SSL Certificate: $CERT_STATUS"
echo ""
echo "Next steps:"
echo "1. Verify application health: curl http://[ALB_DNS]/api/health"
echo "2. Check CloudWatch logs for any errors"
echo "3. Test API endpoints"
echo ""
