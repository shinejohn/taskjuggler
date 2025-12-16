#!/bin/bash
set -e

echo "=========================================="
echo "Railway Environment Variables Setup"
echo "for taskjuggler-web"
echo "=========================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Check Railway CLI
if ! command -v railway &> /dev/null; then
    echo -e "${RED}❌ Railway CLI not found${NC}"
    echo "Install with: npm install -g @railway/cli"
    exit 1
fi

# Check login
if ! railway whoami &> /dev/null; then
    echo -e "${RED}❌ Not logged in to Railway${NC}"
    echo "Login with: railway login"
    exit 1
fi

echo -e "${GREEN}✅ Railway CLI found and logged in${NC}"
echo ""

# Default values
API_URL="${1:-https://api-web-production-cc91.up.railway.app/api}"
PUSHER_KEY="${2:-}"
PUSHER_CLUSTER="${3:-mt1}"

echo -e "${BLUE}Configuration:${NC}"
echo "  API URL: $API_URL"
if [ -n "$PUSHER_KEY" ]; then
    echo "  Pusher Key: $PUSHER_KEY"
    echo "  Pusher Cluster: $PUSHER_CLUSTER"
else
    echo "  Pusher: Not configured (optional)"
fi
echo ""

# Confirm
read -p "Continue? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Cancelled."
    exit 1
fi

echo ""
echo -e "${YELLOW}Setting environment variables...${NC}"

# Set VITE_API_URL (required)
echo -e "${BLUE}Setting VITE_API_URL...${NC}"
railway variables set VITE_API_URL="$API_URL" --service taskjuggler-web
echo -e "${GREEN}✅ VITE_API_URL set${NC}"

# Set Pusher variables if provided
if [ -n "$PUSHER_KEY" ]; then
    echo -e "${BLUE}Setting Pusher variables...${NC}"
    railway variables set VITE_PUSHER_APP_KEY="$PUSHER_KEY" --service taskjuggler-web
    railway variables set VITE_PUSHER_APP_CLUSTER="$PUSHER_CLUSTER" --service taskjuggler-web
    echo -e "${GREEN}✅ Pusher variables set${NC}"
fi

echo ""
echo -e "${GREEN}=========================================="
echo "✅ Environment variables set successfully!"
echo "==========================================${NC}"
echo ""
echo "Variables set:"
echo "  ✅ VITE_API_URL=$API_URL"
if [ -n "$PUSHER_KEY" ]; then
    echo "  ✅ VITE_PUSHER_APP_KEY=$PUSHER_KEY"
    echo "  ✅ VITE_PUSHER_APP_CLUSTER=$PUSHER_CLUSTER"
fi
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Railway will automatically redeploy"
echo "2. Wait for deployment to complete"
echo "3. Test at: https://taskjuggler-web-production.up.railway.app"
echo ""
echo "To verify:"
echo "  railway variables --service taskjuggler-web"
echo ""

