# 🚨 CRITICAL: Railway API Server Still Using Railpack

## The Problem
Railway is **STILL** using Railpack instead of NIXPACKS for the "ai-tools-api" service. The logs show:
- ✅ Railpack 0.17.1 detected
- ✅ Found workspace with 9 packages
- ✅ Found web command in Procfile
- ❌ Trying to build "ai-tools-api" as a Node.js workspace (doesn't exist)

## Root Cause
Railway is reading from the **ROOT directory** instead of `taskjuggler-api/`. This means:
1. It finds `package.json` in root → triggers Railpack
2. It finds `Procfile.railpack-trigger` → confirms Railpack
3. It never reads `taskjuggler-api/railway.json` → NIXPACKS config ignored

## The Fix (MUST DO IN DASHBOARD)

### Step 1: Go to Railway Dashboard
1. Open: https://railway.app
2. Navigate to: **Fibonacco AI Tools** project
3. Click on: **ai-tools-api** service
4. Click: **Settings** tab

### Step 2: Configure Build Settings
Under **Build** section:

1. **Builder:** 
   - Current: "Railpack (Default)" ❌
   - Change to: **"NIXPACKS"** ✅
   - **THIS IS CRITICAL - Dashboard setting overrides railway.json**

2. **Root Directory:**
   - Current: `/` (root) ❌
   - Change to: **`taskjuggler-api`** ✅
   - **THIS IS CRITICAL - Must point to PHP directory**

3. **Build Command:**
   - Leave **EMPTY** (NIXPACKS uses nixpacks.toml)

4. **Start Command:**
   - Leave **EMPTY** (NIXPACKS uses nixpacks.toml)

### Step 3: Configure Deploy Settings
Under **Deploy** section:

1. **Healthcheck Path:** `/up`
2. **Healthcheck Timeout:** `100`

### Step 4: Save and Redeploy
1. Click **Save** at the bottom
2. Go to **Deployments** tab
3. Click **Redeploy** or trigger a new deployment

## Verification

After fixing, check the build logs. You should see:

✅ **NIXPACKS build output** (NOT Railpack)
```
[phases.setup]
nixPkgs = ['php82', 'php82Packages.composer', 'nodejs_20']
```

✅ **PHP installation**
```
Installing PHP 8.2...
```

✅ **Composer installation**
```
composer install --no-interaction --optimize-autoloader --no-dev --prefer-dist
```

✅ **Laravel commands**
```
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

✅ **Migrations running**
```
php artisan migrate --force
```

✅ **Server starting**
```
php artisan serve --host=0.0.0.0 --port=$PORT
```

## What I've Added

1. ✅ **Updated `monorepo-build.sh`** - Now exits early if API service tries to use it
2. ✅ **Created `taskjuggler-api/.railwayignore`** - Prevents Node.js file detection
3. ✅ **Configuration files are correct** - railway.json and nixpacks.toml are ready

## Why Dashboard Settings Matter

Railway's dashboard settings **OVERRIDE** `railway.json` files. Even though we have:
- ✅ `taskjuggler-api/railway.json` specifying NIXPACKS
- ✅ `taskjuggler-api/nixpacks.toml` with PHP config

If the dashboard has:
- ❌ Builder = "Railpack (Default)"
- ❌ Root Directory = `/`

Then Railway will:
1. Read from root directory
2. Find `package.json` → Auto-detect Railpack
3. Ignore `taskjuggler-api/railway.json`
4. Try to build as Node.js workspace → FAILS

## After Fix

Once you set:
- Builder = **NIXPACKS**
- Root Directory = **taskjuggler-api**

Railway will:
1. Read from `taskjuggler-api/` directory
2. Find `railway.json` → Use NIXPACKS
3. Find `nixpacks.toml` → Build PHP
4. Successfully deploy the API server

## Quick Checklist

- [ ] Builder = NIXPACKS (not Railpack)
- [ ] Root Directory = `taskjuggler-api` (not `/`)
- [ ] Build Command = EMPTY
- [ ] Start Command = EMPTY
- [ ] Healthcheck Path = `/up`
- [ ] Saved settings
- [ ] Triggered new deployment
- [ ] Verified logs show NIXPACKS (not Railpack)
