# Upload TaskJuggler to Pulumi Cloud - Quick Guide

## ✅ What's Been Done

1. ✅ Updated `Pulumi.yaml` - Project name changed to "TaskJuggler"
2. ✅ Created setup script: `setup-pulumi-cloud-project.sh`
3. ✅ Created guide: `UPLOAD_TO_PULUMI_CLOUD.md`

## 🚀 Quick Start

Since you're logged into Pulumi Cloud, follow these steps:

### Step 1: Login CLI to Pulumi Cloud

**Option A: Using Access Token (Fastest)**
```bash
cd infrastructure/pulumi

# Get token from: https://app.pulumi.com/account/tokens
export PULUMI_ACCESS_TOKEN=your_token_here
pulumi login https://api.pulumi.com
```

**Option B: Interactive Login**
```bash
cd infrastructure/pulumi
pulumi login https://api.pulumi.com
# This opens your browser to authenticate
```

### Step 2: Create Stack in Cloud

```bash
pulumi stack init johnshine/TaskJuggler/production
```

### Step 3: Sync Resources

```bash
# Preview what will be uploaded
pulumi preview

# Upload your 101 resources to cloud
pulumi up
```

## 📍 After Upload

Your infrastructure will be at:
**https://app.pulumi.com/johnshine/TaskJuggler/production**

## 🔧 Using the Setup Script

After logging into Pulumi Cloud, run:

```bash
cd infrastructure/pulumi
./setup-pulumi-cloud-project.sh
```

This script will:
- Verify you're logged into cloud
- Create the stack `johnshine/TaskJuggler/production`
- Set up configuration
- Provide the stack URL

## 📝 Notes

- Your existing `production` stack with 101 resources will be uploaded
- Configuration from `Pulumi.production.yaml` will be preserved
- All secrets will be encrypted in Pulumi Cloud
- You can share access with team members via the web dashboard

---

**Ready to upload!** Start with Step 1 above.





