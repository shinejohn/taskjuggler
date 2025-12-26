#!/bin/bash
# Run database migrations via ECS task

set -e

AWS_REGION="us-east-1"
PROJECT_NAME="taskjuggler"
ENVIRONMENT="production"
CLUSTER_NAME="$PROJECT_NAME-$ENVIRONMENT-cluster"
TASK_DEFINITION="$PROJECT_NAME-$ENVIRONMENT-api"

echo "Running database migrations..."

# Get cluster ARN
CLUSTER_ARN=$(aws ecs describe-clusters --clusters $CLUSTER_NAME --region $AWS_REGION --query 'clusters[0].clusterArn' --output text)

# Get task definition ARN
TASK_DEF_ARN=$(aws ecs describe-task-definition --task-definition $TASK_DEFINITION --region $AWS_REGION --query 'taskDefinition.taskDefinitionArn' --output text)

# Get subnet IDs (private subnets)
SUBNET_IDS=$(aws ec2 describe-subnets --region $AWS_REGION --filters "Name=tag:Name,Values=$PROJECT_NAME-$ENVIRONMENT-vpc-private-*" --query 'Subnets[*].SubnetId' --output text | tr '\t' ',')

# Get security group
SG_ID=$(aws ec2 describe-security-groups --region $AWS_REGION --filters "Name=tag:Name,Values=$PROJECT_NAME-$ENVIRONMENT-ecs-sg" --query 'SecurityGroups[0].GroupId' --output text)

echo "Cluster: $CLUSTER_NAME"
echo "Task Definition: $TASK_DEF_ARN"
echo "Subnets: $SUBNET_IDS"
echo "Security Group: $SG_ID"

# Run migration task
TASK_ARN=$(aws ecs run-task \
    --cluster $CLUSTER_ARN \
    --task-definition $TASK_DEF_ARN \
    --launch-type FARGATE \
    --network-configuration "awsvpcConfiguration={subnets=[$SUBNET_IDS],securityGroups=[$SG_ID],assignPublicIp=DISABLED}" \
    --overrides "{\"containerOverrides\":[{\"name\":\"api\",\"command\":[\"php\",\"artisan\",\"migrate\",\"--force\"]}]}" \
    --region $AWS_REGION \
    --query 'tasks[0].taskArn' \
    --output text)

echo "Migration task started: $TASK_ARN"
echo "Waiting for task to complete..."

# Wait for task to complete
aws ecs wait tasks-stopped --cluster $CLUSTER_ARN --tasks $TASK_ARN --region $AWS_REGION

# Get task exit code
EXIT_CODE=$(aws ecs describe-tasks --cluster $CLUSTER_ARN --tasks $TASK_ARN --region $AWS_REGION --query 'tasks[0].containers[0].exitCode' --output text)

if [ "$EXIT_CODE" = "0" ]; then
    echo "✓ Migrations completed successfully!"
else
    echo "✗ Migrations failed with exit code: $EXIT_CODE"
    # Get logs
    LOG_GROUP="/ecs/$PROJECT_NAME-$ENVIRONMENT-logs"
    LOG_STREAM=$(aws logs describe-log-streams --log-group-name $LOG_GROUP --region $AWS_REGION --order-by LastEventTime --descending --max-items 1 --query 'logStreams[0].logStreamName' --output text)
    echo "Recent logs:"
    aws logs get-log-events --log-group-name $LOG_GROUP --log-stream-name $LOG_STREAM --region $AWS_REGION --limit 50 --query 'events[*].message' --output text
    exit 1
fi
