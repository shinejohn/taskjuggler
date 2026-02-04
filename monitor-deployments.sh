#!/bin/bash

# Railway AI Tools - Deployment Monitor
# Checks the status of all deployed services

echo "🔍 Railway AI Tools - Deployment Monitor"
echo "=========================================="
echo ""

cd /Users/johnshine/Dropbox/Fibonacco/taskjuggler/Code/taskjuggler-api

SERVICES=("taskjuggler" "4Doctors" "URPA" "4process" "4projects" "Site Health" "Idea Circuit")

for service in "${SERVICES[@]}"; do
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "📦 Service: $service"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    
    # Get last 10 lines of logs
    echo "Latest logs:"
    railway logs --service "$service" 2>&1 | tail -10
    
    echo ""
done

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Monitoring complete!"
echo ""
echo "To view live logs for a specific service:"
echo "  railway logs --service taskjuggler"
echo ""
echo "To check build logs:"
echo "  railway logs --service taskjuggler --build"
echo ""
echo "Railway Dashboard:"
echo "  https://railway.app/project/7e7372dd-373a-4e78-a51e-15eab332b67d"
echo ""
