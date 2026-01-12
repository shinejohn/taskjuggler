#!/bin/bash
# Create webhook for CodeBuild after CodeStar Connection is configured

set -e

PROJECT_NAME="taskjuggler-production-build"
REGION="us-east-1"

echo "🔗 Creating Webhook for CodeBuild"
echo "===================================="
echo ""

# Check if CodeBuild is configured with CodeStar Connection
echo "Step 1: Verifying CodeBuild configuration..."
SOURCE_AUTH=$(aws codebuild batch-get-projects \
    --names "$PROJECT_NAME" \
    --region "$REGION" \
    --query 'projects[0].source.auth.resource // empty' \
    --output text 2>&1)

if [ -z "$SOURCE_AUTH" ] || [ "$SOURCE_AUTH" = "None" ]; then
    echo "❌ CodeBuild is not configured with CodeStar Connection"
    echo ""
    echo "📋 Please update CodeBuild in AWS Console first:"
    echo "1. Go to: https://console.aws.amazon.com/codesuite/codebuild/projects/$PROJECT_NAME/edit?region=$REGION"
    echo "2. Update Source to use connection: taskjuggler-github"
    echo "3. Save changes"
    echo "4. Then run this script again"
    echo ""
    echo "See COMPLETE_WEBHOOK_SETUP.md for detailed instructions"
    exit 1
fi

echo "✅ CodeBuild is configured with CodeStar Connection"
echo "   Connection: $SOURCE_AUTH"
echo ""

# Create webhook
echo "Step 2: Creating webhook..."
WEBHOOK_RESULT=$(aws codebuild create-webhook \
    --project-name "$PROJECT_NAME" \
    --region "$REGION" \
    --filter-groups '[[{"type":"EVENT","pattern":"PUSH"},{"type":"HEAD_REF","pattern":"^refs/heads/main$"}]]' \
    --output json 2>&1)

if [ $? -eq 0 ]; then
    WEBHOOK_URL=$(echo "$WEBHOOK_RESULT" | jq -r '.webhook.url // empty' 2>/dev/null || echo "")
    WEBHOOK_SECRET=$(echo "$WEBHOOK_RESULT" | jq -r '.webhook.secret // empty' 2>/dev/null || echo "")
    
    echo "✅ Webhook created successfully!"
    echo ""
    echo "📋 Webhook Details:"
    if [ -n "$WEBHOOK_URL" ]; then
        echo "   URL: $WEBHOOK_URL"
    fi
    if [ -n "$WEBHOOK_SECRET" ]; then
        echo "   Secret: $WEBHOOK_SECRET"
    fi
    echo ""
    echo "🔗 Next Step: Add webhook to GitHub"
    echo "1. Go to: https://github.com/shinejohn/taskjuggler/settings/hooks"
    echo "2. Click 'Add webhook'"
    if [ -n "$WEBHOOK_URL" ]; then
        echo "3. Payload URL: $WEBHOOK_URL"
    fi
    echo "4. Content type: application/json"
    if [ -n "$WEBHOOK_SECRET" ]; then
        echo "5. Secret: $WEBHOOK_SECRET"
    fi
    echo "6. Events: Just the push event"
    echo "7. Click 'Add webhook'"
    echo ""
    echo "✅ Setup complete! CodeBuild will trigger automatically on push to main branch."
else
    echo "❌ Failed to create webhook"
    echo "$WEBHOOK_RESULT"
    exit 1
fi

