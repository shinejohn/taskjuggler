# CREATE REDIS SERVICE - IMMEDIATE ACTION REQUIRED

## The Problem

Your app is trying to connect to `valkey.railway.internal` which **DOES NOT EXIST**.

**Current Status:**
- ❌ `REDIS_HOST=valkey.railway.internal` (WRONG - service doesn't exist)
- ✅ `REDIS_URL=redis://default:password@redis.railway.internal:6379` (CORRECT - but app is using REDIS_HOST instead)

## Solution: Create Redis Service via Dashboard

The Railway CLI can't create services non-interactively. You MUST do this via the dashboard:

### Step 1: Create Redis Service

1. Go to: https://railway.app
2. Open **"AI Task Juggler"** project
3. Click **"New"** button (top right)
4. Select **"Database"**
5. Choose **"Redis"**
6. Railway will create the service automatically

### Step 2: Link Redis Service

1. Click on your **"taskjuggler"** service
2. Go to **"Variables"** tab
3. Click **"New Variable"** → **"Add from Service"** or **"Add Reference"**
4. Select your **Redis** service
5. Railway will automatically set `REDIS_URL`

### Step 3: Fix REDIS_HOST

**Option A (Recommended):** Delete `REDIS_HOST` entirely
- In Variables tab, delete `REDIS_HOST`

**Option B:** Change `REDIS_HOST` to match your Redis service
- Change `REDIS_HOST` from `valkey.railway.internal` to `redis.railway.internal`

### Step 4: Verify

After creating and linking:
- `REDIS_URL` should be set automatically
- `REDIS_HOST` should be deleted or changed to `redis.railway.internal`
- App will connect successfully

## Why This Is Urgent

The app is **currently broken** because it's trying to connect to a non-existent service. Creating the Redis service and fixing the variables will fix it immediately.

## Summary

**DO THIS NOW:**
1. Dashboard → New → Database → Redis
2. Link Redis to taskjuggler service
3. Delete or fix `REDIS_HOST`
4. Deploy

**This will fix the connection error immediately!** 🚨
