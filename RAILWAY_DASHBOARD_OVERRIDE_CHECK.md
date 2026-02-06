# Railway Dashboard Configuration Check

## ✅ What's CORRECT in Your Dashboard:

1. **Root Directory:** `/` ✅ CORRECT - This is the monorepo root
2. **Source Repo:** `shinejohn/taskjuggler` ✅ CORRECT
3. **Branch:** `main` ✅ CORRECT
4. **GitHub Integration:** Connected ✅ CORRECT

## ⚠️ CRITICAL: Check These Settings

### 1. Custom Build Command

**In Railway Dashboard → Build → Custom Build Command:**

- ✅ **CORRECT:** Leave this EMPTY/BLANK (Railway will use `railway.json`)
- ❌ **WRONG:** If it has any value, it OVERRIDES `railway.json` and will break builds

**What to check:**
- Go to: Build → Custom Build Command
- If it shows: `npm install && npm run build -w official-notice-web` (without shared-ui)
- **DELETE IT** - Let Railway use `railway.json` instead

**Expected:** Field should be empty/blank

### 2. Custom Start Command

**In Railway Dashboard → Deploy → Custom Start Command:**

- ✅ **CORRECT:** Leave this EMPTY/BLANK (Railway will use `railway.json`)
- ❌ **WRONG:** If it has any value, it OVERRIDES `railway.json`

**What to check:**
- Go to: Deploy → Custom Start Command
- If it has any value, **DELETE IT** - Let Railway use `railway.json`

**Expected:** Field should be empty/blank

### 3. Railway Config File Path

**In Railway Dashboard → Config-as-code → Railway Config File:**

- ✅ **CORRECT:** Should be `official-notice-web/railway.json` OR empty (Railway auto-detects)
- ❌ **WRONG:** If it's set to wrong path or missing

**What to check:**
- Go to: Config-as-code → Railway Config File
- Should show: `official-notice-web/railway.json` OR be empty
- If empty, Railway should auto-detect it

---

## 🔍 How Railway Reads Config

Railway reads config in this priority order:

1. **Dashboard Overrides** (Custom Build Command, Custom Start Command) - HIGHEST PRIORITY
2. **railway.json file** - Used if dashboard fields are empty
3. **Auto-detection** - Falls back if no config file

**Problem:** If Custom Build Command is set in dashboard, Railway IGNORES railway.json!

---

## ✅ Correct Configuration

### Build Section:
- **Builder:** Railpack (or NIXPACKS) ✅
- **Custom Build Command:** EMPTY/BLANK ✅
- **Watch Paths:** Can be empty ✅

### Deploy Section:
- **Custom Start Command:** EMPTY/BLANK ✅
- **Healthcheck Path:** Can be empty ✅

### Config-as-code Section:
- **Railway Config File:** `official-notice-web/railway.json` OR empty (auto-detect) ✅

---

## 🚨 Most Likely Issue

**Custom Build Command is probably set in dashboard and overriding railway.json!**

**Fix:**
1. Go to: Build → Custom Build Command
2. **DELETE** any value there
3. Leave it EMPTY/BLANK
4. Save
5. Railway will now use `railway.json` which has the correct shared-ui build

---

## 📋 Checklist for Official Notice Service

- [ ] Root Directory = `/` ✅ (Already correct)
- [ ] Custom Build Command = EMPTY/BLANK ⚠️ CHECK THIS
- [ ] Custom Start Command = EMPTY/BLANK ⚠️ CHECK THIS
- [ ] Railway Config File = `official-notice-web/railway.json` OR empty ⚠️ CHECK THIS
- [ ] Source Repo = `shinejohn/taskjuggler` ✅ (Already correct)
- [ ] Branch = `main` ✅ (Already correct)

---

## 🎯 Action Required

**For Official Notice service:**

1. Go to: Build → Custom Build Command
2. **DELETE** any value (make it empty)
3. Save
4. Go to: Deploy → Custom Start Command
5. **DELETE** any value (make it empty)
6. Save
7. Trigger rebuild

**Repeat for all 6 failed services:**
- Official Notice
- Site Health
- URPA
- 4projects
- 4calls
- 4process

---

## ✅ Expected Result

After clearing dashboard overrides:
- Railway will read `railway.json` from `official-notice-web/railway.json`
- Build command will be: `npm install && npm run build -w shared-ui && npm run build -w official-notice-web`
- Start command will be: `npm run start -w official-notice-web`
- Build should succeed!
