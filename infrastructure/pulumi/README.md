# Task Juggler AWS Infrastructure

Complete AWS infrastructure as code using Pulumi and Python for migrating from Railway to AWS.

## Architecture Overview

### Current Railway Services → AWS Equivalents

| Railway Service | AWS Service | Purpose |
|----------------|-------------|---------|
| Web Service | ECS Fargate + ALB | Laravel API application |
| Worker Service | ECS Fargate Task | Queue workers |
| Scheduler Service | EventBridge + ECS Task | Laravel scheduler |
| PostgreSQL | RDS PostgreSQL Multi-AZ | Primary database |
| Redis | ElastiCache Redis Cluster | Cache and queue backend |
| File Storage | S3 Buckets | Application files and backups |
| Real-time (Pusher) | SNS Topics + WebSockets | Real-time notifications |
| Email (SendGrid) | SES | Email sending |
| Monitoring | CloudWatch | Logs, metrics, alarms |

## Infrastructure Components

### 1. Networking (`infrastructure/networking.py`)
- VPC with public and private subnets across 3 AZs
- Internet Gateway and NAT Gateway
- Security Groups for ALB, ECS, RDS, and Redis
- Route Tables

### 2. Database (`infrastructure/database.py`)
- RDS PostgreSQL 16 Multi-AZ
- Automated backups (7-day retention)
- Performance Insights enabled
- Enhanced monitoring
- Secrets Manager integration

### 3. Cache (`infrastructure/cache.py`)
- ElastiCache Redis 7 cluster
- Multi-AZ with automatic failover
- Encryption at rest and in transit
- Auth token via Secrets Manager

### 4. Storage (`infrastructure/storage.py`)
- S3 bucket for application files
- S3 bucket for database backups
- Versioning and lifecycle policies
- Encryption enabled

### 5. Compute (`infrastructure/compute.py`)
- ECS Fargate cluster
- ECR repository for Docker images
- Application Load Balancer
- CloudFront CDN
- Three ECS services:
  - API service (2+ tasks)
  - Worker service (2+ tasks)
  - Scheduler (EventBridge triggered)

### 6. Security (`infrastructure/security.py`)
- Secrets Manager for credentials
- IAM roles and policies
- Security groups

### 7. Messaging (`infrastructure/messaging.py`)
- SNS topics for notifications
- SQS queues for background jobs
- Dead letter queues
- SES for email (replaces SendGrid)

### 8. Monitoring (`infrastructure/monitoring.py`)
- CloudWatch dashboards
- Alarms for CPU, memory, errors
- Log aggregation
- Performance metrics

### 9. DNS (`infrastructure/dns.py`)
- Route53 hosted zone
- ACM SSL certificates
- DNS records for API and CDN

## Prerequisites

1. **AWS Account**
   - Account ID: `195430954683`
   - Access Key ID: `AKIAS3AEXW255MQDK6MY`
   - Secret Access Key: (stored in `../thefae`)

2. **Install Dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Install Pulumi CLI**
   ```bash
   curl -fsSL https://get.pulumi.com | sh
   ```

4. **Configure AWS Credentials**
   ```bash
   export AWS_ACCESS_KEY_ID=AKIAS3AEXW255MQDK6MY
   export AWS_SECRET_ACCESS_KEY=<your-secret-key>
   export AWS_DEFAULT_REGION=us-east-1
   ```

## Configuration

Create a Pulumi stack configuration:

```bash
pulumi stack init production
pulumi config set aws:region us-east-1
pulumi config set project_name taskjuggler
pulumi config set environment production
```

### Required Configuration Values

```bash
# Database
pulumi config set db_username taskjuggler
pulumi config set --secret db_password <strong-password>
pulumi config set db_instance_class db.t3.medium
pulumi config set db_allocated_storage 100

# Redis
pulumi config set --secret redis_auth_token <strong-token>
pulumi config set redis_node_type cache.t3.micro

# Application Secrets
pulumi config set --secret app_key <laravel-app-key>
pulumi config set --secret twilio_account_sid <twilio-sid>
pulumi config set --secret twilio_auth_token <twilio-token>
pulumi config set --secret sendgrid_api_key <sendgrid-key>
pulumi config set --secret openrouter_api_key <openrouter-key>
pulumi config set --secret stripe_key <stripe-key>
pulumi config set --secret stripe_secret <stripe-secret>
pulumi config set --secret stripe_webhook_secret <stripe-webhook>

# DNS
pulumi config set domain_name taskjuggler.com
pulumi config set route53_zone_id <zone-id-if-exists>

# SES
pulumi config set ses_domain taskjuggler.com
```

## Deployment

### 1. Preview Infrastructure
```bash
pulumi preview
```

### 2. Deploy Infrastructure
```bash
pulumi up
```

### 3. View Outputs
```bash
pulumi stack output
```

## Docker Image Deployment

After infrastructure is deployed, build and push Docker image:

```bash
# Login to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <account-id>.dkr.ecr.us-east-1.amazonaws.com

# Build image
cd ../../taskjuggler-api
docker build -t taskjuggler-api:latest .

# Tag image
docker tag taskjuggler-api:latest <account-id>.dkr.ecr.us-east-1.amazonaws.com/taskjuggler-production:latest

# Push image
docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/taskjuggler-production:latest
```

## Environment Variables Migration

### Railway → AWS Secrets Manager

| Railway Env Var | AWS Secret Location |
|----------------|---------------------|
| `DATABASE_URL` | RDS Secrets Manager |
| `REDIS_URL` | ElastiCache + Secrets Manager |
| `APP_KEY` | Secrets Manager |
| `TWILIO_*` | Secrets Manager |
| `SENDGRID_API_KEY` | Secrets Manager (replaced by SES) |
| `OPENROUTER_API_KEY` | Secrets Manager |
| `STRIPE_*` | Secrets Manager |
| `PUSHER_*` | Replaced by SNS/SQS |

## Laravel Configuration Updates

### 1. Update `.env` for AWS

```env
APP_ENV=production
APP_URL=https://api.taskjuggler.com

# Database (from Secrets Manager)
DB_CONNECTION=pgsql
DB_HOST=<rds-endpoint>
DB_PORT=5432
DB_DATABASE=taskjuggler
DB_USERNAME=taskjuggler
DB_PASSWORD=<from-secrets-manager>

# Redis (from Secrets Manager)
REDIS_HOST=<elasticache-endpoint>
REDIS_PASSWORD=<from-secrets-manager>
REDIS_PORT=6379

# Queue
QUEUE_CONNECTION=redis

# Storage
FILESYSTEM_DISK=s3
AWS_ACCESS_KEY_ID=<iam-role-handles-this>
AWS_SECRET_ACCESS_KEY=<iam-role-handles-this>
AWS_DEFAULT_REGION=us-east-1
AWS_BUCKET=<s3-bucket-name>

# Email (SES instead of SendGrid)
MAIL_MAILER=ses
MAIL_FROM_ADDRESS=noreply@taskjuggler.com
MAIL_FROM_NAME="Task Juggler"

# Real-time (SNS instead of Pusher)
BROADCAST_DRIVER=sns
```

### 2. Install AWS SDK

```bash
composer require aws/aws-sdk-php
composer require league/flysystem-aws-s3-v3
```

### 3. Update Laravel Services

- Replace Pusher with SNS for broadcasting
- Replace SendGrid with SES for email
- Use S3 for file storage
- Use Secrets Manager for credentials

## Monitoring

### CloudWatch Dashboard
Access dashboard at: AWS Console → CloudWatch → Dashboards → `taskjuggler-production-dashboard`

### Key Metrics
- ECS CPU/Memory utilization
- ALB response times
- RDS connection counts
- Redis cache hit rates
- S3 bucket sizes
- Error rates and logs

### Alarms
- API CPU > 80%
- API Memory > 85%
- ALB Response Time > 5s
- 5xx Errors > 10/minute

## Cost Estimation

### Monthly Costs (Approximate)

| Service | Configuration | Monthly Cost |
|---------|-------------|--------------|
| ECS Fargate (API) | 2 tasks × 1 vCPU × 1GB | ~$30 |
| ECS Fargate (Worker) | 2 tasks × 0.25 vCPU × 0.5GB | ~$8 |
| RDS PostgreSQL | db.t3.medium Multi-AZ | ~$150 |
| ElastiCache Redis | cache.t3.micro × 2 | ~$15 |
| ALB | Standard | ~$20 |
| CloudFront | 100GB transfer | ~$10 |
| S3 | 100GB storage | ~$3 |
| Data Transfer | 100GB | ~$10 |
| **Total** | | **~$246/month** |

## Migration Steps

1. **Deploy Infrastructure**
   ```bash
   pulumi up
   ```

2. **Create Database**
   - RDS will be created automatically
   - Run migrations: `php artisan migrate`

3. **Migrate Data**
   - Export from Railway PostgreSQL
   - Import to RDS

4. **Update DNS**
   - Point domain to new ALB/CloudFront

5. **Deploy Application**
   - Build and push Docker image
   - ECS will pull and deploy

6. **Verify**
   - Check health endpoint
   - Monitor CloudWatch metrics
   - Test all functionality

7. **Decommission Railway**
   - After verification, remove Railway services

## Troubleshooting

### Common Issues

1. **ECS Tasks Not Starting**
   - Check CloudWatch logs
   - Verify Secrets Manager permissions
   - Check security group rules

2. **Database Connection Issues**
   - Verify RDS security group allows ECS
   - Check Secrets Manager values
   - Verify subnet group configuration

3. **High Costs**
   - Review CloudWatch metrics
   - Adjust ECS task counts
   - Consider Reserved Instances for RDS

## Support

For issues or questions:
1. Check CloudWatch logs
2. Review Pulumi stack outputs
3. Verify AWS service limits
4. Check IAM permissions

## Next Steps

1. Set up CI/CD pipeline (GitHub Actions → ECR → ECS)
2. Configure auto-scaling policies
3. Set up backup automation
4. Implement disaster recovery plan
5. Configure WAF for ALB
6. Set up AWS GuardDuty for security
