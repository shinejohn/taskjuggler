# ⚠️ URGENT: Set VITE_API_URL for 4projects and 4process

## Problem

Both `4projects` and `4process` services have **NO environment variables** set, so they're using `http://localhost:8000/api` (which doesn't exist in production).

## Immediate Action Required

**You MUST set `VITE_API_URL` in Railway Dashboard for both services.**

### Step-by-Step Instructions

#### For 4projects:

1. **Open Railway Dashboard:** https://railway.app
2. **Select your project** (Fibonacco AI)
3. **Find the service** that serves `4projects.ai` (look for the service name)
4. **Click on that service**
5. **Go to Variables tab**
6. **Click + New Variable**
7. **Add:**
   ```
   Name: VITE_API_URL
   Value: https://api-web-production-cc91.up.railway.app/api
   ```
8. **Click Save**

#### For 4process:

1. **Open Railway Dashboard:** https://railway.app
2. **Select your project** (Fibonacco AI)
3. **Find the service** that serves `4process.ai` (look for the service name)
4. **Click on that service**
5. **Go to Variables tab**
6. **Click + New Variable**
7. **Add:**
   ```
   Name: VITE_API_URL
   Value: https://api-web-production-cc91.up.railway.app/api
   ```
8. **Click Save**

## After Setting Variables

1. **Railway automatically redeploys** (watch the Deployments tab)
2. **Wait 2-5 minutes** for deployments to complete
3. **Clear browser cache** on both sites:
   - Hard refresh: `Cmd+Shift+R` (Mac) or `Ctrl+Shift+R` (Windows)
4. **Test login** on both sites

## Verify Fix

After redeployments complete:

1. **Check browser console (F12)** on both sites
2. **Network tab** → Look for API requests
3. **Should go to:** `https://api-web-production-cc91.up.railway.app/api`
4. **Should NOT go to:** `http://localhost:8000/api`

## Current Status

- ✅ **taskjuggler-web** - VITE_API_URL SET
- ❌ **4projects service** - NO VARIABLES ← **FIX THIS NOW**
- ❌ **4process service** - NO VARIABLES ← **FIX THIS NOW**

## Why This Is Critical

Without `VITE_API_URL`:
- ❌ Login fails (can't connect to API)
- ❌ All API calls fail
- ❌ Apps don't work

With `VITE_API_URL` set:
- ✅ Login works
- ✅ All API calls succeed
- ✅ Apps function correctly

**Do this NOW in Railway Dashboard - it takes 2 minutes!**

