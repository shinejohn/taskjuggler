#!/bin/bash
# Complete deployment script - runs all steps in order

set -e

AWS_REGION="us-east-1"
PROJECT_NAME="taskjuggler"
ENVIRONMENT="production"
DOMAIN_NAME="${1:-taskjuggler.com}"

echo "=========================================="
echo "Task Juggler - Complete Deployment"
echo "=========================================="
echo ""

# Step 1: Fix CodeBuild if needed
echo "Step 1: Checking CodeBuild configuration..."
if ! ./check-build-logs.sh | grep -q "Source Type: S3"; then
    echo "Fixing CodeBuild configuration..."
    ./fix-codebuild.sh
else
    echo "✓ CodeBuild configuration OK"
fi
echo ""

# Step 2: Trigger build
echo "Step 2: Triggering Docker build..."
./trigger-build.sh
echo ""

# Step 3: Update ECS services
echo "Step 3: Updating ECS services..."
./update-ecs-services.sh
echo ""

# Step 4: Run migrations
echo "Step 4: Running database migrations..."
./run-migrations.sh
echo ""

# Step 5: Check SSL certificate
echo "Step 5: Checking SSL certificate..."
./check-ssl-cert.sh "$DOMAIN_NAME"
echo ""

# Step 6: Configure HTTPS if certificate is ready
CERT_STATUS=$(aws acm list-certificates \
    --region $AWS_REGION \
    --query "CertificateSummaryList[?contains(DomainName, '$DOMAIN_NAME')].CertificateArn" \
    --output text | head -1 | xargs -I {} aws acm describe-certificate \
    --certificate-arn {} \
    --region $AWS_REGION \
    --query 'Certificate.Status' \
    --output text 2>/dev/null || echo "NOT_FOUND")

if [ "$CERT_STATUS" = "ISSUED" ]; then
    echo "Step 6: Configuring HTTPS listener..."
    ./configure-https.sh "$DOMAIN_NAME"
    echo ""
else
    echo "Step 6: SSL certificate not ready (Status: $CERT_STATUS)"
    echo "  Run ./check-ssl-cert.sh $DOMAIN_NAME to check status"
    echo "  Then run ./configure-https.sh $DOMAIN_NAME when ready"
    echo ""
fi

# Step 7: Get ALB DNS
echo "Step 7: Getting load balancer URL..."
ALB_DNS=$(aws elbv2 describe-load-balancers \
    --region $AWS_REGION \
    --query "LoadBalancers[?contains(LoadBalancerName, '$PROJECT_NAME-$ENVIRONMENT')].DNSName" \
    --output text)

echo ""
echo "=========================================="
echo "Deployment Complete!"
echo "=========================================="
echo ""
echo "Application URLs:"
echo "  HTTP:  http://$ALB_DNS"
if [ "$CERT_STATUS" = "ISSUED" ]; then
    echo "  HTTPS: https://$DOMAIN_NAME"
else
    echo "  HTTPS: (pending certificate validation)"
fi
echo ""
echo "Health Check:"
echo "  curl http://$ALB_DNS/api/health"
echo ""
echo "Next steps:"
echo "1. Verify application is responding"
echo "2. Test API endpoints"
echo "3. Monitor CloudWatch logs"
echo ""
