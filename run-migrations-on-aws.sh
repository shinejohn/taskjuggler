#!/bin/bash

# Script to run migrations and seeders on AWS ECS
# Usage: ./run-migrations-on-aws.sh <cluster-name> <service-name>

set -e

CLUSTER_NAME=${1:-"taskjuggler-production-cluster"}
SERVICE_NAME=${2:-"taskjuggler-production-api"}

echo "🔍 Finding ECS task..."
TASK_ARN=$(aws ecs list-tasks --cluster "$CLUSTER_NAME" --service-name "$SERVICE_NAME" --query 'taskArns[0]' --output text)

if [ -z "$TASK_ARN" ] || [ "$TASK_ARN" = "None" ]; then
    echo "❌ No running tasks found for service $SERVICE_NAME"
    exit 1
fi

echo "✅ Found task: $TASK_ARN"
TASK_ID=$(echo $TASK_ARN | awk -F/ '{print $NF}')

# Get container name
CONTAINER_NAME=$(aws ecs describe-tasks --cluster "$CLUSTER_NAME" --tasks "$TASK_ARN" --query 'tasks[0].containers[0].name' --output text)

echo "📦 Running migrations..."
aws ecs execute-command \
    --cluster "$CLUSTER_NAME" \
    --task "$TASK_ID" \
    --container "$CONTAINER_NAME" \
    --command "php artisan migrate --force" \
    --interactive

echo "🌱 Running seeders..."
aws ecs execute-command \
    --cluster "$CLUSTER_NAME" \
    --task "$TASK_ID" \
    --container "$CONTAINER_NAME" \
    --command "php artisan db:seed --class=CoordinatorTestUserSeeder --force" \
    --interactive

echo "✅ Migrations and seeders completed!"

