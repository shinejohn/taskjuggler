#!/bin/bash
# Railway Service Configuration Script
# Attempts to configure services via Railway CLI/API

set -e

echo "🔧 Railway Service Configuration Script"
echo "========================================"
echo ""

# Check Railway CLI
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI not found"
    exit 1
fi

# Check login
if ! railway whoami &> /dev/null; then
    echo "❌ Not logged in. Run: railway login"
    exit 1
fi

echo "✅ Railway CLI ready"
echo ""

# Service names as they appear in Railway dashboard
SERVICES=(
    "taskjuggler-web"
    "Idea Circuit"
    "Official Notice"
    "Site Health"
    "URPA"
    "4projects"
    "4calls"
    "4process"
)

echo "📋 Services to configure:"
for service in "${SERVICES[@]}"; do
    echo "   - $service"
done
echo ""

echo "⚠️  IMPORTANT: Railway CLI does not support setting root directory directly."
echo "   Root directory MUST be set in Railway dashboard."
echo ""
echo "📝 To configure root directory:"
echo "   1. Open: https://railway.app"
echo "   2. Navigate to project: Shine Dev Environment"
echo "   3. For each service above:"
echo "      - Click on service"
echo "      - Go to Settings → Source"
echo "      - Set Root Directory to: /"
echo "      - Save"
echo ""

# Try to get service list (may require interactive selection)
echo "🔍 Attempting to list services..."
echo ""

# Note: Railway CLI service commands require interactive selection
# We can't automate root directory setting, but we can prepare for redeploy

echo "💡 After setting root directory in dashboard, you can trigger rebuilds:"
echo ""
echo "   For each service:"
echo "   1. railway service <service-name>"
echo "   2. railway redeploy"
echo ""
echo "   Or use Railway dashboard to trigger redeploy"
echo ""

echo "✅ Configuration script ready"
echo ""
echo "Next steps:"
echo "1. Set root directory in Railway dashboard (see RAILWAY_DASHBOARD_CONFIGURATION_GUIDE.md)"
echo "2. After configuration, rebuild services"
echo "3. Verify all builds succeed"
