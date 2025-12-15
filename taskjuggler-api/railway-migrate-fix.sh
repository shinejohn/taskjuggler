#!/bin/bash
# Script to fix missing tables in Railway database
# This will drop the migrations table and re-run all migrations

echo "⚠️  WARNING: This will drop all tables and re-run migrations!"
echo "This should only be done if tables are missing but migrations show as 'Ran'"
echo ""
read -p "Continue? (yes/no): " confirm

if [ "$confirm" != "yes" ]; then
    echo "Aborted."
    exit 1
fi

echo ""
echo "Running migrate:fresh --force..."
railway run --service api-web php artisan migrate:fresh --force

echo ""
echo "✅ Migrations completed. Check Railway dashboard to verify tables exist."

