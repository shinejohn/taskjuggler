# GitHub Workflows & Deployment Strategy
## Complete Diagnosis and Fix Plan

**Date**: January 10, 2025  
**Status**: 🔴 Critical - Workflows Failing  
**Priority**: P0 - Blocking Deployments

---

## 🎯 Executive Summary

This document provides a comprehensive strategy to diagnose, fix, and ensure GitHub workflows and deployment pipelines work correctly. We need to:

1. **Diagnose** current workflow failures
2. **Fix** GitHub Actions workflows
3. **Verify** AWS infrastructure configuration
4. **Test** end-to-end deployment pipeline
5. **Document** deployment process

---

## 📋 Current State Analysis

### GitHub Workflows Identified

1. **backend-tests.yml** - Laravel backend testing
2. **frontend-tests.yml** - Vue frontend projects testing
3. **build.yml** - Build verification for all projects
4. **lint.yml** - Code style and linting checks
5. **ci.yml** - Combined CI workflow

### Infrastructure Setup

- **AWS**: Pulumi-based infrastructure (ECS, RDS, ElastiCache, etc.)
- **Railway**: Legacy deployment (migration in progress?)
- **CodeBuild**: AWS CodeBuild for Docker builds
- **ECR**: Docker image registry

### Potential Issues Identified

1. **Workflow Configuration**
   - Conditional logic may be too restrictive
   - Missing error handling in some steps
   - Service health checks may timeout
   - Database migrations may fail silently

2. **Dependencies**
   - Shared-ui build dependency not properly cached
   - NPM package-lock.json inconsistencies
   - Composer dependencies may conflict

3. **Infrastructure**
   - AWS CodeBuild using S3 source (should use GitHub)
   - Missing environment variables
   - Docker build context issues

4. **Testing**
   - Tests may be failing but masked by `continue-on-error`
   - Database migrations may fail
   - Missing test data or seeders

---

## 🔍 Phase 1: Diagnosis

### Step 1.1: Check GitHub Actions Status

**Action Items:**
1. Go to GitHub repository → Actions tab
2. Review last 10 workflow runs
3. Identify which workflows are failing
4. Document specific error messages
5. Check if failures are consistent or intermittent

**Commands:**
```bash
# Check workflow status via GitHub CLI (if installed)
gh workflow list
gh run list --limit 10
gh run view <run-id> --log
```

### Step 1.2: Analyze Workflow Logs

**Key Areas to Check:**
- ✅ Service startup (PostgreSQL, Redis)
- ✅ Dependency installation (Composer, NPM)
- ✅ Database migrations
- ✅ Test execution
- ✅ Build processes
- ✅ Type checking
- ✅ Linting

**Common Failure Points:**
1. **Service Health Checks**: PostgreSQL/Redis not ready
2. **Migration Failures**: Database schema issues
3. **Test Failures**: Actual test errors (not just setup)
4. **Build Failures**: Missing dependencies or config
5. **Type Errors**: TypeScript/Vue type checking

### Step 1.3: Local Testing

**Test Each Workflow Locally:**

```bash
# Backend Tests
cd taskjuggler-api
docker-compose up -d postgres redis
composer install
php artisan migrate:fresh --seed
composer test

# Frontend Tests
cd coordinator-web
npm ci
npm run type-check
npm run build
npm test
```

---

## 🛠️ Phase 2: Fix GitHub Workflows

### Fix 2.1: Backend Tests Workflow

**Issues to Address:**
1. Service health checks may timeout
2. Migration failures masked by `continue-on-error`
3. Test failures not properly reported

**Fixes:**

```yaml
# .github/workflows/backend-tests.yml
# Add proper service wait logic
- name: Wait for PostgreSQL
  run: |
    until pg_isready -h localhost -p 5432 -U postgres; do
      echo "Waiting for PostgreSQL..."
      sleep 2
    done

- name: Wait for Redis
  run: |
    until redis-cli -h localhost -p 6379 ping; do
      echo "Waiting for Redis..."
      sleep 2
    done

# Remove continue-on-error from migrations (critical step)
- name: Run database migrations
  run: php artisan migrate:fresh --force --seed
  # Remove continue-on-error - migrations MUST succeed

# Ensure tests fail properly
- name: Run tests
  run: composer test || php artisan test
  # Remove fallback if tests fail - we need to know
```

### Fix 2.2: Frontend Tests Workflow

**Issues to Address:**
1. Shared-ui build not cached between jobs
2. Type checking failures masked
3. Build failures not properly reported

**Fixes:**

```yaml
# Add shared-ui artifact caching
- name: Build shared-ui
  run: npm run build
  
- name: Upload shared-ui artifact
  uses: actions/upload-artifact@v4
  with:
    name: shared-ui-build
    path: shared-ui/dist
    retention-days: 1

# In dependent jobs, download artifact first
- name: Download shared-ui artifact
  uses: actions/download-artifact@v4
  with:
    name: shared-ui-build
    path: shared-ui/dist

# Remove continue-on-error from builds (critical)
- name: Build
  run: npm run build
  # Builds MUST succeed
```

### Fix 2.3: Service Configuration

**Improve Service Health Checks:**

```yaml
services:
  postgres:
    image: postgres:16
    env:
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: taskjuggler_test
      POSTGRES_USER: postgres
    ports:
      - 5432:5432
    options: >-
      --health-cmd "pg_isready -U postgres"
      --health-interval 5s
      --health-timeout 3s
      --health-retries 10
      --health-start-period 10s
  
  redis:
    image: redis:7-alpine
    ports:
      - 6379:6379
    options: >-
      --health-cmd "redis-cli ping"
      --health-interval 5s
      --health-timeout 3s
      --health-retries 10
```

### Fix 2.4: Error Reporting

**Remove Masking of Critical Failures:**

- ❌ Remove `continue-on-error: true` from:
  - Database migrations
  - Build steps
  - Test execution (unless truly optional)
  
- ✅ Keep `continue-on-error: true` for:
  - Optional linting
  - Optional type checking (if not blocking)
  - Code style checks (Pint)

---

## ☁️ Phase 3: AWS Infrastructure Verification

### Step 3.1: Verify AWS Setup

**Check AWS Resources:**

```bash
# Check Pulumi stack status
cd infrastructure/pulumi
pulumi stack ls
pulumi stack select production
pulumi preview

# Verify AWS resources
aws ecs list-clusters
aws ecr describe-repositories
aws codebuild list-projects
aws rds describe-db-instances
```

### Step 3.2: Fix CodeBuild Configuration

**Current Issue**: CodeBuild using S3 source instead of GitHub

**Fix**: Update CodeBuild to use GitHub source

```bash
# Update CodeBuild project to use GitHub
cd infrastructure/pulumi
export GITHUB_TOKEN=<your-token>
./setup-github-cicd.sh

# Or manually update via AWS CLI
aws codebuild update-project \
  --name taskjuggler-production-build \
  --source type=GITHUB,location=https://github.com/shinejohn/taskjuggler.git,buildspec=taskjuggler-api/buildspec.yml
```

### Step 3.3: Verify Environment Variables

**Required AWS Environment Variables:**

```bash
# Check CodeBuild environment variables
aws codebuild batch-get-projects \
  --names taskjuggler-production-build \
  --query 'projects[0].environment.environmentVariables'

# Required variables:
# - AWS_ACCOUNT_ID
# - AWS_DEFAULT_REGION
# - IMAGE_REPO_NAME
# - DATABASE_URL (from Secrets Manager)
# - REDIS_URL (from Secrets Manager)
```

### Step 3.4: Fix Buildspec

**Current Issue**: buildspec.yml expects S3 source

**Fix**: Update buildspec.yml for GitHub source

```yaml
# taskjuggler-api/buildspec.yml
version: 0.2
phases:
  pre_build:
    commands:
      - echo Logging in to Amazon ECR...
      - aws ecr get-login-password --region $AWS_DEFAULT_REGION | docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.$AWS_DEFAULT_REGION.amazonaws.com
      - REPOSITORY_URI=$AWS_ACCOUNT_ID.dkr.ecr.$AWS_DEFAULT_REGION.amazonaws.com/$IMAGE_REPO_NAME
      - COMMIT_HASH=$(echo $CODEBUILD_RESOLVED_SOURCE_VERSION | cut -c 1-7)
      - IMAGE_TAG=${COMMIT_HASH:=latest}
      - cd taskjuggler-api  # GitHub source is at repo root
  build:
    commands:
      - echo Building Docker image...
      - docker build -t $IMAGE_REPO_NAME:$IMAGE_TAG .
      - docker tag $IMAGE_REPO_NAME:$IMAGE_TAG $REPOSITORY_URI:$IMAGE_TAG
      - docker tag $IMAGE_REPO_NAME:$IMAGE_TAG $REPOSITORY_URI:latest
  post_build:
    commands:
      - echo Pushing Docker images...
      - docker push $REPOSITORY_URI:$IMAGE_TAG
      - docker push $REPOSITORY_URI:latest
      - echo Image URI: $REPOSITORY_URI:latest
```

---

## 🧪 Phase 4: Testing Strategy

### Step 4.1: Local Testing Checklist

**Backend:**
- [ ] PostgreSQL starts successfully
- [ ] Redis starts successfully
- [ ] Composer dependencies install
- [ ] NPM dependencies install
- [ ] Database migrations run
- [ ] Tests execute and pass
- [ ] Pint code style check passes

**Frontend (each project):**
- [ ] NPM dependencies install
- [ ] Shared-ui builds first
- [ ] Type checking passes
- [ ] Linting passes (if configured)
- [ ] Build succeeds
- [ ] Tests pass (if configured)

### Step 4.2: Workflow Testing

**Test Each Workflow:**

1. **Backend Tests**
   ```bash
   # Make a small change to trigger
   git checkout -b test-backend-workflow
   echo "# Test" >> taskjuggler-api/README.md
   git commit -m "test: trigger backend workflow"
   git push origin test-backend-workflow
   # Create PR and watch workflow
   ```

2. **Frontend Tests**
   ```bash
   git checkout -b test-frontend-workflow
   echo "// Test" >> coordinator-web/src/main.ts
   git commit -m "test: trigger frontend workflow"
   git push origin test-frontend-workflow
   ```

3. **Build Workflow**
   ```bash
   git checkout -b test-build-workflow
   git commit --allow-empty -m "test: trigger build workflow"
   git push origin test-build-workflow
   ```

### Step 4.3: Deployment Testing

**Test AWS Deployment:**

```bash
# Trigger CodeBuild manually
aws codebuild start-build \
  --project-name taskjuggler-production-build \
  --region us-east-1

# Monitor build
aws codebuild batch-get-builds \
  --ids <build-id> \
  --region us-east-1

# Check ECS service update
aws ecs describe-services \
  --cluster taskjuggler-cluster \
  --services taskjuggler-api \
  --region us-east-1
```

---

## 📝 Phase 5: Implementation Plan

### Priority 1: Critical Fixes (Do First)

1. **Fix Workflow Failures**
   - Remove `continue-on-error` from critical steps
   - Fix service health checks
   - Ensure proper error reporting

2. **Fix Database Migrations**
   - Ensure migrations run successfully
   - Add proper error handling
   - Verify seeders work

3. **Fix Build Processes**
   - Ensure all builds succeed
   - Fix shared-ui dependency handling
   - Verify artifact uploads

### Priority 2: Infrastructure Fixes

1. **Update CodeBuild to GitHub**
   - Switch from S3 to GitHub source
   - Update buildspec.yml
   - Configure webhooks

2. **Verify AWS Resources**
   - Check all resources exist
   - Verify environment variables
   - Test deployment pipeline

### Priority 3: Testing & Validation

1. **Run All Tests Locally**
   - Backend tests
   - Frontend tests
   - Build verification

2. **Test Workflows**
   - Trigger each workflow
   - Verify all pass
   - Document any issues

3. **Test Deployment**
   - Trigger CodeBuild
   - Verify Docker build
   - Verify ECS update

---

## 🔧 Quick Fixes to Apply Now

### Fix 1: Update Backend Tests Workflow

**File**: `.github/workflows/backend-tests.yml`

**Changes:**
1. Add service wait steps
2. Remove `continue-on-error` from migrations
3. Ensure tests fail properly

### Fix 2: Update Frontend Tests Workflow

**File**: `.github/workflows/frontend-tests.yml`

**Changes:**
1. Add shared-ui artifact caching
2. Remove `continue-on-error` from builds
3. Ensure proper dependency handling

### Fix 3: Update Buildspec

**File**: `taskjuggler-api/buildspec.yml`

**Changes:**
1. Remove S3 source references
2. Add `cd taskjuggler-api` step
3. Ensure proper Docker context

### Fix 4: Update CodeBuild Source

**Action**: Run setup script or update manually

```bash
cd infrastructure/pulumi
export GITHUB_TOKEN=<token>
./setup-github-cicd.sh
```

---

## ✅ Success Criteria

### Workflows Must:
- ✅ All workflows run successfully
- ✅ No masked failures (remove continue-on-error from critical steps)
- ✅ Proper error messages when failures occur
- ✅ Services start reliably
- ✅ Tests execute and report results correctly

### Deployment Must:
- ✅ CodeBuild triggers on GitHub push
- ✅ Docker images build successfully
- ✅ Images push to ECR
- ✅ ECS services update automatically
- ✅ Application deploys successfully

### Infrastructure Must:
- ✅ All AWS resources exist and are configured
- ✅ Environment variables are set correctly
- ✅ Secrets are stored in Secrets Manager
- ✅ Network connectivity works
- ✅ Database is accessible

---

## 🚨 Rollback Plan

If fixes cause issues:

1. **Revert Workflow Changes**
   ```bash
   git checkout HEAD~1 -- .github/workflows/
   git commit -m "revert: workflow changes"
   git push
   ```

2. **Revert Buildspec**
   ```bash
   git checkout HEAD~1 -- taskjuggler-api/buildspec.yml
   git commit -m "revert: buildspec changes"
   git push
   ```

3. **Manual Deployment**
   ```bash
   # Use manual S3 upload if needed
   cd infrastructure/pulumi
   ./create-source-archive.sh
   aws codebuild start-build --project-name taskjuggler-production-build
   ```

---

## 📊 Monitoring & Maintenance

### Ongoing Monitoring

1. **GitHub Actions**
   - Check workflow status daily
   - Review failures immediately
   - Fix issues promptly

2. **AWS CodeBuild**
   - Monitor build success rate
   - Check build logs for warnings
   - Verify deployment frequency

3. **Application Health**
   - Monitor ECS service health
   - Check CloudWatch logs
   - Verify database connectivity

### Maintenance Tasks

**Weekly:**
- Review workflow failures
- Check for dependency updates
- Verify infrastructure status

**Monthly:**
- Review and update workflows
- Optimize build times
- Update documentation

---

## 📚 Next Steps

1. **Immediate** (Today):
   - Review GitHub Actions failures
   - Apply quick fixes to workflows
   - Test locally

2. **Short-term** (This Week):
   - Fix all workflow issues
   - Update CodeBuild configuration
   - Test deployment pipeline

3. **Long-term** (This Month):
   - Optimize workflows
   - Add deployment automation
   - Improve monitoring

---

## 🆘 Support & Troubleshooting

### Common Issues

**Workflow Timeouts:**
- Increase service health check timeouts
- Add explicit wait steps
- Check service logs

**Build Failures:**
- Check dependency versions
- Verify build scripts exist
- Review build logs

**Deployment Failures:**
- Check AWS credentials
- Verify ECR permissions
- Review ECS service logs

### Getting Help

1. Check GitHub Actions logs
2. Review AWS CloudWatch logs
3. Check Pulumi stack outputs
4. Review this document

---

**Status**: Ready for Implementation  
**Last Updated**: January 10, 2025  
**Owner**: Development Team



