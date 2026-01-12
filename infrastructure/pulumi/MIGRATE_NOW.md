# Quick Start: Migrate to Pulumi Cloud

Since you're already logged into Pulumi Cloud, follow these steps:

## Option 1: Interactive Login (Recommended)

1. **Login to Pulumi Cloud** (if not already):
   ```bash
   cd infrastructure/pulumi
   pulumi login
   ```
   This will open your browser. Follow the prompts to authenticate.

2. **Create/Select Stack in Cloud**:
   ```bash
   # Create stack in your organization
   pulumi stack init johnshine/taskjuggler-aws/production
   
   # Or if that doesn't work, try:
   pulumi stack init production
   ```

3. **Select the Stack**:
   ```bash
   pulumi stack select johnshine/taskjuggler-aws/production
   # Or
   pulumi stack select production
   ```

4. **Sync State**:
   ```bash
   pulumi preview  # Review changes
   pulumi up       # Sync to cloud
   ```

## Option 2: Using Access Token

If you have a Pulumi access token:

1. **Set Token**:
   ```bash
   export PULUMI_ACCESS_TOKEN=your_token_here
   ```

2. **Login**:
   ```bash
   pulumi login https://api.pulumi.com
   ```

3. **Create Stack**:
   ```bash
   pulumi stack init johnshine/taskjuggler-aws/production
   ```

4. **Sync**:
   ```bash
   pulumi up
   ```

## Get Your Access Token

1. Go to: https://app.pulumi.com/account/tokens
2. Click "Create token"
3. Copy the token
4. Use it in the commands above

## After Migration

Your stack will be available at:
**https://app.pulumi.com/johnshine/taskjuggler-aws/production**

You can:
- View all 101 resources
- See update history
- Share with team members
- Integrate with CI/CD
- Set up policies

---

**Ready to migrate!** Run the commands above to upload your infrastructure to Pulumi Cloud.





