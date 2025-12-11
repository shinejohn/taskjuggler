# Use Valkey Only - Final Configuration

## Goal
Use **Valkey only** - delete Redis service, configure app to use Valkey.

## Steps

### 1. Delete Redis Service
**Via Railway Dashboard:**
1. Go to Railway Dashboard → AI Task Juggler project
2. Click on **`Redis`** service
3. Settings → Delete Service
4. Confirm deletion

### 2. Link Valkey Service (Get Password)
**Via Railway Dashboard:**
1. Click on **`taskjuggler`** service
2. Go to **Variables** tab
3. Click **"New Variable"** → **"Add from Service"** or **"Add Reference"**
4. Select **`Valkey`** service
5. Railway will automatically create:
   - `VALKEY_URL=redis://default:password@valkey.railway.internal:6379`
   - `VALKEY_HOST=valkey.railway.internal`
   - `VALKEY_PASSWORD=...`

### 3. Set REDIS Variables to Use Valkey
**Via Railway Dashboard Variables:**
Set these variables to reference Valkey:

```
REDIS_HOST=${{Valkey.VALKEY_HOST}}
REDIS_PASSWORD=${{Valkey.VALKEY_PASSWORD}}
REDIS_PORT=6379
```

**OR manually set:**
```
REDIS_HOST=valkey.railway.internal
REDIS_PASSWORD=<password-from-valkey-service>
REDIS_PORT=6379
```

### 4. Remove REDIS_URL
**Delete `REDIS_URL`** variable (it points to Redis service which you're deleting)

### 5. Clear Config Cache
After updating variables, Railway will redeploy. The config will:
- Check for `VALKEY_URL` first (if linked)
- Fall back to `REDIS_URL` (delete this)
- Use `REDIS_HOST` + `REDIS_PASSWORD` + `REDIS_PORT` (set these to Valkey values)

## Current Status

✅ **REDIS_HOST** = `valkey.railway.internal` (set)
⏳ **REDIS_PASSWORD** = Need to get from Valkey service
⏳ **REDIS_URL** = Should be deleted (points to Redis)
⏳ **VALKEY_URL** = Will be set when you link Valkey service

## After Completing Steps

1. ✅ Only Valkey service exists
2. ✅ App uses Valkey via `REDIS_HOST` + `REDIS_PASSWORD`
3. ✅ Connection works with authentication
4. ✅ No more 500 errors

## Summary

**Action Required:**
1. Delete Redis service
2. Link Valkey service to taskjuggler
3. Set `REDIS_PASSWORD` from Valkey service
4. Delete `REDIS_URL` variable
5. Keep `REDIS_HOST=valkey.railway.internal`

**Result:**
- App uses Valkey only
- Authentication works
- Connection successful! ✅
