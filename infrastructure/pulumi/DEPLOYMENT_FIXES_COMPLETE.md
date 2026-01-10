# AWS Deployment Fixes Complete
## All Issues Resolved and Scripts Created

**Date:** December 2025  
**Status:** ✅ Ready for Deployment

---

## ✅ COMPLETED FIXES

### 1. CodeBuild Configuration Fixed ✅

**Issue:** CodeBuild was configured with `NO_SOURCE` type, preventing builds from accessing source code.

**Fix:**
- Updated `infrastructure/pulumi/infrastructure/codebuild.py` to use S3 source
- Added S3 permissions to CodeBuild IAM role
- Updated buildspec to download and extract source from S3

**Files Modified:**
- `infrastructure/pulumi/infrastructure/codebuild.py`

### 2. Deployment Scripts Created ✅

Created comprehensive deployment scripts:

#### `fix-codebuild.sh`
- Creates S3 bucket for source code
- Uploads source code to S3
- Updates CodeBuild project configuration
- Adds S3 permissions to CodeBuild role

#### `check-build-logs.sh`
- Checks latest build status
- Fetches CloudWatch logs
- Diagnoses common build issues
- Provides troubleshooting guidance

#### `trigger-build.sh`
- Uploads latest source code to S3
- Starts CodeBuild project
- Monitors build progress (15-minute timeout)
- Reports build success/failure

#### `update-ecs-services.sh`
- Verifies Docker image exists in ECR
- Forces ECS service updates
- Monitors service deployment
- Waits for services to stabilize

#### `check-ssl-cert.sh`
- Finds SSL certificate for domain
- Checks certificate status
- Shows DNS validation records
- Provides validation instructions

#### `configure-https.sh` (already existed, verified)
- Configures HTTPS listener on ALB
- Updates HTTP listener to redirect
- Validates certificate before configuring

#### `complete-deployment.sh`
- Runs all deployment steps in order
- Orchestrates entire deployment process
- Provides final status and URLs

### 3. Migration Script ✅

**File:** `run-migrations.sh` (already existed, verified)
- Runs database migrations via ECS task
- Waits for completion
- Reports success/failure

---

## 🚀 DEPLOYMENT PROCESS

### Quick Start (All-in-One)

```bash
cd infrastructure/pulumi
./complete-deployment.sh taskjuggler.com
```

This will:
1. Fix CodeBuild configuration (if needed)
2. Trigger Docker build
3. Update ECS services
4. Run database migrations
5. Check SSL certificate
6. Configure HTTPS (if certificate is ready)

### Step-by-Step Process

#### Step 1: Fix CodeBuild Configuration
```bash
cd infrastructure/pulumi
./fix-codebuild.sh
```

#### Step 2: Check Current Build Status
```bash
./check-build-logs.sh
```

#### Step 3: Trigger New Build
```bash
./trigger-build.sh
```

#### Step 4: Update ECS Services
```bash
./update-ecs-services.sh
```

#### Step 5: Run Migrations
```bash
./run-migrations.sh
```

#### Step 6: Check SSL Certificate
```bash
./check-ssl-cert.sh taskjuggler.com
```

#### Step 7: Configure HTTPS (when certificate is ready)
```bash
./configure-https.sh taskjuggler.com
```

---

## 📋 PREREQUISITES

Before running deployment scripts:

1. **AWS CLI Configured**
   ```bash
   aws configure
   ```

2. **Required AWS Permissions**
   - CodeBuild (create, update, start builds)
   - ECS (update services, run tasks)
   - ECR (push/pull images)
   - S3 (create bucket, upload files)
   - ACM (describe certificates)
   - ELB (create/modify listeners)
   - CloudWatch Logs (read logs)

3. **Source Code Available**
   - `taskjuggler-api` directory must exist
   - Dockerfile must be present in `taskjuggler-api/`

4. **Infrastructure Deployed**
   - Pulumi infrastructure must be deployed
   - CodeBuild project must exist
   - ECS cluster and services must exist

---

## 🔍 TROUBLESHOOTING

### Build Fails

1. **Check logs:**
   ```bash
   ./check-build-logs.sh
   ```

2. **Common issues:**
   - Source not uploaded to S3 → Run `fix-codebuild.sh`
   - Dockerfile errors → Check Dockerfile syntax
   - Permission errors → Verify IAM roles
   - Network issues → Check VPC configuration

### ECS Services Not Starting

1. **Check service status:**
   ```bash
   aws ecs describe-services \
     --cluster taskjuggler-production-cluster \
     --services taskjuggler-production-api \
     --region us-east-1
   ```

2. **Check task logs:**
   ```bash
   aws logs tail /ecs/taskjuggler-production-logs --follow
   ```

3. **Common issues:**
   - Image not found → Verify build succeeded
   - Secrets not accessible → Check IAM permissions
   - Network issues → Check security groups
   - Health check failing → Verify `/api/health` endpoint

### SSL Certificate Not Validating

1. **Check certificate status:**
   ```bash
   ./check-ssl-cert.sh taskjuggler.com
   ```

2. **Add DNS records:**
   - Copy validation records from output
   - Add to Route53 hosted zone
   - Wait 5-15 minutes for propagation

3. **Re-check status:**
   ```bash
   ./check-ssl-cert.sh taskjuggler.com
   ```

---

## 📊 MONITORING

### CloudWatch Logs

- **CodeBuild:** `/aws/codebuild/taskjuggler-production-build`
- **ECS Tasks:** `/ecs/taskjuggler-production-logs`

### View Logs

```bash
# CodeBuild logs
aws logs tail /aws/codebuild/taskjuggler-production-build --follow

# ECS logs
aws logs tail /ecs/taskjuggler-production-logs --follow
```

### Health Check

```bash
# Get ALB DNS
ALB_DNS=$(aws elbv2 describe-load-balancers \
  --region us-east-1 \
  --query "LoadBalancers[?contains(LoadBalancerName, 'taskjuggler-production')].DNSName" \
  --output text)

# Check health
curl http://$ALB_DNS/api/health
```

---

## ✅ VERIFICATION CHECKLIST

After deployment completes:

- [ ] Docker image exists in ECR (`taskjuggler-production:latest`)
- [ ] API service running (2/2 tasks)
- [ ] Worker service running (2/2 tasks)
- [ ] Migrations completed successfully
- [ ] Health endpoint responding (`/api/health`)
- [ ] SSL certificate validated (if HTTPS configured)
- [ ] HTTPS listener configured (if certificate ready)
- [ ] Application accessible via ALB DNS

---

## 📝 NOTES

1. **S3 Bucket:** `taskjuggler-build-source` is created automatically by `fix-codebuild.sh`

2. **Source Upload:** Source code is uploaded as `source.tar.gz` containing `taskjuggler-api/` directory

3. **Build Time:** Docker builds typically take 10-15 minutes

4. **Service Deployment:** ECS service updates take 5-10 minutes to stabilize

5. **SSL Validation:** DNS validation records must be added to Route53, then wait 5-15 minutes

6. **HTTPS Configuration:** HTTPS listener can only be created after certificate status is "ISSUED"

---

## 🎯 NEXT STEPS

1. **Run Complete Deployment:**
   ```bash
   cd infrastructure/pulumi
   ./complete-deployment.sh taskjuggler.com
   ```

2. **Monitor Progress:**
   - Watch script output
   - Check CloudWatch logs if issues occur
   - Verify each step completes successfully

3. **Verify Deployment:**
   - Test API endpoints
   - Check application functionality
   - Monitor CloudWatch metrics

4. **Configure DNS:**
   - Point domain to ALB DNS
   - Verify HTTPS works (if configured)

---

**All deployment fixes are complete and ready for execution!**
