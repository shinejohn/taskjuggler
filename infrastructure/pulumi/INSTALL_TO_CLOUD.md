# Install TaskJuggler to Pulumi Cloud

## ✅ Current Status

- ✅ **Pulumi CLI Installed**: v3.213.0
- ✅ **Logged in as**: johnshine
- ⚠️ **Backend**: Local (file://~) - needs to switch to Pulumi Cloud

## 🚀 Quick Installation Steps

### Step 1: Login to Pulumi Cloud

You need to authenticate the CLI with Pulumi Cloud. Choose one method:

**Option A: Interactive Login (Easiest)**
```bash
cd infrastructure/pulumi
pulumi login https://api.pulumi.com
```
This will open your browser to authenticate.

**Option B: Using Access Token**
```bash
cd infrastructure/pulumi

# Get your token from: https://app.pulumi.com/account/tokens
export PULUMI_ACCESS_TOKEN=your_token_here
pulumi login https://api.pulumi.com
```

### Step 2: Create Stack in Pulumi Cloud

After logging in, run:
```bash
pulumi stack init johnshine/TaskJuggler/production
```

### Step 3: Set Configuration

```bash
pulumi config set aws:region us-east-1
pulumi config set project_name taskjuggler
pulumi config set environment production
```

### Step 4: Upload Infrastructure

```bash
# Preview what will be uploaded
pulumi preview

# Upload your resources
pulumi up
```

## 🔧 Automated Script

After logging into Pulumi Cloud (Step 1), run:

```bash
cd infrastructure/pulumi
./install-to-cloud.sh
```

This script will:
- Verify CLI is installed ✅
- Check you're logged into cloud
- Create the stack `johnshine/TaskJuggler/production`
- Set up configuration
- Provide the stack URL

## 📍 After Installation

Your infrastructure will be available at:
**https://app.pulumi.com/johnshine/TaskJuggler/production**

## 🔑 Getting Your Access Token

1. Go to: https://app.pulumi.com/account/tokens
2. Click "Create token"
3. Give it a name (e.g., "CLI Access")
4. Copy the token
5. Use it in the commands above

## 📝 Notes

- Your existing `Pulumi.production.yaml` configuration will be preserved
- All secrets will be encrypted in Pulumi Cloud
- You can share access with team members via the web dashboard
- The project name "TaskJuggler" is already set in `Pulumi.yaml`

---

**Ready to install!** Start with Step 1 above to login to Pulumi Cloud.





