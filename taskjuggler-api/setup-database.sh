#!/bin/bash

# Database Setup Script for Railway
# This script helps configure database connection

set -e

echo "🗄️  Database Setup for Task Juggler"
echo "==================================="
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
if ! railway status &> /dev/null; then
    echo "❌ Project not linked. Run: railway link"
    exit 1
fi

echo "✅ Railway connected"
echo ""

# Link to main service
echo "🔗 Linking to taskjuggler service..."
railway service taskjuggler

echo ""
echo "📋 Checking database configuration..."

# Check if DATABASE_URL is set
DB_URL=$(railway variables | grep -i "DATABASE_URL" || echo "")
if [ -n "$DB_URL" ]; then
    echo "✅ DATABASE_URL is set"
    echo "$DB_URL"
else
    echo "⚠️  DATABASE_URL not found"
    echo ""
    echo "📝 Action Required:"
    echo "   1. Go to Railway Dashboard: https://railway.app"
    echo "   2. Open 'AI Task Juggler' project"
    echo "   3. Click on your PostgreSQL database service"
    echo "   4. Go to 'Variables' tab and copy DATABASE_URL"
    echo "   5. Go to 'taskjuggler' service → Variables"
    echo "   6. Click 'Add Reference' and select your PostgreSQL database"
    echo "   7. Railway will automatically add DATABASE_URL"
    echo ""
    echo "   OR manually set:"
    echo "   railway variables --set 'DATABASE_URL=postgresql://...'"
    echo ""
fi

# Check DB_CONNECTION
DB_CONN=$(railway variables | grep -i "DB_CONNECTION" || echo "")
if [ -n "$DB_CONN" ]; then
    echo "✅ DB_CONNECTION is set"
    echo "$DB_CONN"
else
    echo "⚠️  DB_CONNECTION not set"
    echo "🔧 Setting DB_CONNECTION=pgsql..."
    railway variables --set "DB_CONNECTION=pgsql" 2>/dev/null || {
        echo "⚠️  Could not set DB_CONNECTION automatically"
        echo "   Set manually: railway variables --set 'DB_CONNECTION=pgsql'"
    }
fi

echo ""
echo "🧪 Testing database connection..."

# Try to check migration status
railway run php artisan migrate:status 2>&1 | head -5 || {
    echo "⚠️  Could not connect to database"
    echo ""
    echo "📋 Next steps:"
    echo "   1. Ensure DATABASE_URL is set (see above)"
    echo "   2. Verify database service is running in Railway dashboard"
    echo "   3. Check database and service are in same project"
    echo "   4. Try again: railway run php artisan migrate:status"
    exit 1
}

echo ""
echo "✅ Database connection successful!"
echo ""
echo "📊 Migration status:"
railway run php artisan migrate:status | head -20

echo ""
echo "✅ Database setup complete!"
echo ""
echo "💡 If you have multiple databases, you only need one for the main app."
echo "   You can delete unused databases or keep them for staging/testing."
