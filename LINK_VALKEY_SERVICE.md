# Link Valkey Service to Fix Authentication

## Current Error

The app is trying to connect to `valkey.railway.internal` but getting:
```
NOAUTH Authentication required. [tcp://valkey.railway.internal:6379]
```

This means:
- ✅ The hostname resolves (Valkey service exists)
- ❌ Authentication is failing (no password being sent)

## Root Cause

The app is using `REDIS_HOST=valkey.railway.internal` but **no password** is being sent because:
- `REDIS_HOST` doesn't include authentication
- `REDIS_PASSWORD` is not set
- The app needs `VALKEY_URL` or `REDIS_URL` with embedded credentials

## Solution: Link Valkey Service

**You MUST link the Valkey service in Railway Dashboard:**

1. Go to Railway Dashboard → AI Task Juggler project
2. Click on **`taskjuggler`** service
3. Go to **Variables** tab
4. Click **"New Variable"** → **"Add from Service"** or **"Add Reference"**
5. Select your **`Valkey`** service
6. Railway will automatically set:
   - `VALKEY_URL=redis://default:password@valkey.railway.internal:6379`
   - OR it might set `REDIS_URL` pointing to Valkey

## What I've Fixed in Code

✅ Updated `config/database.php` to:
- Check for `VALKEY_URL` first (if Valkey service is linked)
- Fall back to `REDIS_URL` if `VALKEY_URL` is not set
- Use URL exclusively when available (includes password)
- Only use `REDIS_HOST`/`REDIS_PORT` if no URL is set

## After Linking Valkey Service

Once you link the Valkey service:
1. Railway will set `VALKEY_URL` automatically
2. The app will use `VALKEY_URL` (includes password)
3. Connection will work with authentication
4. Error will be resolved

## Alternative: Use Redis Instead

If you want to use Redis (which is already linked):
- Keep `REDIS_URL` (already set correctly)
- Delete `REDIS_HOST` and `REDIS_PORT`
- App will use `REDIS_URL` with authentication

## Summary

**Action Required:**
1. Link Valkey service to taskjuggler in Railway Dashboard
2. Railway will set `VALKEY_URL` automatically
3. App will use `VALKEY_URL` with embedded password
4. Connection will work! ✅

The code is ready - you just need to link the service in the dashboard! 🔗
