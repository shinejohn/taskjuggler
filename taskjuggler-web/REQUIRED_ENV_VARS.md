# Required Environment Variables for taskjuggler-web

## ⚠️ CRITICAL: These MUST be set in Railway!

The frontend **will not work** without these environment variables.

## Required Variables

### 1. `VITE_API_URL` ✅ REQUIRED
- **Purpose:** API backend URL
- **Value:** `https://api-web-production-cc91.up.railway.app/api`
- **What happens if missing:** Frontend can't connect to API, login fails, all API calls fail

## Optional Variables (for real-time features)

### 2. `VITE_PUSHER_APP_KEY` (Optional)
- **Purpose:** Pusher key for real-time updates
- **Value:** Your Pusher app key
- **What happens if missing:** Real-time features won't work, but app still functions

### 3. `VITE_PUSHER_APP_CLUSTER` (Optional)
- **Purpose:** Pusher cluster
- **Value:** `mt1` (default)
- **What happens if missing:** Uses default `mt1`

## Quick Setup

### Using the Setup Script (Easiest)

```bash
cd taskjuggler-web
./setup-railway-env.sh
```

This will:
1. Check Railway CLI is installed
2. Verify you're logged in
3. Set `VITE_API_URL` to the correct API URL
4. Optionally set Pusher variables if provided

### Manual Setup via Railway Dashboard

1. Go to Railway Dashboard
2. Select your project
3. Click **taskjuggler-web** service
4. Go to **Variables** tab
5. Click **+ New Variable**
6. Add:
   - **Name:** `VITE_API_URL`
   - **Value:** `https://api-web-production-cc91.up.railway.app/api`
7. Click **Save**

### Using Railway CLI

```bash
# Set required variable
railway variables set VITE_API_URL="https://api-web-production-cc91.up.railway.app/api" --service taskjuggler-web

# Optional: Set Pusher variables
railway variables set VITE_PUSHER_APP_KEY="your-pusher-key" --service taskjuggler-web
railway variables set VITE_PUSHER_APP_CLUSTER="mt1" --service taskjuggler-web

# Verify
railway variables --service taskjuggler-web
```

## Verification

After setting variables:

1. **Check Railway Dashboard:**
   - Variables tab should show `VITE_API_URL`

2. **Check Deployment Logs:**
   - Should see variable in build output
   - Deployment should complete successfully

3. **Test Frontend:**
   - Open browser console (F12)
   - Navigate to frontend URL
   - Check Network tab - API calls should go to `api-web-production-cc91.up.railway.app`

## Why This Happened

Vite environment variables must be:
1. Prefixed with `VITE_` to be accessible in frontend code
2. Set in Railway before deployment
3. Available at build time (embedded in the bundle)

Without `VITE_API_URL`, the frontend defaults to `http://localhost:8000/api`, which doesn't exist in production.

## Current Status

- ❌ **VITE_API_URL** - NOT SET (this is why login fails!)
- ⚠️ **VITE_PUSHER_APP_KEY** - Optional, not set
- ⚠️ **VITE_PUSHER_APP_CLUSTER** - Optional, defaults to `mt1`

## Fix Now

Run this command:

```bash
cd taskjuggler-web
./setup-railway-env.sh
```

Or manually set in Railway Dashboard:
- Variable: `VITE_API_URL`
- Value: `https://api-web-production-cc91.up.railway.app/api`

