# Debug: Frontend Using localhost:8000 Instead of Production API

## Problem

The frontend is making API requests to `http://localhost:8000/api/auth/login` instead of the production API URL.

## Root Cause

The `VITE_API_URL` environment variable is either:
1. **Not set** in Railway for `taskjuggler-web` service
2. **Set but frontend wasn't rebuilt** after setting it
3. **Build didn't pick up the variable** (Vite embeds env vars at build time)

## Solution

### Step 1: Verify Variable is Set

```bash
# Check Railway variables
railway variables --service taskjuggler-web

# Should show:
# VITE_API_URL=https://api-web-production-cc91.up.railway.app/api
```

### Step 2: Set Variable if Missing

```bash
# Set the variable
railway variables set VITE_API_URL="https://api-web-production-cc91.up.railway.app/api" --service taskjuggler-web
```

### Step 3: Force Redeploy

After setting the variable:
1. Railway should auto-redeploy
2. If not, manually trigger redeploy:
   - Go to Railway Dashboard
   - Select `taskjuggler-web` service
   - Go to Deployments tab
   - Click "Redeploy"

### Step 4: Verify Build Picked Up Variable

Check deployment logs:
- Go to Railway Dashboard → `taskjuggler-web` → Deployments → View Logs
- Look for build output
- Should see `VITE_API_URL` in build environment

### Step 5: Clear Browser Cache

After redeploy:
- Hard refresh: `Cmd+Shift+R` (Mac) or `Ctrl+Shift+R` (Windows)
- Or clear browser cache completely

## Why This Happens

Vite environment variables are **embedded at build time**, not runtime:
- Variables must be set **before** `npm run build`
- Changing variables requires **rebuilding** the frontend
- Railway auto-redeploys when you save variables, which triggers a rebuild

## Quick Fix

Run this command:

```bash
cd taskjuggler-web
./setup-railway-env.sh
```

This will:
1. Set `VITE_API_URL` in Railway
2. Trigger automatic redeploy
3. Wait for deployment to complete

## Verify Fix

After redeploy completes:

1. **Check browser console (F12):**
   - Network tab → Look for API requests
   - Should go to `https://api-web-production-cc91.up.railway.app/api`

2. **Check source code:**
   - View page source
   - Search for `localhost:8000`
   - Should NOT find it (means build picked up new variable)

3. **Test login:**
   - Try logging in
   - Should connect to production API
   - Should work correctly

## Current Status

- ❌ Frontend using: `http://localhost:8000/api`
- ✅ Should use: `https://api-web-production-cc91.up.railway.app/api`
- ⏳ Fix: Set `VITE_API_URL` and redeploy

