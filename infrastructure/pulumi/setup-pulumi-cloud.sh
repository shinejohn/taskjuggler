#!/bin/bash
# Setup Pulumi Cloud project for Task Juggler infrastructure

set -e

echo "=========================================="
echo "Setting Up Pulumi Cloud Project"
echo "=========================================="
echo ""

# Check if logged in
echo "Step 1: Checking Pulumi Cloud login..."
if ! pulumi whoami &>/dev/null; then
    echo "⚠ Not logged into Pulumi Cloud"
    echo "Please run: pulumi login"
    exit 1
fi

USERNAME=$(pulumi whoami)
echo "✓ Logged in as: $USERNAME"
echo ""

# Check if project is initialized
echo "Step 2: Checking project initialization..."
if [ ! -f "Pulumi.yaml" ]; then
    echo "⚠ Pulumi.yaml not found. Initializing project..."
    pulumi new python --name taskjuggler-aws --description "Task Juggler AWS Infrastructure" --force
else
    echo "✓ Project already initialized"
fi
echo ""

# Check current stack
echo "Step 3: Checking current stack..."
CURRENT_STACK=$(pulumi stack --show-name 2>/dev/null || echo "none")

if [ "$CURRENT_STACK" = "none" ]; then
    echo "No stack selected. Creating production stack..."
    pulumi stack init production --secrets-provider passphrase
    echo "✓ Production stack created"
else
    echo "Current stack: $CURRENT_STACK"
    echo "✓ Stack exists"
fi
echo ""

# Link to Pulumi Cloud (if not already linked)
echo "Step 4: Linking to Pulumi Cloud..."
PROJECT_NAME="taskjuggler-aws"
ORG_NAME="${PULUMI_ORG:-$USERNAME}"

# Check if already linked
if pulumi stack --show-urn &>/dev/null; then
    STACK_URN=$(pulumi stack --show-urn)
    if [[ "$STACK_URN" == *"pulumi.com"* ]]; then
        echo "✓ Already linked to Pulumi Cloud"
        echo "Stack URL: https://app.pulumi.com/$ORG_NAME/$PROJECT_NAME/$CURRENT_STACK"
    else
        echo "Linking to Pulumi Cloud..."
        pulumi stack select "$ORG_NAME/$PROJECT_NAME/$CURRENT_STACK" || \
        pulumi stack init "$ORG_NAME/$PROJECT_NAME/$CURRENT_STACK"
        echo "✓ Linked to Pulumi Cloud"
    fi
else
    echo "Creating new stack in Pulumi Cloud..."
    pulumi stack init "$ORG_NAME/$PROJECT_NAME/$CURRENT_STACK"
    echo "✓ Stack created in Pulumi Cloud"
fi
echo ""

# Set up backend configuration
echo "Step 5: Configuring backend..."
pulumi config set aws:region us-east-1
pulumi config set project_name taskjuggler
pulumi config set environment production
echo "✓ Backend configured"
echo ""

# Install dependencies
echo "Step 6: Installing Python dependencies..."
if [ -f "requirements.txt" ]; then
    pip install -r requirements.txt
    echo "✓ Dependencies installed"
else
    echo "⚠ requirements.txt not found"
fi
echo ""

# Preview the infrastructure
echo "Step 7: Previewing infrastructure..."
echo "Running: pulumi preview"
echo ""
read -p "Do you want to preview the infrastructure now? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    pulumi preview
fi

echo ""
echo "=========================================="
echo "Pulumi Cloud Setup Complete!"
echo "=========================================="
echo ""
echo "Project: $PROJECT_NAME"
echo "Stack: $CURRENT_STACK"
echo "Organization: $ORG_NAME"
echo ""
echo "View in Pulumi Cloud:"
echo "https://app.pulumi.com/$ORG_NAME/$PROJECT_NAME/$CURRENT_STACK"
echo ""
echo "Next steps:"
echo "1. Review the preview above"
echo "2. Run 'pulumi up' to deploy infrastructure"
echo "3. Monitor deployment in Pulumi Cloud dashboard"
echo ""





