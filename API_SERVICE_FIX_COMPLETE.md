# API Service Fix - Root Procfile Removed

## Problem Identified

The root `Procfile` was causing Railway to auto-detect **Railpack** for ALL services, including the PHP/Laravel API service (`ai-tools-api`). Railway's detection logic:

1. Scans repository root for `Procfile`
2. If found → Uses Railpack (Node.js builder)
3. Ignores `railway.json` and `nixpacks.toml` configurations

## Root Cause

- **Root `Procfile` existed** with Laravel commands (`php artisan serve`, `php artisan queue:work`, etc.)
- Railway detected this → Switched to Railpack for all services
- Railpack tried to build `ai-tools-api` as a Node.js workspace → **FAILED**

## Fix Applied

✅ **Deleted root `Procfile`**

The root `Procfile` has been removed. This prevents Railway from auto-detecting Railpack.

## What Happens Now

### For Frontend Services (Already Working)
- Railway will use NIXPACKS (from `railway.json`)
- Build commands from `railway.json` will execute
- Services should continue working as before

### For API Service (`ai-tools-api`)

**CRITICAL: You MUST configure Railway dashboard settings:**

1. **Go to Railway Dashboard** → Select `ai-tools-api` service
2. **Settings Tab** → **Build & Deploy**
3. **Set Builder**: Change from "Railpack (Default)" to **"NIXPACKS"**
4. **Set Root Directory**: Change from `/` to **`taskjuggler-api`**
5. **Save** and **Redeploy**

## Why Dashboard Configuration is Required

Railway's detection order:
1. **Dashboard Settings** (highest priority - overrides everything)
2. Auto-detection (Procfile, package.json, etc.)
3. `railway.json` files (only if no dashboard overrides)

Since the dashboard was set to use Railpack, it was overriding all code-based configurations.

## Expected Result After Dashboard Fix

Once you set Builder=NIXPACKS and Root Directory=`taskjuggler-api`:

1. Railway will use NIXPACKS builder
2. Railway will look in `taskjuggler-api/` directory
3. Railway will find `composer.json` and `nixpacks.toml`
4. Build will execute: `composer install` → Laravel cache commands
5. Start command from `nixpacks.toml` will run:
   ```bash
   php artisan migrate --force --no-interaction || true && \
   php artisan storage:link --force || true && \
   php artisan serve --host=0.0.0.0 --port=${PORT:-8000}
   ```

## Verification

After configuring dashboard and redeploying, check Railway logs:

✅ **Should see:**
- NIXPACKS build process
- Composer installing dependencies
- PHP/Laravel commands executing

❌ **Should NOT see:**
- "Railpack 0.17.1"
- "Found web command in Procfile"
- "npm error No workspaces found"

## Summary

- ✅ Root `Procfile` deleted → Prevents Railpack auto-detection
- ⚠️ **ACTION REQUIRED**: Configure Railway dashboard for `ai-tools-api`:
  - Builder: **NIXPACKS**
  - Root Directory: **`taskjuggler-api`**

Once dashboard is configured, the API service should build and deploy successfully.
