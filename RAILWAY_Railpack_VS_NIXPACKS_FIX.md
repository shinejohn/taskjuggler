# Railway Railpack vs NIXPACKS Issue - FIX

## 🔴 Problem Identified

Railway is using **Railpack** (auto-detection) instead of **NIXPACKS** (from railway.json).

### Evidence from Logs:

```
↳ Found workspace with 9 packages
↳ Found web command in Procfile
$ npm ci          ← Railway's auto-detected command (FAILING)
$ npm run build   ← Railway's auto-detected command (wrong)
$ ./monorepo-start.sh  ← From Procfile
```

**Railway is IGNORING railway.json buildCommand because:**
1. Railway detected `Procfile` → triggers Railpack auto-detection
2. Railway detected workspace → uses its own build process
3. Railway ignores `railway.json` when Railpack is active

## ✅ Solution: Force NIXPACKS

### Option 1: Remove/Rename Procfile (Recommended)

**Procfile triggers Railpack.** If Procfile exists at root, Railway uses Railpack instead of NIXPACKS.

**Fix:**
```bash
# Rename Procfile so Railway doesn't detect it
mv Procfile Procfile.backup
```

**Or:** Move Procfile to a service-specific location (not at root)

### Option 2: Set Builder in Railway Dashboard

**For each service:**
1. Go to: Settings → Build → Builder
2. **Change from:** Railpack (Default)
3. **Change to:** NIXPACKS
4. **Save**

This forces Railway to use NIXPACKS and respect railway.json

### Option 3: Remove Procfile from Root

If Procfile is only for backend (taskjuggler-api), move it there:

```bash
# Move Procfile to backend only
mv Procfile taskjuggler-api/Procfile
```

## 🎯 Why This Fixes It

**Current (Broken):**
- Railway detects Procfile → Uses Railpack
- Railpack auto-detects → Runs `npm ci` and `npm run build` from root
- Ignores railway.json buildCommand
- ❌ Fails because root `npm run build` uses monorepo-build.sh

**After Fix:**
- No Procfile at root → Railway uses NIXPACKS (from railway.json)
- NIXPACKS respects railway.json buildCommand
- Runs: `npm install && npm run build -w shared-ui && npm run build -w <service>`
- ✅ Works correctly

## 📋 Action Plan

### Immediate Fix:

1. **Check Procfile:**
   ```bash
   cat Procfile
   ```

2. **If Procfile is only for backend:**
   ```bash
   mv Procfile taskjuggler-api/Procfile
   ```

3. **If Procfile is needed at root:**
   - Rename it: `mv Procfile Procfile.backup`
   - Or set builder to NIXPACKS in Railway dashboard for each service

4. **Verify Railway Dashboard:**
   - For each service: Settings → Build → Builder = NIXPACKS

5. **Trigger Rebuild:**
   - Railway should now use NIXPACKS and respect railway.json

## ✅ Expected Result

After removing Procfile or forcing NIXPACKS:

```
Using NIXPACKS builder
Running: npm install
Running: npm run build -w shared-ui
Running: npm run build -w official-notice-web
✅ Build succeeds
```

## 🔍 Verification

Check Railway logs after fix:
- Should see: "Using NIXPACKS" (not Railpack)
- Should see: Custom buildCommand from railway.json
- Should NOT see: "Found web command in Procfile"
