#!/bin/bash

echo "=========================================="
echo "Checking SSL Certificate Status"
echo "for Railway Custom Domains"
echo "=========================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

domains=("taskjuggler.ai" "4process.ai" "4projects.ai")

for domain in "${domains[@]}"; do
    echo -e "${BLUE}Checking $domain...${NC}"
    
    # Check DNS
    dns_result=$(dig +short "$domain" 2>/dev/null | head -1)
    if [ -n "$dns_result" ]; then
        echo -e "  DNS: ${GREEN}✅ Resolved${NC} ($dns_result)"
    else
        echo -e "  DNS: ${RED}❌ Not resolved${NC}"
    fi
    
    # Check HTTPS
    https_status=$(curl -I -s -k "https://$domain" --max-time 5 2>&1 | head -1)
    if echo "$https_status" | grep -qE "HTTP/[12] (200|301|302)"; then
        echo -e "  HTTPS: ${GREEN}✅ Working${NC}"
        echo -e "  Status: $https_status"
    elif echo "$https_status" | grep -q "SSL\|certificate\|refused"; then
        echo -e "  HTTPS: ${YELLOW}⏳ SSL not ready yet${NC}"
    else
        echo -e "  HTTPS: ${YELLOW}⏳ Checking...${NC}"
        echo -e "  Response: $https_status"
    fi
    
    # Check certificate (if available)
    cert_info=$(echo | openssl s_client -connect "$domain:443" -servername "$domain" 2>/dev/null | openssl x509 -noout -subject -dates 2>/dev/null)
    if [ -n "$cert_info" ]; then
        echo -e "  Certificate: ${GREEN}✅ Valid${NC}"
        echo "$cert_info" | sed 's/^/    /'
    else
        echo -e "  Certificate: ${YELLOW}⏳ Not available yet${NC}"
    fi
    
    echo ""
done

echo -e "${BLUE}=========================================="
echo "Summary"
echo "==========================================${NC}"
echo ""
echo "If HTTPS shows '⏳ SSL not ready yet':"
echo "  • Wait 5-15 minutes after DNS propagates"
echo "  • Railway automatically provisions SSL"
echo "  • Check Railway dashboard for domain status"
echo ""
echo "If HTTPS shows '✅ Working':"
echo "  • SSL certificate is active!"
echo "  • Visit https://$domain in browser"
echo "  • Should see padlock 🔒 icon"
echo ""
echo "To check in Railway dashboard:"
echo "  • Go to each service → Settings → Domains"
echo "  • Domain should show 'Active' status"
echo ""

