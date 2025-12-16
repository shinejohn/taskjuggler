#!/bin/bash

# Add Valkey (Redis-compatible) Service to Railway
# This script adds a Valkey service and links it to your main service

set -e

echo "🔴 Adding Valkey Service to Railway"
echo "==================================="
echo ""

# Check if railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI not found. Install it with:"
    echo "   npm i -g @railway/cli"
    exit 1
fi

# Check if logged in
if ! railway whoami &> /dev/null; then
    echo "❌ Not logged in to Railway. Run:"
    echo "   railway login"
    exit 1
fi

# Check if project is linked
if ! railway status &> /dev/null; then
    echo "❌ Project not linked. Run:"
    echo "   railway link"
    exit 1
fi

echo "✅ Railway CLI ready"
echo ""

# Try to add Valkey service
echo "📦 Adding Valkey service..."
echo ""

# Railway supports both 'redis' and 'valkey' as database types
# Try valkey first, fall back to redis if valkey isn't available
if railway add --database valkey 2>&1 | tee /tmp/railway-output.log | grep -q "already exists\|Service added\|Database\|Valkey"; then
    echo "✅ Valkey service added or already exists"
    VALKEY_ADDED=true
elif railway add --database redis 2>&1 | tee /tmp/railway-output.log | grep -q "already exists\|Service added\|Database\|Redis"; then
    echo "✅ Redis service added (Valkey-compatible)"
    VALKEY_ADDED=true
else
    echo "⚠️  Could not add Valkey/Redis service automatically"
    echo ""
    echo "📋 Manual Steps:"
    echo "1. Go to Railway Dashboard: https://railway.app"
    echo "2. Open your project"
    echo "3. Click 'New' → 'Database'"
    echo "4. Select 'Valkey' (or 'Redis' if Valkey not available)"
    echo "5. Railway will automatically create and link the service"
    VALKEY_ADDED=false
fi

echo ""

if [ "$VALKEY_ADDED" = true ]; then
    echo "🔗 Linking Valkey service to main service..."
    echo ""
    echo "📋 Next Steps (via Railway Dashboard):"
    echo ""
    echo "1. Go to Railway Dashboard: https://railway.app"
    echo "2. Open your 'taskjuggler' service (main application)"
    echo "3. Go to 'Variables' tab"
    echo "4. Click 'Add Reference' or 'New Variable' → 'Add from Service'"
    echo "5. Select your Valkey/Redis service"
    echo "6. Railway will automatically set REDIS_URL"
    echo ""
    echo "7. Remove any manual Redis settings (if they exist):"
    echo "   - Delete REDIS_HOST (if set to valkey.railway.internal)"
    echo "   - Delete REDIS_PORT"
    echo "   - Delete REDIS_PASSWORD"
    echo ""
    echo "8. Verify REDIS_URL is set:"
    echo "   - Should look like: redis://default:password@redis.railway.internal:6379"
    echo ""
    echo "✅ After linking, Railway will automatically redeploy"
    echo ""
    echo "🧪 Test the connection:"
    echo "   railway run --service taskjuggler php artisan tinker"
    echo "   >>> \\Illuminate\\Support\\Facades\\Redis::ping()"
    echo "   # Should return: 'PONG'"
fi

echo ""
echo "✅ Script complete!"
