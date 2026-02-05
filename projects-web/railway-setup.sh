#!/bin/bash

# Railway Setup Script for 4 Projects.ai
# This script configures all services and database on Railway
# 
# Usage: ./railway-setup.sh
# Note: Some commands require interactive prompts

set -e

echo "🚂 Railway Setup for 4 Projects.ai"
echo "===================================="
echo ""

# Check if logged in
if ! railway whoami &>/dev/null; then
    echo "❌ Not logged in to Railway."
    echo "Please run: railway login"
    exit 1
fi

echo "✅ Logged in to Railway as $(railway whoami)"
echo ""

# Check if project is linked
if [ ! -f ".railway" ]; then
    echo "📦 Project not linked to Railway."
    echo "Please run one of:"
    echo "  railway init    (to create a new project)"
    echo "  railway link    (to link to existing project)"
    echo ""
    read -p "Run 'railway init' now? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        railway init
    else
        echo "Please run 'railway init' or 'railway link' first, then run this script again."
        exit 1
    fi
fi

echo "📊 Adding PostgreSQL database..."
railway add --database postgres 2>&1 || echo "   (PostgreSQL may already be added)"
echo ""

echo "🔴 Adding Redis service..."
railway add --plugin redis 2>&1 || echo "   (Redis may already be added)"
echo ""

echo "📝 Setting up environment variables..."
echo ""

# Core application variables
echo "Setting core application variables..."
railway variables set APP_NAME="4 Projects.ai" 2>&1 || true
railway variables set APP_ENV=production 2>&1 || true
railway variables set APP_DEBUG=false 2>&1 || true
railway variables set LOG_LEVEL=info 2>&1 || true
echo "✅ Core app variables set"
echo ""

# Cache and Queue
echo "Setting cache and queue drivers..."
railway variables set CACHE_DRIVER=redis 2>&1 || true
railway variables set SESSION_DRIVER=redis 2>&1 || true
railway variables set QUEUE_CONNECTION=redis 2>&1 || true
echo "✅ Cache/Queue variables set"
echo ""

# Broadcasting
echo "Setting broadcast driver..."
railway variables set BROADCAST_DRIVER=reverb 2>&1 || true
railway variables set REVERB_APP_ID=4projects 2>&1 || true
railway variables set REVERB_SCHEME=https 2>&1 || true
echo "✅ Broadcast variables set"
echo ""

# Generate and set app key
echo "🔑 Generating application key..."
if ! railway variables 2>&1 | grep -q "APP_KEY="; then
    if command -v php &> /dev/null; then
        APP_KEY=$(php artisan key:generate --show 2>/dev/null | tail -1 || echo "")
        if [ -n "$APP_KEY" ] && [ "$APP_KEY" != "Application key set successfully." ]; then
            railway variables --set "APP_KEY=$APP_KEY" 2>&1 || true
            echo "✅ Application key generated and set"
        else
            echo "⚠️  Could not generate key automatically"
            echo "   Please run: railway variables set APP_KEY=\$(php artisan key:generate --show)"
        fi
    else
        echo "⚠️  PHP not found. Please set APP_KEY manually:"
        echo "   railway variables set APP_KEY=\$(php artisan key:generate --show)"
    fi
else
    echo "✅ APP_KEY already set"
fi
echo ""

# Display current variables
echo "🔗 Current Railway variables:"
echo ""
railway variables 2>&1 | head -20 || echo "   (Use 'railway variables' to see all)"
echo ""

# Database connection info
echo "📊 Database variables:"
railway variables 2>&1 | grep -E "DATABASE_URL|POSTGRES" | head -5 || echo "   (Will be auto-set when PostgreSQL service is created)"
echo ""

# Redis connection info
echo "🔴 Redis variables:"
railway variables 2>&1 | grep -E "REDIS" | head -3 || echo "   (Will be auto-set when Redis service is created)"
echo ""

echo "📋 Required next steps:"
echo ""
echo "1. Set OpenRouter API key:"
echo "   railway variables set OPENROUTER_API_KEY=your-key-here"
echo ""
echo "2. Generate and set Reverb keys (run locally first):"
echo "   php artisan reverb:install"
echo "   railway variables set REVERB_APP_KEY=generated-key"
echo "   railway variables set REVERB_APP_SECRET=generated-secret"
echo ""
echo "3. After first deploy, set APP_URL:"
echo "   railway variables set APP_URL=https://your-app.railway.app"
echo ""
echo "4. Optional - Set service keys:"
echo "   railway variables set TWILIO_SID=your-sid"
echo "   railway variables set TWILIO_TOKEN=your-token"
echo "   railway variables set SLACK_BOT_TOKEN=your-token"
echo ""
echo "5. Run migrations:"
echo "   railway run php artisan migrate --force"
echo ""
echo "6. Deploy:"
echo "   railway up"
echo ""
echo "✅ Railway setup configuration complete!"
echo ""
echo "📖 See RAILWAY_SETUP.md for detailed instructions"
echo "🌐 View your project: https://railway.app"

