# AWS CodePipeline Setup Guide

## Overview

CI/CD has been migrated from GitHub Actions to AWS CodePipeline/CodeBuild. This eliminates GitHub Actions billing and provides native AWS integration.

## Architecture

```
GitHub (main branch)
    ↓ (webhook)
CodePipeline
    ↓
CodeBuild (builds Docker image)
    ↓
ECR (stores image)
    ↓
ECS (deploys to production)
```

## Prerequisites

1. **GitHub CodeStar Connection** (already set up: `taskjuggler-github`)
   - Connection ARN needed for Pulumi config

2. **Pulumi Stack** configured with:
   ```bash
   pulumi config set github_connection_arn "arn:aws:codestar-connections:us-east-1:ACCOUNT:connection/CONNECTION_ID"
   ```

## Deployment Steps

### 1. Get GitHub Connection ARN

```bash
aws codestar-connections list-connections --region us-east-1
# Find the ARN for "taskjuggler-github" connection
```

### 2. Configure Pulumi

```bash
cd infrastructure/pulumi
pulumi config set github_connection_arn "arn:aws:codestar-connections:us-east-1:195430954683:connection/CONNECTION_ID"
```

### 3. Deploy Infrastructure

```bash
pulumi up
```

This will create:
- CodePipeline (`taskjuggler-production-pipeline`)
- CodeBuild project (`taskjuggler-production-build`)
- S3 bucket for artifacts
- IAM roles and policies
- ECS deployment stage

### 4. Verify Pipeline

1. Go to AWS CodePipeline Console
2. Find `taskjuggler-production-pipeline`
3. The pipeline will automatically trigger on next push to `main`

## Pipeline Stages

1. **Source**: Pulls code from GitHub `main` branch
2. **Build**: CodeBuild builds Docker image and pushes to ECR
3. **Deploy**: Updates ECS service with new image

## Build Process

The `buildspec.yml` file:
1. Logs into ECR
2. Builds Docker image
3. Tags with commit hash and `latest`
4. Pushes to ECR
5. Creates `imagedefinitions.json` for ECS deployment

## Monitoring

- **CodePipeline**: AWS Console → CodePipeline
- **CodeBuild**: AWS Console → CodeBuild → Build History
- **CloudWatch Logs**: `/aws/codebuild/taskjuggler-production`

## Troubleshooting

### Pipeline not triggering
- Check GitHub webhook is configured
- Verify CodeStar Connection status is "Available"
- Check CodePipeline source stage logs

### Build failures
- Check CodeBuild logs in CloudWatch
- Verify ECR permissions
- Check buildspec.yml syntax

### Deployment failures
- Verify ECS service exists
- Check IAM permissions for ECS deployment
- Verify `imagedefinitions.json` format

## Benefits Over GitHub Actions

- ✅ **No billing**: AWS CodePipeline/CodeBuild included in AWS bill
- ✅ **Native IAM**: No GitHub Secrets needed
- ✅ **Direct integration**: ECR and ECS integration built-in
- ✅ **Better monitoring**: CloudWatch integration
- ✅ **Cost effective**: Pay only for build time

## Rollback

If needed, workflows can be restored from `.github/workflows-disabled/`

