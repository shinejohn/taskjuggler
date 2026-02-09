# Railway API Deployment Fix - Complete Guide

## Problem Summary

Railway is using **Railpack** (Node.js builder) for the `ai-tools-api` service instead of **NIXPACKS** (PHP/Laravel builder). This causes the build to fail because:

1. Railway detects the monorepo root (has `package.json` with workspaces)
2. Railway finds a Procfile and decides to use Railpack
3. Railpack tries to build `ai-tools-api` as a Node.js workspace
4. The workspace `ai-tools-api` doesn't exist (the directory is `taskjuggler-api`)
5. Build fails: `npm error No workspaces found: --workspace=ai-tools-api`

## Root Cause

Railway is looking at the **monorepo root** instead of the `taskjuggler-api` directory for the `ai-tools-api` service.

## Solution

Configure Railway to use `taskjuggler-api` as the root directory for the `ai-tools-api` service.

## Step-by-Step Fix

### Option 1: Railway Dashboard (Recommended)

1. **Go to Railway Dashboard**
   - Visit: https://railway.app
   - Navigate to: **"Fibonacco AI Tools"** project
   - Click on service: **"ai-tools-api"**

2. **Configure Root Directory**
   - Go to: **Settings** tab
   - Scroll to: **Build & Deploy** section
   - Find: **Root Directory** setting
   - Set it to: **`taskjuggler-api`**
   - Click **Save**

3. **Verify Builder**
   - In the same **Build & Deploy** section
   - Ensure **Builder** shows: **NIXPACKS** (not Railpack)
   - Railway should automatically detect NIXPACKS once root directory is set

4. **Redeploy**
   - Go to **Deployments** tab
   - Click **Redeploy** or trigger a new deployment
   - The build should now succeed

### Option 2: Railway CLI

```bash
# Link to project (if not already linked)
railway login
railway link
# Select: "Fibonacco AI Tools"

# Run deployment helper script
./deploy-api-to-railway.sh
```

**Note:** Railway CLI may not support setting root directory directly. The dashboard method is more reliable.

## Verification

After fixing, the build logs should show:

✅ **Using NIXPACKS builder** (not Railpack)
✅ **Building from `taskjuggler-api` directory**
✅ **Running `composer install`**
✅ **Running PHP/Laravel build commands** (config:cache, route:cache, view:cache)
✅ **Starting with:** `php artisan migrate && php artisan serve`

❌ **NOT running:** `npm run build -w ai-tools-api`
❌ **NOT running:** `monorepo-build.sh`

## Current Configuration Files

The following files are already correctly configured:

1. **`taskjuggler-api/railway.json`** ✅
   - Specifies NIXPACKS builder
   - Points to nixpacks.toml
   - Defines start command with migrations

2. **`taskjuggler-api/nixpacks.toml`** ✅
   - PHP 8.2 setup
   - Composer install commands
   - Laravel build commands (config:cache, route:cache, view:cache)
   - Start command with migrations

3. **`monorepo-build.sh`** ✅
   - Exits early if API service is detected
   - Provides clear error message

## Why This Happens

Railway's auto-detection logic:
1. Scans the repository root
2. Finds `package.json` with workspaces → thinks it's a Node.js monorepo
3. Finds a Procfile → decides to use Railpack
4. Ignores `railway.json` in subdirectories unless root directory is set

## Testing Locally

The build script correctly exits for API service:

```bash
cd /Users/johnshine/Dropbox/Fibonacco/taskjuggler/Code
RAILWAY_SERVICE_NAME=ai-tools-api ./monorepo-build.sh
# Should exit with error code 1 and clear message
```

## After Fix

Once Railway is configured correctly:
- Railway will use NIXPACKS builder
- Railway will build from `taskjuggler-api/` directory
- Railway will respect `taskjuggler-api/railway.json`
- The API service will deploy successfully

## Troubleshooting

If the build still fails after setting root directory:

1. **Check Root Directory Setting**
   - Verify it's exactly: `taskjuggler-api` (no trailing slash)
   - Case-sensitive

2. **Check Builder**
   - Should show: **NIXPACKS**
   - If it shows Railpack, try saving again

3. **Check Build Logs**
   - Should see NIXPACKS build steps
   - Should see `composer install`
   - Should NOT see `npm run build -w ai-tools-api`

4. **Force Redeploy**
   - Go to Deployments tab
   - Click "Redeploy"
   - Or push a new commit to trigger deployment
