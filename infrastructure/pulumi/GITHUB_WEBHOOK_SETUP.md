# GitHub Webhook Setup for CodeBuild

## Status: ⚠️ Manual OAuth Authorization Required

**Connection Created**: ✅  
**Connection ARN**: `arn:aws:codestar-connections:us-east-1:195430954683:connection/5f1fff66-59d0-4991-b14d-957239c045b8`  
**Connection Status**: `PENDING` (needs OAuth authorization)

---

## Step-by-Step Instructions

### Step 1: Authorize GitHub Connection (Manual)

1. **Open AWS Console**:
   - Direct link: https://console.aws.amazon.com/codesuite/settings/connections?region=us-east-1
   - Or navigate: AWS Console → Developer Tools → Settings → Connections

2. **Find the Connection**:
   - Look for connection named: `taskjuggler-github`
   - Status will show: `Pending`

3. **Authorize Connection**:
   - Click on the connection name
   - Click **"Update pending connection"** button
   - You'll be redirected to GitHub for OAuth authorization
   - Click **"Authorize AWS"** on GitHub
   - Grant access to the repository: `shinejohn/taskjuggler`
   - Return to AWS Console
   - Connection status should change to **"Available"** (may take 1-2 minutes)

### Step 2: Complete Webhook Setup (Automated)

Once the connection status is **"Available"**, run:

```bash
cd infrastructure/pulumi
./setup-github-webhook.sh
```

This script will:
1. ✅ Verify connection is available
2. ✅ Update CodeBuild to use the CodeStar Connection
3. ✅ Create webhook for automatic builds
4. ✅ Provide webhook URL and secret for GitHub

### Step 3: Add Webhook to GitHub (Manual)

After running the script, you'll get:
- **Webhook URL**: (provided by script)
- **Webhook Secret**: (provided by script)

Then:

1. Go to GitHub: https://github.com/shinejohn/taskjuggler/settings/hooks
2. Click **"Add webhook"**
3. Enter:
   - **Payload URL**: (from script output)
   - **Content type**: `application/json`
   - **Secret**: (from script output, if provided)
   - **Events**: Select "Just the push event"
4. Click **"Add webhook"**

---

## Verification

### Check Connection Status
```bash
aws codestar-connections get-connection \
  --connection-arn "arn:aws:codestar-connections:us-east-1:195430954683:connection/5f1fff66-59d0-4991-b14d-957239c045b8" \
  --region us-east-1 \
  --query 'Connection.ConnectionStatus' \
  --output text
```

Expected: `AVAILABLE`

### Check CodeBuild Configuration
```bash
aws codebuild batch-get-projects \
  --names taskjuggler-production-build \
  --region us-east-1 \
  --query 'projects[0].{SourceType:source.type,SourceAuth:source.auth}' \
  --output json
```

Expected: Source type should be `GITHUB` with auth resource matching connection ARN

### Check Webhook
```bash
aws codebuild batch-get-projects \
  --names taskjuggler-production-build \
  --region us-east-1 \
  --query 'projects[0].webhook' \
  --output json
```

Expected: Should show webhook URL (not null)

### Test Build Trigger
```bash
# Push a commit to main branch
git push origin main

# Check if build triggered
aws codebuild list-builds-for-project \
  --project-name taskjuggler-production-build \
  --region us-east-1 \
  --max-items 1 \
  --output json
```

---

## Troubleshooting

### Connection Stays PENDING
- Wait 1-2 minutes after authorization
- Refresh the AWS Console page
- Check if GitHub authorization was completed successfully

### Webhook Creation Fails
- Ensure connection status is `AVAILABLE`
- Verify CodeBuild project has correct source configuration
- Check IAM permissions for CodeBuild service role

### Builds Don't Trigger
- Verify webhook is added to GitHub repository
- Check webhook deliveries in GitHub Settings → Webhooks
- Verify webhook URL matches CodeBuild webhook URL
- Check CodeBuild logs for errors

---

## Quick Reference

**Connection ARN**: `arn:aws:codestar-connections:us-east-1:195430954683:connection/5f1fff66-59d0-4991-b14d-957239c045b8`  
**Project Name**: `taskjuggler-production-build`  
**Region**: `us-east-1`  
**GitHub Repo**: `shinejohn/taskjuggler`  
**Branch**: `main`

---

**Last Updated**: January 2025

