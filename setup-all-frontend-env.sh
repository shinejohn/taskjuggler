#!/bin/bash
set -e

echo "=========================================="
echo "Setting Environment Variables for"
echo "ALL THREE Frontend Services"
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
echo "This will set VITE_API_URL for:"
echo "  1. taskjuggler-web"
echo "  2. projects-web"
echo "  3. process-web"
echo ""

# Confirm
read -p "Continue? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Cancelled."
    exit 1
fi

echo ""
echo -e "${YELLOW}Setting environment variables for all services...${NC}"
echo ""

# Set for taskjuggler-web
echo -e "${BLUE}[1/3] Setting VITE_API_URL for taskjuggler-web...${NC}"
if railway variables set VITE_API_URL="$API_URL" --service taskjuggler-web 2>/dev/null; then
    echo -e "${GREEN}✅ taskjuggler-web configured${NC}"
else
    echo -e "${RED}❌ Failed to set for taskjuggler-web${NC}"
fi

# Set for projects-web
echo -e "${BLUE}[2/3] Setting VITE_API_URL for projects-web...${NC}"
if railway variables set VITE_API_URL="$API_URL" --service projects-web 2>/dev/null; then
    echo -e "${GREEN}✅ projects-web configured${NC}"
else
    echo -e "${RED}❌ Failed to set for projects-web${NC}"
fi

# Set for process-web
echo -e "${BLUE}[3/3] Setting VITE_API_URL for process-web...${NC}"
if railway variables set VITE_API_URL="$API_URL" --service process-web 2>/dev/null; then
    echo -e "${GREEN}✅ process-web configured${NC}"
else
    echo -e "${RED}❌ Failed to set for process-web${NC}"
fi

echo ""
echo -e "${GREEN}=========================================="
echo "✅ Environment variables set for all services!"
echo "==========================================${NC}"
echo ""
echo "Variables set:"
echo "  ✅ taskjuggler-web: VITE_API_URL=$API_URL"
echo "  ✅ projects-web: VITE_API_URL=$API_URL"
echo "  ✅ process-web: VITE_API_URL=$API_URL"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Railway will automatically redeploy all services"
echo "2. Wait for deployments to complete"
echo "3. Test each frontend:"
echo "   - Task Juggler: https://taskjuggler-web-production.up.railway.app"
echo "   - Projects.ai: https://4projects.ai"
echo "   - Process.ai: https://4process.ai"
echo ""
echo "To verify:"
echo "  railway variables --service taskjuggler-web"
echo "  railway variables --service projects-web"
echo "  railway variables --service process-web"
echo ""

