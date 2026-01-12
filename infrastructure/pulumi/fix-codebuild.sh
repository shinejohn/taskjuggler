#!/bin/bash
# Fix CodeBuild configuration to use S3 source and proper buildspec

set -e

AWS_REGION="us-east-1"
PROJECT_NAME="taskjuggler"
ENVIRONMENT="production"
BUILD_PROJECT_NAME="$PROJECT_NAME-$ENVIRONMENT-build"
S3_BUCKET="taskjuggler-build-source"

echo "=========================================="
echo "Fixing CodeBuild Configuration"
echo "=========================================="
echo ""

# Check if S3 bucket exists, create if not
echo "Step 1: Checking S3 bucket..."
if ! aws s3 ls "s3://$S3_BUCKET" 2>/dev/null; then
    echo "Creating S3 bucket: $S3_BUCKET"
    aws s3 mb "s3://$S3_BUCKET" --region $AWS_REGION
    echo "✓ Bucket created"
else
    echo "✓ Bucket exists"
fi

# Upload source code to S3
echo ""
echo "Step 2: Uploading source code to S3..."
cd /Users/johnshine/Dropbox/Fibonacco/taskjuggler/Code

# Create temporary directory for source
TEMP_DIR=$(mktemp -d)
echo "Creating source archive..."

# Copy taskjuggler-api directory
cp -r taskjuggler-api "$TEMP_DIR/"

# Create tar.gz archive
cd "$TEMP_DIR"
tar -czf source.tar.gz taskjuggler-api/

# Upload to S3
aws s3 cp source.tar.gz "s3://$S3_BUCKET/source.tar.gz" --region $AWS_REGION
echo "✓ Source uploaded to S3"

# Cleanup
rm -rf "$TEMP_DIR"

# Update CodeBuild project to use GitHub source
echo ""
echo "Step 3: Updating CodeBuild project to use GitHub..."

# Check for GitHub token
GITHUB_OWNER="${GITHUB_OWNER:-shinejohn}"
GITHUB_REPO="${GITHUB_REPO:-taskjuggler}"
GITHUB_BRANCH="${GITHUB_BRANCH:-main}"

if [ -z "$GITHUB_TOKEN" ]; then
    echo "⚠ GITHUB_TOKEN not set"
    echo ""
    echo "To use GitHub integration:"
    echo "1. Create GitHub Personal Access Token at: https://github.com/settings/tokens"
    echo "2. Export: export GITHUB_TOKEN=your_token_here"
    echo "3. Or store in Secrets Manager:"
    echo "   aws secretsmanager create-secret \\"
    echo "     --name taskjuggler/github/token \\"
    echo "     --secret-string your_token_here \\"
    echo "     --region $AWS_REGION"
    echo ""
    echo "For now, updating to use S3 source (manual upload method)..."
    
    # Use S3 source as fallback
    BUILDSPEC_PATH="/Users/johnshine/Dropbox/Fibonacco/taskjuggler/Code/taskjuggler-api/buildspec.yml"
    
    # Update CodeBuild project with S3 source
    aws codebuild update-project \
        --name "$BUILD_PROJECT_NAME" \
        --region $AWS_REGION \
        --source "type=S3,location=$S3_BUCKET/source.tar.gz" \
        --source-version "source.tar.gz" \
        --buildspec "file://$BUILDSPEC_PATH" \
        --query 'project.name' \
        --output text
    
    echo "✓ CodeBuild project updated (S3 source)"
else
    echo "Using GitHub integration..."
    
    # Store token in Secrets Manager if not already there
    SECRET_NAME="taskjuggler/github/token"
    if ! aws secretsmanager describe-secret --secret-id "$SECRET_NAME" --region $AWS_REGION &>/dev/null; then
        echo "Storing GitHub token..."
        aws secretsmanager create-secret \
            --name "$SECRET_NAME" \
            --secret-string "$GITHUB_TOKEN" \
            --region $AWS_REGION \
            --description "GitHub Personal Access Token for CodeBuild" \
            > /dev/null
    fi
    
    # Update CodeBuild to use GitHub
    BUILDSPEC_PATH="taskjuggler-api/buildspec.yml"
    
    aws codebuild update-project \
        --name "$BUILD_PROJECT_NAME" \
        --region $AWS_REGION \
        --source "type=GITHUB,location=https://github.com/$GITHUB_OWNER/$GITHUB_REPO.git,buildspec=$BUILDSPEC_PATH" \
        --source-version "$GITHUB_BRANCH" \
        --query 'project.name' \
        --output text
    
    echo "✓ CodeBuild project updated (GitHub source)"
fi

# Add permissions to CodeBuild role
echo ""
echo "Step 4: Adding permissions to CodeBuild role..."

ROLE_NAME=$(aws codebuild batch-get-projects \
    --names "$BUILD_PROJECT_NAME" \
    --region $AWS_REGION \
    --query 'projects[0].serviceRole' \
    --output text | awk -F'/' '{print $NF}')

if [ -n "$GITHUB_TOKEN" ]; then
    # Add Secrets Manager permissions for GitHub token
    SECRETS_POLICY=$(cat <<EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "secretsmanager:GetSecretValue"
            ],
            "Resource": "arn:aws:secretsmanager:$AWS_REGION:195430954683:secret:taskjuggler/github/token*"
        }
    ]
}
EOF
)
    
    aws iam put-role-policy \
        --role-name "$ROLE_NAME" \
        --policy-name "${PROJECT_NAME}-${ENVIRONMENT}-codebuild-secrets-policy" \
        --policy-document "$SECRETS_POLICY"
    
    echo "✓ Secrets Manager permissions added"
else
    # Add S3 permissions for fallback S3 source
    S3_POLICY=$(cat <<EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "s3:GetObject",
                "s3:GetObjectVersion"
            ],
            "Resource": "arn:aws:s3:::$S3_BUCKET/*"
        },
        {
            "Effect": "Allow",
            "Action": [
                "s3:ListBucket"
            ],
            "Resource": "arn:aws:s3:::$S3_BUCKET"
        }
    ]
}
EOF
)
    
    aws iam put-role-policy \
        --role-name "$ROLE_NAME" \
        --policy-name "${PROJECT_NAME}-${ENVIRONMENT}-codebuild-s3-policy" \
        --policy-document "$S3_POLICY"
    
    echo "✓ S3 permissions added"
fi

echo ""
echo "=========================================="
echo "CodeBuild Configuration Fixed!"
echo "=========================================="
echo ""

if [ -n "$GITHUB_TOKEN" ]; then
    echo "✓ GitHub integration configured"
    echo ""
    echo "Next steps:"
    echo "1. Push code to GitHub:"
    echo "   git push origin $GITHUB_BRANCH"
    echo ""
    echo "2. CodeBuild will automatically trigger on push"
    echo ""
    echo "3. Or manually trigger:"
    echo "   ./trigger-build.sh"
else
    echo "⚠ Using S3 source (manual upload method)"
    echo ""
    echo "To use GitHub integration instead:"
    echo "1. Set GITHUB_TOKEN environment variable"
    echo "2. Run this script again"
    echo ""
    echo "Next steps:"
    echo "1. Run: ./check-build-logs.sh"
    echo "2. Run: ./trigger-build.sh"
fi
echo ""
