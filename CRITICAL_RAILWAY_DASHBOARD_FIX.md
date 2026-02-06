# CRITICAL: Railway Dashboard Builder Must Be Set to NIXPACKS

## 🔴 Root Cause

Railway is **STILL using Railpack** even though we renamed Procfile. The logs show:

```
↳ Found web command in Procfile
```

**This means Railway dashboard builder is set to Railpack (auto-detection), not NIXPACKS.**

## ✅ Solution: Force NIXPACKS in Railway Dashboard

### For Each Service (Official Notice, Site Health, URPA, 4projects, 4calls, 4process):

1. **Open Railway Dashboard:** https://railway.app
2. **Navigate to Service** (e.g., "Official Notice")
3. **Go to:** Settings → Build
4. **Find:** Builder dropdown
5. **Change from:** "Railpack (Default)" or "Railpack"
6. **Change to:** **"NIXPACKS"**
7. **Save**

### Why This Is Required

- Renaming Procfile prevents NEW deployments from detecting it
- But Railway dashboard builder setting overrides this
- If builder is set to Railpack, Railway uses Railpack regardless of Procfile
- **Must manually set builder to NIXPACKS in dashboard**

## 📋 Complete Checklist

For each failing service:

- [ ] **Builder** = NIXPACKS (not Railpack)
- [ ] **Root Directory** = `/` (monorepo root)
- [ ] **Custom Build Command** = EMPTY (use railway.json)
- [ ] **Custom Start Command** = EMPTY (use railway.json)

## 🎯 Expected Result

After setting builder to NIXPACKS:

**Railway logs should show:**
```
Using NIXPACKS builder
Running: npm install && npm run build -w shared-ui && npm run build -w official-notice-web
✅ Build succeeds
```

**Instead of:**
```
Using Railpack (auto-detected)
Found Procfile
Running: npm ci
❌ Fails
```

## ✅ What We've Fixed (Code Level)

- ✅ Procfile renamed → `Procfile.railpack-trigger`
- ✅ package-lock.json regenerated → Synced with package.json changes
- ✅ All railway.json files correct → Use NIXPACKS builder
- ✅ All vite.config.ts files correct → Have @taskjuggler/ui alias

## ⏳ What's Required (Dashboard Level)

- ⏳ **Set Builder to NIXPACKS** for all 6 failing services
- ⏳ **Verify Root Directory** = `/`
- ⏳ **Clear Custom Commands** (let Railway use railway.json)

## 🚀 After Dashboard Fix

Railway will:
1. Use NIXPACKS builder (from dashboard setting)
2. Read railway.json buildCommand
3. Run: `npm install && npm run build -w shared-ui && npm run build -w <service>`
4. ✅ Build successfully

---

## 🆘 If Still Failing After Dashboard Fix

1. **Check Build Logs** - Should say "Using NIXPACKS" not "Railpack"
2. **Verify railway.json** - Should be read correctly
3. **Check Root Directory** - Must be `/`
4. **Try Manual Rebuild** - After changing builder setting

---

**The Procfile rename helps, but Railway dashboard builder MUST be set to NIXPACKS manually.**
