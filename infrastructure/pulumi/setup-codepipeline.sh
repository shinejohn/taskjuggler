#!/bin/bash
# Setup AWS CodePipeline for Task Juggler
# This script helps configure CodePipeline to replace GitHub Actions

set -e

echo "🚀 Setting up AWS CodePipeline for Task Juggler"
echo ""

# Check if AWS CLI is configured
if ! aws sts get-caller-identity &>/dev/null; then
    echo "❌ AWS CLI not configured. Please run 'aws configure' first."
    exit 1
fi

ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
REGION="us-east-1"

echo "📋 Account ID: $ACCOUNT_ID"
echo "🌍 Region: $REGION"
echo ""

# Check for existing CodeStar Connections
echo "Checking for existing GitHub connections..."
CONNECTIONS=$(aws codestar-connections list-connections --provider-type-filter GitHub --region $REGION --query 'Connections[?ConnectionStatus==`AVAILABLE`]' --output json 2>/dev/null || echo "[]")

if [ "$CONNECTIONS" != "[]" ] && [ "$CONNECTIONS" != "null" ]; then
    echo "✅ Found existing GitHub connection(s):"
    echo "$CONNECTIONS" | jq -r '.[] | "  - \(.ConnectionName): \(.ConnectionArn)"'
    echo ""
    echo "To use an existing connection, run:"
    echo "  pulumi config set github_connection_arn \"<CONNECTION_ARN>\""
    echo ""
    read -p "Do you want to create a new connection? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Using existing connection. Please set the ARN manually."
        exit 0
    fi
fi

# Create new CodeStar Connection
echo "🔗 Creating new GitHub CodeStar Connection..."
echo ""
echo "This will open AWS Console to authorize GitHub access."
echo "After authorization, the connection will be created."
echo ""

CONNECTION_NAME="taskjuggler-github-$(date +%s)"

echo "Creating connection: $CONNECTION_NAME"
CONNECTION_ARN=$(aws codestar-connections create-connection \
    --provider-type GitHub \
    --connection-name "$CONNECTION_NAME" \
    --region $REGION \
    --query 'ConnectionArn' \
    --output text 2>/dev/null || echo "")

if [ -z "$CONNECTION_ARN" ]; then
    echo "❌ Failed to create connection. You may need to create it manually in AWS Console."
    echo ""
    echo "Manual steps:"
    echo "1. Go to: https://console.aws.amazon.com/codesuite/settings/connections"
    echo "2. Click 'Create connection'"
    echo "3. Select 'GitHub'"
    echo "4. Click 'Connect to GitHub' and authorize"
    echo "5. Copy the Connection ARN"
    echo "6. Run: pulumi config set github_connection_arn \"<CONNECTION_ARN>\""
    exit 1
fi

echo "✅ Connection created: $CONNECTION_ARN"
echo ""
echo "⏳ Waiting for connection to be available (this may take a minute)..."
echo "   You may need to complete GitHub authorization in AWS Console"
echo ""

# Wait for connection to be available
MAX_WAIT=300  # 5 minutes
WAITED=0
while [ $WAITED -lt $MAX_WAIT ]; do
    STATUS=$(aws codestar-connections get-connection \
        --connection-arn "$CONNECTION_ARN" \
        --region $REGION \
        --query 'Connection.ConnectionStatus' \
        --output text 2>/dev/null || echo "PENDING")
    
    if [ "$STATUS" == "AVAILABLE" ]; then
        echo "✅ Connection is available!"
        break
    elif [ "$STATUS" == "FAILED" ]; then
        echo "❌ Connection failed. Please check AWS Console."
        exit 1
    fi
    
    echo "   Status: $STATUS (waiting...)"
    sleep 10
    WAITED=$((WAITED + 10))
done

if [ "$STATUS" != "AVAILABLE" ]; then
    echo "⚠️  Connection not yet available. Please check AWS Console and complete authorization."
    echo "   Connection ARN: $CONNECTION_ARN"
    echo ""
    echo "Once available, run:"
    echo "  pulumi config set github_connection_arn \"$CONNECTION_ARN\""
    exit 1
fi

# Set in Pulumi config
echo ""
echo "📝 Setting GitHub connection ARN in Pulumi config..."
cd "$(dirname "$0")"
pulumi config set github_connection_arn "$CONNECTION_ARN" || {
    echo "⚠️  Failed to set config. Please run manually:"
    echo "  pulumi config set github_connection_arn \"$CONNECTION_ARN\""
    exit 1
}

echo ""
echo "✅ Configuration complete!"
echo ""
echo "Next steps:"
echo "1. Deploy CodePipeline: pulumi up"
echo "2. Make a commit to main branch to test"
echo "3. Monitor pipeline: pulumi stack output pipeline_url"
echo ""

