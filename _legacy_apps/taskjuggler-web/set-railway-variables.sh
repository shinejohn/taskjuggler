#!/bin/bash
set -e

echo "=== Setting Railway Environment Variables for taskjuggler-web ==="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo -e "${RED}Error: Railway CLI is not installed${NC}"
    echo "Install it with: npm install -g @railway/cli"
    exit 1
fi

# Check if logged in
if ! railway whoami &> /dev/null; then
    echo -e "${RED}Error: Not logged in to Railway${NC}"
    echo "Login with: railway login"
    exit 1
fi

echo -e "${YELLOW}This script will set environment variables for taskjuggler-web service${NC}"
echo ""

# Get API URL (default or prompt)
API_URL="${1:-https://api-web-production-cc91.up.railway.app/api}"

if [ -z "$1" ]; then
    echo -e "${YELLOW}Using default API URL: ${API_URL}${NC}"
    echo "To use a different URL, pass it as first argument:"
    echo "  ./set-railway-variables.sh https://your-api-url.com/api"
    echo ""
fi

# Set variables
echo -e "${GREEN}Setting environment variables...${NC}"

railway variables set VITE_API_URL="$API_URL" --service taskjuggler-web

echo ""
echo -e "${GREEN}✅ Environment variables set successfully!${NC}"
echo ""
echo "Variables set:"
echo "  VITE_API_URL=$API_URL"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Railway will automatically redeploy the service"
echo "2. Wait for deployment to complete"
echo "3. Test login at: https://taskjuggler-web-production.up.railway.app"
echo ""
echo "To verify variables are set:"
echo "  railway variables --service taskjuggler-web"

