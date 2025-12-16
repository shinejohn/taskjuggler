# Fix: Frontend API URL Configuration

## Problem

The frontend is trying to connect to the wrong API URL. You're accessing the frontend URL (`taskjuggler-web-production.up.railway.app`) instead of the API URL (`api-web-production-cc91.up.railway.app`).

## Solution

### For Production (Railway)

The frontend needs to be configured with the correct API URL. Set the `VITE_API_URL` environment variable in Railway:

```bash
# In Railway dashboard for taskjuggler-web service:
VITE_API_URL=https://api-web-production-cc91.up.railway.app/api
```

### Steps to Fix

1. **Go to Railway Dashboard**
   - Navigate to your `taskjuggler-web` service
   - Go to **Variables** tab

2. **Add/Update Environment Variable**
   - Variable name: `VITE_API_URL`
   - Variable value: `https://api-web-production-cc91.up.railway.app/api`
   - Click **Save**

3. **Redeploy the Service**
   - Railway will automatically redeploy when you save variables
   - Or manually trigger a redeploy from the **Deployments** tab

### Verify API is Working

```bash
# Test API health endpoint
curl https://api-web-production-cc91.up.railway.app/api/health

# Should return:
# {"status":"ok","timestamp":"2025-12-16T18:42:50.491858Z"}
```

### Test Login Endpoint

```bash
curl -X POST https://api-web-production-cc91.up.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{"email":"test@taskjuggler.com","password":"Test1234!"}'
```

## Current URLs

- **Frontend:** `https://taskjuggler-web-production.up.railway.app`
- **API:** `https://api-web-production-cc91.up.railway.app`
- **API Health:** `https://api-web-production-cc91.up.railway.app/api/health` ✅

## After Fix

Once `VITE_API_URL` is set correctly:
1. Frontend will connect to the correct API
2. Login should work
3. All API calls will go to `api-web-production-cc91.up.railway.app`

## Troubleshooting

If login still fails after setting `VITE_API_URL`:

1. **Check Browser Console**
   - Open DevTools (F12)
   - Look for network errors
   - Verify requests are going to `api-web-production-cc91.up.railway.app`

2. **Check Railway Logs**
   - Go to `taskjuggler-web` service → **Deployments** → **View Logs**
   - Look for build errors or runtime errors

3. **Verify Variable is Set**
   - In Railway dashboard, check that `VITE_API_URL` is visible in variables list
   - Make sure there are no typos

4. **Hard Refresh Browser**
   - Clear browser cache
   - Hard refresh: `Cmd+Shift+R` (Mac) or `Ctrl+Shift+R` (Windows)

