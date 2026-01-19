# Testing Workflows and Deployment - Execution Plan

**Date**: January 2025  
**Status**: Ready for Testing

---

## 🎯 Overview

This document provides step-by-step instructions to test the GitHub workflows and CodeBuild deployment fixes.

---

## ✅ Pre-Testing Checklist

Before testing, ensure:

- [ ] All workflow files are committed
- [ ] Pulumi config updated with GitHub settings
- [ ] GitHub repository is accessible
- [ ] AWS credentials configured
- [ ] CodeBuild project exists

---

## 📋 Phase 1: Test GitHub Actions Workflows

### Step 1.1: Commit Workflow Changes

```bash
cd /Users/johnshine/Dropbox/Fibonacco/taskjuggler/Code

# Check what's changed
git status

# Stage workflow changes
git add .github/workflows/backend-tests.yml
git add .github/workflows/frontend-tests.yml
git add .github/workflows/build.yml
git add taskjuggler-api/buildspec.yml

# Commit
git commit -m "fix: improve GitHub workflows and buildspec

- Add explicit service waits for PostgreSQL/Redis in backend tests
- Remove continue-on-error from migrations (critical step)
- Add shared-ui artifact caching in frontend tests
- Simplify buildspec for GitHub source (remove S3 dependencies)
- Update build workflow to use artifact caching"
```

### Step 1.2: Create Test Branch

```bash
# Create a test branch
git checkout -b test/workflow-fixes

# Push to trigger workflows
git push origin test/workflow-fixes
```

### Step 1.3: Monitor Workflow Runs

1. **Go to GitHub Actions**:
   - Navigate to: `https://github.com/shinejohn/taskjuggler/actions`

2. **Check Each Workflow**:
   - **Backend Tests**: Should show PostgreSQL/Redis wait steps, migrations should fail properly if broken
   - **Frontend Tests**: Should show shared-ui artifact upload/download
   - **Build**: Should show shared-ui artifact usage

3. **Verify Success**:
   - All workflows should pass
   - Check logs for:
     - ✅ "PostgreSQL is ready"
     - ✅ "Redis is ready"
     - ✅ "Upload shared-ui artifact"
     - ✅ "Download shared-ui artifact"

### Step 1.4: Test Failure Scenarios (Optional)

To verify migrations fail properly:

```bash
# Temporarily break a migration to test error handling
# Edit a migration file to have a syntax error
# Push and verify the workflow fails with clear error message
```

---

## 📋 Phase 2: Enable GitHub Source in CodeBuild

### Step 2.1: Update Pulumi Stack

```bash
cd infrastructure/pulumi

# Verify config is set
pulumi config get github:enabled
pulumi config get github:owner
pulumi config get github:repo
pulumi config get github:branch

# Preview changes
pulumi preview --stack production

# Apply changes
pulumi up --stack production
```

### Step 2.2: Verify CodeBuild Configuration

```bash
# Check CodeBuild source type
aws codebuild batch-get-projects \
  --names taskjuggler-production-build \
  --region us-east-1 \
  --query 'projects[0].source.type'

# Should output: "GITHUB"

# Check source location
aws codebuild batch-get-projects \
  --names taskjuggler-production-build \
  --region us-east-1 \
  --query 'projects[0].source.location'

# Should output: "https://github.com/shinejohn/taskjuggler.git"
```

### Step 2.3: Configure GitHub Webhook (If Needed)

If webhook is not automatically configured:

```bash
# Get webhook info
aws codebuild batch-get-projects \
  --names taskjuggler-production-build \
  --region us-east-1 \
  --query 'projects[0].webhook'

# If webhook exists, note the URL and secret
# Add webhook to GitHub repository:
# 1. Go to: https://github.com/shinejohn/taskjuggler/settings/hooks
# 2. Click "Add webhook"
# 3. Payload URL: (from CodeBuild webhook)
# 4. Content type: application/json
# 5. Secret: (from CodeBuild webhook)
# 6. Events: Just the "push" event
# 7. Active: checked
```

---

## 📋 Phase 3: Test CodeBuild Deployment

### Step 3.1: Trigger Manual Build

```bash
# Trigger CodeBuild manually to test
aws codebuild start-build \
  --project-name taskjuggler-production-build \
  --region us-east-1

# Note the build ID from output
```

### Step 3.2: Monitor Build

```bash
# Replace BUILD_ID with actual build ID
BUILD_ID=<build-id>

# Check build status
aws codebuild batch-get-builds \
  --ids $BUILD_ID \
  --region us-east-1 \
  --query 'builds[0].buildStatus'

# Stream logs (if needed)
aws logs tail /aws/codebuild/taskjuggler-production-build \
  --follow \
  --region us-east-1
```

### Step 3.3: Verify Build Success

Check for:
- ✅ Source pulled from GitHub (not S3)
- ✅ Buildspec found and executed
- ✅ Docker image built successfully
- ✅ Image pushed to ECR
- ✅ No S3 download errors

### Step 3.4: Test Automatic Trigger

```bash
# Make a small change to trigger automatic build
cd /Users/johnshine/Dropbox/Fibonacco/taskjuggler/Code

# Create a test commit
echo "# Test" >> taskjuggler-api/README.md
git add taskjuggler-api/README.md
git commit -m "test: trigger CodeBuild"
git push origin main

# Monitor CodeBuild console or use:
aws codebuild list-builds-for-project \
  --project-name taskjuggler-production-build \
  --region us-east-1 \
  --max-items 1
```

---

## 📋 Phase 4: End-to-End Testing

### Step 4.1: Full Pipeline Test

1. **Make a change**:
   ```bash
   # Make a small backend change
   echo "// Test" >> taskjuggler-api/app/Http/Controllers/Api/AuthController.php
   git add .
   git commit -m "test: full pipeline test"
   git push origin main
   ```

2. **Monitor GitHub Actions**:
   - Backend tests should run
   - Should pass with new wait steps

3. **Monitor CodeBuild**:
   - Should trigger automatically (if webhook configured)
   - Should pull from GitHub
   - Should build Docker image
   - Should push to ECR

### Step 4.2: Verify ECS Update (If Configured)

If ECS auto-update is configured:

```bash
# Check ECS service
aws ecs describe-services \
  --cluster taskjuggler-cluster \
  --services taskjuggler-api \
  --region us-east-1 \
  --query 'services[0].events[0:5]'
```

---

## 🔍 Verification Checklist

### GitHub Actions
- [ ] Backend tests workflow passes
- [ ] Service wait steps appear in logs
- [ ] Migrations run successfully (or fail with clear error)
- [ ] Frontend tests workflow passes
- [ ] Shared-ui artifact uploaded/downloaded
- [ ] Build workflow passes
- [ ] All artifacts uploaded correctly

### CodeBuild
- [ ] Source type is "GITHUB" (not "S3")
- [ ] Buildspec path is correct
- [ ] Build triggers automatically on push (if webhook configured)
- [ ] Docker image builds successfully
- [ ] Image pushed to ECR
- [ ] No S3-related errors in logs

### Buildspec
- [ ] No S3 download commands in logs
- [ ] Direct navigation to taskjuggler-api works
- [ ] Commit hash extracted correctly
- [ ] Image tagged with commit hash

---

## 🚨 Troubleshooting

### Issue: Workflow Fails on Service Startup

**Solution**: Check that `pg_isready` and `redis-cli` are available in the runner. They should be available by default in Ubuntu runners.

### Issue: Shared-UI Artifact Not Found

**Solution**: Ensure the shared-ui job completes successfully before dependent jobs run. Check job dependencies (`needs: shared-ui`).

### Issue: CodeBuild Still Uses S3

**Solution**: 
1. Verify Pulumi config is correct
2. Run `pulumi up` to apply changes
3. Check CodeBuild project source type

### Issue: CodeBuild Not Triggering on Push

**Solution**:
1. Check webhook configuration
2. Verify GitHub repository permissions
3. Check CodeBuild webhook filter (should match branch)

### Issue: Buildspec Not Found

**Solution**:
1. Verify buildspec path in Pulumi config: `taskjuggler-api/buildspec.yml`
2. Ensure file exists in repository
3. Check CodeBuild project source version (should match branch)

---

## 📊 Success Criteria

### All Tests Pass When:
- ✅ All GitHub Actions workflows complete successfully
- ✅ CodeBuild uses GitHub source (not S3)
- ✅ Builds trigger automatically on push
- ✅ Docker images build and push successfully
- ✅ No masked failures in workflows
- ✅ Clear error messages when failures occur

---

## 📝 Next Steps After Testing

1. **Merge Test Branch**:
   ```bash
   git checkout main
   git merge test/workflow-fixes
   git push origin main
   ```

2. **Monitor Production**:
   - Watch first few production builds
   - Verify deployment pipeline works end-to-end
   - Check application health after deployment

3. **Document Any Issues**:
   - Update troubleshooting guide if needed
   - Document any edge cases found

---

**Status**: Ready for Testing  
**Last Updated**: January 2025





