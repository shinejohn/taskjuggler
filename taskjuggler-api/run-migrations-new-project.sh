#!/bin/bash
# Script to run migrations on the new Railway project
# Project: Fibonacco AI Tools
# Project ID: ca3879ff-fd72-4239-983d-32ade6cace83

echo "🚀 Running migrations for Fibonacco AI Tools project..."
echo ""

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI not found. Please install it first:"
    echo "   npm i -g @railway/cli"
    exit 1
fi

# Check if linked to project
if [ ! -f ".railway/project.json" ]; then
    echo "⚠️  Not linked to Railway project. Linking now..."
    echo "   Please run: railway link --project ca3879ff-fd72-4239-983d-32ade6cace83"
    echo "   Then authenticate with: railway login"
    exit 1
fi

echo "📋 Checking migration status..."
railway run --service api-web php artisan migrate:status

echo ""
echo "🔄 Running migrations..."
railway run --service api-web php artisan migrate --force

echo ""
echo "✅ Migrations completed!"
echo ""
echo "📊 Verifying tables..."
railway run --service api-web php artisan tinker --execute="echo 'Tables: '; \$tables = DB::select('SELECT tablename FROM pg_tables WHERE schemaname = \\'public\\''); foreach(\$tables as \$table) { echo \$table->tablename . PHP_EOL; }"
