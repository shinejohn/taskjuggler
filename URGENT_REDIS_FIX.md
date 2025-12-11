# URGENT: Redis Connection Fix

## The Problem

Your app is trying to connect to `valkey.railway.internal:6379` which doesn't exist. This is because:

- ❌ `REDIS_HOST=valkey.railway.internal` is set in Railway (wrong service name)
- ✅ `REDIS_URL=redis://default:password@redis.railway.internal:6379` is set (correct)

The app should use `REDIS_URL`, but `REDIS_HOST` is taking precedence.

## Immediate Fix Required

**You MUST remove `REDIS_HOST` and `REDIS_PORT` from Railway Dashboard:**

1. Go to: https://railway.app
2. Open **"AI Task Juggler"** project
3. Click **"taskjuggler"** service
4. Go to **"Variables"** tab
5. **DELETE** these variables:
   - `REDIS_HOST` (currently: `valkey.railway.internal`)
   - `REDIS_PORT` (currently: `6379`)
6. **KEEP** `REDIS_URL` (it's already correct!)

## Why This Is Critical

The code has been updated to prioritize `REDIS_URL`, but if `REDIS_HOST` is set to a non-existent service, Predis may still try to use it during connection attempts.

## After Removing Variables

1. Railway will automatically redeploy
2. The app will use `REDIS_URL` exclusively
3. Connection will work to `redis.railway.internal:6379`

## Verification

After removing the variables, test:

```bash
railway run --service taskjuggler php artisan tinker
```

Then:
```php
>>> \Illuminate\Support\Facades\Redis::ping()
# Should return: "PONG"
```

## What I've Fixed in Code

✅ Updated `config/database.php` to completely exclude `host`/`port` when `REDIS_URL` is set  
✅ Cleared config cache locally  
✅ Configuration now properly prioritizes `REDIS_URL`

**But you still need to remove `REDIS_HOST` and `REDIS_PORT` from Railway!**

## Summary

**Action Required (Dashboard Only - CLI can't delete):**
1. Delete `REDIS_HOST` from Railway Variables
2. Delete `REDIS_PORT` from Railway Variables  
3. Keep `REDIS_URL` (already correct)

**This is the ONLY way to fix the connection error!** 🚨
