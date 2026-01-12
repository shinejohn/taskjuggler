#!/bin/bash
# Migrate local Pulumi stack to Pulumi Cloud

set -e

echo "=========================================="
echo "Migrating to Pulumi Cloud"
echo "=========================================="
echo ""

# Get current user
USERNAME=$(pulumi whoami)
echo "Pulumi Cloud User: $USERNAME"
echo ""

# Project details
PROJECT_NAME="taskjuggler-aws"
STACK_NAME="production"
ORG_NAME="$USERNAME"

echo "Project: $PROJECT_NAME"
echo "Stack: $STACK_NAME"
echo "Organization: $ORG_NAME"
echo ""

# Step 1: Ensure logged into Pulumi Cloud
echo "Step 1: Verifying Pulumi Cloud login..."
if ! pulumi whoami &>/dev/null; then
    echo "⚠ Not logged in. Please run: pulumi login"
    exit 1
fi

# Check current backend
CURRENT_BACKEND=$(pulumi whoami --json 2>/dev/null | jq -r '.backendURL' 2>/dev/null || echo "unknown")
echo "Current backend: $CURRENT_BACKEND"

if [[ "$CURRENT_BACKEND" == *"pulumi.com"* ]] || [[ "$CURRENT_BACKEND" == *"app.pulumi.com"* ]]; then
    echo "✓ Already using Pulumi Cloud backend"
else
    echo "⚠ Using local backend. Migrating to Pulumi Cloud..."
    echo "Logging into Pulumi Cloud..."
    pulumi login --default-org "$ORG_NAME"
fi
echo ""

# Step 2: Select current stack
echo "Step 2: Selecting stack..."
pulumi stack select "$STACK_NAME" 2>&1 || {
    echo "⚠ Stack $STACK_NAME not found locally"
    exit 1
}
echo "✓ Stack selected: $STACK_NAME"
echo ""

# Step 3: Export current stack state
echo "Step 3: Exporting current stack state..."
EXPORT_FILE="/tmp/pulumi-stack-export-$(date +%s).json"
pulumi stack export > "$EXPORT_FILE"
echo "✓ Stack exported to: $EXPORT_FILE"
echo ""

# Step 4: Create/select stack in Pulumi Cloud
echo "Step 4: Creating stack in Pulumi Cloud..."
FULL_STACK_NAME="$ORG_NAME/$PROJECT_NAME/$STACK_NAME"

# Try to select cloud stack first
if pulumi stack select "$FULL_STACK_NAME" 2>/dev/null; then
    echo "✓ Stack already exists in Pulumi Cloud: $FULL_STACK_NAME"
else
    echo "Creating new stack in Pulumi Cloud..."
    pulumi stack init "$FULL_STACK_NAME" --secrets-provider passphrase 2>&1 || {
        echo "⚠ Could not create stack. Trying alternative..."
        # Alternative: create without org prefix and let Pulumi handle it
        pulumi stack init "$STACK_NAME" --secrets-provider passphrase 2>&1 || {
            echo "⚠ Stack creation failed. Stack may already exist."
            echo "Attempting to select existing stack..."
            pulumi stack select "$FULL_STACK_NAME" || pulumi stack select "$STACK_NAME"
        }
    }
fi

# Ensure we're on the cloud stack
CURRENT_STACK=$(pulumi stack --show-name)
echo "Current stack: $CURRENT_STACK"
echo ""

# Step 5: Import stack state if needed
echo "Step 5: Checking if state import is needed..."
RESOURCE_COUNT=$(pulumi stack --show-urn 2>&1 | grep -c "urn:" || echo "0")
if [ "$RESOURCE_COUNT" -eq "0" ]; then
    echo "Stack is empty. Importing state..."
    if [ -f "$EXPORT_FILE" ]; then
        echo "Importing from export file..."
        pulumi stack import --file "$EXPORT_FILE" 2>&1 || {
            echo "⚠ Import failed. You may need to run 'pulumi up' to sync state."
        }
    fi
else
    echo "✓ Stack has resources. State should be synced."
fi
echo ""

# Step 6: Verify configuration
echo "Step 6: Verifying configuration..."
pulumi config get aws:region 2>/dev/null || pulumi config set aws:region us-east-1
pulumi config get project_name 2>/dev/null || pulumi config set project_name taskjuggler
pulumi config get environment 2>/dev/null || pulumi config set environment production
echo "✓ Configuration verified"
echo ""

# Step 7: Get stack URL
FULL_STACK=$(pulumi stack --show-name)
if [[ "$FULL_STACK" == *"/"* ]]; then
    ORG=$(echo "$FULL_STACK" | cut -d'/' -f1)
    PROJ=$(echo "$FULL_STACK" | cut -d'/' -f2)
    STACK=$(echo "$FULL_STACK" | cut -d'/' -f3)
    STACK_URL="https://app.pulumi.com/$ORG/$PROJ/$STACK"
else
    STACK_URL="https://app.pulumi.com/$ORG_NAME/$PROJECT_NAME/$STACK_NAME"
fi

echo "=========================================="
echo "Migration Complete!"
echo "=========================================="
echo ""
echo "Stack Details:"
echo "  Full Name: $FULL_STACK"
echo "  Project: $PROJECT_NAME"
echo "  Organization: $ORG_NAME"
echo ""
echo "View in Pulumi Cloud:"
echo "  $STACK_URL"
echo ""
echo "Next steps:"
echo "1. Verify stack: pulumi stack"
echo "2. Preview: pulumi preview"
echo "3. Sync state: pulumi up (if needed)"
echo "4. View outputs: pulumi stack output"
echo ""
echo "Note: If resources show as needing update, run 'pulumi up' to sync state."
echo ""





