# Quick Start Guide - Complete AWS Deployment

## ✅ What's Been Done

1. **Infrastructure Deployed**: 97 AWS resources created and configured
2. **Dockerfile Created**: Production-ready Dockerfile in `taskjuggler-api/Dockerfile`
3. **Deployment Scripts Created**: All automation scripts ready to execute
4. **HTTPS Listener Code**: Added to infrastructure (ready after cert validation)

## 🚀 Execute These Commands (In Order)

### Step 1: Build and Push Docker Image

**Note**: Requires Docker to be installed. If Docker is not available, install it first or use a CI/CD system.

```bash
cd /Users/johnshine/Dropbox/Fibonacco/taskjuggler/Code/infrastructure/pulumi
./build-and-push.sh
```

This script:
- Logs into ECR
- Builds the Docker image from `taskjuggler-api/Dockerfile`
- Tags it as `latest`
- Pushes to `195430954683.dkr.ecr.us-east-1.amazonaws.com/taskjuggler-production:latest`

### Step 2: Update ECS Services

After the image is pushed, update the ECS services:

```bash
./update-ecs-image.sh
```

Or manually:
```bash
aws ecs update-service \
  --cluster taskjuggler-production-cluster \
  --service taskjuggler-production-api \
  --force-new-deployment \
  --region us-east-1

aws ecs update-service \
  --cluster taskjuggler-production-cluster \
  --service taskjuggler-production-worker \
  --force-new-deployment \
  --region us-east-1
```

### Step 3: Verify Services Are Running

```bash
aws ecs describe-services \
  --cluster taskjuggler-production-cluster \
  --services taskjuggler-production-api taskjuggler-production-worker \
  --region us-east-1 \
  --query 'services[*].{Name:serviceName,Running:runningCount,Desired:desiredCount,Status:status}'
```

Wait until `runningCount` equals `desiredCount` for both services.

### Step 4: Run Database Migrations

Once services are running:

```bash
./run-migrations.sh
```

This will:
- Create a one-time ECS task
- Run `php artisan migrate --force`
- Show logs if it fails

### Step 5: Configure HTTPS (After Certificate Validation)

**First, validate the SSL certificate:**

1. Get certificate validation records:
```bash
aws acm describe-certificate \
  --certificate-arn <cert-arn> \
  --region us-east-1 \
  --query 'Certificate.DomainValidationOptions'
```

2. Add DNS records to Route53 (if not already done)

3. Wait for certificate status to be "ISSUED"

4. Then configure HTTPS:
```bash
./configure-https.sh taskjuggler.com
```

## 📋 Current Infrastructure Status

### ECS Services
- **API Service**: Configured, waiting for Docker image
- **Worker Service**: Configured, waiting for Docker image  
- **Scheduler**: Configured via EventBridge

### Database
- **RDS PostgreSQL**: Running at `taskjuggler-production-db.csr8wa00wss4.us-east-1.rds.amazonaws.com:5432`
- **Credentials**: Stored in Secrets Manager

### Cache
- **ElastiCache Redis**: Running at `master.taskjuggler-production-redis.yhbxhb.use1.cache.amazonaws.com`
- **Auth Token**: Stored in Secrets Manager

### Load Balancer
- **ALB**: `taskjuggler-production-alb-230168975.us-east-1.elb.amazonaws.com`
- **HTTP Listener**: Configured (will redirect to HTTPS after cert validation)
- **HTTPS Listener**: Code ready, needs certificate validation

### Secrets Manager
All secrets are configured:
- Database credentials: `taskjuggler/production/db`
- Application secrets: `taskjuggler/production/app`
- Redis secret: `taskjuggler/production/redis`

## 🔍 Troubleshooting

### If Docker Build Fails
- Ensure Docker is installed: `docker --version`
- Check Dockerfile syntax
- Verify AWS credentials are set

### If ECS Services Won't Start
- Check CloudWatch logs: `/ecs/taskjuggler-production-logs`
- Verify task definition uses correct image URI
- Check security group rules
- Verify Secrets Manager permissions

### If Migrations Fail
- Check database connectivity
- Verify credentials in Secrets Manager
- Check ECS task logs
- Ensure database subnet group allows connections

### If HTTPS Configuration Fails
- Verify certificate status is "ISSUED"
- Check DNS validation records
- Verify certificate ARN is correct
- Check ALB listener limits (max 50 per ALB)

## 📊 Monitoring

View logs in real-time:
```bash
aws logs tail /ecs/taskjuggler-production-logs --follow --region us-east-1
```

Check service health:
```bash
curl http://taskjuggler-production-alb-230168975.us-east-1.elb.amazonaws.com/api/health
```

View CloudWatch dashboard:
- AWS Console → CloudWatch → Dashboards → `taskjuggler-production-dashboard`

## ✅ Completion Checklist

- [ ] Docker image built and pushed to ECR
- [ ] ECS services updated and running
- [ ] Database migrations completed
- [ ] SSL certificate validated
- [ ] HTTPS listener configured
- [ ] Application accessible via HTTPS
- [ ] Health check endpoint responding
- [ ] Logs streaming correctly

## 🎯 Next Steps After Deployment

1. **Configure Domain**: Point DNS to CloudFront or ALB
2. **Set Up CI/CD**: Automate Docker builds and deployments
3. **Configure Monitoring Alerts**: Set up SNS notifications for alarms
4. **Backup Strategy**: Configure RDS automated backups
5. **Scaling**: Set up auto-scaling policies if needed

## 📞 Support

All scripts are in `/Users/johnshine/Dropbox/Fibonacco/taskjuggler/Code/infrastructure/pulumi/`

For detailed information, see `DEPLOYMENT_COMPLETE.md`
