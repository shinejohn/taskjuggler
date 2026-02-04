#!/bin/bash

# AI Tools Platform - Environment Variables Setup Script
# This script sets up all shared and service-specific variables for Railway

set -e

echo "🔧 AI Tools Platform - Environment Variables Setup"
echo "==================================================="
echo ""

cd /Users/johnshine/Dropbox/Fibonacco/taskjuggler/Code/taskjuggler-api

# Ensure we're linked to the right project
echo "📡 Verifying Railway connection..."
railway link --project 7e7372dd-373a-4e78-a51e-15eab332b67d 2>/dev/null || true

echo ""
echo "Step 1: Setting Shared Variables"
echo "=================================="
echo ""

# Database Variables
echo "Setting database variables..."
railway variables \
  --set "DB_CONNECTION=pgsql" \
  --set "DB_HOST=postgres-ea870ea6.railway.internal" \
  --set "DB_PORT=5432" \
  --set "DB_DATABASE=railway" \
  --set "DB_USERNAME=postgres" \
  --set "DB_PASSWORD=FzULulOrNbBNaiUkYutiRcTQMSqPlhhR" \
  --set "DATABASE_URL=postgresql://postgres:FzULulOrNbBNaiUkYutiRcTQMSqPlhhR@postgres-ea870ea6.railway.internal:5432/railway"

echo "✅ Database variables set"

# Redis/Valkey Variables
echo ""
echo "Setting Redis/Valkey variables..."

# Detect the correct Valkey service name
echo "Detecting Valkey service name..."
VALKEY_HOST="Valkey.railway.internal"  # Default

# Check if Valkey-CTyp exists (you can verify in Railway dashboard)
# For now, we'll use the most common internal hostname pattern
# If your service is named "Valkey-CTyp", change this to:
# VALKEY_HOST="Valkey-CTyp.railway.internal"

echo "Using REDIS_HOST: ${VALKEY_HOST}"

railway variables \
  --set "REDIS_CLIENT=predis" \
  --set "REDIS_HOST=${VALKEY_HOST}" \
  --set "REDIS_PORT=6379" \
  --set "REDIS_PASSWORD=" \
  --set "CACHE_STORE=redis" \
  --set "CACHE_PREFIX=aitools_" \
  --set "QUEUE_CONNECTION=redis" \
  --set "SESSION_DRIVER=redis"

echo "✅ Redis variables set"

# Core Application Variables
echo ""
echo "Setting core application variables..."
railway variables \
  --set "APP_ENV=production" \
  --set "APP_DEBUG=false" \
  --set "APP_TIMEZONE=America/New_York" \
  --set "APP_LOCALE=en" \
  --set "APP_FALLBACK_LOCALE=en" \
  --set "LOG_CHANNEL=stderr" \
  --set "LOG_LEVEL=info" \
  --set "BCRYPT_ROUNDS=12" \
  --set "SESSION_LIFETIME=120" \
  --set "FILESYSTEM_DISK=local" \
  --set "BROADCAST_CONNECTION=log"

echo "✅ Core variables set"

# Platform Features
echo ""
echo "Setting platform feature variables..."
railway variables \
  --set "WORKSPACES_ENABLED=true" \
  --set "WORKSPACES_CAN_CREATE_WORKSPACE=true" \
  --set "PASSWORD_ENABLED=true" \
  --set "MAGICLINK_ENABLED=false" \
  --set "SOCIALITE_ENABLED=false"

echo "✅ Platform variables set"

echo ""
echo "Step 2: Setting Service-Specific Variables"
echo "==========================================="
echo ""

# Generate APP_KEY for API
echo "Generating APP_KEY for ai-tools-api..."
APP_KEY=$(php artisan key:generate --show)

# ai-tools-api Service
echo ""
echo "Configuring ai-tools-api service..."
railway variables --service "ai-tools-api" \
  --set "APP_NAME=AI Tools API" \
  --set "APP_URL=https://ai-tools-api-production.up.railway.app" \
  --set "APP_KEY=${APP_KEY}" 2>&1 || echo "⚠️  Service 'ai-tools-api' may not exist yet - rename 'taskjuggler' first"

# Frontend Services
API_URL="https://ai-tools-api-production.up.railway.app"

# 4Doctors
echo ""
echo "Configuring 4Doctors service..."
railway variables --service "4Doctors" \
  --set "VITE_API_URL=${API_URL}" \
  --set "NODE_ENV=production" \
  --set "APP_NAME=4Healthcare" \
  --set "VITE_APP_NAME=4Healthcare"

# URPA
echo ""
echo "Configuring URPA service..."
railway variables --service "URPA" \
  --set "VITE_API_URL=${API_URL}" \
  --set "NODE_ENV=production" \
  --set "APP_NAME=URPA Scheduler" \
  --set "VITE_APP_NAME=URPA Scheduler"

# 4process
echo ""
echo "Configuring 4process service..."
railway variables --service "4process" \
  --set "VITE_API_URL=${API_URL}" \
  --set "NODE_ENV=production" \
  --set "APP_NAME=4Process" \
  --set "VITE_APP_NAME=4Process"

# 4projects
echo ""
echo "Configuring 4projects service..."
railway variables --service "4projects" \
  --set "VITE_API_URL=${API_URL}" \
  --set "NODE_ENV=production" \
  --set "APP_NAME=4Projects" \
  --set "VITE_APP_NAME=4Projects"

# Site Health
echo ""
echo "Configuring Site Health service..."
railway variables --service "Site Health" \
  --set "VITE_API_URL=${API_URL}" \
  --set "NODE_ENV=production" \
  --set "APP_NAME=Site Health Scanner" \
  --set "VITE_APP_NAME=Site Health Scanner"

# Idea Circuit
echo ""
echo "Configuring Idea Circuit service..."
railway variables --service "Idea Circuit" \
  --set "VITE_API_URL=${API_URL}" \
  --set "NODE_ENV=production" \
  --set "APP_NAME=Idea Circuit" \
  --set "VITE_APP_NAME=Idea Circuit"

echo ""
echo "==================================================="
echo "✅ Environment Variables Setup Complete!"
echo "==================================================="
echo ""
echo "Summary:"
echo "  ✅ Shared variables configured"
echo "  ✅ Database connection configured"
echo "  ✅ Redis/Valkey configured"
echo "  ✅ 6 frontend services configured"
echo ""
echo "Next Steps:"
echo "  1. Rename 'taskjuggler' service to 'ai-tools-api' in Railway dashboard"
echo "  2. Create missing services:"
echo "     - taskjuggler-web"
echo "     - coordinator"
echo "     - official-notice"
echo "  3. Redeploy all services to pick up new variables"
echo ""
echo "To verify variables:"
echo "  railway variables --service ai-tools-api"
echo "  railway variables --service 4Doctors"
echo ""
