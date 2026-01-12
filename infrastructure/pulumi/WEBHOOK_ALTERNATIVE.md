# Webhook Creation - Alternative Approach

The "Create trigger" button only shows scheduled triggers (cron). Webhooks might be created automatically or in a different location.

## Option 1: Check if Webhook Already Exists

When CodeBuild is connected to GitHub via CodeStar Connection, AWS sometimes creates the webhook automatically. Check:

1. **In CodeBuild Project Settings**:
   - Go to project → "Edit" → Look for "Webhook" section
   - Or check "Project details" tab

2. **Via AWS CLI**:
   ```bash
   aws codebuild batch-get-projects \
     --names taskjuggler-production-build \
     --region us-east-1 \
     --query 'projects[0].webhook' \
     --output json
   ```

## Option 2: Create Webhook via GitHub

Sometimes it's easier to create the webhook from GitHub's side:

1. **Get CodeBuild Webhook URL** (if it exists):
   - Check CodeBuild project settings
   - Or use AWS CLI command above

2. **Add to GitHub**:
   - Go to: https://github.com/shinejohn/taskjuggler/settings/hooks
   - Click "Add webhook"
   - Payload URL: (CodeBuild webhook URL)
   - Content type: `application/json`
   - Events: "Just the push event"

## Option 3: Use GitHub Actions Instead

If webhooks are problematic, you can trigger CodeBuild from GitHub Actions:

1. Create `.github/workflows/deploy.yml`
2. Use AWS CLI in GitHub Actions to trigger CodeBuild
3. This avoids webhook setup entirely

## Option 4: Check Project Edit Page

Webhooks might be configured in the project Edit page:
1. Click "Edit" button on project
2. Look for "Webhook" or "Build triggers" section
3. There might be a separate "Webhook" option vs "Schedule"

Let me check what's available via CLI first.

