#!/bin/bash

# TEF 2.0.0 Migration Script
# Run this script to complete TEF 2.0.0 setup

set -e

echo "🚀 Starting TEF 2.0.0 Migration..."
echo ""

# Step 1: Run migrations
echo "📦 Step 1: Running database migrations..."
php artisan migrate --force

echo ""
echo "✅ Migrations completed!"
echo ""

# Step 2: Create actors for existing users
echo "👥 Step 2: Creating Actor records for existing users..."
php artisan tef:create-actors-for-users

echo ""
echo "✅ TEF 2.0.0 Migration Complete!"
echo ""
echo "Next steps:"
echo "  - Test TEF 2.0.0 export: GET /api/tasks/{id}/tef?version=2.0.0"
echo "  - Test TEF 2.0.0 envelope: GET /api/tasks/{id}/tef/envelope"
echo "  - Register new actor: POST /api/tef/v1/actors"
