# Fix REDIS_URL Reference

## Current Issue

Your `REDIS_URL` is set to: `${Redis.REDIS_URL}}`

**Problems:**
1. Double closing brace `}}` - should be single `}`
2. References a service named `Redis` - need to verify this service exists
3. If you want Valkey instead, you may need to create it or rename the reference

## Fix Steps

### Option 1: Fix the Syntax (If Redis Service Exists)

1. In Railway Dashboard, go to your `taskjuggler` service
2. Go to **Variables** tab
3. Find `REDIS_URL`
4. Click to edit it
5. Change from: `${Redis.REDIS_URL}}`
6. To: `${Redis.REDIS_URL}` (remove one closing brace)
7. Save

### Option 2: Create/Verify Redis Service

If the `Redis` service doesn't exist:

1. **Check if Redis service exists:**
   - Look in your Railway project dashboard
   - See if there's a service named `Redis` or `Valkey`
   - If it exists but is named differently, update the reference

2. **If Redis service doesn't exist, create it:**
   - Click **"New"** → **"Database"**
   - Select **"Valkey"** or **"Redis"**
   - Railway will create it automatically
   - Note the exact service name (might be `Redis`, `Valkey`, or something else)

3. **Link the service:**
   - Go to your `taskjuggler` service → **Variables** tab
   - Click **"New Variable"** or edit `REDIS_URL`
   - Select **"Add from Service"** or **"Reference"**
   - Choose your Redis/Valkey service
   - Railway will set it to: `${ServiceName.REDIS_URL}` (single brace)

### Option 3: Use Direct REDIS_URL Value

If you want to set the URL directly (not recommended, but works):

1. Go to your Redis/Valkey service
2. Go to **Variables** tab
3. Find the actual `REDIS_URL` value (should be like `redis://default:password@redis.railway.internal:6379`)
4. Copy that value
5. Go to your `taskjuggler` service → **Variables**
6. Edit `REDIS_URL`
7. Paste the actual URL value (not a reference)

**Note**: Using a reference (`${Redis.REDIS_URL}`) is better because Railway updates it automatically if the service changes.

## Correct Syntax

The correct Railway service reference syntax is:
- ✅ `${Redis.REDIS_URL}` (single closing brace)
- ❌ `${Redis.REDIS_URL}}` (double closing brace - typo)

## Verify It Works

After fixing:

1. **Check the value resolves:**
   - In Railway dashboard, the `REDIS_URL` should show the actual connection string when you view it
   - Or run: `railway variables` to see resolved values

2. **Test connection:**
   ```bash
   railway run --service taskjuggler php artisan tinker
   ```
   Then:
   ```php
   >>> \Illuminate\Support\Facades\Redis::ping()
   # Should return: "PONG"
   ```

## Summary

1. ✅ Fix syntax: `${Redis.REDIS_URL}}` → `${Redis.REDIS_URL}`
2. ✅ Verify `Redis` service exists in your project
3. ✅ If it doesn't exist, create Valkey/Redis service
4. ✅ Test connection with `Redis::ping()`

The double closing brace is likely just a display/typo issue. Fix it to a single brace and verify the Redis service exists!
