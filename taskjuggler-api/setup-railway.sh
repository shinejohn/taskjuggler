#!/bin/bash

# Railway Setup Script for AI Task Juggler
# Run this after: railway login && railway link

set -e

echo "🚂 Railway Setup for AI Task Juggler"
echo "===================================="
echo ""

# Check if railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI not found. Install it with: npm i -g @railway/cli"
    exit 1
fi

# Check if logged in
if ! railway whoami &> /dev/null; then
    echo "❌ Not logged in to Railway. Run: railway login"
    exit 1
fi

# Check if project is linked
if ! railway status &> /dev/null; then
    echo "❌ Project not linked. Run: railway link"
    exit 1
fi

echo "✅ Railway CLI ready"
echo ""

# Add PostgreSQL
echo "📦 Adding PostgreSQL service..."
if railway add postgresql 2>&1 | grep -q "already exists\|Service added"; then
    echo "✅ PostgreSQL service ready"
else
    echo "⚠️  PostgreSQL may already exist or there was an issue"
fi
echo ""

# Add Redis
echo "📦 Adding Redis service..."
if railway add redis 2>&1 | grep -q "already exists\|Service added"; then
    echo "✅ Redis service ready"
else
    echo "⚠️  Redis may already exist or there was an issue"
fi
echo ""

# Set basic app variables
echo "🔧 Setting basic app configuration..."
railway variables set APP_NAME="Task Juggler" 2>/dev/null || true
railway variables set APP_ENV=production 2>/dev/null || true
railway variables set APP_DEBUG=false 2>/dev/null || true
railway variables set QUEUE_CONNECTION=redis 2>/dev/null || true
railway variables set BROADCAST_DRIVER=pusher 2>/dev/null || true

# Get and set APP_URL
APP_URL=$(railway domain 2>/dev/null || echo "")
if [ -n "$APP_URL" ]; then
    railway variables set APP_URL="https://$APP_URL" 2>/dev/null || true
    echo "✅ APP_URL set to: https://$APP_URL"
else
    echo "⚠️  Could not get domain. Set APP_URL manually after deployment."
fi
echo ""

# Generate and set APP_KEY
echo "🔑 Generating APP_KEY..."
APP_KEY=$(railway run php artisan key:generate --show 2>/dev/null | grep -o 'base64:[^[:space:]]*' || echo "")
if [ -n "$APP_KEY" ]; then
    railway variables set APP_KEY="$APP_KEY" 2>/dev/null || true
    echo "✅ APP_KEY generated and set"
else
    echo "⚠️  Could not generate APP_KEY. Run manually: railway run php artisan key:generate --show"
fi
echo ""

echo "✅ Basic setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Set external service API keys (Twilio, SendGrid, OpenRouter, Stripe, Pusher)"
echo "2. Run migrations: railway run php artisan migrate --force"
echo "3. Deploy: railway up (or push to GitHub)"
echo ""
echo "💡 View all variables: railway variables"
echo "💡 View logs: railway logs"
echo "💡 Check status: railway status"
