#!/bin/bash

# Complete Railway Setup Script
# This script completes the Railway configuration that was started

set -e

echo "🚂 Completing Railway Setup for 4 Projects.ai"
echo "=============================================="
echo ""

# Check if logged in
if ! railway whoami &>/dev/null; then
    echo "❌ Not logged in to Railway. Please run: railway login"
    exit 1
fi

echo "✅ Logged in as $(railway whoami)"
echo ""

# Check if project is linked
if [ ! -f ".railway" ]; then
    echo "⚠️  Project not linked to Railway."
    echo ""
    echo "You need to either:"
    echo "1. Link to existing project: railway link"
    echo "2. Create new project: railway init"
    echo ""
    echo "This script cannot do this interactively. Please run one of the above commands first."
    exit 1
fi

echo "✅ Project linked"
echo ""

# Check if services exist
echo "📊 Checking services..."
SERVICES=$(railway service 2>&1 || echo "")

if echo "$SERVICES" | grep -q "postgres\|PostgreSQL"; then
    echo "✅ PostgreSQL service found"
else
    echo "📊 Adding PostgreSQL database..."
    railway add --database postgres
    echo ""
fi

if echo "$SERVICES" | grep -q "redis\|Redis"; then
    echo "✅ Redis service found"
else
    echo "🔴 Adding Redis service..."
    railway add --plugin redis
    echo ""
fi

# Set core variables
echo "📝 Setting core environment variables..."
railway variables --set "APP_NAME=4 Projects.ai" 2>&1 || true
railway variables --set "APP_ENV=production" 2>&1 || true
railway variables --set "APP_DEBUG=false" 2>&1 || true
railway variables --set "LOG_LEVEL=info" 2>&1 || true
railway variables --set "CACHE_DRIVER=redis" 2>&1 || true
railway variables --set "SESSION_DRIVER=redis" 2>&1 || true
railway variables --set "QUEUE_CONNECTION=redis" 2>&1 || true
railway variables --set "BROADCAST_DRIVER=reverb" 2>&1 || true
railway variables --set "REVERB_APP_ID=4projects" 2>&1 || true
railway variables --set "REVERB_SCHEME=https" 2>&1 || true

echo "✅ Core variables set"
echo ""

# Generate app key if needed
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

# Display summary
echo "📊 Current Railway configuration:"
echo ""
railway variables 2>&1 | head -25
echo ""

echo "✅ Railway setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Set required API keys (OpenRouter, Reverb, etc.)"
echo "2. Deploy: railway up"
echo "3. Run migrations: railway run php artisan migrate --force"
echo ""
echo "📖 See RAILWAY_SETUP.md for complete documentation"


