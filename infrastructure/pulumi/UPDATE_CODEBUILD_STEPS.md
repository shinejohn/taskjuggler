# Update CodeBuild to Use CodeStar Connection

## Navigation Steps

1. **From AWS Console Homepage**:
   - Search for "CodeBuild" in the top search bar
   - Click on "CodeBuild" service

2. **Or Direct Link**:
   - https://console.aws.amazon.com/codesuite/codebuild/projects/taskjuggler-production-build?region=us-east-1

3. **Once in CodeBuild**:
   - You should see "Projects" in the left sidebar
   - Click on project: `taskjuggler-production-build`
   - Click the **"Edit"** button (top right)

4. **Update Source Section**:
   - Scroll down to find **"Source"** section
   - Look for **"Connection"** dropdown (it may say "No connection" or be empty)
   - Select: `taskjuggler-github` from the dropdown
   - Click **"Update source"** or **"Save changes"** button

## What You're Looking For

In the Edit page, you should see:
- **Source provider**: GitHub (already set)
- **Repository**: https://github.com/shinejohn/taskjuggler.git (already set)
- **Connection**: [Dropdown] ← **Select `taskjuggler-github` here**
- **Source version**: refs/heads/main (already set)
- **Buildspec name**: taskjuggler-api/buildspec.yml (already set)

## After Saving

Once you've selected the connection and saved:
```bash
cd infrastructure/pulumi
./create-webhook.sh
```

This will create the webhook and give you the GitHub webhook URL.

