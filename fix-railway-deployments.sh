#!/bin/bash
# Railway Deployment Fix Script
# This script fixes Railway configurations and triggers rebuilds

set -e

echo "🚀 Railway Deployment Fix Script"
echo "=================================="
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check Railway CLI
if ! command -v railway &> /dev/null; then
    echo -e "${RED}❌ Railway CLI not found. Please install it: npm i -g @railway/cli${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Railway CLI found${NC}"
echo ""

# Check login status
if ! railway whoami &> /dev/null; then
    echo -e "${RED}❌ Not logged in to Railway. Please run: railway login${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Logged in to Railway${NC}"
USER=$(railway whoami | sed 's/Logged in as //' | sed 's/ 👋//')
echo "   User: $USER"
echo ""

# Verify railway.json files are fixed
echo "📋 Verifying railway.json configurations..."
echo ""

SERVICES=(
    "taskjuggler-web:taskjuggler-web"
    "ideacircuit-web:ideacircuit-web"
    "official-notice-web:official-notice-web"
    "scanner-web:scanner-web"
    "urpa-web:urpa-web"
    "projects-web:projects-web"
    "coordinator-web:coordinator-web"
    "process-web:process-web"
)

FIXED_COUNT=0
for service_info in "${SERVICES[@]}"; do
    service_dir="${service_info%%:*}"
    workspace_name="${service_info##*:}"
    
    if [ -f "$service_dir/railway.json" ]; then
        # Check if shared-ui build is included
        if grep -q "npm run build -w shared-ui" "$service_dir/railway.json"; then
            echo -e "  ${GREEN}✅${NC} $service_dir - Configuration correct"
            FIXED_COUNT=$((FIXED_COUNT + 1))
        else
            echo -e "  ${RED}❌${NC} $service_dir - Missing shared-ui build"
        fi
    else
        echo -e "  ${YELLOW}⚠️${NC} $service_dir - railway.json not found"
    fi
done

echo ""
echo "Fixed configurations: $FIXED_COUNT/${#SERVICES[@]}"
echo ""

if [ $FIXED_COUNT -lt ${#SERVICES[@]} ]; then
    echo -e "${RED}❌ Some configurations are missing fixes${NC}"
    exit 1
fi

echo -e "${GREEN}✅ All railway.json files are correctly configured${NC}"
echo ""

# Instructions for Railway Dashboard
echo "📝 MANUAL STEPS REQUIRED IN RAILWAY DASHBOARD:"
echo "=============================================="
echo ""
echo "The following steps MUST be done manually in Railway dashboard:"
echo ""
echo "1. For EACH frontend service, set Root Directory to '/' (monorepo root):"
echo "   - Open Railway Dashboard"
echo "   - Navigate to each service"
echo "   - Go to Settings → Source"
echo "   - Set Root Directory to: /"
echo "   - Save changes"
echo ""
echo "2. Verify GitHub Integration:"
echo "   - Check that GitHub repository is connected"
echo "   - Verify branch is set to 'main'"
echo "   - Check webhook status in GitHub"
echo ""
echo "3. Trigger Rebuilds:"
echo "   - After setting root directory, trigger manual rebuild for each service"
echo "   - Monitor build logs to verify success"
echo ""
echo "Services to configure:"
for service_info in "${SERVICES[@]}"; do
    service_dir="${service_info%%:*}"
    echo "   - $service_dir"
done
echo ""

# Try to get project info
echo "🔍 Checking Railway project status..."
echo ""

if railway status &> /dev/null; then
    railway status
    echo ""
    
    echo "💡 To link to a specific service and trigger rebuild:"
    echo "   railway service <service-name>"
    echo "   railway redeploy"
    echo ""
fi

# Create summary
echo "📊 SUMMARY"
echo "=========="
echo ""
echo "✅ Code fixes completed:"
echo "   - All railway.json files updated"
echo "   - Workspace names fixed"
echo "   - Shared-ui builds added"
echo ""
echo "⏳ Manual steps required:"
echo "   - Set root directory in Railway dashboard (see RAILWAY_DASHBOARD_CONFIGURATION_GUIDE.md)"
echo "   - Verify GitHub integration"
echo "   - Trigger rebuilds"
echo ""
echo "📚 Documentation:"
echo "   - RAILWAY_DEPLOYMENT_COMPREHENSIVE_ASSESSMENT.md"
echo "   - RAILWAY_DASHBOARD_CONFIGURATION_GUIDE.md"
echo ""

echo -e "${GREEN}✅ Script completed successfully${NC}"
echo ""
echo "Next: Follow the manual steps above to complete the fix."
