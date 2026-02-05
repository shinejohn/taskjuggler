#!/bin/bash

# Railway Environment Variables Setup Script
# This script sets all required environment variables for 4 Projects.ai
# 
# Usage: ./railway-set-variables.sh
# Note: Project must be linked first (run 'railway init' or 'railway link')

set -e

echo "🔧 Setting Railway Environment Variables"
echo "========================================"
echo ""

# Check if logged in
if ! railway whoami &>/dev/null; then
    echo "❌ Not logged in to Railway. Please run: railway login"
    exit 1
fi

# Check if project is linked
if ! railway status &>/dev/null; then
    echo "❌ No linked project found."
    echo "Please run: railway init (or railway link)"
    exit 1
fi

echo "✅ Project linked"
echo ""

# Core application variables
echo "Setting core application variables..."
railway variables --set "APP_NAME=4 Projects.ai" 2>&1 || true
railway variables --set "APP_ENV=production" 2>&1 || true
railway variables --set "APP_DEBUG=false" 2>&1 || true
railway variables --set "LOG_LEVEL=info" 2>&1 || true
echo "✅ Core app variables set"
echo ""

# Cache and Queue
echo "Setting cache and queue drivers..."
railway variables --set "CACHE_DRIVER=redis" 2>&1 || true
railway variables --set "SESSION_DRIVER=redis" 2>&1 || true
railway variables --set "QUEUE_CONNECTION=redis" 2>&1 || true
echo "✅ Cache/Queue variables set"
echo ""

# Broadcasting
echo "Setting broadcast driver..."
railway variables --set "BROADCAST_DRIVER=reverb" 2>&1 || true
railway variables --set "REVERB_APP_ID=4projects" 2>&1 || true
railway variables --set "REVERB_SCHEME=https" 2>&1 || true
echo "✅ Broadcast variables set"
echo ""

# Generate and set app key
echo "🔑 Checking application key..."
if ! railway variables 2>&1 | grep -q "APP_KEY="; then
    if command -v php &> /dev/null; then
        APP_KEY=$(php artisan key:generate --show 2>/dev/null | tail -1 || echo "")
        if [ -n "$APP_KEY" ] && [ "$APP_KEY" != "Application key set successfully." ]; then
            railway variables --set "APP_KEY=$APP_KEY" 2>&1 || true
            echo "✅ Application key generated and set"
        else
            echo "⚠️  Could not generate key automatically"
            echo "   Please run: railway variables --set \"APP_KEY=\$(php artisan key:generate --show)\""
        fi
    else
        echo "⚠️  PHP not found. Please set APP_KEY manually:"
        echo "   railway variables --set \"APP_KEY=\$(php artisan key:generate --show)\""
    fi
else
    echo "✅ APP_KEY already set"
fi
echo ""

# OpenRouter (placeholder - user must set)
echo "📝 OpenRouter AI (REQUIRED for AI features):"
if railway variables 2>&1 | grep -q "OPENROUTER_API_KEY="; then
    echo "✅ OPENROUTER_API_KEY already set"
else
    echo "⚠️  NOT SET - Required for AI features"
    echo "   Run: railway variables --set \"OPENROUTER_API_KEY=your-key\""
fi
echo ""

# Display summary
echo "📊 Current Railway variables:"
echo ""
railway variables 2>&1 | head -25
echo ""

echo "📋 Required variables still to set:"
echo ""
echo "1. OpenRouter API key (REQUIRED):"
echo "   railway variables --set \"OPENROUTER_API_KEY=your-key\""
echo ""
echo "2. Reverb keys (REQUIRED for WebSockets):"
echo "   Generate locally: php artisan reverb:install"
echo "   railway variables --set \"REVERB_APP_KEY=generated-key\""
echo "   railway variables --set \"REVERB_APP_SECRET=generated-secret\""
echo ""
echo "3. After first deploy, set APP_URL:"
echo "   railway variables --set \"APP_URL=https://your-app.railway.app\""
echo ""
echo "4. Optional service keys:"
echo "   railway variables --set \"TWILIO_SID=your-sid\""
echo "   railway variables --set \"TWILIO_TOKEN=your-token\""
echo "   railway variables --set \"SLACK_BOT_TOKEN=your-token\""
echo ""
echo "✅ Variable configuration complete!"
echo ""
echo "📖 See RAILWAY_SETUP.md for detailed instructions"


