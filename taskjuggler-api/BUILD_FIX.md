# Task Juggler Build Fix

## Problem

The `taskjuggler` service is failing to build. Railway's Railpack cannot determine how to build the app.

## Root Cause

1. **Root Directory Issue:** Railway was trying to build from root (`/Code`) instead of `taskjuggler-api/`
2. **Conflicting railway.json:** There was a `railway.json` in the root directory that conflicted with the one in `taskjuggler-api/`

## Fixes Applied

### 1. ✅ Removed Root railway.json
- Deleted `/Code/railway.json` (conflicting file)
- Railway will now use `/Code/taskjuggler-api/railway.json`

### 2. ✅ Verified Root Directory Setting
- `RAILWAY_ROOT_DIRECTORY=taskjuggler-api` is set
- This tells Railway to use `taskjuggler-api/` as the service root

### 3. ✅ Verified railway.json in taskjuggler-api/
- Build command: `composer install --no-dev --optimize-autoloader && php artisan config:cache && php artisan route:cache && php artisan view:cache`
- Start command: `php artisan serve --host=0.0.0.0 --port=$PORT`
- Builder: NIXPACKS (auto-detects PHP/Laravel)

## Current Configuration

**Service:** `taskjuggler`
- **Root Directory:** `taskjuggler-api`
- **railway.json:** Located in `taskjuggler-api/railway.json`
- **Builder:** NIXPACKS (auto-detects PHP)
- **Build Command:** `composer install --no-dev --optimize-autoloader && php artisan config:cache && php artisan route:cache && php artisan view:cache`
- **Start Command:** `php artisan serve --host=0.0.0.0 --port=$PORT`

## Next Steps

### 1. Verify Root Directory in Railway Dashboard

Even though `RAILWAY_ROOT_DIRECTORY` is set, verify in dashboard:

1. Go to Railway Dashboard: https://railway.app
2. Open "AI Task Juggler" project
3. Click on `taskjuggler` service
4. Go to **Settings** tab
5. Find **"Root Directory"** or **"Source"** setting
6. Ensure it's set to: `taskjuggler-api`
7. If not set, set it manually and save

### 2. Trigger New Deployment

After verifying root directory:

1. In Railway Dashboard, go to `taskjuggler` service
2. Click **"Deploy"** or **"Redeploy"** button
3. Or push a commit to trigger auto-deployment

### 3. Monitor Build Logs

Watch the build process:

```bash
railway logs --service taskjuggler
```

You should see:
- ✅ NIXPACKS detecting PHP
- ✅ Running `composer install`
- ✅ Running Laravel cache commands
- ✅ Build completing successfully

## Expected Build Process

1. **NIXPACKS Detection:**
   - Detects `composer.json` → PHP project
   - Detects `artisan` → Laravel framework

2. **Build Steps:**
   - Install PHP dependencies: `composer install --no-dev --optimize-autoloader`
   - Cache config: `php artisan config:cache`
   - Cache routes: `php artisan route:cache`
   - Cache views: `php artisan view:cache`

3. **Deploy:**
   - Start command: `php artisan serve --host=0.0.0.0 --port=$PORT`

## Troubleshooting

### Build Still Fails

**Check 1: Root Directory**
- Verify in Railway Dashboard that root directory is `taskjuggler-api`
- Not just the variable, but the actual service setting

**Check 2: railway.json Location**
- Ensure `railway.json` is in `taskjuggler-api/` directory
- Not in root `/Code/` directory

**Check 3: Build Logs**
```bash
railway logs --service taskjuggler
```
Look for:
- "Railpack could not determine how to build" → Root directory issue
- "composer.json not found" → Root directory wrong
- "artisan not found" → Root directory wrong

**Check 4: Service Source**
- If service is linked to GitHub repo, ensure repo structure matches
- Railway should build from `taskjuggler-api/` subdirectory

### Alternative: Update Build Command

If root directory setting doesn't work, you can modify `railway.json` to handle subdirectory:

```json
{
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "cd taskjuggler-api && composer install --no-dev --optimize-autoloader && cd taskjuggler-api && php artisan config:cache && php artisan route:cache && php artisan view:cache"
  },
  "deploy": {
    "startCommand": "cd taskjuggler-api && php artisan serve --host=0.0.0.0 --port=$PORT"
  }
}
```

But this is a workaround - setting root directory properly is the correct solution.

## Verification

After fixing, verify build succeeds:

```bash
# Check service status
railway status

# View build logs
railway logs --service taskjuggler

# Check if service is running
railway service taskjuggler
```

## Summary

✅ **Fixed:**
- Removed conflicting root `railway.json`
- Verified `RAILWAY_ROOT_DIRECTORY` is set
- Verified `railway.json` exists in `taskjuggler-api/`

⚠️ **Action Required:**
- Verify root directory in Railway Dashboard
- Trigger new deployment
- Monitor build logs

The build should now work correctly!
