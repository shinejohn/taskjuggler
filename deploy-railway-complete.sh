#!/bin/bash

# Railway AI Tools - Complete Deployment Script
# This script configures all services and deploys the platform

set -e

echo "🚀 Railway AI Tools - Complete Deployment"
echo "=========================================="
echo ""

# Change to the project root
cd /Users/johnshine/Dropbox/Fibonacco/taskjuggler/Code

# Ensure we're linked to the right project
cd taskjuggler-api
echo "📡 Verifying Railway connection..."
railway status || {
    echo "❌ Not linked to Railway. Linking now..."
    railway link --project 7e7372dd-373a-4e78-a51e-15eab332b67d
}

echo ""
echo "✅ Connected to Railway"
echo ""

# Configure remaining frontend services
echo "📦 Configuring Frontend Services..."
echo "===================================="

API_URL="https://taskjuggler-production.up.railway.app"

# URPA
echo ""
echo "Configuring URPA..."
railway variables --service "URPA" \
  --set "VITE_API_URL=${API_URL}" \
  --set "NODE_ENV=production" && echo "✅ URPA configured"

# 4process
echo ""
echo "Configuring 4process..."
railway variables --service "4process" \
  --set "VITE_API_URL=${API_URL}" \
  --set "NODE_ENV=production" && echo "✅ 4process configured"

# 4projects
echo ""
echo "Configuring 4projects..."
railway variables --service "4projects" \
  --set "VITE_API_URL=${API_URL}" \
  --set "NODE_ENV=production" && echo "✅ 4projects configured"

# Site Health
echo ""
echo "Configuring Site Health..."
railway variables --service "Site Health" \
  --set "VITE_API_URL=${API_URL}" \
  --set "NODE_ENV=production" && echo "✅ Site Health configured"

# Idea Circuit
echo ""
echo "Configuring Idea Circuit..."
railway variables --service "Idea Circuit" \
  --set "VITE_API_URL=${API_URL}" \
  --set "NODE_ENV=production" && echo "✅ Idea Circuit configured"

echo ""
echo "✅ All frontend services configured!"
echo ""

# Commit and push deployment configurations
echo "📤 Committing and Pushing Deployment Configurations..."
echo "======================================================"

cd /Users/johnshine/Dropbox/Fibonacco/taskjuggler/Code

# Check if there are changes to commit
if git diff --quiet && git diff --cached --quiet; then
    echo "ℹ️  No changes to commit"
else
    echo ""
    echo "Files to be committed:"
    git status --short
    echo ""
    
    # Add all railway configuration files
    git add taskjuggler-api/railway.json 2>/dev/null || true
    git add taskjuggler-api/nixpacks.toml 2>/dev/null || true
    git add taskjuggler-web/railway.json 2>/dev/null || true
    git add 4doctors-web/railway.json 2>/dev/null || true
    git add urpa-web/railway.json 2>/dev/null || true
    git add process-web/railway.json 2>/dev/null || true
    git add projects-web/railway.json 2>/dev/null || true
    git add scanner-web/railway.json 2>/dev/null || true
    git add ideacircuit-web/railway.json 2>/dev/null || true
    git add coordinator-web/railway.json 2>/dev/null || true
    git add official-notice-web/railway.json 2>/dev/null || true
    
    # Commit
    git commit -m "feat: add Railway deployment configurations for AI Tools platform

- Add railway.json and nixpacks.toml for taskjuggler-api
- Add railway.json for all frontend applications
- Configure automatic database migrations on deployment
- Set up Nixpacks builder for all services"
    
    echo ""
    echo "✅ Changes committed"
    echo ""
    
    # Push to trigger deployments
    echo "Pushing to GitHub to trigger deployments..."
    git push origin main
    
    echo ""
    echo "✅ Pushed to GitHub - deployments will start automatically"
fi

echo ""
echo "=========================================="
echo "🎉 Deployment Configuration Complete!"
echo "=========================================="
echo ""
echo "Next Steps:"
echo "1. Monitor deployments in Railway dashboard:"
echo "   https://railway.app/project/7e7372dd-373a-4e78-a51e-15eab332b67d"
echo ""
echo "2. Check API deployment:"
echo "   railway logs --service taskjuggler"
echo ""
echo "3. Verify database migrations:"
echo "   railway run --service taskjuggler 'php artisan migrate:status'"
echo ""
echo "4. Check frontend builds:"
echo "   railway logs --service '4Doctors'"
echo "   railway logs --service 'URPA'"
echo "   railway logs --service '4process'"
echo "   railway logs --service '4projects'"
echo "   railway logs --service 'Site Health'"
echo "   railway logs --service 'Idea Circuit'"
echo ""
echo "Services that need to be created manually in Railway:"
echo "  - coordinator (for coordinator-web)"
echo "  - official-notice (for official-notice-web)"
echo ""
echo "Database: Postgres - AI TOOLs"
echo "  Host: postgres-ea870ea6.railway.internal"
echo "  Database: railway"
echo "  User: postgres"
echo ""
