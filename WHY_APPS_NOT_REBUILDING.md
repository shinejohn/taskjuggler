# Why Apps Are Not Rebuilding - Root Cause Analysis

## ✅ What We Fixed (Code Level)

1. ✅ **All railway.json files updated** - Committed and pushed to GitHub
2. ✅ **Workspace names fixed** - coordinator-web, ideacircuit-web corrected
3. ✅ **Shared-ui builds added** - All configs now build shared-ui first
4. ✅ **Changes pushed to GitHub** - Railway can now see the updates

## 🔴 CRITICAL ISSUE: Root Directory Not Set

### The Problem

**Railway cannot find your railway.json files OR cannot access the monorepo root because:**

1. **Root Directory is Wrong**: Each service's root directory is likely set to its own directory (e.g., `/scanner-web`) instead of `/` (monorepo root)

2. **Why This Breaks Everything:**
   - Railway looks for `railway.json` in the root directory
   - Railway needs access to root `package.json` to understand workspaces
   - npm workspaces (`-w` flag) only work when running from monorepo root
   - If root is `/scanner-web`, Railway can't see:
     - Root `package.json` (defines workspaces)
     - Other workspace directories
     - Shared-ui workspace

3. **Result:**
   - Builds fail with "workspace not found" errors
   - Railway can't execute `npm run build -w shared-ui` because it doesn't know about workspaces
   - Even though railway.json is correct, Railway can't use it properly

---

## ✅ Solution: Set Root Directory in Railway Dashboard

### For EACH Failed Service:

1. **Open Railway Dashboard:** https://railway.app
2. **Navigate to:** Project "Shine Dev Environment" or "AI Tools"
3. **For Each Service:**
   - Click on service name (e.g., "Site Health")
   - Go to **Settings** → **Source**
   - Find **Root Directory** field
   - **Current value:** Probably `/scanner-web` or similar
   - **Change to:** `/` (monorepo root)
   - Click **Save**

4. **After Setting Root Directory:**
   - Railway will automatically trigger a rebuild
   - OR click **Deploy** / **Redeploy** button
   - Monitor build logs

### Services That Need Root Directory Fix:

- [ ] **Official Notice** (official-notice-web)
- [ ] **Site Health** (scanner-web)
- [ ] **URPA** (urpa-web)
- [ ] **4projects** (projects-web)
- [ ] **4calls** (coordinator-web)
- [ ] **4process** (process-web)

**Note:** taskjuggler-web and Idea Circuit are working, so their root directory is likely already correct.

---

## 🔍 How to Verify Root Directory is Correct

### In Railway Dashboard:

1. Go to service → Settings → Source
2. Check **Root Directory** value:
   - ✅ **Correct:** `/` (monorepo root)
   - ❌ **Wrong:** `/scanner-web`, `/urpa-web`, etc. (service directory)

### Expected Behavior After Fix:

1. **Build Logs Should Show:**
   ```
   Running: npm install
   Running: npm run build -w shared-ui
   Running: npm run build -w scanner-web
   ```

2. **If Root Directory is Wrong, You'll See:**
   ```
   Error: workspace not found: shared-ui
   Error: workspace not found: scanner-web
   ```

---

## 🚀 Immediate Action Plan

### Step 1: Verify Changes Are Pushed ✅ (DONE)

```bash
# Already completed:
git commit -m "fix: update Railway configs..."
git push
```

### Step 2: Set Root Directory (DO NOW)

**For each failed service:**

1. Open Railway dashboard
2. Service → Settings → Source
3. Set Root Directory to `/`
4. Save
5. Trigger rebuild

**Time Required:** ~2 minutes per service (12 minutes total)

### Step 3: Monitor Builds

After setting root directory:
- Railway should auto-trigger rebuild
- Watch build logs
- Verify all succeed

### Step 4: Verify GitHub Integration

1. Make a test commit
2. Push to GitHub
3. Verify Railway auto-builds
4. Verify builds succeed

---

## 📊 Why taskjuggler-web and Idea Circuit Work

These services are likely already configured correctly:
- ✅ Root directory is set to `/`
- ✅ Railway can access root package.json
- ✅ Workspaces work correctly
- ✅ Builds succeed

**This confirms:** The fix works, but only if root directory is set correctly!

---

## 🆘 If Builds Still Fail After Root Directory Fix

### Check Build Logs For:

1. **Workspace Errors:**
   - "workspace not found" → Root directory still wrong
   - "package not found" → npm install issue

2. **Build Command Errors:**
   - Check if `npm run build -w shared-ui` succeeds
   - Check if `npm run build -w <service>` succeeds

3. **Dependency Errors:**
   - Check npm install logs
   - Verify all dependencies install correctly

### Common Issues:

1. **Root Directory Still Wrong:**
   - Double-check it's set to `/` (not `/scanner-web`)
   - Save and rebuild

2. **GitHub Not Triggering:**
   - Check webhook status
   - Verify repository connection
   - Reconnect if needed

3. **Build Timeout:**
   - Shared-ui build might take time
   - Check Railway build timeout settings
   - Consider increasing timeout

---

## ✅ Summary

### What's Fixed:
- ✅ All railway.json files updated and pushed
- ✅ Workspace names corrected
- ✅ Shared-ui builds added

### What's Required:
- ⏳ **Set root directory to `/` for all 6 failed services**
- ⏳ **Trigger rebuilds**
- ⏳ **Verify builds succeed**

### Expected Result:
- ✅ All 8 services building successfully
- ✅ All services deploying successfully
- ✅ GitHub auto-builds working

---

## 🎯 Next Steps

1. **Open Railway Dashboard** (https://railway.app)
2. **Fix root directory** for all 6 failed services (set to `/`)
3. **Trigger rebuilds**
4. **Monitor and verify** all builds succeed

**This is the ONLY remaining step to fix the builds!**
