#!/bin/bash
# Migrate Pulumi stack to Pulumi Cloud

echo "=========================================="
echo "Migrating to Pulumi Cloud"
echo "=========================================="
echo ""

USERNAME=$(pulumi whoami)
echo "User: $USERNAME"
echo ""

# Check if logged into cloud
BACKEND=$(pulumi whoami --json 2>/dev/null | jq -r '.backendURL' 2>/dev/null || echo "file://")
if [[ "$BACKEND" != *"pulumi.com"* ]]; then
    echo "⚠ Not logged into Pulumi Cloud"
    echo "Please run: pulumi login"
    echo "Then run this script again"
    exit 1
fi

echo "✓ Logged into Pulumi Cloud"
echo ""

# Create/select stack
STACK_NAME="johnshine/taskjuggler-aws/production"
echo "Creating/selecting stack: $STACK_NAME"

if pulumi stack select "$STACK_NAME" 2>/dev/null; then
    echo "✓ Stack exists"
else
    echo "Creating stack..."
    pulumi stack init "$STACK_NAME" || pulumi stack init production
    pulumi stack select "$STACK_NAME" 2>/dev/null || pulumi stack select production
fi

echo ""
echo "Stack: $(pulumi stack --show-name)"
echo ""
echo "View at: https://app.pulumi.com/$STACK_NAME"
echo ""
echo "Next: Run 'pulumi up' to sync state"
