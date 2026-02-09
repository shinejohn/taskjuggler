#!/bin/bash

# Fix Railway API Service Configuration
# This script helps configure the ai-tools-api service to use NIXPACKS builder

set -e

echo "🔧 Railway API Service Configuration Fix"
echo "========================================"
echo ""
echo "Service Name: ai-tools-api"
echo "Code Directory: taskjuggler-api"
echo "Required Builder: NIXPACKS (PHP/Laravel)"
echo ""

# Check if Railway CLI is available
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI not found. Please install it first:"
    echo "   npm i -g @railway/cli"
    exit 1
fi

# Check if linked to a project
if ! railway status &> /dev/null; then
    echo "⚠️  Railway CLI is not linked to a project."
    echo ""
    echo "To link this project:"
    echo "   1. Run: railway login"
    echo "   2. Run: railway link"
    echo "   3. Select your project: 'Fibonacco AI Tools'"
    echo ""
    echo "Then run this script again."
    exit 1
fi

echo "✅ Railway CLI is linked"
echo ""

# Try to update the service configuration
echo "Attempting to configure ai-tools-api service..."
echo ""

# Check if service exists
if railway service list 2>&1 | grep -q "ai-tools-api"; then
    echo "✅ Found ai-tools-api service"
    
    # Try to set root directory (this might require Railway CLI update)
    echo "Setting root directory to 'taskjuggler-api'..."
    
    # Note: Railway CLI might not support setting root directory directly
    # This is typically done via the dashboard
    echo ""
    echo "⚠️  Railway CLI may not support setting root directory directly."
    echo "   You may need to configure this in the Railway dashboard."
    echo ""
    
    # Show current service info
    echo "Current service configuration:"
    railway service show ai-tools-api 2>&1 || echo "Could not retrieve service details"
    
else
    echo "❌ Service 'ai-tools-api' not found"
    echo ""
    echo "Available services:"
    railway service list 2>&1 || echo "Could not list services"
fi

echo ""
echo "📋 MANUAL CONFIGURATION REQUIRED:"
echo "=================================="
echo ""
echo "Please configure in Railway Dashboard:"
echo ""
echo "1. Go to: https://railway.app"
echo "2. Navigate to: 'Fibonacco AI Tools' project"
echo "3. Click on service: 'ai-tools-api'"
echo "4. Go to: Settings → Build & Deploy"
echo "5. Set Root Directory to: taskjuggler-api"
echo "6. Ensure Builder is: NIXPACKS (not Railpack)"
echo "7. Save and redeploy"
echo ""
echo "The taskjuggler-api/railway.json already specifies NIXPACKS,"
echo "but Railway needs the root directory set to find it."
