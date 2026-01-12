# GitHub CI/CD Setup Guide
## Proper CI/CD Integration with GitHub

**Date:** December 2025  
**Status:** ✅ Ready for Setup

---

## Overview

This guide explains how to set up proper CI/CD using GitHub integration instead of manual S3 uploads. CodeBuild will automatically pull source code from GitHub and trigger builds on push.

---

## Why GitHub Integration?

### Current Approach (S3 Manual Upload)
- ❌ Manual uploads required
- ❌ No automatic builds on code changes
- ❌ Extra steps in deployment process
- ❌ Not following CI/CD best practices

### GitHub Integration (Recommended)
- ✅ Automatic builds on git push
- ✅ No manual uploads needed
- ✅ Proper CI/CD workflow
- ✅ Webhook-based triggers
- ✅ Industry standard approach

---

## Setup Options

### Option 1: GitHub Personal Access Token (Quick Setup)

#### Step 1: Create GitHub Token

1. Go to: https://github.com/settings/tokens
2. Click "Generate new token" → "Generate new token (classic)"
3. Name: `TaskJuggler CodeBuild`
4. Expiration: Choose appropriate (90 days recommended)
5. Scopes: Check `repo` (Full control of private repositories)
6. Click "Generate token"
7. **Copy the token immediately** (you won't see it again)

#### Step 2: Store Token

**Option A: Environment Variable (for testing)**
```bash
export GITHUB_TOKEN=your_token_here
```

**Option B: AWS Secrets Manager (recommended for production)**
```bash
aws secretsmanager create-secret \
  --name taskjuggler/github/token \
  --secret-string your_token_here \
  --region us-east-1 \
  --description "GitHub Personal Access Token for CodeBuild"
```

#### Step 3: Configure CodeBuild

```bash
cd infrastructure/pulumi

# Set GitHub details (if different from defaults)
export GITHUB_OWNER=shinejohn
export GITHUB_REPO=taskjuggler
export GITHUB_BRANCH=main

# Run setup script
./setup-github-cicd.sh
```

This will:
- Update CodeBuild to use GitHub source
- Store token in Secrets Manager
- Configure webhook for automatic builds

---

### Option 2: GitHub App Connection (Enterprise/Production)

For production environments, use AWS CodeStar Connections:

#### Step 1: Create GitHub Connection in AWS

1. Go to AWS Console → CodeBuild → Settings → Connections
2. Click "Create connection"
3. Select "GitHub"
4. Click "Connect to GitHub"
5. Authorize AWS to access your GitHub account
6. Name: `taskjuggler-github-connection`
7. Click "Create"

#### Step 2: Update CodeBuild Project

The connection ARN will be used in Pulumi configuration:

```python
# In codebuild.py
source=aws.codebuild.ProjectSourceArgs(
    type="GITHUB",
    location=f"https://github.com/{github_owner}/{github_repo}.git",
    buildspec="taskjuggler-api/buildspec.yml",
    auth=aws.codebuild.ProjectSourceAuthArgs(
        type="OAUTH",
        resource=connection_arn,  # From CodeStar Connections
    ),
)
```

---

## Configuration

### Environment Variables

Set these before running setup scripts:

```bash
export GITHUB_OWNER=shinejohn          # Your GitHub username/org
export GITHUB_REPO=taskjuggler         # Repository name
export GITHUB_BRANCH=main              # Branch to build from
export GITHUB_TOKEN=your_token_here    # Personal Access Token
```

### Pulumi Configuration

Add to `Pulumi.production.yaml`:

```yaml
config:
  github:
    enabled: true
    owner: shinejohn
    repo: taskjuggler
    branch: main
    buildspec: taskjuggler-api/buildspec.yml
```

Then update `codebuild.py` to read this config.

---

## Workflow

### Automatic Builds (Recommended)

1. **Push code to GitHub:**
   ```bash
   git add .
   git commit -m "Your changes"
   git push origin main
   ```

2. **GitHub webhook triggers CodeBuild automatically**

3. **CodeBuild:**
   - Pulls source from GitHub
   - Runs buildspec.yml
   - Builds Docker image
   - Pushes to ECR

4. **ECS services automatically update** (if configured)

### Manual Builds

If you need to trigger manually:

```bash
cd infrastructure/pulumi
./trigger-build.sh
```

---

## Webhook Setup

After configuring GitHub source, CodeBuild provides a webhook URL:

1. **Get webhook info:**
   ```bash
   aws codebuild batch-get-projects \
     --names taskjuggler-production-build \
     --region us-east-1 \
     --query 'projects[0].webhook'
   ```

2. **Add webhook to GitHub:**
   - Go to: `https://github.com/shinejohn/taskjuggler/settings/hooks`
   - Click "Add webhook"
   - Payload URL: (from CodeBuild webhook)
   - Content type: `application/json`
   - Secret: (from CodeBuild webhook)
   - Events: Just the `push` event
   - Active: checked
   - Click "Add webhook"

Or use the `setup-github-cicd.sh` script which attempts to create it automatically.

---

## Verification

### Check CodeBuild Source

```bash
aws codebuild batch-get-projects \
  --names taskjuggler-production-build \
  --region us-east-1 \
  --query 'projects[0].source'
```

Should show:
```json
{
  "type": "GITHUB",
  "location": "https://github.com/shinejohn/taskjuggler.git",
  "buildspec": "taskjuggler-api/buildspec.yml"
}
```

### Test Build

```bash
# Trigger build manually
aws codebuild start-build \
  --project-name taskjuggler-production-build \
  --region us-east-1

# Or push to GitHub
git push origin main
```

### Monitor Builds

```bash
./check-build-logs.sh
```

---

## Troubleshooting

### Build Not Triggering on Push

1. **Check webhook is configured:**
   ```bash
   aws codebuild batch-get-projects \
     --names taskjuggler-production-build \
     --query 'projects[0].webhook'
   ```

2. **Check GitHub webhook delivery:**
   - Go to repository settings → Webhooks
   - Click on webhook
   - Check "Recent Deliveries" for errors

3. **Verify branch matches:**
   - CodeBuild source version should match branch
   - Webhook filter should match branch pattern

### Authentication Errors

1. **Token expired:**
   - Generate new token
   - Update in Secrets Manager
   - Restart build

2. **Insufficient permissions:**
   - Token needs `repo` scope
   - Repository must be accessible

### Buildspec Not Found

- Ensure `buildspec.yml` exists in `taskjuggler-api/` directory
- Path in CodeBuild config: `taskjuggler-api/buildspec.yml`
- Or use absolute path from repo root

---

## Migration from S3 to GitHub

If you're currently using S3 source:

1. **Set up GitHub integration:**
   ```bash
   export GITHUB_TOKEN=your_token
   ./setup-github-cicd.sh
   ```

2. **Verify configuration:**
   ```bash
   ./check-build-logs.sh
   ```

3. **Test build:**
   ```bash
   git push origin main
   ```

4. **Remove S3 upload scripts** (optional):
   - `fix-codebuild.sh` (S3 parts)
   - `trigger-build.sh` (S3 upload parts)

---

## Best Practices

1. **Use Secrets Manager** for tokens (not environment variables)
2. **Rotate tokens** regularly (every 90 days)
3. **Use GitHub Apps** for production (more secure than PATs)
4. **Set up branch protection** in GitHub
5. **Use separate tokens** for different environments
6. **Monitor webhook deliveries** for failures
7. **Use buildspec.yml** in repository (not inline)

---

## Next Steps

1. ✅ Set up GitHub integration using `setup-github-cicd.sh`
2. ✅ Configure webhook for automatic builds
3. ✅ Test with a push to GitHub
4. ✅ Verify builds trigger automatically
5. ✅ Remove S3 upload dependencies

---

**GitHub CI/CD Setup Complete!**

Now your deployment follows proper CI/CD practices with automatic builds on code changes.
