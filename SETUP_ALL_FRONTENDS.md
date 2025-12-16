# Setup All Frontend Environment Variables

## ⚠️ CRITICAL: All three frontends need `VITE_API_URL` set!

All three frontend services (`taskjuggler-web`, `projects-web`, `process-web`) were deployed **without** the required `VITE_API_URL` environment variable.

## Quick Fix - Run All Setup Scripts

```bash
# Task Juggler
cd taskjuggler-web
./setup-railway-env.sh

# Projects.ai
cd ../projects-web
./setup-railway-env.sh

# Process.ai
cd ../process-web
./setup-railway-env.sh
```

## Or Set All at Once via Railway CLI

```bash
# Set for all three services
railway variables set VITE_API_URL="https://api-web-production-cc91.up.railway.app/api" --service taskjuggler-web
railway variables set VITE_API_URL="https://api-web-production-cc91.up.railway.app/api" --service projects-web
railway variables set VITE_API_URL="https://api-web-production-cc91.up.railway.app/api" --service process-web

# Verify all are set
railway variables --service taskjuggler-web
railway variables --service projects-web
railway variables --service process-web
```

## Manual Setup via Railway Dashboard

For each service (`taskjuggler-web`, `projects-web`, `process-web`):

1. Go to Railway Dashboard
2. Select the service
3. Go to **Variables** tab
4. Click **+ New Variable**
5. Add:
   - **Name:** `VITE_API_URL`
   - **Value:** `https://api-web-production-cc91.up.railway.app/api`
6. Click **Save**

Repeat for all three services.

## What Each Frontend Needs

| Service | Required Variable | Value |
|---------|------------------|-------|
| `taskjuggler-web` | `VITE_API_URL` | `https://api-web-production-cc91.up.railway.app/api` |
| `projects-web` | `VITE_API_URL` | `https://api-web-production-cc91.up.railway.app/api` |
| `process-web` | `VITE_API_URL` | `https://api-web-production-cc91.up.railway.app/api` |

## Verification

After setting variables for all services:

1. **Check Railway Dashboard:**
   - Each service should show `VITE_API_URL` in Variables tab

2. **Wait for Redeployments:**
   - Railway auto-redeploys when you save variables
   - Wait for all three deployments to complete

3. **Test Each Frontend:**
   - Task Juggler: https://taskjuggler-web-production.up.railway.app
   - Projects.ai: https://4projects.ai (or Railway URL)
   - Process.ai: https://4process.ai (or Railway URL)

4. **Check Browser Console:**
   - Open DevTools (F12)
   - Try to login
   - Verify API calls go to `api-web-production-cc91.up.railway.app`

## Why This Happened

Vite environment variables must be:
- Prefixed with `VITE_` to be accessible in frontend code
- Set in Railway **before** deployment
- Available at build time (embedded in the bundle)

Without `VITE_API_URL`, all three frontends default to `http://localhost:8000/api`, which doesn't exist in production.

## Current Status

- ❌ **taskjuggler-web** - `VITE_API_URL` NOT SET
- ❌ **projects-web** - `VITE_API_URL` NOT SET  
- ❌ **process-web** - `VITE_API_URL` NOT SET

## Fix All Now

Run the setup scripts for all three:

```bash
# Task Juggler
cd taskjuggler-web && ./setup-railway-env.sh && cd ..

# Projects.ai
cd projects-web && ./setup-railway-env.sh && cd ..

# Process.ai
cd process-web && ./setup-railway-env.sh && cd ..
```

Or use Railway CLI to set all at once (see above).

