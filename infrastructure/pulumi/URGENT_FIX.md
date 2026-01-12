# URGENT: CodeBuild Can't Download Source

## The Problem
CodeBuild `SourceAuth` is `null` - it can't authenticate to GitHub to download source code.

## Root Cause
The CodeStar Connection (`taskjuggler-github`) exists and is AVAILABLE, but it's NOT linked to the CodeBuild project source configuration.

## Fix Required (AWS Console)

**You MUST link the connection in AWS Console:**

1. **Go to CodeBuild Edit**:
   - https://console.aws.amazon.com/codesuite/codebuild/projects/taskjuggler-production-build/edit?region=us-east-1

2. **Source Section**:
   - Find **"Connection"** field
   - **MUST SELECT**: `taskjuggler-github` from dropdown
   - **CRITICAL**: Click **"Update source"** button (not just Save)
   - Wait for confirmation

3. **Verify**:
   ```bash
   aws codebuild batch-get-projects \
     --names taskjuggler-production-build \
     --region us-east-1 \
     --query 'projects[0].source.auth.resource' \
     --output text
   ```
   
   Should show: `arn:aws:codestar-connections:us-east-1:195430954683:connection/5f1fff66-59d0-4991-b14d-957239c045b8`
   
   NOT: `None` or empty

## Why This Matters
Without the connection linked, CodeBuild can't authenticate to GitHub to download your code, so every build fails at DOWNLOAD_SOURCE phase.

## Alternative Workaround
If connection linking keeps failing, we could:
1. Use GitHub Personal Access Token instead of CodeStar Connection
2. Or build Docker image in GitHub Actions and push to ECR directly (skip CodeBuild)

But fixing the connection is the proper solution.

