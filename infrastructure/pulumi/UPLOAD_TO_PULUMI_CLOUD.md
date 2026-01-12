# Upload TaskJuggler to Pulumi Cloud

## Current Status
- ✅ Project name updated to "TaskJuggler" in `Pulumi.yaml`
- ⚠️ CLI is currently using local backend (`file://~`)
- ✅ You're logged into Pulumi Cloud in browser

## Steps to Upload

### Option 1: Using Access Token (Recommended)

1. **Get your Pulumi Access Token:**
   - Go to: https://app.pulumi.com/account/tokens
   - Click "Create token"
   - Copy the token

2. **Login to Pulumi Cloud:**
   ```bash
   cd infrastructure/pulumi
   export PULUMI_ACCESS_TOKEN=your_token_here
   pulumi login https://api.pulumi.com
   ```

3. **Create the stack:**
   ```bash
   pulumi stack init johnshine/TaskJuggler/production
   ```

4. **Sync your resources:**
   ```bash
   pulumi preview  # Review changes
   pulumi up       # Upload to cloud
   ```

### Option 2: Interactive Login

1. **Login interactively:**
   ```bash
   cd infrastructure/pulumi
   pulumi login https://api.pulumi.com
   ```
   This will open your browser to authenticate.

2. **Create the stack:**
   ```bash
   pulumi stack init johnshine/TaskJuggler/production
   ```

3. **Sync resources:**
   ```bash
   pulumi preview
   pulumi up
   ```

## After Upload

Your infrastructure will be available at:
**https://app.pulumi.com/johnshine/TaskJuggler/production**

You'll be able to:
- View all 101 resources
- See update history
- Share with team members
- Integrate with CI/CD
- Set up policies

## Quick Script

I've created `setup-pulumi-cloud-project.sh` that will:
1. Check if you're logged into cloud
2. Create the stack `johnshine/TaskJuggler/production`
3. Set up configuration
4. Provide the stack URL

Run it after logging into Pulumi Cloud:
```bash
cd infrastructure/pulumi
./setup-pulumi-cloud-project.sh
```

---

**Ready to upload!** Follow the steps above to migrate your infrastructure to Pulumi Cloud.





