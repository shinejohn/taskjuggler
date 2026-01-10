# Pulumi Cloud Setup Guide
## Uploading Task Juggler Infrastructure to Pulumi Cloud

**Date:** December 28, 2025  
**Status:** Ready for Upload

---

## Overview

This guide will help you upload your existing Pulumi infrastructure to Pulumi Cloud, enabling:
- **State Management**: Centralized state management in the cloud
- **Team Collaboration**: Share infrastructure with team members
- **History & Auditing**: Track all infrastructure changes
- **Web Dashboard**: View and manage infrastructure via web UI
- **CI/CD Integration**: Integrate with GitHub Actions, etc.

---

## Prerequisites

1. **Pulumi Cloud Account**: You're logged in as `johnshine`
2. **Pulumi CLI**: Installed and configured
3. **AWS Credentials**: Configured for deployment
4. **Existing Stack**: `production` stack exists locally with 101 resources

---

## Step-by-Step Migration

### Step 1: Login to Pulumi Cloud

If you're not already logged into Pulumi Cloud, run:

```bash
cd infrastructure/pulumi
pulumi login
```

This will:
- Open your browser to Pulumi Cloud
- Authenticate and get an access token
- Configure CLI to use Pulumi Cloud backend

**Note**: If you already have a Pulumi access token, you can set it:
```bash
export PULUMI_ACCESS_TOKEN=your_token_here
pulumi login https://api.pulumi.com
```

### Step 2: Export Current Stack State

Before migrating, export your current stack state as a backup:

```bash
cd infrastructure/pulumi
pulumi stack select production
pulumi stack export > stack-backup-$(date +%Y%m%d).json
```

This creates a backup of your current stack state.

### Step 3: Create Stack in Pulumi Cloud

Create a new stack in Pulumi Cloud with the format: `org/project/stack`

```bash
# Your organization is your username: johnshine
# Project name: taskjuggler-aws
# Stack name: production

pulumi stack init johnshine/taskjuggler-aws/production
```

**Alternative**: If the above format doesn't work, try:

```bash
# First, ensure you're logged into cloud
pulumi login

# Then create stack (Pulumi will use your default org)
pulumi stack init production
```

### Step 4: Import Stack State (Optional)

If you exported the state in Step 2, you can import it:

```bash
pulumi stack import --file stack-backup-YYYYMMDD.json
```

**Note**: This is optional. If you skip this, running `pulumi up` will sync the state.

### Step 5: Verify Configuration

Ensure all configuration values are set:

```bash
# Verify existing config
pulumi config

# Set any missing values
pulumi config set aws:region us-east-1
pulumi config set project_name taskjuggler
pulumi config set environment production
```

### Step 6: Verify Stack Link

Check that the stack is linked to Pulumi Cloud:

```bash
pulumi stack --show-name
```

You should see either:
- `johnshine/taskjuggler-aws/production` (full path)
- `production` (if using default org)

### Step 7: Preview Changes

Preview what will happen when you sync:

```bash
pulumi preview
```

This will show any differences between your local state and cloud state.

### Step 8: Sync State to Cloud

If everything looks good, sync the state:

```bash
pulumi up
```

This will:
- Upload your stack state to Pulumi Cloud
- Sync all 101 resources
- Create the project in Pulumi Cloud dashboard

---

## Quick Migration Script

I've created a script that automates most of this process. Run:

```bash
cd infrastructure/pulumi
chmod +x migrate-to-pulumi-cloud.sh
./migrate-to-pulumi-cloud.sh
```

**Note**: The script will prompt you for interactive login if needed.

---

## After Migration

### View in Pulumi Cloud

Once migrated, your stack will be available at:

```
https://app.pulumi.com/johnshine/taskjuggler-aws/production
```

### Stack Management

```bash
# View stack info
pulumi stack

# View outputs
pulumi stack output

# View resources
pulumi stack --show-urns

# View stack history
pulumi stack history
```

### Team Collaboration

To share with team members:

1. Go to Pulumi Cloud dashboard
2. Navigate to your project
3. Click "Settings" → "Access Control"
4. Add team members or organizations

---

## Troubleshooting

### Issue: "Stack already exists"

If the stack already exists in Pulumi Cloud:

```bash
# Select the existing cloud stack
pulumi stack select johnshine/taskjuggler-aws/production

# Or if using default org
pulumi stack select production
```

### Issue: "Backend mismatch"

If you get backend errors:

```bash
# Check current backend
pulumi whoami --json | jq .backendURL

# Switch to Pulumi Cloud
pulumi login https://api.pulumi.com

# Then select/create stack
pulumi stack select johnshine/taskjuggler-aws/production
```

### Issue: "Resources need update"

If `pulumi preview` shows resources need updating:

```bash
# Review the changes carefully
pulumi preview --diff

# If changes are expected (state sync), apply them
pulumi up
```

### Issue: "Configuration missing"

If configuration values are missing:

```bash
# List all config
pulumi config

# Set missing values
pulumi config set <key> <value>
pulumi config set --secret <key> <value>  # For secrets
```

---

## Manual Migration Steps

If the automated script doesn't work, follow these manual steps:

### 1. Login to Pulumi Cloud

```bash
pulumi login
# Follow the browser prompts to authenticate
```

### 2. Select/Create Stack

```bash
# Try to select existing cloud stack
pulumi stack select johnshine/taskjuggler-aws/production

# If it doesn't exist, create it
pulumi stack init johnshine/taskjuggler-aws/production
```

### 3. Copy Configuration

Your existing `Pulumi.production.yaml` will be used automatically. If you need to migrate secrets:

```bash
# Secrets are encrypted, so they should migrate automatically
# But you can verify:
pulumi config get db_password
pulumi config get redis_auth_token
```

### 4. Sync State

```bash
# Preview first
pulumi preview

# Then sync
pulumi up
```

---

## Verification Checklist

After migration, verify:

- [ ] Stack appears in Pulumi Cloud dashboard
- [ ] All 101 resources are visible
- [ ] Configuration values are present
- [ ] Stack URL is accessible
- [ ] `pulumi stack` shows cloud backend
- [ ] `pulumi preview` shows no unexpected changes

---

## Next Steps

After successful migration:

1. **Set up CI/CD**: Integrate with GitHub Actions
2. **Configure Teams**: Add team members
3. **Set up Policies**: Configure stack policies
4. **Enable Webhooks**: Set up webhook notifications
5. **Review History**: Check stack update history

---

## Support

If you encounter issues:

1. Check Pulumi Cloud status: https://status.pulumi.com
2. Review Pulumi docs: https://www.pulumi.com/docs/
3. Check stack logs in Pulumi Cloud dashboard
4. Verify AWS credentials are configured

---

**Migration Guide Created:** December 28, 2025  
**Ready for Execution**





