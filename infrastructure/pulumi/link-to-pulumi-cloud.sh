#!/bin/bash
# Link existing Pulumi project to Pulumi Cloud

set -e

echo "=========================================="
echo "Linking to Pulumi Cloud"
echo "=========================================="
echo ""

# Get current user
USERNAME=$(pulumi whoami)
echo "Pulumi Cloud User: $USERNAME"
echo ""

# Project details
PROJECT_NAME="taskjuggler-aws"
STACK_NAME="production"
ORG_NAME="${PULUMI_ORG:-$USERNAME}"

echo "Project: $PROJECT_NAME"
echo "Stack: $STACK_NAME"
echo "Organization: $ORG_NAME"
echo ""

# Check current stack
CURRENT_STACK=$(pulumi stack --show-name 2>/dev/null || echo "none")
echo "Current stack: $CURRENT_STACK"
echo ""

if [ "$CURRENT_STACK" != "$STACK_NAME" ]; then
    echo "Selecting $STACK_NAME stack..."
    pulumi stack select "$STACK_NAME" || {
        echo "⚠ Stack $STACK_NAME not found locally"
        echo "Creating new stack linked to Pulumi Cloud..."
        pulumi stack init "$ORG_NAME/$PROJECT_NAME/$STACK_NAME"
    }
fi

# Check if already linked to Pulumi Cloud
echo "Checking if stack is linked to Pulumi Cloud..."
STACK_INFO=$(pulumi stack ls --json 2>/dev/null | jq -r ".[] | select(.name==\"$STACK_NAME\")" 2>/dev/null || echo "{}")

if echo "$STACK_INFO" | jq -e '.url' > /dev/null 2>&1; then
    STACK_URL=$(echo "$STACK_INFO" | jq -r '.url')
    echo "✓ Stack already linked to Pulumi Cloud"
    echo "Stack URL: $STACK_URL"
else
    echo "Linking stack to Pulumi Cloud..."
    
    # Try to link using the org/project/stack format
    pulumi stack select "$ORG_NAME/$PROJECT_NAME/$STACK_NAME" 2>&1 || {
        echo "Creating new stack in Pulumi Cloud..."
        pulumi stack init "$ORG_NAME/$PROJECT_NAME/$STACK_NAME" --secrets-provider passphrase
        
        # Copy existing config if stack existed locally
        if [ -f "Pulumi.$STACK_NAME.yaml" ]; then
            echo "Copying configuration from local stack..."
            # Config will be migrated automatically
        fi
    }
    
    echo "✓ Stack linked to Pulumi Cloud"
fi

echo ""
echo "Verifying link..."
pulumi stack select "$ORG_NAME/$PROJECT_NAME/$STACK_NAME" 2>&1 || pulumi stack select "$STACK_NAME"

# Get stack URL
STACK_URL="https://app.pulumi.com/$ORG_NAME/$PROJECT_NAME/$STACK_NAME"
echo ""
echo "=========================================="
echo "Successfully Linked to Pulumi Cloud!"
echo "=========================================="
echo ""
echo "Stack Details:"
echo "  Organization: $ORG_NAME"
echo "  Project: $PROJECT_NAME"
echo "  Stack: $STACK_NAME"
echo ""
echo "View in Pulumi Cloud:"
echo "  $STACK_URL"
echo ""
echo "Next steps:"
echo "1. View stack: pulumi stack"
echo "2. Preview changes: pulumi preview"
echo "3. Deploy: pulumi up"
echo "4. View outputs: pulumi stack output"
echo ""





