# Railway Redis Connection Fix

## Problem
The application is trying to connect to `valkey.railway.internal:6379` but the hostname can't be resolved, causing a 500 error.

## Root Cause
- `REDIS_HOST=valkey.railway.internal` is set manually
- This internal hostname only works when a Valkey/Redis service is properly linked
- Railway provides `REDIS_URL` automatically when services are linked
- The app should use `REDIS_URL` instead of individual host/port settings

## Solution

### Option 1: Use File-Based Storage (Quick Fix - No Redis Needed)

If you don't need Redis features, switch to file-based storage:

```bash
# In Railway Dashboard or CLI, set these environment variables:
CACHE_STORE=file
SESSION_DRIVER=file
QUEUE_CONNECTION=sync
```

**Remove these variables if they exist:**
- `REDIS_HOST`
- `REDIS_PORT`
- `REDIS_PASSWORD`
- `CACHE_STORE=redis`
- `SESSION_DRIVER=redis`
- `QUEUE_CONNECTION=redis`

### Option 2: Use Railway's Redis/Valkey Service (Recommended for Production)

1. **Add Redis/Valkey Service in Railway:**
   - Go to Railway Dashboard
   - Click "New" → "Database" → Select "Valkey" or "Redis"
   - Railway will automatically provide `REDIS_URL` environment variable

2. **Update Environment Variables:**
   ```bash
   # Railway automatically sets REDIS_URL when service is linked
   # Then set:
   CACHE_STORE=redis
   SESSION_DRIVER=redis
   QUEUE_CONNECTION=redis
   ```

3. **Remove Manual Redis Settings:**
   ```bash
   # Remove these if they exist:
   # REDIS_HOST
   # REDIS_PORT
   # REDIS_PASSWORD
   ```

4. **Verify Connection:**
   ```bash
   railway run php artisan tinker
   # Then in tinker:
   Redis::ping()
   # Should return: "PONG"
   ```

## Configuration Update

The `config/database.php` has been updated to:
- Prioritize `REDIS_URL` if it exists (Railway provides this)
- Only use `REDIS_HOST`/`REDIS_PORT` if `REDIS_URL` is not set
- This prevents connection attempts to non-existent Redis instances

## Current Status

✅ **Configuration updated** to handle Redis gracefully
⚠️ **Action Required**: Choose Option 1 or Option 2 above

## Quick Fix Command (Option 1)

```bash
cd taskjuggler-api
railway variables --set "CACHE_STORE=file"
railway variables --set "SESSION_DRIVER=file"
railway variables --set "QUEUE_CONNECTION=sync"
railway variables --unset "REDIS_HOST"
```

Then restart the service in Railway dashboard.
