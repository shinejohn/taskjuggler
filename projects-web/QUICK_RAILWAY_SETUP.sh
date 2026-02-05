#!/bin/bash

# Quick Railway Setup - Interactive Guide
# This script guides you through Railway setup step by step

set -e

echo "🚂 Railway Quick Setup for 4 Projects.ai"
echo "=========================================="
echo ""

# Step 1: Check login
if ! railway whoami &>/dev/null; then
    echo "Step 1: Logging in to Railway..."
    railway login
    echo ""
fi

echo "✅ Logged in as $(railway whoami)"
echo ""

# Step 2: Initialize project
if [ ! -f ".railway" ]; then
    echo "Step 2: Initializing Railway project..."
    echo "Please follow the prompts:"
    echo "  - Select 'Create a new project'"
    echo "  - Name: 4projects (or your choice)"
    echo ""
    railway init
    echo ""
else
    echo "✅ Project already linked"
fi

# Step 3: Add services
echo "Step 3: Adding services..."
echo ""

echo "Adding PostgreSQL database..."
railway add --database postgres
echo ""

echo "Adding Redis service..."
railway add --plugin redis
echo ""

# Step 4: Set variables using helper script
echo "Step 4: Setting environment variables..."
echo ""
if [ -f "railway-set-variables.sh" ]; then
    ./railway-set-variables.sh
else
    echo "⚠️  railway-set-variables.sh not found, setting basic variables..."
    railway variables --set "APP_NAME=4 Projects.ai"
    railway variables --set "APP_ENV=production"
    railway variables --set "APP_DEBUG=false"
    railway variables --set "CACHE_DRIVER=redis"
    railway variables --set "SESSION_DRIVER=redis"
    railway variables --set "QUEUE_CONNECTION=redis"
    railway variables --set "BROADCAST_DRIVER=reverb"
    railway variables --set "REVERB_APP_ID=4projects"
fi
echo ""

echo "✅ Railway setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Set required API keys (see RAILWAY_SETUP.md)"
echo "2. Run migrations: railway run php artisan migrate --force"
echo "3. Deploy: railway up"
echo ""
echo "📖 See RAILWAY_SETUP.md for complete documentation"


