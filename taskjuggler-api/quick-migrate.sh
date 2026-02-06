#!/bin/bash
# Quick migration script for Fibonacco AI Tools Railway project
# This script assumes Railway CLI is installed and you're authenticated

set -e

PROJECT_ID="ca3879ff-fd72-4239-983d-32ade6cace83"
SERVICE_NAME="api-web"

echo "🚀 Fibonacco AI Tools - Database Migration"
echo "=========================================="
echo ""

# Check Railway CLI
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI not found!"
    echo "   Install with: npm i -g @railway/cli"
    exit 1
fi

# Link to project if not already linked
if [ ! -f ".railway/project.json" ]; then
    echo "📎 Linking to project..."
    railway link --project "$PROJECT_ID" || {
        echo "❌ Failed to link. Please run: railway login"
        exit 1
    }
fi

echo "✅ Linked to project"
echo ""

# Check migration status
echo "📋 Checking migration status..."
railway run --service "$SERVICE_NAME" php artisan migrate:status || {
    echo "⚠️  Service might be named differently. Trying 'api'..."
    SERVICE_NAME="api"
    railway run --service "$SERVICE_NAME" php artisan migrate:status
}

echo ""
read -p "Continue with migration? (y/n) " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Aborted."
    exit 1
fi

# Run migrations
echo ""
echo "🔄 Running migrations..."
railway run --service "$SERVICE_NAME" php artisan migrate --force

echo ""
echo "✅ Migrations completed!"
echo ""
echo "📊 Verifying key tables..."
railway run --service "$SERVICE_NAME" php artisan tinker --execute="
\$tables = ['users', 'profiles', 'tasks', 'teams', 'subscriptions'];
foreach (\$tables as \$table) {
    \$exists = Schema::hasTable(\$table);
    echo (\$exists ? '✅' : '❌') . ' ' . \$table . PHP_EOL;
}
"

echo ""
echo "🎉 Done! Check the output above for any missing tables."
