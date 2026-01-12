#!/bin/bash
# Force ECS services to update with latest Docker image

set -e

AWS_REGION="us-east-1"
PROJECT_NAME="taskjuggler"
ENVIRONMENT="production"
CLUSTER_NAME="$PROJECT_NAME-$ENVIRONMENT-cluster"
API_SERVICE="$PROJECT_NAME-$ENVIRONMENT-api"
WORKER_SERVICE="$PROJECT_NAME-$ENVIRONMENT-worker"

echo "=========================================="
echo "Updating ECS Services"
echo "=========================================="
echo ""

# Verify image exists
echo "Step 1: Verifying Docker image..."
IMAGE_EXISTS=$(aws ecr describe-images \
    --repository-name "$PROJECT_NAME-$ENVIRONMENT" \
    --region $AWS_REGION \
    --image-ids imageTag=latest \
    --query 'imageDetails[0].imageTags' \
    --output text 2>/dev/null || echo "None")

if [ "$IMAGE_EXISTS" = "None" ]; then
    echo "✗ Image not found in ECR"
    echo "Please run ./trigger-build.sh first"
    exit 1
fi

echo "✓ Image found: $PROJECT_NAME-$ENVIRONMENT:latest"
echo ""

# Force update API service
echo "Step 2: Updating API service..."
aws ecs update-service \
    --cluster "$CLUSTER_NAME" \
    --service "$API_SERVICE" \
    --force-new-deployment \
    --region $AWS_REGION \
    --query 'service.{Name:serviceName,Status:status,Desired:desiredCount,Running:runningCount}' \
    --output table

echo "✓ API service update initiated"
echo ""

# Force update Worker service
echo "Step 3: Updating Worker service..."
aws ecs update-service \
    --cluster "$CLUSTER_NAME" \
    --service "$WORKER_SERVICE" \
    --force-new-deployment \
    --region $AWS_REGION \
    --query 'service.{Name:serviceName,Status:status,Desired:desiredCount,Running:runningCount}' \
    --output table

echo "✓ Worker service update initiated"
echo ""

# Monitor services
echo "Step 4: Monitoring service deployment..."
echo "This may take 5-10 minutes..."
echo ""

MAX_WAIT=600
ELAPSED=0
INTERVAL=30

while [ $ELAPSED -lt $MAX_WAIT ]; do
    SERVICES=$(aws ecs describe-services \
        --cluster "$CLUSTER_NAME" \
        --services "$API_SERVICE" "$WORKER_SERVICE" \
        --region $AWS_REGION \
        --query 'services[*].{Name:serviceName,Running:runningCount,Desired:desiredCount,Deployments:deployments[*].{Status:status,Running:runningCount}}' \
        --output json)
    
    API_RUNNING=$(echo "$SERVICES" | jq -r '.[0].Running // 0')
    WORKER_RUNNING=$(echo "$SERVICES" | jq -r '.[1].Running // 0')
    API_DESIRED=$(echo "$SERVICES" | jq -r '.[0].Desired // 2')
    WORKER_DESIRED=$(echo "$SERVICES" | jq -r '.[1].Desired // 2')
    
    echo "API: $API_RUNNING/$API_DESIRED | Worker: $WORKER_RUNNING/$WORKER_DESIRED ($(date +%H:%M:%S))"
    
    if [ "$API_RUNNING" -ge "$API_DESIRED" ] && [ "$WORKER_RUNNING" -ge "$WORKER_DESIRED" ]; then
        # Check if deployments are stable
        API_DEPLOYMENTS=$(echo "$SERVICES" | jq -r '.[0].Deployments | length')
        WORKER_DEPLOYMENTS=$(echo "$SERVICES" | jq -r '.[1].Deployments | length')
        
        if [ "$API_DEPLOYMENTS" -eq "1" ] && [ "$WORKER_DEPLOYMENTS" -eq "1" ]; then
            echo ""
            echo "✓ All services are running and stable!"
            break
        fi
    fi
    
    sleep $INTERVAL
    ELAPSED=$((ELAPSED + INTERVAL))
done

if [ $ELAPSED -ge $MAX_WAIT ]; then
    echo ""
    echo "⚠ Services did not stabilize within timeout"
    echo "Check ECS console for details"
    exit 1
fi

echo ""
echo "=========================================="
echo "ECS Services Updated!"
echo "=========================================="
echo ""
echo "Next steps:"
echo "1. Run migrations:"
echo "   ./run-migrations.sh"
echo ""
echo "2. Check SSL certificate:"
echo "   ./check-ssl-cert.sh"
echo ""
