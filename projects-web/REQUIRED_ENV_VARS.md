# Required Environment Variables for projects-web (4projects)

## ⚠️ CRITICAL: These MUST be set in Railway!

The frontend **will not work** without these environment variables.

## Required Variables

### `VITE_API_URL` ✅ REQUIRED
- **Purpose:** API backend URL
- **Value:** `https://api-web-production-cc91.up.railway.app/api`
- **What happens if missing:** Frontend can't connect to API, login fails, all API calls fail

## Quick Setup

### Using the Setup Script (Easiest)

```bash
cd projects-web
./setup-railway-env.sh
```

### Manual Setup via Railway Dashboard

1. Go to Railway Dashboard
2. Select your project
3. Click **projects-web** service
4. Go to **Variables** tab
5. Click **+ New Variable**
6. Add:
   - **Name:** `VITE_API_URL`
   - **Value:** `https://api-web-production-cc91.up.railway.app/api`
7. Click **Save**

### Using Railway CLI

```bash
railway variables set VITE_API_URL="https://api-web-production-cc91.up.railway.app/api" --service projects-web

# Verify
railway variables --service projects-web
```

## Verification

After setting variables:

1. **Check Railway Dashboard:** Variables tab should show `VITE_API_URL`
2. **Check Deployment Logs:** Should see variable in build output
3. **Test Frontend:** API calls should go to `api-web-production-cc91.up.railway.app`

## Current Status

- ❌ **VITE_API_URL** - NOT SET (this is why login fails!)

## Fix Now

Run this command:

```bash
cd projects-web
./setup-railway-env.sh
```

Or manually set in Railway Dashboard:
- Variable: `VITE_API_URL`
- Value: `https://api-web-production-cc91.up.railway.app/api`

