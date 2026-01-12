#!/bin/bash
# Check CodeStar Connection status and provide next steps

CONNECTION_ARN="arn:aws:codestar-connections:us-east-1:195430954683:connection/5f1fff66-59d0-4991-b14d-957239c045b8"
REGION="us-east-1"

echo "🔍 Checking CodeStar Connection Status..."
echo ""

CONNECTION_STATUS=$(aws codestar-connections get-connection \
    --connection-arn "$CONNECTION_ARN" \
    --region "$REGION" \
    --query 'Connection.ConnectionStatus' \
    --output text 2>&1)

CONNECTION_NAME=$(aws codestar-connections get-connection \
    --connection-arn "$CONNECTION_ARN" \
    --region "$REGION" \
    --query 'Connection.ConnectionName' \
    --output text 2>&1)

echo "Connection Name: $CONNECTION_NAME"
echo "Status: $CONNECTION_STATUS"
echo ""

if [ "$CONNECTION_STATUS" = "AVAILABLE" ]; then
    echo "✅ Connection is AVAILABLE!"
    echo ""
    echo "Next step: Run ./setup-github-webhook.sh to complete webhook setup"
elif [ "$CONNECTION_STATUS" = "PENDING" ]; then
    echo "⚠️  Connection is PENDING - OAuth authorization required"
    echo ""
    echo "📋 To complete authorization:"
    echo "1. Open: https://console.aws.amazon.com/codesuite/settings/connections?region=us-east-1"
    echo "2. Find connection: $CONNECTION_NAME"
    echo "3. Click 'Update pending connection'"
    echo "4. Authorize AWS to access your GitHub account"
    echo "5. Wait 1-2 minutes, then run this script again"
    echo ""
    echo "Or run: open 'https://console.aws.amazon.com/codesuite/settings/connections?region=us-east-1'"
else
    echo "❌ Connection status: $CONNECTION_STATUS"
    echo "Check AWS Console for details"
fi

