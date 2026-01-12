#!/bin/bash
# Install TaskJuggler to Pulumi Cloud

set -e

echo "=========================================="
echo "Installing TaskJuggler to Pulumi Cloud"
echo "=========================================="
echo ""

cd "$(dirname "$0")"

# Verify CLI
echo "Step 1: Verifying Pulumi CLI..."
VERSION=$(pulumi version)
echo "✓ Pulumi CLI: $VERSION"
echo ""

# Check login
echo "Step 2: Checking login..."
USERNAME=$(pulumi whoami)
echo "✓ User: $USERNAME"
echo ""

# Check backend
BACKEND=$(pulumi whoami --json 2>/dev/null | jq -r '.backendURL' 2>/dev/null || echo "file://")
echo "Backend: $BACKEND"
echo ""

if [[ "$BACKEND" != *"pulumi.com"* ]]; then
    echo "⚠ Need to login to Pulumi Cloud"
    echo ""
    echo "Please run one of these:"
    echo ""
    echo "Option 1: Interactive login (opens browser)"
    echo "  pulumi login https://api.pulumi.com"
    echo ""
    echo "Option 2: Using access token"
    echo "  export PULUMI_ACCESS_TOKEN=your_token"
    echo "  pulumi login https://api.pulumi.com"
    echo ""
    echo "Get token from: https://app.pulumi.com/account/tokens"
    echo ""
    exit 1
fi

echo "✓ Using Pulumi Cloud"
echo ""

# Create stack
PROJECT="TaskJuggler"
STACK="production"
FULL_STACK="$USERNAME/$PROJECT/$STACK"

echo "Step 3: Creating stack..."
echo "Stack: $FULL_STACK"
echo ""

if pulumi stack select "$FULL_STACK" 2>/dev/null; then
    echo "✓ Stack exists"
else
    pulumi stack init "$FULL_STACK" || pulumi stack init "$STACK"
    pulumi stack select "$FULL_STACK" 2>/dev/null || pulumi stack select "$STACK"
fi

CURRENT=$(pulumi stack --show-name)
echo "Current: $CURRENT"
echo ""

# Config
echo "Step 4: Setting config..."
pulumi config set aws:region us-east-1 2>/dev/null || true
echo "✓ Config set"
echo ""

# URL
if [[ "$CURRENT" == *"/"* ]]; then
    ORG=$(echo "$CURRENT" | cut -d'/' -f1)
    PROJ=$(echo "$CURRENT" | cut -d'/' -f2)
    STK=$(echo "$CURRENT" | cut -d'/' -f3)
    URL="https://app.pulumi.com/$ORG/$PROJ/$STK"
else
    URL="https://app.pulumi.com/$USERNAME/$PROJECT/$STACK"
fi

echo "=========================================="
echo "Complete!"
echo "=========================================="
echo ""
echo "Stack: $CURRENT"
echo "URL: $URL"
echo ""
echo "Next: pulumi preview && pulumi up"
echo ""





