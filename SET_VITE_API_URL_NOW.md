# URGENT: Set VITE_API_URL in Railway Dashboard

## Problem

The frontend is making requests to `http://localhost:8000/api/auth/login` instead of the production API.

**This is because `VITE_API_URL` is NOT set in Railway!**

## Immediate Fix Required

### Option 1: Railway Dashboard (Fastest)

1. Go to: https://railway.app
2. Select your project
3. Click on **taskjuggler-web** service
4. Go to **Variables** tab
5. Click **+ New Variable**
6. Add:
   - **Name:** `VITE_API_URL`
   - **Value:** `https://api-web-production-cc91.up.railway.app/api`
7. Click **Save**

Railway will automatically redeploy after you save.

### Option 2: Railway CLI (if syntax is correct)

Try one of these:

```bash
# Method 1
railway variables --set VITE_API_URL="https://api-web-production-cc91.up.railway.app/api" --service taskjuggler-web

# Method 2
railway link --service taskjuggler-web
railway variables VITE_API_URL="https://api-web-production-cc91.up.railway.app/api"

# Method 3 (interactive)
railway variables --service taskjuggler-web
# Then follow prompts to add VITE_API_URL
```

## After Setting Variable

1. **Wait for redeploy** (Railway auto-redeploys)
2. **Check deployment logs** - should see variable in build
3. **Clear browser cache** - Hard refresh (`Cmd+Shift+R`)
4. **Test login** - Should now connect to production API

## Verify Fix

After redeploy, check browser console (F12):
- Network tab → Look for API requests
- Should go to: `https://api-web-production-cc91.up.railway.app/api`
- Should NOT go to: `http://localhost:8000/api`

## Why This Happens

Vite embeds environment variables **at build time**:
- Variables must be set **before** `npm run build`
- Changing variables requires **rebuilding** the app
- Railway auto-redeploys when you save variables (triggers rebuild)

## Current Status

- ❌ `VITE_API_URL` NOT SET in Railway
- ❌ Frontend using: `http://localhost:8000/api` (default fallback)
- ✅ Should use: `https://api-web-production-cc91.up.railway.app/api`
- ⏳ **ACTION REQUIRED:** Set variable in Railway Dashboard NOW

