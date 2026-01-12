#!/bin/bash
# Complete deployment script for Pulumi Cloud

set -e

cd "$(dirname "$0")"

# Activate virtual environment
if [ -d "venv" ]; then
    source venv/bin/activate
fi

echo "=========================================="
echo "Deploying TaskJuggler to Pulumi Cloud"
echo "=========================================="
echo ""

# Verify stack
STACK=$(pulumi stack --show-name)
echo "Stack: $STACK"
echo ""

# Preview first
echo "Previewing changes..."
pulumi preview --non-interactive 2>&1 | tail -20
echo ""

# Deploy
echo "Deploying infrastructure..."
pulumi up --yes --non-interactive

echo ""
echo "Deployment complete!"
echo ""
echo "View in Pulumi Cloud:"
pulumi stack ls --json | jq -r ".[] | select(.name==\"$STACK\") | .url"





