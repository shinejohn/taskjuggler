# Railway Redis Service Linking Fix

## Problem
Your Redis service is **Online** in Railway, but the application is getting connection errors:
```
Predis\Connection\Resource\Exception\StreamInitException
php_network_getaddresses: getaddrinfo for valkey.railway.internal failed
```

This happens when:
- ✅ Redis service exists and is Online
- ❌ Redis service is **not linked** to your main `taskjuggler` service
- ❌ `REDIS_URL` environment variable is **not set** (Railway sets this automatically when services are linked)
- ❌ `REDIS_HOST` is manually set to `valkey.railway.internal` (this only works when linked)

## Solution: Link Redis Service

Railway services need to be **linked** to share environment variables. When you link the Redis service to your main service, Railway automatically sets `REDIS_URL`.

### Step 1: Link Redis Service in Railway Dashboard

1. Go to your Railway project dashboard
2. Click on your **`taskjuggler`** service (the main application)
3. Go to the **"Variables"** tab
4. Look for **"Add Reference"** or **"Link Service"** option
5. Select **`Redis`** from the list of available services
6. Railway will automatically:
   - Link the services
   - Set `REDIS_URL` environment variable
   - Make Redis accessible to your application

### Step 2: Verify REDIS_URL is Set

After linking, check that `REDIS_URL` is set:

1. In Railway dashboard, go to **`taskjuggler`** service → **Variables** tab
2. Look for `REDIS_URL` - it should be something like:
   ```
   redis://default:password@redis.railway.internal:6379
   ```
3. If `REDIS_URL` is present, the link is successful ✅

### Step 3: Remove Manual Redis Settings (Important!)

If you manually set `REDIS_HOST`, `REDIS_PORT`, or `REDIS_PASSWORD`, **remove them**:

**Via Railway Dashboard:**
1. Go to **`taskjuggler`** service → **Variables** tab
2. Find and **delete** these variables:
   - `REDIS_HOST` (if set to `valkey.railway.internal` or similar)
   - `REDIS_PORT` (not needed when using REDIS_URL)
   - `REDIS_PASSWORD` (included in REDIS_URL)

**Via Railway CLI:**
```bash
railway variables --unset REDIS_HOST
railway variables --unset REDIS_PORT
railway variables --unset REDIS_PASSWORD
```

### Step 4: Set Redis Drivers (If Using Redis)

If you want to use Redis for cache, sessions, and queues:

```bash
railway variables --set CACHE_STORE=redis
railway variables --set SESSION_DRIVER=redis
railway variables --set QUEUE_CONNECTION=redis
```

**Note**: These are optional. The defaults work fine:
- Cache: `array` (in-memory)
- Session: `database` (uses PostgreSQL)
- Queue: `database` (uses PostgreSQL)

### Step 5: Redeploy

After linking and updating variables:
1. Railway will automatically redeploy, OR
2. Manually trigger a redeploy from the dashboard

## How Railway Service Linking Works

When services are **linked** in Railway:
- Railway automatically creates environment variables that reference the linked service
- For Redis: `REDIS_URL` is automatically set
- For PostgreSQL: `DATABASE_URL` is automatically set
- These URLs use Railway's internal network (`.railway.internal` hostnames)
- Internal hostnames **only work** when services are properly linked

## Verification

After linking, test the connection:

```bash
railway run --service taskjuggler php artisan tinker
```

Then in tinker:
```php
>>> \Illuminate\Support\Facades\Redis::ping()
# Should return: "PONG"
```

## Current Configuration

The application is already configured to:
- ✅ Prioritize `REDIS_URL` when available (Railway provides this when linked)
- ✅ Fall back to `REDIS_HOST`/`REDIS_PORT` only if `REDIS_URL` is not set
- ✅ Use safe defaults (database for sessions/queues, array for cache)

## Summary

**The fix is simple**: Link your Redis service to your main `taskjuggler` service in Railway. Once linked:
- ✅ Railway sets `REDIS_URL` automatically
- ✅ Remove manual `REDIS_HOST` setting
- ✅ Application will connect successfully

The Redis service is already Online - it just needs to be linked! 🔗
