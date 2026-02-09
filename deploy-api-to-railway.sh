#!/bin/bash

# Deploy ai-tools-api (taskjuggler-api) to Railway
# This script helps configure and deploy the PHP/Laravel API service

set -e

echo "🚀 Deploying ai-tools-api to Railway"
echo "===================================="
echo ""

# Check Railway CLI
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI not found. Installing..."
    npm i -g @railway/cli
fi

echo "✅ Railway CLI: $(railway --version)"
echo ""

# Check if linked
if ! railway status &> /dev/null; then
    echo "⚠️  Railway CLI not linked to a project."
    echo ""
    echo "Please run:"
    echo "  1. railway login"
    echo "  2. railway link"
    echo "  3. Select project: 'Fibonacco AI Tools'"
    echo ""
    echo "Then run this script again."
    exit 1
fi

echo "✅ Railway CLI is linked"
echo ""

# Verify API directory exists
if [ ! -d "taskjuggler-api" ]; then
    echo "❌ Error: taskjuggler-api directory not found"
    exit 1
fi

if [ ! -f "taskjuggler-api/railway.json" ]; then
    echo "❌ Error: taskjuggler-api/railway.json not found"
    exit 1
fi

if [ ! -f "taskjuggler-api/nixpacks.toml" ]; then
    echo "❌ Error: taskjuggler-api/nixpacks.toml not found"
    exit 1
fi

echo "✅ API configuration files found"
echo ""

# Check service exists
echo "Checking for ai-tools-api service..."
if railway service list 2>&1 | grep -q "ai-tools-api"; then
    echo "✅ Found ai-tools-api service"
    
    echo ""
    echo "📋 CRITICAL: Configure Root Directory in Railway Dashboard"
    echo "========================================================"
    echo ""
    echo "The service exists, but Railway needs to be configured:"
    echo ""
    echo "1. Go to: https://railway.app"
    echo "2. Navigate to: 'Fibonacco AI Tools' project"
    echo "3. Click on service: 'ai-tools-api'"
    echo "4. Go to: Settings → Build & Deploy"
    echo "5. Set Root Directory to: taskjuggler-api"
    echo "6. Ensure Builder is: NIXPACKS (not Railpack)"
    echo "7. Save and redeploy"
    echo ""
    echo "This will make Railway use taskjuggler-api/railway.json"
    echo "which specifies NIXPACKS builder."
    echo ""
    
    # Try to show current service config
    echo "Current service configuration:"
    railway service show ai-tools-api 2>&1 || echo "Could not retrieve details"
    
else
    echo "⚠️  Service 'ai-tools-api' not found"
    echo ""
    echo "Available services:"
    railway service list 2>&1 || echo "Could not list services"
    echo ""
    echo "You may need to create the service first in Railway dashboard."
fi

echo ""
echo "📝 Next Steps:"
echo "=============="
echo ""
echo "After configuring the root directory in Railway dashboard:"
echo ""
echo "1. Railway will automatically detect taskjuggler-api/railway.json"
echo "2. Railway will use NIXPACKS builder (not Railpack)"
echo "3. Railway will build using taskjuggler-api/nixpacks.toml"
echo "4. The build will run: composer install, then Laravel build commands"
echo "5. The service will start with: php artisan migrate && php artisan serve"
echo ""
echo "The monorepo-build.sh script will NOT run for this service"
echo "because Railway will be building from taskjuggler-api/ directory."
