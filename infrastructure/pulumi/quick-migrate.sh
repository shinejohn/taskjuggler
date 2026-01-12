#!/bin/bash
# Quick migration script - Interactive version

set -e

echo "=========================================="
echo "Quick Migration to Pulumi Cloud"
echo "=========================================="
echo ""

# Check if logged in
echo "Step 1: Checking Pulumi Cloud login..."
if ! pulumi whoami &>/dev/null; then
    echo "⚠ Not logged in. Please run: pulumi login"
    exit 1
fi

USERNAME=$(pulumi whoami)
BACKEND=$(pulumi whoami --json 2>/dev/null | jq -r '.backendURL' 2>/dev/null || echo "file://")

echo "User: $USERNAME"
echo "Backend: $BACKEND"
echo ""

if [[ "$BACKEND" != *"pulumi.com"* ]] && [[ "$BACKEND" != *"api.pulumi.com"* ]]; then
    echo "⚠ Currently using local backend ($BACKEND)"
    echo ""
    echo "To migrate to Pulumi Cloud, please run:"
    echo "  pulumi login"
    echo ""
    echo "This will open your browser to authenticate with Pulumi Cloud."
    echo "After logging in, run this script again."
    exit 1
fi

echo "✓ Using Pulumi Cloud backend"
echo ""

# Project details
PROJECT_NAME="taskjuggler-aws"
STACK_NAME="production"
ORG_NAME="$USERNAME"

echo "Step 2: Setting up stack..."
echo "Project: $PROJECT_NAME"
echo "Stack: $STACK_NAME"
echo "Organization: $ORG_NAME"
echo ""

# Select or create stack
echo "Step 3: Selecting/creating stack..."

# Try full path first
if pulumi stack select "$ORG_NAME/$PROJECT_NAME/$STACK_NAME" 2>/dev/null; then
    echo "✓ Stack exists: $ORG_NAME/$PROJECT_NAME/$STACK_NAME"
elif pulumi stack select "$STACK_NAME" 2>/dev/null; then
    echo "✓ Stack exists: $STACK_NAME"
    CURRENT_STACK=$(pulumi stack --show-name)
    if [[ "$CURRENT_STACK" != *"/"* ]]; then
        echo "Stack is using default org. To use full path, run:"
        echo "  pulumi stack rename $ORG_NAME/$PROJECT_NAME/$STACK_NAME"
    fi
else
    echo "Creating new stack in Pulumi Cloud..."
    pulumi stack init "$ORG_NAME/$PROJECT_NAME/$STACK_NAME" 2>&1 || {
        echo "Trying without org prefix..."
        pulumi stack init "$STACK_NAME"
    }
    echo "✓ Stack created"
fi

CURRENT_STACK=$(pulumi stack --show-name)
echo "Current stack: $CURRENT_STACK"
echo ""

# Verify configuration
echo "Step 4: Verifying configuration..."
pulumi config get aws:region 2>/dev/null || pulumi config set aws:region us-east-1
pulumi config get project_name 2>/dev/null || pulumi config set project_name taskjuggler
pulumi config get environment 2>/dev/null || pulumi config set environment production
echo "✓ Configuration verified"
echo ""

# Get stack URL
if [[ "$CURRENT_STACK" == *"/"* ]]; then
    ORG=$(echo "$CURRENT_STACK" | cut -d'/' -f1)
    PROJ=$(echo "$CURRENT_STACK" | cut -d'/' -f2)
    STACK=$(echo "$CURRENT_STACK" | cut -d'/' -f3)
    STACK_URL="https://app.pulumi.com/$ORG/$PROJ/$STACK"
else
    STACK_URL="https://app.pulumi.com/$ORG_NAME/$PROJECT_NAME/$STACK_NAME"
fi

echo "=========================================="
echo "Migration Complete!"
echo "=========================================="
echo ""
echo "Stack: $CURRENT_STACK"
echo "View in Pulumi Cloud:"
echo "  $STACK_URL"
echo ""
echo "Next: Run 'pulumi preview' to verify state"
echo ""





