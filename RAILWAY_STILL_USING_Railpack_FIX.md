# Railway Still Using Railpack - Additional Fix Needed

## 🔴 Problem

Railway is **STILL using Railpack** even after renaming Procfile. The logs show:

```
↳ Found web command in Procfile
```

**This means:**
1. Railway might be caching the old Procfile
2. OR Railway dashboard builder is set to Railpack (not NIXPACKS)
3. OR Railway hasn't pulled latest code yet

## 🔴 Additional Issue Found

**package-lock.json is out of sync:**

```
npm error Missing: coordinator-web@0.0.0 from lock file
```

**Cause:** We changed `coordinator-web/package.json` name from `"4calls-ai-web"` to `"coordinator-web"`, but `package-lock.json` wasn't updated.

## ✅ Fixes Applied

### 1. Regenerated package-lock.json ✅

```bash
rm package-lock.json
npm install --package-lock-only
```

This syncs package-lock.json with all package.json changes.

### 2. Verify Procfile is Renamed ✅

- ✅ Procfile renamed to `Procfile.railpack-trigger`
- ✅ Changes committed and pushed

## 🎯 Railway Dashboard Action Required

**Railway is STILL detecting Procfile, which means:**

### Option 1: Force NIXPACKS in Dashboard (Recommended)

**For each service:**
1. Go to: Railway Dashboard → Service → Settings → Build
2. **Builder:** Change from "Railpack (Default)" to **"NIXPACKS"**
3. **Save**

This forces Railway to use NIXPACKS and ignore Procfile detection.

### Option 2: Wait for Cache Clear

Railway might be caching the old Procfile. Wait a few minutes and rebuild.

### Option 3: Check Root Directory

Ensure Root Directory is set to `/` (not `/official-notice-web`)

## 📋 Verification Checklist

After fixing dashboard:

- [ ] Builder = NIXPACKS (not Railpack)
- [ ] Root Directory = `/`
- [ ] Custom Build Command = EMPTY (use railway.json)
- [ ] package-lock.json synced ✅ (done)
- [ ] Procfile renamed ✅ (done)

## 🚀 Expected Result

After forcing NIXPACKS in dashboard:

```
Using NIXPACKS builder
Running: npm install && npm run build -w shared-ui && npm run build -w official-notice-web
✅ Build succeeds
```

Instead of:
```
Using Railpack (auto-detected)
Found Procfile
Running: npm ci  ← Wrong command
❌ Fails
```

## 🆘 If Still Failing

1. **Check Railway Dashboard Builder** - Must be NIXPACKS
2. **Clear Railway Cache** - Delete and recreate service (last resort)
3. **Check Build Logs** - Look for "Using NIXPACKS" vs "Railpack"

---

## ✅ Summary

- ✅ package-lock.json regenerated and synced
- ✅ Procfile renamed (committed and pushed)
- ⏳ **Railway Dashboard:** Need to force NIXPACKS builder manually

**The Procfile rename alone isn't enough - Railway dashboard builder must be set to NIXPACKS.**
