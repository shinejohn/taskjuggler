#!/bin/bash
set -e

echo "=========================================="
echo "Railway Environment Variables Setup"
echo "for projects-web (4projects)"
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

# Default API URL
API_URL="${1:-https://api-web-production-cc91.up.railway.app/api}"

echo -e "${BLUE}Configuration:${NC}"
echo "  API URL: $API_URL"
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
railway variables set VITE_API_URL="$API_URL" --service projects-web
echo -e "${GREEN}✅ VITE_API_URL set${NC}"

echo ""
echo -e "${GREEN}=========================================="
echo "✅ Environment variables set successfully!"
echo "==========================================${NC}"
echo ""
echo "Variables set:"
echo "  ✅ VITE_API_URL=$API_URL"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Railway will automatically redeploy"
echo "2. Wait for deployment to complete"
echo "3. Test at: https://4projects.ai (or your Railway URL)"
echo ""
echo "To verify:"
echo "  railway variables --service projects-web"
echo ""

