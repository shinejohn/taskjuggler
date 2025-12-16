#!/bin/bash

# Complete Railway Setup Script
# This script sets up environment variables and runs migrations

set -e

echo "🚂 Railway Complete Setup"
echo "========================"
echo ""

cd "$(dirname "$0")"

# Check Railway CLI
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI not installed"
    exit 1
fi

# Check login
if ! railway whoami &> /dev/null; then
    echo "❌ Not logged in. Run: railway login"
    exit 1
fi

# Check project link
PROJECT_STATUS=$(railway status 2>&1)
if echo "$PROJECT_STATUS" | grep -q "No linked project"; then
    echo "❌ Project not linked. Run: railway link"
    exit 1
fi

echo "✅ Railway connected"
echo ""

# List available services
echo "📋 Available services:"
railway status
echo ""

# Prompt for service name or try to detect
echo "🔗 To set variables and run migrations, you need to link to a service."
echo "   If you have a service named 'api' or similar, we'll try to use it."
echo ""

# Try to set project-level variables (if Railway supports it)
echo "🔧 Setting environment variables..."

# Note: Railway variables need to be set per-service or per-project
# We'll try project-level first, then service-level

echo ""
echo "⚠️  Railway CLI requires service linking for variable management."
echo ""
echo "📝 Manual Steps Required:"
echo ""
echo "1. Create services in Railway Dashboard:"
echo "   - Go to: https://railway.app"
echo "   - Open 'AI Task Juggler' project"
echo "   - Add services:"
echo "     * PostgreSQL (if not added): New → Database → PostgreSQL"
echo "     * Redis (if not added): New → Database → Redis"
echo "     * API service: New → GitHub Repo (or Empty Service)"
echo "     * Worker service: New → Empty Service (name: 'worker')"
echo "     * Scheduler service: New → Empty Service (name: 'scheduler')"
echo ""
echo "2. Configure services:"
echo "   - API service: Start command: php artisan serve --host=0.0.0.0 --port=\$PORT"
echo "   - Worker service: Start command: php artisan queue:work --tries=3 --timeout=300 --sleep=3"
echo "   - Scheduler service: Start command: php artisan schedule:work"
echo ""
echo "3. Set environment variables (in Railway dashboard or via CLI after linking):"
echo "   - QUEUE_CONNECTION=redis"
echo "   - CACHE_DRIVER=redis"
echo "   - SESSION_DRIVER=redis"
echo ""
echo "4. After services are created, run migrations:"
echo "   railway service <service-name>"
echo "   railway run php artisan migrate --force"
echo ""

# Try to run migrations if we can detect a service
echo "🔄 Attempting to run migrations..."
echo "   (This will work once you link to a service with: railway service <name>)"
echo ""

# Check if we can list services or need to link
SERVICE_LINKED=$(railway service 2>&1 | head -1)
if echo "$SERVICE_LINKED" | grep -q "No service linked\|Failed to prompt"; then
    echo "⚠️  No service linked. Link to a service first:"
    echo "   railway service <service-name>"
    echo ""
    echo "Then run migrations with:"
    echo "   railway run php artisan migrate --force"
else
    echo "✅ Service linked: $SERVICE_LINKED"
    echo ""
    echo "🗄️  Running migrations..."
    railway run php artisan migrate --force || {
        echo "⚠️  Migration failed. Check database connection and try again."
        exit 1
    }
    echo ""
    echo "✅ Migrations completed!"
fi

echo ""
echo "✅ Setup script complete!"
echo ""
echo "📚 Next steps:"
echo "   1. Verify all services are running in Railway dashboard"
echo "   2. Check logs: railway logs --service <service-name>"
echo "   3. Test queue: railway run php artisan tinker → Queue::size()"
echo "   4. Test scheduler: railway run --service scheduler php artisan schedule:list"
