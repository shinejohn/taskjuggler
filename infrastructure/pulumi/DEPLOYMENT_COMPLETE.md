# AWS Deployment Complete - Next Steps

## ✅ Infrastructure Deployed

All AWS infrastructure has been successfully deployed:
- **VPC**: `vpc-0fa97df292fff1f60`
- **Load Balancer**: `taskjuggler-production-alb-230168975.us-east-1.elb.amazonaws.com`
- **CloudFront**: `dc5qjuhw8pq20.cloudfront.net`
- **Database**: `taskjuggler-production-db.csr8wa00wss4.us-east-1.rds.amazonaws.com:5432`
- **Redis**: `master.taskjuggler-production-redis.yhbxhb.use1.cache.amazonaws.com`
- **ECR Repository**: `195430954683.dkr.ecr.us-east-1.amazonaws.com/taskjuggler-production`

## 📋 Remaining Steps

### 1. Build and Push Docker Image

```bash
cd /Users/johnshine/Dropbox/Fibonacco/taskjuggler/Code/infrastructure/pulumi
chmod +x build-and-push.sh
./build-and-push.sh
```

This will:
- Build the Docker image from `taskjuggler-api/Dockerfile`
- Push it to ECR repository `taskjuggler-production`

### 2. Update ECS Task Definitions

The ECS task definitions are already configured to use `:latest` tag. After pushing the image, update the services:

```bash
chmod +x update-ecs-image.sh
./update-ecs-image.sh [tag]
```

Or manually force new deployment:
```bash
aws ecs update-service \
  --cluster taskjuggler-production-cluster \
  --service taskjuggler-production-api \
  --force-new-deployment \
  --region us-east-1
```

### 3. Configure Environment Variables

Environment variables are automatically configured via Secrets Manager. Verify:

```bash
chmod +x configure-environment.sh
./configure-environment.sh
```

The ECS tasks are already configured to pull secrets from:
- Database credentials: Secrets Manager
- Redis password: Secrets Manager  
- Application secrets: Secrets Manager

### 4. Run Database Migrations

After the API service is running with the new image:

```bash
chmod +x run-migrations.sh
./run-migrations.sh
```

This will:
- Run a one-time ECS task to execute `php artisan migrate --force`
- Wait for completion and show logs if it fails

### 5. Configure HTTPS Listener

After SSL certificate is validated:

```bash
chmod +x configure-https.sh
./configure-https.sh [domain-name]
```

**Prerequisites:**
- Certificate must be validated via Route53 DNS records
- Check certificate status: `aws acm describe-certificate --certificate-arn <arn> --region us-east-1`

## 🔍 Verification Steps

### Check ECS Services Status
```bash
aws ecs describe-services \
  --cluster taskjuggler-production-cluster \
  --services taskjuggler-production-api taskjuggler-production-worker \
  --region us-east-1 \
  --query 'services[*].{Name:serviceName,Status:status,Running:runningCount,Desired:desiredCount}'
```

### Check Application Health
```bash
curl http://taskjuggler-production-alb-230168975.us-east-1.elb.amazonaws.com/api/health
```

### View Logs
```bash
aws logs tail /ecs/taskjuggler-production-logs --follow --region us-east-1
```

### Check Database Connection
```bash
# Get database credentials from Secrets Manager
aws secretsmanager get-secret-value \
  --secret-id taskjuggler/production/db \
  --region us-east-1 \
  --query SecretString --output text | jq .
```

## 📝 Important Notes

1. **Docker Image**: Must be built and pushed before ECS services can start
2. **Database Migrations**: Run after first successful API deployment
3. **SSL Certificate**: Requires DNS validation via Route53 before HTTPS can be enabled
4. **Environment Variables**: Already configured via Secrets Manager - no manual setup needed
5. **Monitoring**: CloudWatch dashboard available at AWS Console

## 🚀 Quick Start Commands

```bash
# 1. Build and push image
cd infrastructure/pulumi && ./build-and-push.sh

# 2. Update services (automatic with :latest tag, or force update)
./update-ecs-image.sh

# 3. Run migrations
./run-migrations.sh

# 4. Configure HTTPS (after certificate validation)
./configure-https.sh taskjuggler.com
```

## 📊 Monitoring

- **CloudWatch Dashboard**: `taskjuggler-production-dashboard`
- **Logs**: `/ecs/taskjuggler-production-logs`
- **Alarms**: CPU, Memory, ALB response time, 5xx errors

## 🔐 Security

- All secrets stored in AWS Secrets Manager
- IAM roles configured for least privilege access
- SSL/TLS encryption enabled
- VPC isolation with private subnets for compute

## 📞 Support

If you encounter issues:
1. Check CloudWatch logs
2. Verify ECS task status
3. Check Secrets Manager for correct credentials
4. Verify security group rules allow traffic
