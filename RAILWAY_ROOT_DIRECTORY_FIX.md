# Railway Root Directory Fix

## Problem

Railway is trying to build from the root directory (`/Code`), but the Laravel application is in the `taskjuggler-api/` subdirectory. This causes Railpack to fail because it can't find the PHP application files.

## Solution

You need to configure Railway to use `taskjuggler-api` as the root directory for the service.

### Option 1: Railway Dashboard (Recommended)

1. Go to Railway Dashboard: https://railway.app
2. Open "AI Task Juggler" project
3. Click on the `taskjuggler` service
4. Go to **Settings** tab
5. Find **"Root Directory"** or **"Source"** setting
6. Set it to: `taskjuggler-api`
7. Save and redeploy

### Option 2: Railway CLI

If Railway CLI supports root directory configuration:

```bash
railway service taskjuggler
railway variables --set "RAILWAY_ROOT_DIRECTORY=taskjuggler-api"
```

Then redeploy:
```bash
railway up
```

### Option 3: Update railway.json

I've created a `railway.json` at the root that includes `cd taskjuggler-api` in the build commands. However, the best solution is to set the root directory in Railway dashboard.

## Verification

After setting the root directory:

1. Check build logs: `railway logs --service taskjuggler`
2. Verify it's building from `taskjuggler-api/`
3. Look for: `composer install` running in the correct directory

## Alternative: Move railway.json

If Railway detects `railway.json` in the service root, it will use that. Make sure the service root is set to `taskjuggler-api` so it uses the existing `railway.json` there.

## Current Status

- ✅ `railway.json` exists in `taskjuggler-api/` with correct configuration
- ⚠️ Railway service needs root directory set to `taskjuggler-api`
- ✅ Root `railway.json` created as fallback (uses `cd taskjuggler-api`)

**Action Required:** Set root directory in Railway dashboard to `taskjuggler-api`
