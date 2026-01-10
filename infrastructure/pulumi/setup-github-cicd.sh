#!/bin/bash
# Setup proper GitHub-based CI/CD with CodeBuild/CodePipeline

set -e

AWS_REGION="us-east-1"
PROJECT_NAME="taskjuggler"
ENVIRONMENT="production"
GITHUB_OWNER="${GITHUB_OWNER:-shinejohn}"
GITHUB_REPO="${GITHUB_REPO:-taskjuggler}"
GITHUB_BRANCH="${GITHUB_BRANCH:-main}"

echo "=========================================="
echo "Setting Up GitHub CI/CD Integration"
echo "=========================================="
echo ""
echo "GitHub Repository: $GITHUB_OWNER/$GITHUB_REPO"
echo "Branch: $GITHUB_BRANCH"
echo ""

# Check if GitHub token is set
if [ -z "$GITHUB_TOKEN" ]; then
    echo "⚠ GITHUB_TOKEN not set"
    echo ""
    echo "To set up GitHub integration, you need a GitHub Personal Access Token"
    echo "with 'repo' scope."
    echo ""
    echo "1. Create token at: https://github.com/settings/tokens"
    echo "2. Export it: export GITHUB_TOKEN=your_token_here"
    echo "3. Or store in AWS Secrets Manager:"
    echo "   aws secretsmanager create-secret \\"
    echo "     --name taskjuggler/github/token \\"
    echo "     --secret-string your_token_here \\"
    echo "     --region $AWS_REGION"
    echo ""
    read -p "Do you want to continue with manual GitHub connection setup? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Option 1: Update CodeBuild to use GitHub source directly
echo "Option 1: Updating CodeBuild to use GitHub source..."
echo ""

BUILD_PROJECT_NAME="$PROJECT_NAME-$ENVIRONMENT-build"

# Check current source type
CURRENT_SOURCE=$(aws codebuild batch-get-projects \
    --names "$BUILD_PROJECT_NAME" \
    --region $AWS_REGION \
    --query 'projects[0].source.type' \
    --output text 2>/dev/null || echo "NOT_FOUND")

if [ "$CURRENT_SOURCE" = "NOT_FOUND" ]; then
    echo "✗ CodeBuild project not found"
    echo "Please deploy infrastructure first with Pulumi"
    exit 1
fi

echo "Current source type: $CURRENT_SOURCE"
echo ""

if [ "$CURRENT_SOURCE" != "GITHUB" ]; then
    echo "Updating CodeBuild to use GitHub source..."
    
    if [ -n "$GITHUB_TOKEN" ]; then
        # Store token in Secrets Manager if not already there
        SECRET_NAME="taskjuggler/github/token"
        
        if ! aws secretsmanager describe-secret --secret-id "$SECRET_NAME" --region $AWS_REGION &>/dev/null; then
            echo "Storing GitHub token in Secrets Manager..."
            aws secretsmanager create-secret \
                --name "$SECRET_NAME" \
                --secret-string "$GITHUB_TOKEN" \
                --region $AWS_REGION \
                --description "GitHub Personal Access Token for CodeBuild" \
                > /dev/null
            echo "✓ Token stored"
        else
            echo "Updating GitHub token..."
            aws secretsmanager update-secret \
                --secret-id "$SECRET_NAME" \
                --secret-string "$GITHUB_TOKEN" \
                --region $AWS_REGION \
                > /dev/null
            echo "✓ Token updated"
        fi
        
        # Get secret ARN
        SECRET_ARN=$(aws secretsmanager describe-secret \
            --secret-id "$SECRET_NAME" \
            --region $AWS_REGION \
            --query 'ARN' \
            --output text)
        
        # Update CodeBuild project
        echo "Updating CodeBuild project..."
        aws codebuild update-project \
            --name "$BUILD_PROJECT_NAME" \
            --region $AWS_REGION \
            --source "type=GITHUB,location=https://github.com/$GITHUB_OWNER/$GITHUB_REPO.git,buildspec=taskjuggler-api/buildspec.yml" \
            --source-version "$GITHUB_BRANCH" \
            --query 'project.name' \
            --output text
        
        echo "✓ CodeBuild updated to use GitHub"
    else
        echo "⚠ GITHUB_TOKEN not set - using manual connection setup"
        echo ""
        echo "To set up GitHub connection manually:"
        echo "1. Go to AWS Console > CodeBuild > Settings > Connections"
        echo "2. Create GitHub connection"
        echo "3. Authorize AWS to access GitHub"
        echo "4. Update CodeBuild project to use connection"
        echo ""
        echo "Or set GITHUB_TOKEN and run this script again"
        exit 1
    fi
else
    echo "✓ CodeBuild already configured for GitHub"
fi

echo ""

# Create webhook for automatic builds
echo "Step 2: Setting up GitHub webhook..."
echo ""

# Get webhook URL from CodeBuild
WEBHOOK_INFO=$(aws codebuild batch-get-projects \
    --names "$BUILD_PROJECT_NAME" \
    --region $AWS_REGION \
    --query 'projects[0].{Webhook:webhook.url,Payload:webhook.payloadUrl,Secret:webhook.secret}' \
    --output json 2>/dev/null || echo "{}")

if echo "$WEBHOOK_INFO" | jq -e '.Webhook' > /dev/null 2>&1; then
    WEBHOOK_URL=$(echo "$WEBHOOK_INFO" | jq -r '.Webhook')
    PAYLOAD_URL=$(echo "$WEBHOOK_INFO" | jq -r '.Payload')
    SECRET=$(echo "$WEBHOOK_INFO" | jq -r '.Secret')
    
    echo "Webhook URL: $WEBHOOK_URL"
    echo ""
    echo "To set up GitHub webhook:"
    echo "1. Go to: https://github.com/$GITHUB_OWNER/$GITHUB_REPO/settings/hooks"
    echo "2. Click 'Add webhook'"
    echo "3. Payload URL: $PAYLOAD_URL"
    echo "4. Content type: application/json"
    echo "5. Secret: $SECRET"
    echo "6. Events: Just the push event"
    echo "7. Active: checked"
    echo "8. Click 'Add webhook'"
    echo ""
    
    if [ -n "$GITHUB_TOKEN" ]; then
        echo "Attempting to create webhook via GitHub API..."
        
        # Create webhook via GitHub API
        WEBHOOK_RESPONSE=$(curl -s -X POST \
            -H "Authorization: token $GITHUB_TOKEN" \
            -H "Accept: application/vnd.github.v3+json" \
            "https://api.github.com/repos/$GITHUB_OWNER/$GITHUB_REPO/hooks" \
            -d "{
                \"name\": \"web\",
                \"active\": true,
                \"events\": [\"push\"],
                \"config\": {
                    \"url\": \"$PAYLOAD_URL\",
                    \"content_type\": \"json\",
                    \"secret\": \"$SECRET\",
                    \"insecure_ssl\": \"0\"
                }
            }" 2>/dev/null || echo "{}")
        
        if echo "$WEBHOOK_RESPONSE" | jq -e '.id' > /dev/null 2>&1; then
            echo "✓ Webhook created successfully!"
        else
            echo "⚠ Could not create webhook automatically"
            echo "Please set it up manually using instructions above"
        fi
    fi
else
    echo "⚠ Webhook not configured"
    echo "CodeBuild will need to be configured with webhook support"
fi

echo ""
echo "=========================================="
echo "GitHub CI/CD Setup Complete!"
echo "=========================================="
echo ""
echo "Next steps:"
echo "1. Push code to GitHub:"
echo "   git push origin $GITHUB_BRANCH"
echo ""
echo "2. CodeBuild will automatically trigger on push"
echo ""
echo "3. Monitor builds:"
echo "   aws codebuild list-builds-for-project \\"
echo "     --project-name $BUILD_PROJECT_NAME \\"
echo "     --region $AWS_REGION"
echo ""
echo "4. View logs:"
echo "   ./check-build-logs.sh"
echo ""
