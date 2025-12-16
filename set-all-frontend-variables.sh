#!/bin/bash
set -e

echo "=========================================="
echo "Setting VITE_API_URL for All Frontend Services"
echo "=========================================="
echo ""

API_URL="https://api-web-production-cc91.up.railway.app/api"

echo "This script will set VITE_API_URL for:"
echo "  1. taskjuggler-web"
echo "  2. projects-web (4projects)"
echo "  3. process-web (4process)"
echo ""
echo "API URL: $API_URL"
echo ""

# Check Railway CLI
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI not found"
    echo "Install with: npm install -g @railway/cli"
    exit 1
fi

# Check login
if ! railway whoami &> /dev/null; then
    echo "❌ Not logged in to Railway"
    echo "Login with: railway login"
    exit 1
fi

echo "✅ Railway CLI found and logged in"
echo ""
echo "⚠️  Note: Railway CLI requires interactive service selection"
echo "   For non-interactive setup, use Railway Dashboard instead"
echo ""
echo "Press Enter to continue with Railway Dashboard instructions..."
read

echo ""
echo "=========================================="
echo "Railway Dashboard Instructions"
echo "=========================================="
echo ""
echo "For each service, follow these steps:"
echo ""
echo "1. Go to: https://railway.app"
echo "2. Select your project"
echo "3. Click on the service"
echo "4. Go to Variables tab"
echo "5. Click + New Variable"
echo "6. Add:"
echo "   Name: VITE_API_URL"
echo "   Value: $API_URL"
echo "7. Click Save"
echo ""
echo "Services to configure:"
echo "  • taskjuggler-web (or taskjuggler service)"
echo "  • projects-web (or 4projects service)"
echo "  • process-web (or 4process service)"
echo ""
echo "After setting variables, Railway will auto-redeploy."
echo ""

