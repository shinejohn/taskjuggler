# Fix Pulumi Secret Decryption Error

## Issue
```
error: validating stack config: [400] could not decrypt secret at index 0
```

This happens when Pulumi can't decrypt secrets stored in the stack config. This is usually due to:
- Encryption key mismatch
- Need to refresh Pulumi login
- Passphrase-protected stack

## Solution

### Option 1: Refresh Pulumi Login (Recommended)

Run these commands **interactively** (not in a script):

```bash
cd infrastructure/pulumi
source venv/bin/activate
pulumi logout
pulumi login
# Follow the prompts to login (browser or access token)
pulumi stack select shinejohn/production
pulumi preview
```

### Option 2: Use Passphrase (If Stack is Passphrase-Protected)

If your stack uses a passphrase:

```bash
cd infrastructure/pulumi
source venv/bin/activate
export PULUMI_CONFIG_PASSPHRASE="your-passphrase"
pulumi stack select shinejohn/production
pulumi preview
```

### Option 3: Re-set Secrets (If Above Don't Work)

If decryption still fails, you can remove and re-add the secrets:

```bash
cd infrastructure/pulumi
source venv/bin/activate
pulumi stack select shinejohn/production

# Remove problematic secrets
pulumi config rm redis_auth_token
pulumi config rm github_token

# Re-add them (you'll need the original values)
pulumi config set --secret redis_auth_token "<original-value>"
pulumi config set --secret github_token "<your-github-token>"

# Try preview again
pulumi preview
```

### Option 4: Use Pulumi Access Token

If you have a Pulumi access token:

```bash
export PULUMI_ACCESS_TOKEN="your-access-token"
cd infrastructure/pulumi
source venv/bin/activate
pulumi stack select shinejohn/production
pulumi preview
```

## Quick Fix Script

Create a file `fix-decryption.sh`:

```bash
#!/bin/bash
cd "$(dirname "$0")"
source venv/bin/activate

echo "Attempting to fix Pulumi decryption..."
pulumi stack select shinejohn/production

# Try to refresh config
pulumi config refresh

# If that doesn't work, try preview with verbose output
pulumi preview --debug 2>&1 | head -50
```

Run it:
```bash
chmod +x fix-decryption.sh
./fix-decryption.sh
```

## Most Likely Solution

The issue is probably that you need to login interactively. Run this **in your terminal** (not via script):

```bash
cd infrastructure/pulumi
source venv/bin/activate
pulumi login
# Choose: Login with browser (easiest)
# Or: Login with access token (if you have one)
pulumi stack select shinejohn/production
pulumi preview
```

After successful login, the decryption should work and you can proceed with `pulumi up`.

