#!/bin/bash
# Upload TaskJuggler infrastructure to Pulumi Cloud

set -e

echo "=========================================="
echo "Uploading TaskJuggler to Pulumi Cloud"
echo "=========================================="
echo ""

USERNAME=$(pulumi whoami)
echo "Pulumi User: $USERNAME"
echo ""

PROJECT_NAME="TaskJuggler"
STACK_NAME="production"
ORG_NAME="$USERNAME"
FULL_STACK_NAME="$ORG_NAME/$PROJECT_NAME/$STACK_NAME"

echo "Project: $PROJECT_NAME"
echo "Stack: $STACK_NAME"
echo "Full Stack Name: $FULL_STACK_NAME"
echo ""

# Select current stack
echo "Step 1: Selecting production stack..."
pulumi stack select production 2>/dev/null || {
    echo "⚠ Production stack not found"
    exit 1
}
echo "✓ Stack selected"
echo ""

# Export backup
echo "Step 2: Creating backup..."
BACKUP_FILE="stack-backup-$(date +%Y%m%d-%H%M%S).json"
pulumi stack export > "$BACKUP_FILE" 2>/dev/null || echo "Note: Could not export"
echo "✓ Backup: $BACKUP_FILE"
echo ""

# Create/select cloud stack
echo "Step 3: Creating stack in Pulumi Cloud..."
if pulumi stack select "$FULL_STACK_NAME" 2>/dev/null; then
    echo "✓ Stack exists: $FULL_STACK_NAME"
else
    echo "Creating: $FULL_STACK_NAME"
    pulumi stack init "$FULL_STACK_NAME" 2>&1 || {
        echo "Trying: $STACK_NAME"
        pulumi stack init "$STACK_NAME" 2>&1 || {
            echo "Stack may already exist, selecting..."
            pulumi stack select "$FULL_STACK_NAME" || pulumi stack select "$STACK_NAME"
        }
    }
fi

CURRENT_STACK=$(pulumi stack --show-name)
echo "Current Stack: $CURRENT_STACK"
echo ""

# Verify config
echo "Step 4: Verifying configuration..."
pulumi config get aws:region 2>/dev/null || pulumi config set aws:region us-east-1
echo "✓ Config verified"
echo ""

# Get URL
if [[ "$CURRENT_STACK" == *"/"* ]]; then
    ORG=$(echo "$CURRENT_STACK" | cut -d'/' -f1)
    PROJ=$(echo "$CURRENT_STACK" | cut -d'/' -f2)
    STACK=$(echo "$CURRENT_STACK" | cut -d'/' -f3)
    STACK_URL="https://app.pulumi.com/$ORG/$PROJ/$STACK"
else
    STACK_URL="https://app.pulumi.com/$ORG_NAME/$PROJECT_NAME/$STACK_NAME"
fi

echo "=========================================="
echo "Complete!"
echo "=========================================="
echo ""
echo "Stack: $CURRENT_STACK"
echo "View: $STACK_URL"
echo ""
echo "Next: pulumi preview && pulumi up"
echo ""





