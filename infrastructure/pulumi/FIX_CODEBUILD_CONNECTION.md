# Fix CodeBuild Connection Issue

## Problem
CodeBuild `SourceAuth` is `null` - the CodeStar Connection isn't linked to the project.

## Solution

The connection needs to be properly linked in the AWS Console. The CLI update didn't work.

### Steps:

1. **Go to CodeBuild Project Edit**:
   - https://console.aws.amazon.com/codesuite/codebuild/projects/taskjuggler-production-build/edit?region=us-east-1

2. **In the Source section**:
   - Look for **"Connection"** dropdown
   - It might say "No connection" or be empty
   - **Select**: `taskjuggler-github` from the dropdown
   - **IMPORTANT**: Make sure you click **"Update source"** or **"Save changes"** button

3. **Verify it saved**:
   ```bash
   aws codebuild batch-get-projects \
     --names taskjuggler-production-build \
     --region us-east-1 \
     --query 'projects[0].source.auth' \
     --output json
   ```
   
   Should show the connection ARN, not `null`

4. **If connection doesn't appear**:
   - Go to CodeStar Connections: https://console.aws.amazon.com/codesuite/settings/connections?region=us-east-1
   - Verify `taskjuggler-github` shows status: **"Available"**
   - If not, click "Update pending connection" and authorize again

## Alternative: Use GitHub Actions Only

Since GitHub Actions workflow is working, we can skip CodeBuild webhook entirely and just use GitHub Actions to trigger builds. The workflow already does this.

The current setup:
- ✅ GitHub Actions triggers CodeBuild via CLI
- ✅ CodeBuild builds Docker image
- ✅ Pushes to ECR

This works even without the CodeStar Connection linked to CodeBuild source!

