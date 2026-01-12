#!/bin/bash
# Setup GitHub Webhook for CodeBuild
# This script completes the webhook setup after CodeStar Connection is authorized

set -e

CONNECTION_ARN="arn:aws:codestar-connections:us-east-1:195430954683:connection/5f1fff66-59d0-4991-b14d-957239c045b8"
PROJECT_NAME="taskjuggler-production-build"
REGION="us-east-1"

echo "🔗 GitHub Webhook Setup for CodeBuild"
echo "========================================"
echo ""

# Step 1: Check connection status
echo "Step 1: Checking CodeStar Connection status..."
CONNECTION_STATUS=$(aws codestar-connections get-connection \
    --connection-arn "$CONNECTION_ARN" \
    --region "$REGION" \
    --query 'Connection.ConnectionStatus' \
    --output text 2>&1)

echo "Connection Status: $CONNECTION_STATUS"
echo ""

if [ "$CONNECTION_STATUS" != "AVAILABLE" ]; then
    echo "⚠️  Connection is not yet AVAILABLE (current: $CONNECTION_STATUS)"
    echo ""
    echo "📋 Manual Step Required:"
    echo "1. Go to AWS Console: https://console.aws.amazon.com/codesuite/settings/connections"
    echo "2. Find connection: taskjuggler-github"
    echo "3. Click 'Update pending connection'"
    echo "4. Authorize AWS to access your GitHub account"
    echo "5. Wait for connection status to become 'AVAILABLE'"
    echo ""
    echo "Then run this script again to complete webhook setup."
    exit 1
fi

echo "✅ Connection is AVAILABLE"
echo ""

# Step 2: Update CodeBuild to use the connection
echo "Step 2: Updating CodeBuild project to use CodeStar Connection..."
aws codebuild update-project \
    --name "$PROJECT_NAME" \
    --region "$REGION" \
    --source type=GITHUB,location=https://github.com/shinejohn/taskjuggler.git,buildspec=taskjuggler-api/buildspec.yml \
    --source-version refs/heads/main \
    --source-auth type=OAUTH,resource="$CONNECTION_ARN" \
    > /dev/null 2>&1

if [ $? -eq 0 ]; then
    echo "✅ CodeBuild updated to use CodeStar Connection"
else
    echo "❌ Failed to update CodeBuild"
    exit 1
fi
echo ""

# Step 3: Create webhook
echo "Step 3: Creating webhook for automatic builds..."
WEBHOOK_RESULT=$(aws codebuild create-webhook \
    --project-name "$PROJECT_NAME" \
    --region "$REGION" \
    --filter-groups '[[{"type":"EVENT","pattern":"PUSH"},{"type":"HEAD_REF","pattern":"^refs/heads/main$"}]]' \
    --output json 2>&1)

if [ $? -eq 0 ]; then
    WEBHOOK_URL=$(echo "$WEBHOOK_RESULT" | jq -r '.webhook.url // empty')
    WEBHOOK_SECRET=$(echo "$WEBHOOK_RESULT" | jq -r '.webhook.secret // empty')
    
    echo "✅ Webhook created successfully"
    echo ""
    echo "📋 Webhook Details:"
    echo "   URL: $WEBHOOK_URL"
    echo "   Secret: $WEBHOOK_SECRET"
    echo ""
    echo "🔗 Next Steps:"
    echo "1. Go to GitHub: https://github.com/shinejohn/taskjuggler/settings/hooks"
    echo "2. Click 'Add webhook'"
    echo "3. Enter the webhook URL above"
    echo "4. Set Content type to: application/json"
    echo "5. Enter the secret (if provided)"
    echo "6. Select events: Just the push event"
    echo "7. Click 'Add webhook'"
    echo ""
    echo "✅ Setup complete! CodeBuild will now trigger automatically on push to main branch."
else
    echo "❌ Failed to create webhook"
    echo "$WEBHOOK_RESULT"
    exit 1
fi

