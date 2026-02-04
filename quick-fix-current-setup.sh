#!/bin/bash

# Quick Fix Script for Current Railway Setup
# Based on screenshot analysis

set -e

echo "🔧 AI Tools Platform - Quick Fix Script"
echo "========================================"
echo ""

cd /Users/johnshine/Dropbox/Fibonacco/taskjuggler/Code/taskjuggler-api

echo "Step 1: Update REDIS_HOST to Valkey-CTyp"
echo "=========================================="
railway variables --set "REDIS_HOST=Valkey-CTyp.railway.internal"
echo "✅ REDIS_HOST updated"

echo ""
echo "Step 2: Update Frontend Services with Correct API URL"
echo "======================================================"

# Get the actual API URL (you may need to update this)
API_URL="https://ai-tools-api-production.up.railway.app"
echo "Using API URL: ${API_URL}"

echo ""
echo "Updating taskjuggler (TaskJuggler Web)..."
railway variables --service "taskjuggler" --set "VITE_API_URL=${API_URL}"

echo "Updating 4calls (Coordinator)..."
railway variables --service "4calls" --set "VITE_API_URL=${API_URL}"

echo "Updating URPA..."
railway variables --service "URPA" --set "VITE_API_URL=${API_URL}"

echo "Updating 4process..."
railway variables --service "4process" --set "VITE_API_URL=${API_URL}"

echo "Updating 4projects..."
railway variables --service "4projects" --set "VITE_API_URL=${API_URL}"

echo "Updating Site Health..."
railway variables --service "Site Health" --set "VITE_API_URL=${API_URL}"

echo "Updating Idea Circuit..."
railway variables --service "Idea Circuit" --set "VITE_API_URL=${API_URL}"

echo "Updating Official Notice..."
railway variables --service "Official Notice" --set "VITE_API_URL=${API_URL}"

echo ""
echo "✅ Frontend services updated"

echo ""
echo "========================================"
echo "✅ Quick Fixes Applied!"
echo "========================================"
echo ""
echo "⚠️  MANUAL ACTIONS STILL NEEDED:"
echo ""
echo "1. Restart Valkey-CTyp service in Railway dashboard"
echo "   (It crashed 7 hours ago)"
echo ""
echo "2. Delete these unnecessary services:"
echo "   - horizon"
echo "   - AI Storage???"
echo ""
echo "3. Rename these services in Railway dashboard:"
echo "   - 'taskjuggler' → 'taskjuggler-web'"
echo "   - '4calls' → '4Doctors'"
echo ""
echo "4. Create missing service:"
echo "   - coordinator (root dir: coordinator-web)"
echo ""
echo "5. Trigger redeployments:"
echo "   - All services should rebuild with the start scripts we added"
echo ""
echo "After completing these steps, all services should deploy successfully!"
echo ""
