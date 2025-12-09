#!/bin/bash

# Railway Services Setup Script
# This script helps set up Railway services for Task Juggler

set -e

echo "🚂 Railway Services Setup for Task Juggler"
echo "=========================================="
echo ""

# Check if railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI not found. Install it with: npm i -g @railway/cli"
    exit 1
fi

# Check if logged in
if ! railway whoami &> /dev/null; then
    echo "❌ Not logged in to Railway. Run: railway login"
    exit 1
fi

# Check if project is linked
if ! railway status &> /dev/null; then
    echo "❌ Project not linked. Run: railway link"
    exit 1
fi

echo "✅ Railway CLI ready"
echo ""

# Add PostgreSQL if not exists
echo "📦 Checking PostgreSQL service..."
if railway add --database postgres 2>&1 | grep -q "already exists\|Service added\|Database"; then
    echo "✅ PostgreSQL service ready"
else
    echo "⚠️  PostgreSQL may already exist or needs manual setup"
fi
echo ""

# Add Redis if not exists
echo "📦 Checking Redis service..."
if railway add --database redis 2>&1 | grep -q "already exists\|Service added\|Database"; then
    echo "✅ Redis service ready"
else
    echo "⚠️  Redis may already exist or needs manual setup"
fi
echo ""

echo "📋 Next Steps (Manual via Railway Dashboard):"
echo ""
echo "1. Go to Railway Dashboard: https://railway.app"
echo "2. Open 'AI Task Juggler' project"
echo "3. Create services:"
echo "   - Click 'New' → 'Empty Service' → Name: 'worker'"
echo "   - Set start command: php artisan queue:work --tries=3 --timeout=300 --sleep=3"
echo "   - Link to same source as main API service"
echo ""
echo "   - Click 'New' → 'Empty Service' → Name: 'scheduler'"
echo "   - Set start command: php artisan schedule:work"
echo "   - Link to same source as main API service"
echo ""
echo "4. Set environment variables (project-level or service-level):"
echo "   - QUEUE_CONNECTION=redis"
echo "   - CACHE_DRIVER=redis"
echo "   - SESSION_DRIVER=redis"
echo ""
echo "5. Run this script again to set variables and run migrations:"
echo "   ./setup-railway-services.sh --configure"
echo ""

if [ "$1" == "--configure" ]; then
    echo "🔧 Configuring environment variables..."
    
    # Try to set variables (requires service to be linked)
    railway variables --set "QUEUE_CONNECTION=redis" 2>/dev/null || echo "⚠️  Could not set QUEUE_CONNECTION (link to service first)"
    railway variables --set "CACHE_DRIVER=redis" 2>/dev/null || echo "⚠️  Could not set CACHE_DRIVER (link to service first)"
    railway variables --set "SESSION_DRIVER=redis" 2>/dev/null || echo "⚠️  Could not set SESSION_DRIVER (link to service first)"
    
    echo ""
    echo "🗄️  Running migrations..."
    echo "Linking to service first..."
    
    # Try to run migrations
    railway run php artisan migrate --force 2>/dev/null || {
        echo "⚠️  Could not run migrations automatically"
        echo "   Run manually: railway service <service-name>"
        echo "   Then: railway run php artisan migrate --force"
    }
    
    echo ""
    echo "✅ Configuration complete!"
fi
