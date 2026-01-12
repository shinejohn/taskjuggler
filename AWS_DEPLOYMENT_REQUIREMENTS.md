# AWS Deployment Requirements - What's Actually Needed

## 🚨 CRITICAL BLOCKER (Must Fix First)

### 1. CodeBuild GitHub Connection ❌ **BLOCKING**

**Status**: CodeStar Connection exists but NOT linked to CodeBuild  
**Impact**: CodeBuild cannot download source code - ALL builds fail

**Fix Required**:
1. Go to: https://console.aws.amazon.com/codesuite/codebuild/projects/taskjuggler-production-build/edit?region=us-east-1
2. In **Source** section:
   - **Connection** dropdown: Select `taskjuggler-github`
   - Click **"Update source"** button
   - Verify it saved (check `source.auth.resource` via CLI)
3. Verify:
   ```bash
   aws codebuild batch-get-projects \
     --names taskjuggler-production-build \
     --region us-east-1 \
     --query 'projects[0].source.auth.resource' \
     --output text
   ```
   Should show: `arn:aws:codestar-connections:us-east-1:195430954683:connection/5f1fff66-59d0-4991-b14d-957239c045b8`

**Without this**: CodeBuild cannot download code from GitHub → Builds fail immediately

---

## ✅ What's Already Working

1. **CodeStar Connection**: Created and authorized (`taskjuggler-github`)
2. **CodeBuild Project**: Exists (`taskjuggler-production-build`)
3. **ECR Repository**: Should exist (for Docker images)
4. **GitHub Actions**: Workflow triggers CodeBuild
5. **Buildspec**: Fixed for GitHub source
6. **IAM Roles**: CodeBuild service role exists

---

## 📋 Complete AWS Infrastructure Checklist

### Infrastructure Components (via Pulumi)

**Status**: Need to verify what's actually deployed

```bash
cd infrastructure/pulumi
source venv/bin/activate
pulumi stack select production
pulumi stack output
```

**Required Components**:
- [ ] **VPC** - Networking (subnets, security groups)
- [ ] **RDS PostgreSQL** - Database
- [ ] **ElastiCache Redis** - Cache/Queue
- [ ] **ECS Fargate Cluster** - Container hosting
- [ ] **Application Load Balancer** - Traffic routing
- [ ] **ECR Repository** - Docker image storage
- [ ] **S3 Buckets** - File storage
- [ ] **CloudWatch Logs** - Logging
- [ ] **IAM Roles** - Permissions

### CodeBuild Requirements

- [x] CodeBuild project created
- [x] Service role configured
- [x] ECR permissions
- [x] Buildspec configured
- [ ] **GitHub connection linked** ← **BLOCKING**

### Deployment Pipeline

- [x] GitHub Actions workflow
- [x] AWS credentials in GitHub Secrets
- [x] CodeBuild trigger working
- [ ] CodeBuild can download source ← **BLOCKING**

---

## 🔧 Quick Fix Steps

### Step 1: Link CodeStar Connection (5 minutes)

1. AWS Console → CodeBuild → Edit project
2. Source → Connection → Select `taskjuggler-github`
3. Click "Update source"
4. Verify with CLI command above

### Step 2: Test Build

```bash
aws codebuild start-build \
  --project-name taskjuggler-production-build \
  --region us-east-1 \
  --source-version refs/heads/main
```

### Step 3: Verify Infrastructure

```bash
# Check if infrastructure is deployed
cd infrastructure/pulumi
source venv/bin/activate
pulumi stack select production
pulumi stack output

# Check ECR repository
aws ecr describe-repositories --region us-east-1 --query 'repositories[?contains(repositoryName, `taskjuggler`)]'

# Check ECS cluster
aws ecs list-clusters --region us-east-1
```

---

## 🎯 Minimum Viable Deployment

**To get code running on AWS, you need**:

1. ✅ **CodeBuild working** (fix connection linking)
2. ✅ **ECR repository** (for Docker images)
3. ✅ **ECS Fargate cluster** (to run containers)
4. ✅ **RDS PostgreSQL** (database)
5. ✅ **ElastiCache Redis** (cache/queues)
6. ✅ **Load Balancer** (traffic routing)
7. ✅ **Security Groups** (network access)
8. ✅ **IAM Roles** (permissions)

**Current Status**: Infrastructure code exists in Pulumi, but need to verify what's actually deployed.

---

## 🚀 Next Steps

1. **Fix CodeBuild connection** (critical blocker)
2. **Verify infrastructure deployment**:
   ```bash
   cd infrastructure/pulumi
   pulumi stack select production
   pulumi preview  # See what needs to be created
   pulumi up       # Deploy if needed
   ```
3. **Test end-to-end**:
   - Push code → GitHub Actions triggers → CodeBuild builds → Push to ECR → Deploy to ECS

---

## 📊 Current Status Summary

| Component | Status | Notes |
|-----------|--------|-------|
| CodeStar Connection | ✅ Created | Not linked to CodeBuild |
| CodeBuild Project | ✅ Exists | Can't download source |
| GitHub Actions | ✅ Working | Triggers CodeBuild |
| Buildspec | ✅ Fixed | Ready for GitHub source |
| Infrastructure Code | ✅ Exists | Need to verify deployment |
| ECR Repository | ❓ Unknown | Need to check |
| ECS Cluster | ❓ Unknown | Need to check |
| Database | ❓ Unknown | Need to check |

---

**Bottom Line**: Fix the CodeBuild connection linking, then verify infrastructure is deployed. That's the critical path.

