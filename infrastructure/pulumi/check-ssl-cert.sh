#!/bin/bash
# Check SSL certificate status and validation

set -e

AWS_REGION="us-east-1"
DOMAIN_NAME="${1:-taskjuggler.com}"

echo "=========================================="
echo "SSL Certificate Status Check"
echo "=========================================="
echo ""

# Find certificate
echo "Step 1: Finding certificate for $DOMAIN_NAME..."
CERT_ARN=$(aws acm list-certificates \
    --region $AWS_REGION \
    --query "CertificateSummaryList[?contains(DomainName, '$DOMAIN_NAME')].CertificateArn" \
    --output text | head -1)

if [ -z "$CERT_ARN" ]; then
    echo "✗ Certificate not found for $DOMAIN_NAME"
    echo ""
    echo "To create a certificate:"
    echo "  aws acm request-certificate \\"
    echo "    --domain-name $DOMAIN_NAME \\"
    echo "    --validation-method DNS \\"
    echo "    --region $AWS_REGION"
    exit 1
fi

echo "✓ Certificate found: $CERT_ARN"
echo ""

# Get certificate details
echo "Step 2: Certificate details..."
CERT_INFO=$(aws acm describe-certificate \
    --certificate-arn "$CERT_ARN" \
    --region $AWS_REGION \
    --query 'Certificate.{Status:Status,Domain:DomainName,Type:Type,Validation:DomainValidationOptions[*].{Domain:DomainName,Status:ValidationStatus,Record:ResourceRecord}}' \
    --output json)

STATUS=$(echo "$CERT_INFO" | jq -r '.Status')
DOMAIN=$(echo "$CERT_INFO" | jq -r '.Domain')
TYPE=$(echo "$CERT_INFO" | jq -r '.Type')

echo "Status: $STATUS"
echo "Domain: $DOMAIN"
echo "Type: $TYPE"
echo ""

# Check validation records
if [ "$STATUS" != "ISSUED" ]; then
    echo "Step 3: DNS Validation Records..."
    echo "----------------------------------------"
    
    VALIDATION_RECORDS=$(echo "$CERT_INFO" | jq -r '.Validation[]')
    
    if [ -n "$VALIDATION_RECORDS" ] && [ "$VALIDATION_RECORDS" != "null" ]; then
        echo "$CERT_INFO" | jq -r '.Validation[] | "Domain: \(.Domain)\nStatus: \(.Status)\nRecord Name: \(.Record.Name)\nRecord Type: \(.Record.Type)\nRecord Value: \(.Record.Value)\n"'
        
        echo ""
        echo "To validate the certificate:"
        echo "1. Add the DNS records above to your Route53 hosted zone"
        echo "2. Wait 5-15 minutes for DNS propagation"
        echo "3. Run this script again to check status"
    else
        echo "⚠ No validation records found"
        echo "Certificate may be using email validation"
    fi
else
    echo "✓ Certificate is ISSUED and ready to use!"
    echo ""
    echo "Step 3: Configure HTTPS listener..."
    echo "Run: ./configure-https.sh $DOMAIN_NAME"
fi

echo ""
echo "=========================================="
echo "Certificate Check Complete"
echo "=========================================="
