#!/bin/bash

# Quick migration via Railway CLI
# Usage: ./migrate-railway.sh

cd /Users/johnshine/Dropbox/Fibonacco/taskjuggler/Code/taskjuggler-api

echo "🗄️  Running migrations on Postgres - AI TOOLs..."
railway run "php artisan migrate --force"

echo ""
echo "✅ Migration complete! Checking status..."
railway run "php artisan migrate:status"
