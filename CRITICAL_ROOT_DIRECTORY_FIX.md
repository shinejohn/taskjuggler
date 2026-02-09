# CRITICAL: Railway Root Directory Not Set

## Current Error

Railway is using **NIXPACKS** (correct!), but it's building from the **monorepo root** instead of the `taskjuggler-api` directory. This causes:

1. NIXPACKS detects Node.js (from root `package.json`) instead of PHP (from `taskjuggler-api/composer.json`)
2. NIXPACKS uses Node.js 18 (wrong version - Vite needs 20+)
3. Build fails because it tries to build Node.js workspaces instead of PHP/Laravel

## The Fix

**You MUST set the Root Directory in Railway Dashboard:**

### Step-by-Step:

1. **Go to Railway Dashboard**
   - Visit: https://railway.app
   - Navigate to: **"Fibonacco AI Tools"** project
   - Click on service: **"ai-tools-api"**

2. **Set Root Directory**
   - Go to: **Settings** tab
   - Scroll to: **Build & Deploy** section
   - Find: **Root Directory** field
   - **Set it to:** `taskjuggler-api` (exactly this, no trailing slash)
   - Click **Save**

3. **Verify Builder**
   - In the same section, verify **Builder** shows: **NIXPACKS**
   - It should already be NIXPACKS (that's correct)

4. **Redeploy**
   - Go to **Deployments** tab
   - Click **Redeploy** or trigger a new deployment

## What Will Happen After Fix

Once the root directory is set to `taskjuggler-api`:

✅ NIXPACKS will detect `composer.json` (PHP/Laravel)
✅ NIXPACKS will use `taskjuggler-api/nixpacks.toml` (PHP 8.2)
✅ NIXPACKS will run: `composer install`
✅ NIXPACKS will run Laravel build commands (config:cache, route:cache, view:cache)
✅ Service will start with: `php artisan migrate && php artisan serve`

❌ NIXPACKS will NOT detect Node.js
❌ NIXPACKS will NOT run `npm run build`
❌ The `monorepo-build.sh` script will NOT run

## Current vs Expected

**Current (WRONG):**
- Railway builds from: `/app/` (monorepo root)
- NIXPACKS sees: `package.json` → detects Node.js
- Build fails

**Expected (CORRECT):**
- Railway builds from: `/app/taskjuggler-api/`
- NIXPACKS sees: `composer.json` → detects PHP
- Build succeeds

## Verification

After setting root directory, check the build logs:

✅ Should see: `Using Nixpacks` with PHP setup
✅ Should see: `composer install`
✅ Should see: `php artisan config:cache`
✅ Should NOT see: `npm run build`
✅ Should NOT see: `monorepo-build.sh`

## Why This Happens

Railway's auto-detection:
1. Scans the repository root by default
2. Finds `package.json` → thinks it's Node.js
3. Ignores `taskjuggler-api/railway.json` unless root directory is set
4. Builds from wrong directory

Setting the root directory tells Railway: "Build from THIS directory, not the root."

## Files Already Configured

These files are correct and ready:

- ✅ `taskjuggler-api/railway.json` - Specifies NIXPACKS
- ✅ `taskjuggler-api/nixpacks.toml` - PHP 8.2 configuration
- ✅ `taskjuggler-api/composer.json` - Laravel dependencies

Railway just needs to know to look in `taskjuggler-api/` directory!
