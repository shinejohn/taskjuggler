# URGENT: Railway API Service Builder Fix

## Problem
Railway is using **Railpack** (Node.js builder) for the `ai-tools-api` service instead of **NIXPACKS** (PHP/Laravel builder). This causes the build to fail because:

1. Railway detects the monorepo root (which has `package.json` with workspaces)
2. Railway finds a Procfile and decides to use Railpack
3. Railpack tries to build `ai-tools-api` as a Node.js workspace
4. The workspace `ai-tools-api` doesn't exist in the monorepo
5. Build fails with: `npm error No workspaces found: --workspace=ai-tools-api`

## Root Cause
Railway is looking at the **monorepo root** instead of the `taskjuggler-api` directory for the `ai-tools-api` service.

## Solution - Configure Railway Dashboard

### Step 1: Access Railway Dashboard
1. Go to: https://railway.app
2. Navigate to: **Fibonacco AI Tools** project
3. Click on service: **`ai-tools-api`**

### Step 2: Configure Root Directory
1. Go to **Settings** tab
2. Scroll to **Build & Deploy** section
3. Find **Root Directory** setting
4. Set it to: **`taskjuggler-api`**
5. Click **Save**

### Step 3: Verify Builder
1. In the same **Build & Deploy** section
2. Ensure **Builder** is set to: **NIXPACKS** (not Railpack)
3. If it shows Railpack, Railway should automatically switch to NIXPACKS once the root directory is set correctly

### Step 4: Redeploy
1. Go to **Deployments** tab
2. Click **Redeploy** or trigger a new deployment
3. The build should now use NIXPACKS and succeed

## Verification

After fixing, the build logs should show:
- ✅ Using NIXPACKS builder
- ✅ Building from `taskjuggler-api` directory
- ✅ Running `composer install`
- ✅ Running PHP/Laravel build commands
- ❌ NOT running `npm run build -w ai-tools-api`

## Current Configuration Files

The following files are already correctly configured:

1. **`taskjuggler-api/railway.json`** - Specifies NIXPACKS builder ✅
2. **`taskjuggler-api/nixpacks.toml`** - NIXPACKS configuration ✅
3. **`monorepo-build.sh`** - Exits early if API service is detected ✅

## Why This Happens

Railway's auto-detection logic:
1. Scans the repository root
2. Finds `package.json` with workspaces → thinks it's a Node.js monorepo
3. Finds a Procfile → decides to use Railpack
4. Ignores the `railway.json` in subdirectories unless root directory is set

## Alternative: Railway CLI

If you have Railway CLI access, you can try:

```bash
# Link to project first
railway login
railway link

# Then run the fix script
./fix-railway-api-service.sh
```

**Note:** Railway CLI may not support setting root directory directly. The dashboard method is more reliable.

## Quick Fix Script

A helper script is available:

```bash
./fix-railway-api-service.sh
```

This will check your Railway configuration and provide instructions.
