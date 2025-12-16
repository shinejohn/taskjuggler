#!/bin/bash
# Quick Railway Setup Script for Fibonacci Platform
# Run this after creating/linking your Railway project

set -e

echo "=== Railway Quick Setup for Fibonacci ==="
echo ""

# Check Railway CLI
if ! command -v railway &> /dev/null; then
    echo "ERROR: Railway CLI not found. Install: brew install railway"
    exit 1
fi

# Check login
if ! railway whoami &> /dev/null; then
    echo "ERROR: Not logged in. Run: railway login"
    exit 1
fi

echo "✓ Railway CLI ready"
echo ""

# API Setup
echo "=== Setting up API (taskjuggler-api) ==="
cd taskjuggler-api

# Check if linked
if ! railway status &> /dev/null; then
    echo "⚠ Not linked to a project."
    echo "Please run: railway link --project <project-id>"
    echo "Or create project in dashboard and link it"
    exit 1
fi

echo "✓ Linked to Railway project"

# Add databases (if not already added)
echo ""
echo "Adding databases..."
railway add --database postgres || echo "  PostgreSQL might already exist"
sleep 3
railway add --database redis || echo "  Redis might already exist"
sleep 3

# Set environment variables
echo ""
echo "Setting environment variables..."
railway variables set \
  APP_NAME="Fibonacci API" \
  APP_ENV=production \
  APP_DEBUG=false \
  LOG_CHANNEL=stderr \
  LOG_LEVEL=info \
  DB_CONNECTION=pgsql \
  CACHE_STORE=redis \
  SESSION_DRIVER=redis \
  QUEUE_CONNECTION=redis \
  MODULE_TASKS_ENABLED=true \
  MODULE_PROCESSES_ENABLED=false \
  MODULE_PROJECTS_ENABLED=false \
  2>&1 | grep -v "already exists" || true

echo ""
echo "✓ API configured"
echo ""

# Get API service info
echo "API Service Setup:"
echo "  1. Connect GitHub repo in Railway dashboard"
echo "  2. Ensure start command uses: web (from Procfile)"
echo "  3. Create worker service with start command: worker"
echo "  4. Create scheduler service with start command: scheduler"
echo ""

# Frontend Setup
echo "=== Setting up Task Juggler Frontend ==="
cd ../taskjuggler-web

# Check if linked (will fail if not, that's ok)
if railway status &> /dev/null; then
    echo "✓ Already linked to Railway project"
else
    echo "⚠ Not linked. You'll need to link to the same project:"
    echo "  railway link --project <same-project-id>"
fi

# Set frontend variables (need API URL)
echo ""
echo "Frontend environment variables:"
echo "  You'll need to set VITE_API_URL after API service is deployed"
echo "  Example: railway variables set VITE_API_URL=https://your-api.up.railway.app"
echo ""

echo "=== Setup Complete ==="
echo ""
echo "Next steps:"
echo "  1. Create/link Railway project (if not done)"
echo "  2. Connect GitHub repos in Railway dashboard"
echo "  3. Deploy API service and get the domain URL"
echo "  4. Set VITE_API_URL in frontend service with that domain"
echo "  5. Run migrations: railway run php artisan migrate --force"
echo ""

