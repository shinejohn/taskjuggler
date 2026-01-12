# Complete Pulumi Cloud Deployment Guide
## Following Pulumi Best Practices

**Reference**: https://github.com/pulumi/docs

---

## Current Status

✅ **Stack Created**: `shinejohn/TaskJuggler/production`  
✅ **Configuration Set**: Basic config values configured  
✅ **Preview Working**: Shows 113 resources ready to deploy  
⚠️ **Not Deployed**: Resources haven't been created yet

---

## Prerequisites

1. **Pulumi CLI**: v3.213.0 ✅ Installed
2. **Pulumi Cloud Account**: ✅ Logged in as `shinejohn`
3. **AWS Credentials**: Configured
4. **Python Dependencies**: Installed in virtual environment

---

## Complete Deployment Steps

### Step 1: Verify Stack Configuration

```bash
cd infrastructure/pulumi
source venv/bin/activate

# Check stack
pulumi stack --show-name

# Verify configuration
pulumi config
```

### Step 2: Review Preview

```bash
# Preview what will be created
pulumi preview
```

This shows all 113 resources that will be created.

### Step 3: Deploy Infrastructure

**Option A: Automated Script (Recommended)**

```bash
./deploy-to-cloud.sh
```

**Option B: Manual Deployment**

```bash
# Refresh state first
pulumi refresh --yes

# Preview changes
pulumi preview

# Deploy
pulumi up --yes
```

### Step 4: Verify Deployment

After deployment completes:

```bash
# View outputs
pulumi stack output

# View resources
pulumi stack --show-urns

# View in Pulumi Cloud
pulumi stack ls
```

---

## What Gets Deployed

The deployment creates **113 AWS resources** including:

- **Networking**: VPC, subnets, NAT gateways, security groups
- **Database**: RDS PostgreSQL Multi-AZ
- **Cache**: ElastiCache Redis cluster
- **Storage**: S3 buckets for app files and backups
- **Compute**: ECS Fargate cluster with API, worker, and scheduler services
- **Load Balancing**: Application Load Balancer
- **CDN**: CloudFront distribution
- **DNS**: Route53 hosted zone and records
- **Monitoring**: CloudWatch dashboards and alarms
- **Messaging**: SNS topics and SQS queues
- **Security**: IAM roles, Secrets Manager
- **Scanner**: ECS service, SQS queue, S3 bucket for SiteHealth Scanner

---

## Pulumi Best Practices Applied

### ✅ 1. Version Control
- Infrastructure code is in Git
- All changes tracked

### ✅ 2. Organized Project Structure
- Modular infrastructure components
- Clear separation of concerns

### ✅ 3. Environment-Specific Configuration
- Using Pulumi config for environment values
- Stack-based isolation

### ✅ 4. Secure Secrets Management
- Using Pulumi secrets for sensitive data
- Redis auth token stored as secret

### ✅ 5. Idempotent Code
- All resources defined declaratively
- Multiple runs produce same result

### ✅ 6. Stack Management
- Using stacks for environment isolation
- Production stack properly configured

---

## Deployment Outputs

After successful deployment, you'll get:

```bash
Outputs:
  cloudfront_url     : "https://d1234567890.cloudfront.net"
  database_endpoint  : "taskjuggler-production.xxxxx.us-east-1.rds.amazonaws.com"
  environment        : "production"
  load_balancer_dns  : "taskjuggler-production-alb-xxxxx.us-east-1.elb.amazonaws.com"
  project_name       : "taskjuggler"
  redis_endpoint     : "taskjuggler-production-redis.xxxxx.cache.amazonaws.com"
  scanner_bucket_name: "taskjuggler-production-scanner-xxxxx"
  scanner_queue_url  : "https://sqs.us-east-1.amazonaws.com/xxxxx/taskjuggler-production-scanner-queue"
  scanner_repo_url    : "xxxxx.dkr.ecr.us-east-1.amazonaws.com/taskjuggler-production-scanner"
  vpc_id             : "vpc-xxxxx"
```

---

## Viewing in Pulumi Cloud

After deployment, view your infrastructure at:

**https://app.pulumi.com/shinejohn/TaskJuggler/production**

You'll see:
- All 113 resources
- Resource relationships graph
- Update history
- Configuration values
- Outputs and exports
- Resource details and status

---

## Troubleshooting

### Issue: "Preview shows 0 resources"

**Solution**: Make sure you're in the correct directory and virtual environment:
```bash
cd infrastructure/pulumi
source venv/bin/activate
pulumi preview
```

### Issue: "Authentication failed"

**Solution**: Login to Pulumi Cloud:
```bash
pulumi login https://api.pulumi.com
```

### Issue: "Missing configuration"

**Solution**: Set required config:
```bash
pulumi config set aws:region us-east-1
pulumi config set project_name taskjuggler
pulumi config set environment production
```

### Issue: "Deployment fails"

**Solution**: Check logs:
```bash
# View deployment log
cat deploy.log

# Check specific resource errors
pulumi stack --show-urns | grep -i error
```

---

## Next Steps After Deployment

1. **Verify Resources**: Check AWS Console to confirm resources created
2. **Configure DNS**: Update Route53 records if needed
3. **Deploy Application**: Build and push Docker images to ECR
4. **Run Migrations**: Execute Laravel migrations on RDS
5. **Test Endpoints**: Verify API endpoints are accessible
6. **Monitor**: Check CloudWatch dashboards

---

## Automated Deployment Script

Use the provided script for complete deployment:

```bash
cd infrastructure/pulumi
./deploy-to-cloud.sh
```

This script:
- ✅ Verifies prerequisites
- ✅ Checks Pulumi Cloud connection
- ✅ Refreshes stack state
- ✅ Previews changes
- ✅ Deploys infrastructure
- ✅ Shows outputs and stack URL

---

**Ready to deploy!** Run `./deploy-to-cloud.sh` or `pulumi up --yes` to create all 113 resources in Pulumi Cloud.





