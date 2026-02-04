# Valkey-CTyp Configuration Error - FIX

## 🚨 Problem Identified

**Error:**
```
*** FATAL CONFIG FILE ERROR (Version 9.0.2) ***
Reading the configuration file, at line 2
>>> 'port "--requirepass"'
argument couldn't be parsed into an integer
```

**Root Cause:**
The Valkey-CTyp service has an **incorrect environment variable** set. Someone likely set a variable like:
- `PORT="--requirepass"` (wrong)
- Or a malformed Redis configuration variable

This is causing Valkey to crash on startup.

---

## ✅ Solution

### Step 1: Check Current Variables

Go to Railway Dashboard:
1. Click on **Valkey-CTyp** service
2. Go to **Variables** tab
3. Look for any variables that look wrong, especially:
   - `PORT`
   - `REDIS_ARGS`
   - `VALKEY_ARGS`
   - Any variable with `--requirepass` in it

### Step 2: Remove Bad Variables

**Delete or fix these variables:**

❌ **Remove if present:**
```
PORT="--requirepass"
REDIS_ARGS="--requirepass something"
```

✅ **Valkey should have NO custom variables** (Railway manages it automatically)

Or at most:
```
# Only if you want password protection:
REDIS_PASSWORD=your_password_here
```

### Step 3: Restart Valkey-CTyp

After removing bad variables:
1. Click **Restart** on the Valkey-CTyp service
2. Wait for it to come online
3. Check logs to confirm it starts successfully

---

## 🔍 What to Look For in Railway Dashboard

### Valkey-CTyp Variables Tab

**Should be EMPTY or only have:**
```
REDIS_PASSWORD=  (optional, can be empty)
```

**Should NOT have:**
- `PORT` variable
- `REDIS_ARGS` variable
- `VALKEY_ARGS` variable
- Any variable with `--requirepass` in the value

---

## 📋 Correct Valkey Configuration

### Railway Manages Valkey Automatically

Valkey is a **managed service** in Railway. You don't need to set any variables on the Valkey service itself.

**The Valkey service should have:**
- ✅ No custom environment variables (Railway handles everything)
- ✅ A volume for data persistence
- ✅ Internal networking enabled

**Other services connect to Valkey using:**
```bash
# In ai-tools-api and other services:
REDIS_HOST=Valkey-CTyp.railway.internal
REDIS_PORT=6379
REDIS_PASSWORD=  (empty unless you set one)
```

---

## 🚀 Quick Fix Steps

### Via Railway Dashboard (Recommended):

1. **Go to Valkey-CTyp service**
   - https://railway.app/project/7e7372dd-373a-4e78-a51e-15eab332b67d

2. **Click "Variables" tab**

3. **Delete ALL variables** (Valkey doesn't need any)
   - Or keep only `REDIS_PASSWORD` if you want password auth

4. **Click "Restart"**

5. **Check logs** - should see:
   ```
   Ready to accept connections
   ```

---

## 🔧 Alternative: Recreate Valkey Service

If deleting variables doesn't work:

### Option 1: Redeploy
1. Go to Valkey-CTyp service
2. Click "Settings"
3. Scroll to "Danger Zone"
4. Click "Redeploy"

### Option 2: Delete and Recreate (Last Resort)
1. Delete Valkey-CTyp service
2. Create new Valkey service:
   - Click "+ New Service"
   - Select "Valkey" from templates
   - Name it "Valkey-CTyp" (or just "Valkey")
   - Don't add any variables
   - Deploy

3. Update all services to use new internal hostname:
   ```bash
   REDIS_HOST=Valkey-CTyp.railway.internal
   # or
   REDIS_HOST=Valkey.railway.internal
   ```

---

## ✅ Verification

After fixing, test the connection:

```bash
cd /Users/johnshine/Dropbox/Fibonacco/taskjuggler/Code
./verify-valkey.sh
```

Or manually:
```bash
railway run --service ai-tools-api "php artisan tinker --execute='
  \Illuminate\Support\Facades\Redis::set(\"test\", \"works\");
  echo \Illuminate\Support\Facades\Redis::get(\"test\");
'"
```

Should output: `works`

---

## 📝 Summary

**Problem**: Valkey has a malformed `PORT` or `REDIS_ARGS` variable
**Solution**: Delete all variables from Valkey-CTyp service
**Result**: Valkey will start successfully with default configuration

**Valkey is a managed service - it doesn't need custom environment variables!**

---

## 🎯 Action Now

1. Go to Railway Dashboard
2. Open Valkey-CTyp service
3. Variables tab
4. **Delete ALL variables**
5. Restart service
6. Verify it's running

Then all your other services will be able to connect to it! 🚀
