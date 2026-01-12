# Create Webhook via AWS Console

Since there's a permissions issue with CLI, let's create the webhook through the console.

## Steps:

1. **Go to CodeBuild Project**:
   - https://console.aws.amazon.com/codesuite/codebuild/projects/taskjuggler-production-build?region=us-east-1
   - Or navigate: CodeBuild → Projects → `taskjuggler-production-build`

2. **Click on the project name** to open details

3. **Look for "Webhooks" section**:
   - In the project details page, find "Webhooks" tab or section
   - Or look for "Triggers" section

4. **Create Webhook**:
   - Click "Create webhook" or "Add webhook" button
   - **Filter groups**: 
     - Event: `PUSH`
     - Branch: `^refs/heads/main$`
   - Click "Create webhook" or "Save"

5. **Copy Webhook Details**:
   - After creation, you'll see:
     - **Webhook URL** (copy this)
     - **Webhook Secret** (copy this, if shown)

6. **Add to GitHub**:
   - Go to: https://github.com/shinejohn/taskjuggler/settings/hooks
   - Click "Add webhook"
   - Paste the webhook URL
   - Set content type: `application/json`
   - Add secret if provided
   - Select events: "Just the push event"
   - Click "Add webhook"

## Alternative: Check if Webhook Already Exists

Sometimes AWS creates the webhook automatically. Check:
- CodeBuild project → Webhooks section
- Look for existing webhook URL

