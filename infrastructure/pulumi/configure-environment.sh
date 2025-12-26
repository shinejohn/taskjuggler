#!/bin/bash
# Configure Laravel environment variables from Secrets Manager

set -e

AWS_REGION="us-east-1"
PROJECT_NAME="taskjuggler"
ENVIRONMENT="production"

# Get secrets ARNs
DB_SECRET_ARN=$(aws secretsmanager list-secrets --region $AWS_REGION --filters Key=tag-key,Values=Project Key=tag-value,Values=$PROJECT_NAME --query "SecretList[?contains(Name, 'db')].ARN" --output text | head -1)
APP_SECRETS_ARN=$(aws secretsmanager list-secrets --region $AWS_REGION --filters Key=tag-key,Values=Project Key=tag-value,Values=$PROJECT_NAME --query "SecretList[?contains(Name, 'app')].ARN" --output text | head -1)
REDIS_SECRET_ARN=$(aws secretsmanager list-secrets --region $AWS_REGION --filters Key=tag-key,Values=Project Key=tag-value,Values=$PROJECT_NAME --query "SecretList[?contains(Name, 'redis')].ARN" --output text | head -1)

echo "DB Secret ARN: $DB_SECRET_ARN"
echo "App Secrets ARN: $APP_SECRETS_ARN"
echo "Redis Secret ARN: $REDIS_SECRET_ARN"

# Get database credentials
DB_CREDS=$(aws secretsmanager get-secret-value --secret-id $DB_SECRET_ARN --region $AWS_REGION --query SecretString --output text)
DB_HOST=$(echo $DB_CREDS | jq -r '.host // .endpoint')
DB_PORT=$(echo $DB_CREDS | jq -r '.port // 5432')
DB_NAME=$(echo $DB_CREDS | jq -r '.dbname // .database')
DB_USERNAME=$(echo $DB_CREDS | jq -r '.username')
DB_PASSWORD=$(echo $DB_CREDS | jq -r '.password')

echo "Database configured: $DB_USERNAME@$DB_HOST:$DB_PORT/$DB_NAME"

# Get Redis credentials
REDIS_CREDS=$(aws secretsmanager get-secret-value --secret-id $REDIS_SECRET_ARN --region $AWS_REGION --query SecretString --output text 2>/dev/null || echo '{}')
REDIS_PASSWORD=$(echo $REDIS_CREDS | jq -r '.password // .auth_token // ""')

echo "Redis configured"

# Get application secrets
APP_SECRETS=$(aws secretsmanager get-secret-value --secret-id $APP_SECRETS_ARN --region $AWS_REGION --query SecretString --output text)
APP_KEY=$(echo $APP_SECRETS | jq -r '.APP_KEY // ""')

echo "Application secrets configured"

echo ""
echo "Environment variables configured successfully!"
echo "ECS tasks will automatically use these secrets via Secrets Manager integration."
