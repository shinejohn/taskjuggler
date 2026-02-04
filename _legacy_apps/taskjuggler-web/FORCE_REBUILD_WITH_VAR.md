# Force Rebuild taskjuggler-web with VITE_API_URL

## Problem

The frontend is STILL using `localhost:8000` even though `VITE_API_URL` is set in Railway.

## Root Cause

Railway may not have rebuilt after setting the variable, OR the build didn't pick up the variable.

## What I Just Did

1. ✅ Created `.env.production` file with `VITE_API_URL`
2. ✅ Added debug echo to `nixpacks.toml` to verify variable is available during build
3. ✅ Pushed to GitHub to trigger rebuild

## What Happens Next

1. **Railway detects the push** and starts rebuilding
2. **Build process will:**
   - Echo `VITE_API_URL` value (check logs to verify)
   - Run `npm run build` with variable available
   - Embed production API URL in bundle

## Verify in Railway Logs

After rebuild starts, check Railway deployment logs:
- Should see: `VITE_API_URL=https://api-web-production-cc91.up.railway.app/api`
- If you see empty or `localhost:8000`, the variable isn't being passed

## After Rebuild Completes

1. **Wait 3-5 minutes** for rebuild
2. **Clear browser cache completely**
3. **Test login** - should now work

## If Still Fails

Check Railway deployment logs for:
- `VITE_API_URL=` value during build
- Any errors about missing variables
- Build completion status

The `.env.production` file should ensure Vite picks up the variable even if Railway doesn't pass it correctly.

