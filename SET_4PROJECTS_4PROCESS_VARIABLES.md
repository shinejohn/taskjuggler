# Set VITE_API_URL for 4projects and 4process

## ⚠️ CRITICAL: Both services need VITE_API_URL set!

## Quick Fix via Railway Dashboard

### For 4projects (projects-web service)

1. Go to: https://railway.app
2. Select your project
3. Find the service for **4projects** (may be named `projects-web` or similar)
4. Click on the service
5. Go to **Variables** tab
6. Click **+ New Variable**
7. Add:
   - **Name:** `VITE_API_URL`
   - **Value:** `https://api-web-production-cc91.up.railway.app/api`
8. Click **Save**

### For 4process (process-web service)

1. Go to: https://railway.app
2. Select your project
3. Find the service for **4process** (may be named `process-web` or similar)
4. Click on the service
5. Go to **Variables** tab
6. Click **+ New Variable**
7. Add:
   - **Name:** `VITE_API_URL`
   - **Value:** `https://api-web-production-cc91.up.railway.app/api`
8. Click **Save**

## After Setting Variables

1. **Railway auto-redeploys** both services (2-5 minutes)
2. **Wait for deployments** to complete
3. **Clear browser cache** on both sites
4. **Test login** - should now connect to production API

## Verify Variables Are Set

In Railway Dashboard, for each service:
- Go to Variables tab
- Should see: `VITE_API_URL` = `https://api-web-production-cc91.up.railway.app/api`

## Current Status

- ✅ **taskjuggler-web** - VITE_API_URL SET
- ❌ **projects-web (4projects)** - VITE_API_URL NOT SET ← Fix this
- ❌ **process-web (4process)** - VITE_API_URL NOT SET ← Fix this

## Why This Matters

Without `VITE_API_URL`:
- Frontends default to `http://localhost:8000/api`
- Login fails (can't connect to API)
- All API calls fail

With `VITE_API_URL` set:
- Frontends use production API
- Login works
- All API calls succeed

## Quick Checklist

- [ ] Set VITE_API_URL for 4projects service
- [ ] Set VITE_API_URL for 4process service
- [ ] Wait for redeployments (2-5 minutes)
- [ ] Clear browser cache
- [ ] Test login on both sites

