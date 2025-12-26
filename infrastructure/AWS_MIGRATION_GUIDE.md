# Task Juggler AWS Migration Guide

Complete guide for migrating from Railway to AWS using Pulumi infrastructure as code.

## Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Architecture Mapping](#architecture-mapping)
4. [Infrastructure Setup](#infrastructure-setup)
5. [Application Migration](#application-migration)
6. [Data Migration](#data-migration)
7. [DNS and SSL](#dns-and-ssl)
8. [Monitoring and Alerts](#monitoring-and-alerts)
9. [Cost Optimization](#cost-optimization)
10. [Rollback Plan](#rollback-plan)

## Overview

This guide covers migrating Task Juggler from Railway to AWS, including:
- Complete infrastructure as code using Pulumi/Python
- All AWS services properly configured
- Monitoring and alerting setup
- Cost optimization strategies
- Migration procedures

## Prerequisites

### AWS Account Setup

1. **AWS Account**: `195430954683`
2. **Access Credentials**: Located in `../thefae`
3. **Region**: `us-east-1` (recommended)

### Required Tools

```bash
# Install Pulumi
curl -fsSL https://get.pulumi.com | sh

# Install Python dependencies
pip install -r infrastructure/pulumi/requirements.txt

# Install AWS CLI
brew install awscli  # macOS
# or
pip install awscli

# Configure AWS credentials
aws configure
# Enter: Access Key ID, Secret Access Key, Region (us-east-1)
```

### Laravel Application Updates

1. Install AWS SDK:
```bash
cd taskjuggler-api
composer require aws/aws-sdk-php
composer require league/flysystem-aws-s3-v3
```

2. Update `config/filesystems.php`:
```php
's3' => [
    'driver' => 's3',
    'key' => env('AWS_ACCESS_KEY_ID'),
    'secret' => env('AWS_SECRET_ACCESS_KEY'),
    'region' => env('AWS_DEFAULT_REGION'),
    'bucket' => env('AWS_BUCKET'),
    'url' => env('AWS_URL'),
    'endpoint' => env('AWS_ENDPOINT'),
    'use_path_style_endpoint' => env('AWS_USE_PATH_STYLE_ENDPOINT', false),
],
```

## Architecture Mapping

### Service Equivalents

| Component | Railway | AWS | Notes |
|-----------|---------|-----|-------|
| Web App | Web Service | ECS Fargate + ALB | Auto-scaling, load balanced |
| Queue Worker | Worker Service | ECS Fargate Task | Separate service |
| Scheduler | Cron Service | EventBridge + ECS Task | Event-driven |
| Database | PostgreSQL | RDS PostgreSQL Multi-AZ | High availability |
| Cache | Redis | ElastiCache Redis | Cluster mode |
| File Storage | N/A | S3 | Object storage |
| Real-time | Pusher | SNS + WebSockets | Native AWS |
| Email | SendGrid | SES | Cost-effective |
| Monitoring | Railway Metrics | CloudWatch | Comprehensive |

## Infrastructure Setup

### Step 1: Initialize Pulumi Stack

```bash
cd infrastructure/pulumi
pulumi stack init production
pulumi config set aws:region us-east-1
```

### Step 2: Configure Secrets

```bash
# Database
pulumi config set db_username taskjuggler
pulumi config set --secret db_password <generate-strong-password>
pulumi config set db_instance_class db.t3.medium

# Redis
pulumi config set --secret redis_auth_token <generate-strong-token>

# Application secrets
pulumi config set --secret app_key <laravel-app-key>
pulumi config set --secret twilio_account_sid <from-railway>
pulumi config set --secret twilio_auth_token <from-railway>
pulumi config set --secret openrouter_api_key <from-railway>
pulumi config set --secret stripe_key <from-railway>
pulumi config set --secret stripe_secret <from-railway>
pulumi config set --secret stripe_webhook_secret <from-railway>

# DNS
pulumi config set domain_name taskjuggler.com
```

### Step 3: Preview Infrastructure

```bash
pulumi preview
```

Review all resources that will be created.

### Step 4: Deploy Infrastructure

```bash
pulumi up
```

This will create:
- VPC and networking
- RDS PostgreSQL database
- ElastiCache Redis cluster
- S3 buckets
- ECS cluster and services
- Application Load Balancer
- CloudFront distribution
- CloudWatch monitoring
- Route53 DNS records

### Step 5: Get Outputs

```bash
pulumi stack output
```

Save these outputs for application configuration.

## Application Migration

### Step 1: Build Docker Image

```bash
cd ../../taskjuggler-api

# Build image
docker build -t taskjuggler-api:latest .

# Get ECR repository URL from Pulumi outputs
ECR_REPO=$(pulumi stack output --json | jq -r '.ecr_repo_url')

# Login to ECR
aws ecr get-login-password --region us-east-1 | \
  docker login --username AWS --password-stdin $ECR_REPO

# Tag and push
docker tag taskjuggler-api:latest $ECR_REPO:latest
docker push $ECR_REPO:latest
```

### Step 2: Update ECS Task Definitions

The Pulumi code automatically configures ECS tasks with:
- Environment variables from Secrets Manager
- Proper IAM roles
- CloudWatch logging
- Health checks

### Step 3: Update Laravel Configuration

Create `.env.production`:

```env
APP_NAME="Task Juggler"
APP_ENV=production
APP_KEY=<from-secrets-manager>
APP_DEBUG=false
APP_URL=https://api.taskjuggler.com

LOG_CHANNEL=cloudwatch
LOG_LEVEL=info

DB_CONNECTION=pgsql
DB_HOST=<rds-endpoint-from-outputs>
DB_PORT=5432
DB_DATABASE=taskjuggler
DB_USERNAME=taskjuggler
DB_PASSWORD=<from-secrets-manager>

REDIS_HOST=<elasticache-endpoint-from-outputs>
REDIS_PASSWORD=<from-secrets-manager>
REDIS_PORT=6379

QUEUE_CONNECTION=redis

FILESYSTEM_DISK=s3
AWS_ACCESS_KEY_ID=<iam-role-handles>
AWS_SECRET_ACCESS_KEY=<iam-role-handles>
AWS_DEFAULT_REGION=us-east-1
AWS_BUCKET=<s3-bucket-from-outputs>

MAIL_MAILER=ses
MAIL_FROM_ADDRESS=noreply@taskjuggler.com
MAIL_FROM_NAME="Task Juggler"

BROADCAST_DRIVER=sns
```

## Data Migration

### Step 1: Export from Railway

```bash
# From Railway CLI or dashboard
railway connect postgres
pg_dump -h <railway-host> -U <user> -d <database> > backup.sql
```

### Step 2: Import to RDS

```bash
# Get RDS endpoint from Pulumi outputs
RDS_ENDPOINT=$(pulumi stack output database_endpoint)

# Import data
psql -h $RDS_ENDPOINT -U taskjuggler -d taskjuggler < backup.sql
```

### Step 3: Verify Data

```bash
# Connect and verify
psql -h $RDS_ENDPOINT -U taskjuggler -d taskjuggler
SELECT COUNT(*) FROM users;
SELECT COUNT(*) FROM tasks;
-- etc.
```

## DNS and SSL

### Step 1: Update DNS Records

The Pulumi code creates:
- Route53 A record for `api.taskjuggler.com` → ALB
- Route53 A record for `taskjuggler.com` → CloudFront

### Step 2: SSL Certificate

ACM certificate is automatically created and validated via DNS.

### Step 3: Update ALB Listener

After certificate validation, update ALB listener to use HTTPS:

```python
# Add to compute.py if not already present
https_listener = aws.lb.Listener(
    f"{project_name}-{environment}-https-listener",
    load_balancer_arn=alb.arn,
    port=443,
    protocol="HTTPS",
    ssl_policy="ELBSecurityPolicy-TLS13-1-2-2021-06",
    certificate_arn=dns_stack["certificate_arn"],
    default_actions=[aws.lb.ListenerDefaultActionArgs(
        type="forward",
        target_group_arn=api_target_group.arn,
    )],
)
```

## Monitoring and Alerts

### CloudWatch Dashboard

Access: AWS Console → CloudWatch → Dashboards

### Key Metrics to Monitor

1. **ECS Metrics**
   - CPU Utilization
   - Memory Utilization
   - Task Count

2. **RDS Metrics**
   - CPU Utilization
   - Database Connections
   - Read/Write IOPS

3. **ALB Metrics**
   - Request Count
   - Response Time
   - HTTP Status Codes

4. **ElastiCache Metrics**
   - CPU Utilization
   - Cache Hit Rate
   - Evictions

### Set Up Alerts

Alarms are automatically created. Configure SNS topic for notifications:

```bash
# Create SNS topic for alerts
aws sns create-topic --name taskjuggler-alerts

# Subscribe email
aws sns subscribe \
  --topic-arn <topic-arn> \
  --protocol email \
  --notification-endpoint your-email@example.com
```

## Cost Optimization

### Recommendations

1. **Use Reserved Instances** for RDS (save ~30%)
2. **Right-size ECS tasks** based on actual usage
3. **Enable S3 lifecycle policies** for old files
4. **Use CloudFront caching** to reduce ALB costs
5. **Monitor and adjust** ElastiCache node sizes

### Cost Monitoring

Set up AWS Cost Explorer and Budgets:

```bash
# Create budget alert
aws budgets create-budget \
  --account-id 195430954683 \
  --budget file://budget.json \
  --notifications-with-subscribers file://notifications.json
```

## Rollback Plan

### If Migration Fails

1. **Keep Railway Running** during migration
2. **Use Blue/Green Deployment**:
   - Deploy to AWS
   - Test thoroughly
   - Switch DNS gradually
   - Keep Railway as backup

3. **Rollback Steps**:
   ```bash
   # Revert DNS
   # Point back to Railway
   
   # Scale down AWS services
   pulumi destroy
   
   # Or keep AWS for future use
   ```

## Post-Migration Checklist

- [ ] All services running in AWS
- [ ] DNS pointing to AWS
- [ ] SSL certificates valid
- [ ] Database migrated and verified
- [ ] Application responding correctly
- [ ] Queue workers processing jobs
- [ ] Scheduler running tasks
- [ ] Monitoring and alerts configured
- [ ] Backups configured
- [ ] Cost monitoring set up
- [ ] Documentation updated
- [ ] Team trained on AWS console
- [ ] Railway services decommissioned

## Support and Troubleshooting

### Common Issues

1. **ECS Tasks Not Starting**
   - Check CloudWatch logs
   - Verify Secrets Manager access
   - Check security group rules

2. **Database Connection Errors**
   - Verify RDS security group
   - Check Secrets Manager values
   - Verify subnet configuration

3. **High Latency**
   - Check CloudFront cache hit rate
   - Review ALB target health
   - Monitor RDS performance

### Useful Commands

```bash
# View ECS service logs
aws logs tail /ecs/taskjuggler-production --follow

# Check RDS status
aws rds describe-db-instances --db-instance-identifier taskjuggler-production-db

# View CloudWatch metrics
aws cloudwatch get-metric-statistics \
  --namespace AWS/ECS \
  --metric-name CPUUtilization \
  --dimensions Name=ServiceName,Value=taskjuggler-production-api \
  --start-time 2024-01-01T00:00:00Z \
  --end-time 2024-01-02T00:00:00Z \
  --period 3600 \
  --statistics Average
```

## Next Steps

1. Set up CI/CD pipeline
2. Configure auto-scaling
3. Implement backup automation
4. Set up disaster recovery
5. Configure WAF rules
6. Enable AWS GuardDuty
