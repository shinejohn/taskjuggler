# Complete Webhook Setup - Manual Steps Required

**Status**: Connection is AVAILABLE ✅  
**Next**: Update CodeBuild to use CodeStar Connection (Console only)

---

## Step 1: Update CodeBuild to Use CodeStar Connection

The AWS CLI doesn't support updating CodeBuild source auth for CodeStar Connections. This must be done through the AWS Console.

### Instructions:

1. **Open CodeBuild Console**:
   - Direct link: https://console.aws.amazon.com/codesuite/codebuild/projects/taskjuggler-production-build/edit?region=us-east-1
   - Or navigate: AWS Console → CodeBuild → Projects → `taskjuggler-production-build` → Edit

2. **Update Source Configuration**:
   - Scroll to **"Source"** section
   - **Source provider**: Select `GitHub`
   - **Repository**: `https://github.com/shinejohn/taskjuggler.git`
   - **Source version**: `refs/heads/main`
   - **Buildspec name**: `taskjuggler-api/buildspec.yml`
   - **Connection**: Select `taskjuggler-github` from dropdown
   - Click **"Update source"** or **"Save"**

3. **Verify**:
   - The source should now show connection: `taskjuggler-github`
   - Connection status should be `Available`

---

## Step 2: Create Webhook (Automated)

After updating CodeBuild in the console, run:

```bash
cd infrastructure/pulumi
./create-webhook.sh
```

Or manually:

```bash
aws codebuild create-webhook \
  --project-name taskjuggler-production-build \
  --region us-east-1 \
  --filter-groups '[[{"type":"EVENT","pattern":"PUSH"},{"type":"HEAD_REF","pattern":"^refs/heads/main$"}]]' \
  --output json
```

This will output the webhook URL and secret.

---

## Step 3: Add Webhook to GitHub

After webhook is created, you'll get:
- **Webhook URL**: (from create-webhook output)
- **Webhook Secret**: (from create-webhook output)

### Add to GitHub:

1. Go to: https://github.com/shinejohn/taskjuggler/settings/hooks
2. Click **"Add webhook"**
3. Enter:
   - **Payload URL**: (from Step 2 output)
   - **Content type**: `application/json`
   - **Secret**: (from Step 2 output, if provided)
   - **Which events**: Select "Just the push event"
   - **Active**: ✅ Checked
4. Click **"Add webhook"**

---

## Verification

### Test Build Trigger

```bash
# Push a commit to main branch
git commit --allow-empty -m "Test webhook trigger"
git push origin main

# Check if build triggered (wait 30 seconds)
aws codebuild list-builds-for-project \
  --project-name taskjuggler-production-build \
  --region us-east-1 \
  --max-items 1 \
  --output json
```

### Check Webhook Status

```bash
aws codebuild batch-get-projects \
  --names taskjuggler-production-build \
  --region us-east-1 \
  --query 'projects[0].webhook' \
  --output json
```

---

## Quick Reference

**Connection ARN**: `arn:aws:codestar-connections:us-east-1:195430954683:connection/5f1fff66-59d0-4991-b14d-957239c045b8`  
**Project Name**: `taskjuggler-production-build`  
**Region**: `us-east-1`  
**GitHub Repo**: `shinejohn/taskjuggler`  
**Branch**: `main`

---

**Last Updated**: January 2025

