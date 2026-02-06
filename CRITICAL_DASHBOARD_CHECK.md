# ⚠️ CRITICAL: Check Dashboard Overrides

## ✅ What's CORRECT in Your Settings:

1. **Root Directory:** `/` ✅ CORRECT
2. **Source Repo:** `shinejohn/taskjuggler` ✅ CORRECT  
3. **Branch:** `main` ✅ CORRECT

## 🔴 CRITICAL ISSUE: Dashboard Overrides

Railway has **Custom Build Command** and **Custom Start Command** fields that **OVERRIDE** your `railway.json` file!

### The Problem:

If these fields have values in the dashboard, Railway **IGNORES** your `railway.json` file completely.

**Priority Order:**
1. Dashboard Custom Commands (HIGHEST - overrides everything)
2. railway.json file (only used if dashboard is empty)
3. Auto-detection (fallback)

---

## 🚨 ACTION REQUIRED: Check These Fields

### 1. Custom Build Command

**Location:** Build → Custom Build Command

**What to check:**
- Does this field have ANY value? (even if it looks correct)
- If YES → **DELETE IT** (make it empty/blank)
- If NO → ✅ Good, Railway will use railway.json

**Why:** If it has the OLD build command (without shared-ui), Railway uses that instead of your fixed railway.json!

### 2. Custom Start Command  

**Location:** Deploy → Custom Start Command

**What to check:**
- Does this field have ANY value?
- If YES → **DELETE IT** (make it empty/blank)
- If NO → ✅ Good, Railway will use railway.json

---

## 📋 Step-by-Step Fix

### For Official Notice Service:

1. **Go to:** Build → Custom Build Command
   - **If it shows:** `npm install && npm run build -w official-notice-web` (or any value)
   - **ACTION:** Click the field, DELETE all text, leave it EMPTY
   - **Save**

2. **Go to:** Deploy → Custom Start Command
   - **If it shows:** `npm run start -w official-notice-web` (or any value)
   - **ACTION:** Click the field, DELETE all text, leave it EMPTY
   - **Save**

3. **Verify:** Config-as-code → Railway Config File
   - Should show: `official-notice-web/railway.json` OR be empty (auto-detect)
   - If wrong path, fix it

4. **Trigger Rebuild:**
   - Click "Deploy" or "Redeploy"
   - Railway will now read from railway.json

---

## ✅ Expected Configuration

### Build Section:
```
Builder: Railpack (or NIXPACKS)
Custom Build Command: [EMPTY/BLANK] ← Must be empty!
Watch Paths: [Can be empty]
```

### Deploy Section:
```
Custom Start Command: [EMPTY/BLANK] ← Must be empty!
Healthcheck Path: [Can be empty]
```

### Config-as-code Section:
```
Railway Config File: official-notice-web/railway.json
OR
Railway Config File: [EMPTY - auto-detect]
```

---

## 🎯 Why This Fixes It

**Before (with override):**
- Dashboard has: `npm install && npm run build -w official-notice-web`
- Railway uses dashboard (ignores railway.json)
- ❌ Missing shared-ui build → Build fails

**After (no override):**
- Dashboard fields are empty
- Railway reads: `official-notice-web/railway.json`
- ✅ Build command: `npm install && npm run build -w shared-ui && npm run build -w official-notice-web`
- ✅ Build succeeds!

---

## 📋 Repeat for All Failed Services

Do this for:
- [ ] Official Notice
- [ ] Site Health  
- [ ] URPA
- [ ] 4projects
- [ ] 4calls
- [ ] 4process

**For each:**
1. Clear Custom Build Command
2. Clear Custom Start Command
3. Verify Railway Config File path
4. Trigger rebuild

---

## ✅ Verification

After clearing overrides and rebuilding:

**Build logs should show:**
```
Running: npm install
Running: npm run build -w shared-ui
Running: npm run build -w official-notice-web
```

**If you still see:**
```
Running: npm install
Running: npm run build -w official-notice-web
(without shared-ui)
```
→ Dashboard override is still active!

---

## 🎯 Summary

**Root directory is correct (`/`), but dashboard overrides are likely preventing Railway from using your fixed railway.json file!**

**Fix:** Clear Custom Build Command and Custom Start Command fields in dashboard for all 6 failed services.
