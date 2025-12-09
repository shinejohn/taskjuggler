#!/bin/bash

# Configure Scheduler Service Script
# Run this once the _scheduler service is available in Railway

set -e

echo "🕐 Configuring Scheduler Service"
echo "================================="
echo ""

cd "$(dirname "$0")"

# Check Railway CLI
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI not installed"
    exit 1
fi

# Try to link to scheduler service
echo "🔗 Linking to scheduler service..."

# Try different possible names
SCHEDULER_SERVICE=""
for name in "_scheduler" "scheduler" "ops-scheduler"; do
    if railway service "$name" 2>/dev/null; then
        SCHEDULER_SERVICE="$name"
        echo "✅ Linked to service: $SCHEDULER_SERVICE"
        break
    fi
done

if [ -z "$SCHEDULER_SERVICE" ]; then
    echo "⚠️  Scheduler service not found. Possible reasons:"
    echo "   1. Service is still being provisioned (wait 1-2 minutes)"
    echo "   2. Service has a different name"
    echo ""
    echo "📋 To find the service name:"
    echo "   1. Go to Railway Dashboard: https://railway.app"
    echo "   2. Open 'AI Task Juggler' project"
    echo "   3. Find the scheduler service and note its exact name"
    echo "   4. Run: railway service <exact-name>"
    echo ""
    exit 1
fi

# Set environment variables
echo ""
echo "🔧 Setting environment variables..."

railway variables --set "APP_NAME=Task Juggler"
railway variables --set "APP_ENV=production"
railway variables --set "APP_DEBUG=false"
railway variables --set "APP_KEY=base64:SZGbzKepGX1iCqcluQIDwoa0QidaXLtp7n8qsVWKIFg="
railway variables --set "QUEUE_CONNECTION=redis"
railway variables --set "CACHE_DRIVER=redis"
railway variables --set "SESSION_DRIVER=redis"

echo "✅ Environment variables set"
echo ""

# Verify configuration
echo "📋 Verifying configuration..."
railway status
echo ""

# Test scheduled tasks
echo "🔄 Testing scheduled tasks..."
railway run php artisan schedule:list || {
    echo "⚠️  Could not list scheduled tasks. Service may need to be running first."
}

echo ""
echo "✅ Scheduler service configured!"
echo ""
echo "📚 Next steps:"
echo "   1. Verify start command in Railway dashboard: php artisan schedule:work"
echo "   2. Check logs: railway logs --service $SCHEDULER_SERVICE"
echo "   3. Monitor scheduled tasks: railway run php artisan schedule:list"
