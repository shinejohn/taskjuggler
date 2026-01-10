#!/bin/bash
# Setup TaskJuggler project in Pulumi Cloud

set -e

echo "=========================================="
echo "Setting up TaskJuggler in Pulumi Cloud"
echo "=========================================="
echo ""

cd "$(dirname "$0")"

USERNAME=$(pulumi whoami)
echo "User: $USERNAME"
echo ""

# Check backend
BACKEND=$(pulumi whoami --json 2>/dev/null | jq -r '.backendURL' 2>/dev/null || echo "file://")
echo "Current Backend: $BACKEND"
echo ""

if [[ "$BACKEND" != *"pulumi.com"* ]] && [[ "$BACKEND" != *"api.pulumi.com"* ]]; then
    echo "⚠ Currently using local backend"
    echo ""
    echo "To upload to Pulumi Cloud, please login first:"
    echo ""
    echo "Option 1: Using access token"
    echo "  export PULUMI_ACCESS_TOKEN=your_token"
    echo "  pulumi login https://api.pulumi.com"
    echo ""
    echo "Option 2: Interactive login"
    echo "  pulumi login https://api.pulumi.com"
    echo ""
    echo "Then run this script again."
    exit 1
fi

echo "✓ Using Pulumi Cloud backend"
echo ""

PROJECT_NAME="TaskJuggler"
STACK_NAME="production"
FULL_STACK="$USERNAME/$PROJECT_NAME/$STACK_NAME"

echo "Project: $PROJECT_NAME"
echo "Stack: $STACK_NAME"
echo "Full Stack: $FULL_STACK"
echo ""

# Create/select stack
echo "Creating/selecting stack..."
if pulumi stack select "$FULL_STACK" 2>/dev/null; then
    echo "✓ Stack exists: $FULL_STACK"
else
    echo "Creating stack: $FULL_STACK"
    pulumi stack init "$FULL_STACK" || {
        echo "Trying alternative format..."
        pulumi stack init "$STACK_NAME"
        pulumi stack select "$STACK_NAME"
    }
fi

CURRENT_STACK=$(pulumi stack --show-name)
echo "Current Stack: $CURRENT_STACK"
echo ""

# Set config
echo "Setting configuration..."
pulumi config set aws:region us-east-1 2>/dev/null || true
pulumi config set project_name taskjuggler 2>/dev/null || true
pulumi config set environment production 2>/dev/null || true
echo "✓ Configuration set"
echo ""

# Get URL
if [[ "$CURRENT_STACK" == *"/"* ]]; then
    ORG=$(echo "$CURRENT_STACK" | cut -d'/' -f1)
    PROJ=$(echo "$CURRENT_STACK" | cut -d'/' -f2)
    STACK=$(echo "$CURRENT_STACK" | cut -d'/' -f3)
    STACK_URL="https://app.pulumi.com/$ORG/$PROJ/$STACK"
else
    STACK_URL="https://app.pulumi.com/$USERNAME/$PROJECT_NAME/$STACK_NAME"
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





