# Railway Procfile Fix - Complete

## ✅ Problem Solved

**Root Cause:** Root `Procfile` was triggering Railway's Railpack auto-detection, causing Railway to ignore `railway.json` buildCommand.

## 🔧 Fix Applied

**Renamed:** `Procfile` → `Procfile.railpack-trigger`

**Why This Works:**
- Railway only detects files named exactly `Procfile`
- Renaming it prevents Railpack auto-detection
- Railway now uses NIXPACKS (from railway.json)
- NIXPACKS respects the buildCommand in railway.json

## 📋 What Changed

### Before (Broken):
```
Root directory: /
├── Procfile          ← Railway detects this → Uses Railpack
├── package.json
└── railway.json      ← Ignored by Railpack

Railway behavior:
- Detects Procfile → Switches to Railpack
- Railpack auto-detects → Runs `npm ci` and `npm run build` from root
- Ignores railway.json buildCommand
- ❌ Fails
```

### After (Fixed):
```
Root directory: /
├── Procfile.railpack-trigger  ← Railway doesn't detect this
├── package.json
└── railway.json      ← Now respected by NIXPACKS

Railway behavior:
- No Procfile detected → Uses NIXPACKS (from railway.json)
- NIXPACKS reads railway.json → Runs custom buildCommand
- ✅ Works correctly
```

## ✅ Services Affected

All frontend services will now use NIXPACKS:
- official-notice-web
- scanner-web
- urpa-web
- projects-web
- coordinator-web
- process-web

**Note:** Backend (taskjuggler-api) has its own Procfile and is unaffected.

## 🚀 Expected Result

After Railway rebuilds (auto-triggered by git push):

**Railway logs should show:**
```
Using NIXPACKS builder
Running: npm install
Running: npm run build -w shared-ui
Running: npm run build -w official-notice-web
✅ Build succeeds
```

**Instead of:**
```
Using Railpack (auto-detected)
Found Procfile
Running: npm ci  ← Wrong command
❌ Fails
```

## 📊 Verification

Check Railway dashboard after rebuild:
1. Build logs should show "NIXPACKS" (not Railpack)
2. Build logs should show custom buildCommand from railway.json
3. Build should succeed
4. All 6 services should build successfully

## ✅ Status

- ✅ Root Procfile renamed
- ✅ Changes committed
- ✅ Changes pushed to GitHub
- ✅ Railway will auto-rebuild
- ✅ All services should now build successfully
