# ⚠️ URGENT: Railway Dashboard Configuration Required

## The Problem

Railway is **STILL using Railpack** for the `ai-tools-api` service, even though:
- ✅ Root `Procfile` has been deleted
- ✅ `railway.json` specifies NIXPACKS builder
- ✅ `nixpacks.toml` is configured correctly
- ✅ Script has early exit for API service

**Railway dashboard settings override ALL code-based configurations.**

## The Solution (Manual Dashboard Configuration)

You **MUST** configure the Railway dashboard manually. Code changes alone are not enough.

### Step-by-Step Instructions:

1. **Go to Railway Dashboard**
   - Navigate to: https://railway.app
   - Select your project: **"Fibonacco AI Tools"** (or project ID: `ca3879ff-fd72-4239-983d-32ade6cace83`)

2. **Select the `ai-tools-api` Service**
   - Click on the service named `ai-tools-api`

3. **Open Settings Tab**
   - Click on **"Settings"** tab at the top

4. **Configure Build Settings**
   - Scroll to **"Build & Deploy"** section
   - Find **"Builder"** dropdown
   - **Change from:** "Railpack (Default)" or "Railpack"
   - **Change to:** **"NIXPACKS"** ⚠️ CRITICAL
   
5. **Configure Root Directory**
   - Find **"Root Directory"** field
   - **Change from:** `/` (empty or root)
   - **Change to:** **`taskjuggler-api`** ⚠️ CRITICAL
   
6. **Clear Build Command (Optional but Recommended)**
   - Find **"Build Command"** field
   - **Clear it** (leave empty)
   - NIXPACKS will use `nixpacks.toml` automatically
   
7. **Clear Start Command (Optional but Recommended)**
   - Find **"Start Command"** field
   - **Clear it** (leave empty)
   - NIXPACKS will use `nixpacks.toml` start command automatically

8. **Save Changes**
   - Click **"Save"** or **"Update"** button

9. **Trigger Redeploy**
   - Click **"Redeploy"** or **"Deploy"** button
   - Or push a new commit to trigger automatic deploy

## Why This Is Required

Railway's configuration priority order:

1. **Dashboard Settings** (HIGHEST PRIORITY - Overrides everything)
2. Auto-detection (Procfile, package.json, etc.)
3. `railway.json` files (only if no dashboard overrides)

Even though we:
- Deleted the root `Procfile`
- Configured `railway.json` with NIXPACKS
- Added `.railwayignore`

**Railway will STILL use Railpack if the dashboard is set to Railpack.**

## Verification After Fix

After configuring dashboard and redeploying, check Railway logs:

### ✅ Should See:
```
[inf] Using NIXPACKS builder
[inf] Installing PHP dependencies...
[inf] composer install --no-interaction...
[inf] php artisan migrate...
[inf] Starting PHP server...
```

### ❌ Should NOT See:
```
[err] Railpack 0.17.1
[err] Found web command in Procfile
[err] npm error No workspaces found
[err] Detected Node
```

## Current Status

- ✅ Code fixes applied (Procfile deleted, railway.json configured)
- ✅ Script updated (early exit for API service)
- ⚠️ **ACTION REQUIRED: Configure Railway dashboard**

## If Dashboard Configuration Doesn't Work

1. **Check Service Name**: Ensure you're configuring `ai-tools-api` (not another service)
2. **Check Project**: Ensure you're in the correct Railway project
3. **Clear Cache**: Try deleting and recreating the service
4. **Contact Support**: If dashboard settings don't stick, contact Railway support

## Summary

**You MUST manually configure the Railway dashboard:**
- Builder: **NIXPACKS**
- Root Directory: **`taskjuggler-api`**

This is the ONLY way to fix the API service build failure. Code changes alone are not sufficient.
