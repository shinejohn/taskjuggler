# Railway Dashboard Configuration - ai-tools-api Service

## Critical Settings to Configure

Based on your Railway dashboard, here are the exact settings to configure:

### 1. Root Directory (CRITICAL - MUST SET THIS)

**Location:** Settings → Source section

**Action:**
- Find the **"Root directory"** field
- **Set it to:** `taskjuggler-api`
- Click **"Update"** button

**Why:** This tells Railway to build from `taskjuggler-api/` directory instead of the monorepo root.

### 2. Builder (Already Correct)

**Location:** Settings → Build section

**Current:** Nixpacks ✅

**Action:** No change needed - this is correct!

### 3. Build Command (Should be Empty or Use railway.json)

**Location:** Settings → Build → Custom Build Command

**Action:** 
- **Leave empty** (Railway will use `taskjuggler-api/railway.json` which specifies NIXPACKS)
- OR if there's a build command set, **clear it**

**Why:** The `taskjuggler-api/railway.json` already specifies the build configuration. Railway will use `taskjuggler-api/nixpacks.toml` automatically.

### 4. Start Command (Should Use railway.json)

**Location:** Settings → Deploy → Custom Start Command

**Action:**
- **Leave empty** (Railway will use `taskjuggler-api/railway.json` which has: `php artisan migrate --force && php artisan serve --host=0.0.0.0 --port=$PORT`)
- OR if there's a start command set, **clear it** to use the one from railway.json

**Why:** The `taskjuggler-api/railway.json` already specifies the start command with migrations.

### 5. Healthcheck Path (Should Use railway.json)

**Location:** Settings → Deploy → Healthcheck Path

**Action:**
- **Leave empty** (Railway will use `taskjuggler-api/railway.json` which has: `/up`)
- OR set to: `/up`

**Why:** Laravel's health check endpoint is `/up`.

### 6. Railway Config File (Optional but Recommended)

**Location:** Settings → Config-as-code → Railway Config File

**Action:**
- **Set to:** `taskjuggler-api/railway.json`

**Why:** This explicitly tells Railway to use the config file from the API directory.

## Step-by-Step Configuration

1. **Set Root Directory:**
   - Scroll to **Source** section
   - Find **"Root directory"** field
   - Enter: `taskjuggler-api`
   - Click **"Update"**

2. **Clear Build Command (if set):**
   - Scroll to **Build** section
   - Find **"Custom Build Command"**
   - If there's a value, **clear it**
   - Click **"Update"**

3. **Clear Start Command (if set):**
   - Scroll to **Deploy** section
   - Find **"Custom Start Command"**
   - If there's a value, **clear it**
   - Click **"Update"**

4. **Set Healthcheck Path:**
   - In **Deploy** section
   - Find **"Healthcheck Path"**
   - Set to: `/up`
   - Click **"Update"**

5. **Set Railway Config File (Optional):**
   - Scroll to **Config-as-code** section
   - Find **"Railway Config File"**
   - Set to: `taskjuggler-api/railway.json`
   - Click **"Update"**

6. **Redeploy:**
   - Go to **Deployments** tab
   - Click **"Redeploy"** or trigger a new deployment

## Expected Result

After configuration, Railway will:

✅ Build from `taskjuggler-api/` directory
✅ Detect `composer.json` (PHP/Laravel)
✅ Use `taskjuggler-api/nixpacks.toml` (PHP 8.2)
✅ Run `composer install`
✅ Run Laravel build commands (config:cache, route:cache, view:cache)
✅ Start with: `php artisan migrate --force && php artisan serve`
✅ Health check on: `/up`

❌ Will NOT detect Node.js from root
❌ Will NOT run `npm run build`
❌ Will NOT run `monorepo-build.sh`

## Verification

After redeploying, check the build logs:

✅ Should see: `Using Nixpacks` with PHP setup
✅ Should see: `composer install`
✅ Should see: `php artisan config:cache`
✅ Should see: Building from `/app/` (which will be taskjuggler-api directory)
✅ Should NOT see: `npm run build`
✅ Should NOT see: `monorepo-build.sh`

## Troubleshooting

If it still doesn't work:

1. **Verify Root Directory:**
   - Make sure it's exactly `taskjuggler-api` (no trailing slash, no leading slash)
   - Case-sensitive

2. **Check Build Logs:**
   - Look for what directory Railway is building from
   - Should see files from `taskjuggler-api/` directory

3. **Verify railway.json:**
   - Check that `taskjuggler-api/railway.json` exists
   - Check that it specifies `"builder": "NIXPACKS"`

4. **Force Redeploy:**
   - Go to Deployments tab
   - Click "Redeploy"
   - Or push a new commit to trigger deployment
