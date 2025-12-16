#!/bin/bash
set -e

echo "=========================================="
echo "Railway Custom Domains Setup"
echo "for taskjuggler.ai, 4process.ai, 4projects.ai"
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

echo -e "${BLUE}This script will add custom domains to Railway services:${NC}"
echo "  • taskjuggler.ai → taskjuggler-web"
echo "  • 4process.ai → process-web"
echo "  • 4projects.ai → projects-web"
echo ""
echo -e "${YELLOW}Note: You'll need to add DNS records at your domain registrar${NC}"
echo "Railway will show you the DNS records after adding each domain."
echo ""

# Confirm
read -p "Continue? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Cancelled."
    exit 1
fi

echo ""
echo -e "${YELLOW}Adding custom domains...${NC}"
echo ""

# Add taskjuggler.ai
echo -e "${BLUE}[1/3] Adding taskjuggler.ai to taskjuggler-web...${NC}"
if railway domain add taskjuggler.ai --service taskjuggler-web 2>/dev/null; then
    echo -e "${GREEN}✅ taskjuggler.ai added${NC}"
    echo -e "${YELLOW}   → Check Railway dashboard for DNS records to add${NC}"
else
    echo -e "${RED}❌ Failed to add taskjuggler.ai${NC}"
    echo -e "${YELLOW}   → You may need to add it manually in Railway dashboard${NC}"
fi

# Add 4process.ai
echo -e "${BLUE}[2/3] Adding 4process.ai to process-web...${NC}"
if railway domain add 4process.ai --service process-web 2>/dev/null; then
    echo -e "${GREEN}✅ 4process.ai added${NC}"
    echo -e "${YELLOW}   → Check Railway dashboard for DNS records to add${NC}"
else
    echo -e "${RED}❌ Failed to add 4process.ai${NC}"
    echo -e "${YELLOW}   → You may need to add it manually in Railway dashboard${NC}"
fi

# Add 4projects.ai
echo -e "${BLUE}[3/3] Adding 4projects.ai to projects-web...${NC}"
if railway domain add 4projects.ai --service projects-web 2>/dev/null; then
    echo -e "${GREEN}✅ 4projects.ai added${NC}"
    echo -e "${YELLOW}   → Check Railway dashboard for DNS records to add${NC}"
else
    echo -e "${RED}❌ Failed to add 4projects.ai${NC}"
    echo -e "${YELLOW}   → You may need to add it manually in Railway dashboard${NC}"
fi

echo ""
echo -e "${GREEN}=========================================="
echo "✅ Domains added to Railway!"
echo "==========================================${NC}"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo ""
echo "1. Get DNS records from Railway:"
echo "   • Go to Railway Dashboard"
echo "   • For each service, go to Settings → Domains"
echo "   • Copy the DNS records shown"
echo ""
echo "2. Add DNS records at your domain registrar:"
echo "   • Go to your domain registrar (Namecheap, GoDaddy, etc.)"
echo "   • Add the DNS records Railway provided"
echo "   • Wait for DNS propagation (5-30 minutes)"
echo ""
echo "3. Railway will automatically:"
echo "   • Detect when DNS propagates"
echo "   • Provision SSL certificate (Let's Encrypt)"
echo "   • Enable HTTPS (1-5 minutes after DNS)"
echo ""
echo "4. Verify SSL certificates:"
echo "   curl -I https://taskjuggler.ai"
echo "   curl -I https://4process.ai"
echo "   curl -I https://4projects.ai"
echo ""
echo "To check domain status:"
echo "   railway domains --service taskjuggler-web"
echo "   railway domains --service process-web"
echo "   railway domains --service projects-web"
echo ""
echo -e "${BLUE}See RAILWAY_CUSTOM_DOMAINS_SSL.md for detailed instructions${NC}"
echo ""

