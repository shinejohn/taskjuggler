# Railway Environment Variables Setup for taskjuggler-web

## Required Environment Variables

The `taskjuggler-web` frontend requires the following environment variable:

### `VITE_API_URL`
- **Required:** Yes
- **Description:** The base URL for the API backend
- **Example:** `https://api-web-production-cc91.up.railway.app/api`
- **Default (if not set):** `http://localhost:8000/api` (only works locally)

## Quick Setup

### Option 1: Using Railway CLI (Recommended)

```bash
# Make script executable
chmod +x set-railway-variables.sh

# Run the script (uses default API URL)
./set-railway-variables.sh

# OR specify custom API URL
./set-railway-variables.sh https://your-api-url.com/api
```

### Option 2: Manual Setup via Railway Dashboard

1. Go to [Railway Dashboard](https://railway.app)
2. Select your project
3. Click on `taskjuggler-web` service
4. Go to **Variables** tab
5. Click **+ New Variable**
6. Add:
   - **Name:** `VITE_API_URL`
   - **Value:** `https://api-web-production-cc91.up.railway.app/api`
7. Click **Save**

### Option 3: Using Railway CLI Directly

```bash
# Set the variable
railway variables set VITE_API_URL="https://api-web-production-cc91.up.railway.app/api" --service taskjuggler-web

# Verify it's set
railway variables --service taskjuggler-web
```

## Verify Setup

After setting the variable:

1. **Check Railway Dashboard:**
   - Go to `taskjuggler-web` service → Variables
   - Verify `VITE_API_URL` is listed

2. **Check Deployment:**
   - Railway will automatically redeploy when you save variables
   - Wait for deployment to complete
   - Check deployment logs for any errors

3. **Test Frontend:**
   - Open browser console (F12)
   - Navigate to: `https://taskjuggler-web-production.up.railway.app`
   - Try to login
   - Check Network tab - API calls should go to `api-web-production-cc91.up.railway.app`

## Troubleshooting

### Variable Not Taking Effect

1. **Redeploy manually:**
   - Go to Railway Dashboard → `taskjuggler-web` → Deployments
   - Click "Redeploy"

2. **Check build logs:**
   - Look for `VITE_API_URL` in build output
   - Should see: `VITE_API_URL=https://api-web-production-cc91.up.railway.app/api`

3. **Clear browser cache:**
   - Hard refresh: `Cmd+Shift+R` (Mac) or `Ctrl+Shift+R` (Windows)

### Still Getting Network Errors

1. **Verify API is accessible:**
   ```bash
   curl https://api-web-production-cc91.up.railway.app/api/health
   ```

2. **Check browser console:**
   - Open DevTools (F12)
   - Look for network errors
   - Verify requests are going to correct URL

3. **Check Railway logs:**
   - Go to `taskjuggler-web` service → Deployments → View Logs
   - Look for runtime errors

## Environment Variables Reference

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `VITE_API_URL` | ✅ Yes | API base URL | `https://api-web-production-cc91.up.railway.app/api` |

## Notes

- Vite environment variables must be prefixed with `VITE_` to be accessible in the frontend
- Variables are embedded at build time, so you need to redeploy after changing them
- Railway automatically redeploys when you save variables in the dashboard

