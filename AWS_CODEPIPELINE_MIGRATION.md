# AWS CodePipeline Migration Guide

## Overview
Migrating from GitHub Actions to AWS CodePipeline/CodeBuild to:
- ✅ Eliminate GitHub Actions billing issues
- ✅ Use native AWS IAM (no GitHub Secrets needed)
- ✅ Integrate directly with ECR and ECS
- ✅ Keep everything in AWS

## Current Status

### ✅ Already Configured
- CodePipeline infrastructure code exists (`infrastructure/pulumi/infrastructure/codepipeline.py`)
- CodeBuild project configured for CODEPIPELINE source
- Buildspec.yml ready (`taskjuggler-api/buildspec.yml`)
- ECS deployment stage configured

### 🔧 Steps to Complete Migration

#### 1. Set Up GitHub CodeStar Connection (One-Time Setup)

**Option A: Use Existing Connection**
If you already have a CodeStar Connection for GitHub:
```bash
cd infrastructure/pulumi
pulumi config set github_connection_arn "arn:aws:codestar-connections:us-east-1:195430954683:connection/CONNECTION_ID"
```

**Option B: Create New Connection**
1. Go to AWS Console → CodePipeline → Settings → Connections
2. Create connection → GitHub
3. Authorize via GitHub OAuth
4. Copy the Connection ARN
5. Set in Pulumi config:
```bash
cd infrastructure/pulumi
pulumi config set github_connection_arn "arn:aws:codestar-connections:us-east-1:195430954683:connection/YOUR_CONNECTION_ID"
```

#### 2. Deploy CodePipeline Infrastructure

```bash
cd infrastructure/pulumi
source venv/bin/activate  # or activate your Python venv
pulumi stack select production
pulumi up
```

This will create:
- CodePipeline with GitHub source
- CodeBuild project (if not exists)
- ECS deployment stage
- S3 artifact bucket
- All necessary IAM roles

#### 3. Verify Pipeline

After deployment, check:
```bash
pulumi stack output pipeline_url
```

Or visit AWS Console → CodePipeline → Pipelines → `taskjuggler-production-pipeline`

#### 4. Test the Pipeline

1. Make a commit to `main` branch
2. CodePipeline will automatically trigger
3. Watch the pipeline execute:
   - **Source**: Pulls code from GitHub
   - **Build**: Builds Docker image via CodeBuild
   - **Deploy**: Deploys to ECS

## Pipeline Flow

```
GitHub (main branch)
    ↓
CodePipeline Source Stage
    ↓
CodeBuild (Build Docker Image)
    ↓
ECR (Push Image)
    ↓
ECS Deploy Stage (Update Service)
    ↓
Production Running
```

## Benefits

1. **No GitHub Actions Billing**: All CI/CD runs in AWS
2. **Native AWS Integration**: Direct ECR/ECS integration
3. **IAM-Based Security**: No GitHub Secrets needed
4. **Cost Effective**: Pay only for CodeBuild compute time
5. **Unified Infrastructure**: Everything managed via Pulumi

## Troubleshooting

### Pipeline Not Triggering
- Check GitHub connection status in AWS Console
- Verify branch name matches (default: `main`)
- Check CodePipeline event rules

### Build Failing
- Check CodeBuild logs in CloudWatch
- Verify buildspec.yml path is correct
- Check ECR permissions

### Deployment Failing
- Verify ECS service name matches
- Check IAM permissions for ECS deployment
- Verify imagedefinitions.json format

## Rollback Plan

If needed, GitHub Actions workflows can be restored from git history:
```bash
git log --all --full-history -- .github/workflows/
git checkout <commit-hash> -- .github/workflows/
```

## Next Steps

1. ✅ Set GitHub connection ARN in Pulumi config
2. ✅ Deploy CodePipeline via `pulumi up`
3. ✅ Test with a commit to `main`
4. ✅ Monitor first deployment
5. ✅ Remove GitHub Actions workflows (already done)

