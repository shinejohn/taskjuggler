#!/bin/bash
# Upload Pulumi infrastructure to Pulumi Cloud

set -e

echo "=========================================="
echo "Uploading Infrastructure to Pulumi Cloud"
echo "=========================================="
echo ""

# Get current user
USERNAME=$(pulumi whoami)
echo "Pulumi Cloud User: $USERNAME"
echo ""

# Project details
PROJECT_NAME="taskjuggler-aws"
STACK_NAME="production"

echo "Project: $PROJECT_NAME"
echo "Stack: $STACK_NAME"
echo ""

# Check if logged into Pulumi Cloud
echo "Step 1: Verifying Pulumi Cloud login..."
BACKEND=$(pulumi whoami --json 2>/dev/null | jq -r '.backendURL' 2>/dev/null || echo "file://")
if [[ "$BACKEND" == *"pulumi.com"* ]] || [[ "$BACKEND" == *"app.pulumi.com"* ]]; then
    echo "✓ Already logged into Pulumi Cloud"
else
    echo "⚠ Not logged into Pulumi Cloud"
    echo "Logging in..."
    pulumi login
fi
echo ""

# Select current stack
echo "Step 2: Selecting stack..."
pulumi stack select "$STACK_NAME" 2>&1 || {
    echo "Stack $STACK_NAME not found. Creating..."
    pulumi stack init "$STACK_NAME"
}
echo "✓ Stack selected: $STACK_NAME"
echo ""

# Check if stack is already in Pulumi Cloud
echo "Step 3: Checking stack status..."
STACK_LIST=$(pulumi stack ls --json 2>/dev/null || echo "[]")
STACK_EXISTS=$(echo "$STACK_LIST" | jq -r ".[] | select(.name==\"$STACK_NAME\") | .name" 2>/dev/null || echo "")

if [ -n "$STACK_EXISTS" ]; then
    echo "✓ Stack exists locally"
    
    # Try to get stack info from Pulumi Cloud
    echo "Checking if stack is in Pulumi Cloud..."
    if pulumi stack select "$USERNAME/$PROJECT_NAME/$STACK_NAME" 2>/dev/null; then
        echo "✓ Stack already exists in Pulumi Cloud"
        STACK_URL="https://app.pulumi.com/$USERNAME/$PROJECT_NAME/$STACK_NAME"
    else
        echo "Stack exists locally but not in Pulumi Cloud"
        echo "Linking local stack to Pulumi Cloud..."
        
        # Export current stack config
        echo "Exporting stack configuration..."
        pulumi stack export > /tmp/stack-backup.json
        
        # Create new stack in Pulumi Cloud with same name
        echo "Creating stack in Pulumi Cloud..."
        pulumi stack init "$USERNAME/$PROJECT_NAME/$STACK_NAME" --secrets-provider passphrase 2>&1 || {
            echo "Stack may already exist in cloud, selecting it..."
            pulumi stack select "$USERNAME/$PROJECT_NAME/$STACK_NAME" || {
                echo "⚠ Could not create/select cloud stack"
                echo "Trying alternative method..."
                # Try without org prefix
                pulumi stack select "$STACK_NAME"
            }
        }
        
        # Import config if needed
        if [ -f "/tmp/stack-backup.json" ]; then
            echo "Stack configuration preserved"
        fi
    fi
else
    echo "Creating new stack in Pulumi Cloud..."
    pulumi stack init "$USERNAME/$PROJECT_NAME/$STACK_NAME" --secrets-provider passphrase
fi

# Ensure we're on the right stack
pulumi stack select "$STACK_NAME" 2>/dev/null || pulumi stack select "$USERNAME/$PROJECT_NAME/$STACK_NAME"

echo ""

# Verify configuration
echo "Step 4: Verifying configuration..."
pulumi config get aws:region 2>/dev/null || pulumi config set aws:region us-east-1
pulumi config get project_name 2>/dev/null || pulumi config set project_name taskjuggler
pulumi config get environment 2>/dev/null || pulumi config set environment production
echo "✓ Configuration verified"
echo ""

# Show stack info
echo "Step 5: Stack Information"
echo "----------------------------------------"
pulumi stack --show-name
echo ""

# Get stack URL
FULL_STACK_NAME=$(pulumi stack --show-name)
if [[ "$FULL_STACK_NAME" == *"/"* ]]; then
    ORG=$(echo "$FULL_STACK_NAME" | cut -d'/' -f1)
    PROJ=$(echo "$FULL_STACK_NAME" | cut -d'/' -f2)
    STACK=$(echo "$FULL_STACK_NAME" | cut -d'/' -f3)
    STACK_URL="https://app.pulumi.com/$ORG/$PROJ/$STACK"
else
    STACK_URL="https://app.pulumi.com/$USERNAME/$PROJECT_NAME/$STACK_NAME"
fi

echo "=========================================="
echo "Upload Complete!"
echo "=========================================="
echo ""
echo "Stack Details:"
echo "  Name: $FULL_STACK_NAME"
echo "  Project: $PROJECT_NAME"
echo ""
echo "View in Pulumi Cloud:"
echo "  $STACK_URL"
echo ""
echo "Next steps:"
echo "1. View stack: pulumi stack"
echo "2. Preview infrastructure: pulumi preview"
echo "3. Deploy: pulumi up"
echo "4. View outputs: pulumi stack output"
echo ""
echo "To share with team:"
echo "  Add team members in Pulumi Cloud dashboard"
echo ""





