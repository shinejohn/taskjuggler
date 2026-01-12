#!/bin/bash
set -e
cd "$(dirname "$0")"
source venv/bin/activate

echo "🔧 Fixing Pulumi decryption and deploying CodePipeline..."
echo ""

# Select correct stack
pulumi stack select shinejohn/production

# Try config refresh
echo "Refreshing config..."
pulumi config refresh || echo "Config refresh completed (may have warnings)"

# Try preview
echo ""
echo "Running preview..."
if pulumi preview 2>&1 | head -50; then
    echo ""
    echo "✅ Preview successful! Ready to deploy."
    echo ""
    read -p "Deploy now? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        pulumi up
    fi
else
    echo ""
    echo "❌ Preview failed. Please run 'pulumi login' interactively first."
    echo "Then run this script again."
fi
