# Railway API Server Fix - "ai-tools-api" Service

## Problem
Railway is detecting the API service as a Node.js project and trying to use Railpack instead of NIXPACKS. The service name is "ai-tools-api" but it's actually the PHP/Laravel backend.

## Error
```
RAILWAY_SERVICE_NAME: ai-tools-api
npm error No workspaces found:
npm error   --workspace=ai-tools-api
```

## Root Cause
1. Railway auto-detected Railpack because it found `package.json` in the root
2. Railway is trying to build it as a Node.js workspace
3. The service name "ai-tools-api" doesn't match any workspace in `package.json`

## Solution

### Step 1: Configure Railway Dashboard

Go to Railway dashboard → "Fibonacco AI Tools" project → "ai-tools-api" service:

1. **Settings → Build**
   - **Builder:** Change from "Railpack (Default)" to **"NIXPACKS"**
   - **Root Directory:** Set to **`taskjuggler-api`**
   - **Build Command:** Leave empty (NIXPACKS will use `nixpacks.toml`)
   - **Start Command:** Leave empty (NIXPACKS will use `nixpacks.toml`)

2. **Settings → Deploy**
   - **Healthcheck Path:** `/up`
   - **Healthcheck Timeout:** `100`

### Step 2: Verify Configuration Files

The following files are already correctly configured:

✅ `taskjuggler-api/railway.json` - Specifies NIXPACKS builder
✅ `taskjuggler-api/nixpacks.toml` - PHP build configuration
✅ `taskjuggler-api/Procfile` - Process definitions

### Step 3: Prevent Railpack Detection

Create a `.railwayignore` file in the root to prevent Railway from detecting Node.js files for the API service:

```bash
# In taskjuggler-api directory
echo "package.json" > .railwayignore
echo "package-lock.json" >> .railwayignore
echo "node_modules" >> .railwayignore
```

Actually, DON'T do this - we need Railway to use NIXPACKS, not ignore files.

### Alternative: Use Railway CLI

If you have Railway CLI access:

```bash
cd taskjuggler-api
railway link --project ca3879ff-fd72-4239-983d-32ade6cace83 --service ai-tools-api
railway variables set RAILWAY_BUILDER=NIXPACKS
```

## Expected Behavior After Fix

When Railway builds the API service:
1. ✅ Detects `nixpacks.toml` in `taskjuggler-api/`
2. ✅ Uses NIXPACKS builder (not Railpack)
3. ✅ Installs PHP 8.2 and Composer
4. ✅ Runs `composer install`
5. ✅ Runs Laravel cache commands
6. ✅ Starts with: `php artisan migrate --force && php artisan serve`

## Verification

After fixing, check Railway logs. You should see:
- ✅ NIXPACKS build output (not Railpack)
- ✅ PHP/Composer installation
- ✅ Laravel migrations running
- ✅ Server starting on port $PORT

## Current Configuration Files

### `taskjuggler-api/railway.json`
```json
{
    "build": {
        "builder": "NIXPACKS",
        "nixpacksConfigPath": "nixpacks.toml"
    },
    "deploy": {
        "startCommand": "php artisan migrate --force && php artisan serve --host=0.0.0.0 --port=$PORT",
        "healthcheckPath": "/up",
        "healthcheckTimeout": 100
    }
}
```

### `taskjuggler-api/nixpacks.toml`
```toml
[phases.setup]
nixPkgs = ['php82', 'php82Packages.composer', 'nodejs_20']

[phases.install]
cmds = [
  'composer install --no-interaction --optimize-autoloader --no-dev --prefer-dist'
]

[phases.build]
cmds = [
  'php artisan config:cache',
  'php artisan route:cache',
  'php artisan view:cache'
]

[start]
cmd = 'php artisan migrate --force --no-interaction || true && php artisan storage:link --force || true && php artisan serve --host=0.0.0.0 --port=${PORT:-8000}'
```

## Critical: Dashboard Configuration Required

**You MUST manually set the Builder to NIXPACKS in the Railway dashboard.** The `railway.json` file alone won't override Railpack auto-detection if Railway has already detected the project as Node.js.
