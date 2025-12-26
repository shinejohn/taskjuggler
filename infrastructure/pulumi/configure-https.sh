#!/bin/bash
# Configure HTTPS listener with validated SSL certificate

set -e

AWS_REGION="us-east-1"
PROJECT_NAME="taskjuggler"
ENVIRONMENT="production"
DOMAIN_NAME="${1:-taskjuggler.com}"

echo "Configuring HTTPS listener..."

# Get ALB ARN
ALB_ARN=$(aws elbv2 describe-load-balancers --region $AWS_REGION --query "LoadBalancers[?contains(LoadBalancerName, '$PROJECT_NAME-$ENVIRONMENT')].LoadBalancerArn" --output text)

# Get certificate ARN
CERT_ARN=$(aws acm list-certificates --region $AWS_REGION --query "CertificateSummaryList[?contains(DomainName, '$DOMAIN_NAME')].CertificateArn" --output text | head -1)

if [ -z "$CERT_ARN" ]; then
    echo "Error: Certificate not found for domain $DOMAIN_NAME"
    echo "Please validate the certificate first via Route53 DNS records"
    exit 1
fi

echo "ALB ARN: $ALB_ARN"
echo "Certificate ARN: $CERT_ARN"

# Check if certificate is validated
CERT_STATUS=$(aws acm describe-certificate --certificate-arn $CERT_ARN --region $AWS_REGION --query 'Certificate.Status' --output text)

if [ "$CERT_STATUS" != "ISSUED" ]; then
    echo "Warning: Certificate status is $CERT_STATUS (not ISSUED)"
    echo "Certificate must be validated before creating HTTPS listener"
    echo "Check DNS validation records in Route53"
    exit 1
fi

# Get target group ARN
TG_ARN=$(aws elbv2 describe-target-groups --region $AWS_REGION --query "TargetGroups[?contains(TargetGroupName, '$PROJECT_NAME-$ENVIRONMENT-api')].TargetGroupArn" --output text)

# Create HTTPS listener
HTTPS_LISTENER_ARN=$(aws elbv2 create-listener \
    --load-balancer-arn $ALB_ARN \
    --protocol HTTPS \
    --port 443 \
    --ssl-policy ELBSecurityPolicy-TLS13-1-2-2021-06 \
    --certificates CertificateArn=$CERT_ARN \
    --default-actions Type=forward,TargetGroupArn=$TG_ARN \
    --region $AWS_REGION \
    --query 'Listeners[0].ListenerArn' \
    --output text)

echo "✓ HTTPS listener created: $HTTPS_LISTENER_ARN"

# Update HTTP listener to redirect to HTTPS
HTTP_LISTENER_ARN=$(aws elbv2 describe-listeners --load-balancer-arn $ALB_ARN --region $AWS_REGION --query "Listeners[?Port==\`80\`].ListenerArn" --output text)

aws elbv2 modify-listener \
    --listener-arn $HTTP_LISTENER_ARN \
    --default-actions Type=redirect,RedirectConfig="{Protocol=HTTPS,Port=443,StatusCode=HTTP_301}" \
    --region $AWS_REGION \
    --query 'Listeners[0].ListenerArn' \
    --output text

echo "✓ HTTP listener updated to redirect to HTTPS"

echo ""
echo "HTTPS configuration complete!"
echo "Your application is now accessible via HTTPS at: https://$DOMAIN_NAME"
