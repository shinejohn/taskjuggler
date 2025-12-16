# ⚠️ URGENT: Force Redeploy taskjuggler-web

## Problem

The frontend is STILL using the OLD build that was created BEFORE `VITE_API_URL` was set.

**Vite embeds environment variables at BUILD TIME**, not runtime. So even though the variable is set, you're seeing the old build.

## Solution: Force Redeploy

### Option 1: Railway Dashboard (Fastest)

1. Go to: https://railway.app
2. Select your project
3. Click on **taskjuggler-web** service
4. Go to **Deployments** tab
5. Click **Redeploy** button (or three dots → Redeploy)
6. Wait for deployment to complete (2-5 minutes)

### Option 2: Trigger via Variable Change

1. Go to Railway Dashboard
2. **taskjuggler-web** → **Variables**
3. **Edit** `VITE_API_URL` (just add a space and remove it)
4. **Save** - This triggers a redeploy

### Option 3: Push Empty Commit

```bash
cd taskjuggler-web
git commit --allow-empty -m "Trigger Railway redeploy"
git push
```

## After Redeploy Completes

1. **Wait for deployment** to finish (check Railway dashboard)
2. **Clear browser cache COMPLETELY:**
   - Chrome: Settings → Privacy → Clear browsing data → Cached images and files
   - Or use Incognito/Private window
3. **Hard refresh:** `Cmd+Shift+R` (Mac) or `Ctrl+Shift+R` (Windows)
4. **Test login again**

## Verify New Build

After redeploy, check the browser:

1. **View page source** (Right-click → View Page Source)
2. **Search for:** `localhost:8000`
3. **Should NOT find it** (means new build picked up variable)

OR

1. **Open DevTools** (F12)
2. **Network tab** → Try login
3. **Should go to:** `https://api-web-production-cc91.up.railway.app/api`
4. **Should NOT go to:** `http://localhost:8000/api`

## Why This Happens

- Vite embeds `VITE_API_URL` in the JavaScript bundle at BUILD TIME
- Old build = `localhost:8000` hardcoded
- New build = production API URL hardcoded
- Setting variable doesn't change existing build - need NEW build

## Current Status

- ✅ Variable SET in Railway
- ❌ Old build still deployed (has `localhost:8000` hardcoded)
- ⏳ **ACTION:** Force redeploy to create new build

## Quick Checklist

- [ ] Go to Railway Dashboard
- [ ] Find taskjuggler-web service
- [ ] Click Redeploy
- [ ] Wait for deployment (2-5 minutes)
- [ ] Clear browser cache completely
- [ ] Test login

**DO THIS NOW - Redeploy in Railway Dashboard!**

