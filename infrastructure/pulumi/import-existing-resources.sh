#!/bin/bash
# Import existing AWS resources into Pulumi state

set -e

cd "$(dirname "$0")"
source venv/bin/activate

echo "Importing existing resources into Pulumi state..."
echo ""

# Get AWS account ID
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
REGION=$(pulumi config get aws:region)

echo "AWS Account: $ACCOUNT_ID"
echo "Region: $REGION"
echo ""

# Import existing resources
echo "Importing CloudWatch Log Group..."
pulumi import aws:cloudwatch/logGroup:LogGroup taskjuggler-production-logs /ecs/taskjuggler-production 2>&1 || echo "Already imported or doesn't exist"

echo "Importing S3 Buckets..."
pulumi import aws:s3/bucket:Bucket taskjuggler-production-storage taskjuggler-production-storage 2>&1 || echo "Already imported"
pulumi import aws:s3/bucket:Bucket taskjuggler-production-backups taskjuggler-production-backups 2>&1 || echo "Already imported"

echo "Importing ECR Repository..."
pulumi import aws:ecr/repository:Repository taskjuggler-production-repo taskjuggler-production 2>&1 || echo "Already imported"

echo "Importing Secrets Manager secrets..."
pulumi import aws:secretsmanager/secret:Secret taskjuggler-production-db-secret "arn:aws:secretsmanager:${REGION}:${ACCOUNT_ID}:secret:taskjuggler/production/database" 2>&1 || echo "Already imported"
pulumi import aws:secretsmanager/secret:Secret taskjuggler-production-app-secrets "arn:aws:secretsmanager:${REGION}:${ACCOUNT_ID}:secret:taskjuggler/production/app" 2>&1 || echo "Already imported"
pulumi import aws:secretsmanager/secret:Secret taskjuggler-production-redis-secret "arn:aws:secretsmanager:${REGION}:${ACCOUNT_ID}:secret:taskjuggler/production/redis" 2>&1 || echo "Already imported"

echo "Importing SNS Topics..."
pulumi import aws:sns/topic:Topic taskjuggler-production-user-topic "arn:aws:sns:${REGION}:${ACCOUNT_ID}:taskjuggler-production-users" 2>&1 || echo "Already imported"
pulumi import aws:sns/topic:Topic taskjuggler-production-task-topic "arn:aws:sns:${REGION}:${ACCOUNT_ID}:taskjuggler-production-tasks" 2>&1 || echo "Already imported"

echo "Importing SES Configuration Set..."
pulumi import aws:ses/configurationSet:ConfigurationSet taskjuggler-production-ses-config taskjuggler-production-ses-config 2>&1 || echo "Already imported"

echo ""
echo "Import complete. Now run: pulumi up --yes"





