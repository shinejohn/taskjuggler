# Verify CodeBuild Connection

The webhook creation is failing because the CodeStar Connection might not be properly linked yet.

## Please Verify in AWS Console:

1. **Go back to CodeBuild project**:
   - https://console.aws.amazon.com/codesuite/codebuild/projects/taskjuggler-production-build/edit?region=us-east-1

2. **Check Source Section**:
   - Look at the **"Connection"** field
   - It should show: `taskjuggler-github` (not empty or "No connection")
   - If it's empty, select `taskjuggler-github` again and click **"Update source"**

3. **Wait 30 seconds** after updating, then try creating webhook again:
   ```bash
   cd infrastructure/pulumi
   ./create-webhook.sh
   ```

## Alternative: Check via AWS CLI

```bash
aws codebuild batch-get-projects \
  --names taskjuggler-production-build \
  --region us-east-1 \
  --query 'projects[0].source.auth' \
  --output json
```

If this shows `null`, the connection wasn't saved properly. Go back to console and save again.

## If Connection is Set But Webhook Still Fails:

Sometimes AWS needs a few minutes to propagate the connection. Wait 2-3 minutes and try again.

