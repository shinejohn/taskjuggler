# Railway Dashboard Configuration Guide
## Step-by-Step Instructions for Fixing All Services

**Date:** February 4, 2026  
**Purpose:** Manual configuration steps required in Railway dashboard to fix build failures

---

## ⚠️ CRITICAL: Root Directory Configuration

**The most important fix:** All frontend services MUST have their root directory set to the monorepo root (`/`) in Railway dashboard.

---

## Configuration Steps for Each Service

### Service 1: taskjuggler-web

1. **Open Railway Dashboard**
2. **Navigate to:** Project → "AI Tools" → Service "taskjuggler-web"
3. **Go to:** Settings → Source
4. **Set Root Directory:** `/` (monorepo root)
5. **Verify GitHub Connection:**
   - Repository: Should be connected to your GitHub repo
   - Branch: Should be `main` (or your default branch)
6. **Save Changes**
7. **Trigger Rebuild:** Click "Deploy" or "Redeploy"

---

### Service 2: Idea Circuit (ideacircuit-web)

1. **Navigate to:** Service "Idea Circuit"
2. **Go to:** Settings → Source
3. **Set Root Directory:** `/` (monorepo root)
4. **Verify GitHub Connection**
5. **Save Changes**
6. **Trigger Rebuild**

**Note:** railway.json has been fixed to use `ideacircuit-web` workspace name.

---

### Service 3: Official Notice (official-notice-web)

1. **Navigate to:** Service "Official Notice"
2. **Go to:** Settings → Source
3. **Set Root Directory:** `/` (monorepo root)
4. **Verify GitHub Connection**
5. **Save Changes**
6. **Trigger Rebuild**

---

### Service 4: Site Health (scanner-web)

1. **Navigate to:** Service "Site Health"
2. **Go to:** Settings → Source
3. **Set Root Directory:** `/` (monorepo root)
4. **Verify GitHub Connection**
5. **Save Changes**
6. **Trigger Rebuild**

---

### Service 5: URPA (urpa-web)

1. **Navigate to:** Service "URPA"
2. **Go to:** Settings → Source
3. **Set Root Directory:** `/` (monorepo root)
4. **Verify GitHub Connection**
5. **Save Changes**
6. **Trigger Rebuild**

---

### Service 6: 4projects (projects-web)

1. **Navigate to:** Service "4projects"
2. **Go to:** Settings → Source
3. **Set Root Directory:** `/` (monorepo root)
4. **Verify GitHub Connection**
5. **Save Changes**
6. **Trigger Rebuild**

---

### Service 7: 4calls (coordinator-web)

1. **Navigate to:** Service "4calls"
2. **Go to:** Settings → Source
3. **Set Root Directory:** `/` (monorepo root)
4. **Verify GitHub Connection**
5. **Save Changes**
6. **Trigger Rebuild**

**Note:** railway.json has been fixed to use `coordinator-web` workspace name (was `4calls-ai-web`).

---

### Service 8: 4process (process-web)

1. **Navigate to:** Service "4process"
2. **Go to:** Settings → Source
3. **Set Root Directory:** `/` (monorepo root)
4. **Verify GitHub Connection**
5. **Save Changes**
6. **Trigger Rebuild**

---

## GitHub Integration Verification

### For Each Service:

1. **Check GitHub Connection:**
   - Settings → Source
   - Verify repository URL is correct
   - Verify branch is `main` (or correct branch)

2. **Check Webhook:**
   - Go to GitHub repository → Settings → Webhooks
   - Find Railway webhook
   - Check recent deliveries
   - Verify webhook is active and delivering successfully

3. **Test Auto-Build:**
   - Make a small change (e.g., add comment to README)
   - Commit and push to `main` branch
   - Verify Railway triggers build automatically
   - Verify build succeeds

---

## Troubleshooting

### Issue: "Root Directory" Option Not Visible

**If you don't see Root Directory setting:**

1. **Check Railway Documentation:** Railway may have changed UI
2. **Contact Railway Support:** Ask about monorepo root directory configuration
3. **Alternative:** Use Railway CLI or API to set root directory

### Issue: Build Still Fails After Configuration

**Check Build Logs:**

1. **Open Service → Deployments → Latest Build**
2. **Check for errors:**
   - "Workspace not found" → Root directory not set correctly
   - "npm ERR!" → Dependency or build script issue
   - "Command failed" → Build command syntax error

**Common Fixes:**

- Verify root directory is `/`
- Verify workspace name matches directory name
- Check that shared-ui builds successfully
- Verify npm install completes

### Issue: GitHub Not Triggering Builds

**Check:**

1. **Webhook Status:** GitHub → Settings → Webhooks → Railway webhook
2. **Recent Deliveries:** Check if webhook is being called
3. **Railway Connection:** Service → Settings → Source → GitHub connection

**Fix:**

1. **Reconnect GitHub:** Disconnect and reconnect GitHub repository
2. **Recreate Webhook:** Delete and recreate webhook
3. **Check Permissions:** Ensure Railway has access to repository

---

## Quick Checklist

### For Each Frontend Service:

- [ ] Root Directory set to `/` (monorepo root)
- [ ] GitHub repository connected
- [ ] Branch set to `main` (or correct branch)
- [ ] railway.json updated (already done)
- [ ] Manual rebuild triggered
- [ ] Build succeeds
- [ ] Service is online
- [ ] GitHub auto-build works (test with commit)

---

## Verification Commands

### After Configuration, Verify:

```bash
# Check Railway service status (if CLI installed)
railway status

# Or check Railway dashboard for:
# - Build status: Should be "Success"
# - Service status: Should be "Online"
# - Health checks: Should be passing
```

---

## Expected Results

### After All Fixes:

- ✅ All 8 frontend services building successfully
- ✅ All services deploying successfully
- ✅ All services online and accessible
- ✅ GitHub integration working (auto-builds on push)
- ✅ Build times reasonable (< 10 minutes per service)

---

## Next Steps After Configuration

1. **Monitor Builds:** Watch first few builds to ensure they succeed
2. **Test Applications:** Verify each app is accessible and working
3. **Test GitHub Integration:** Make test commit, verify auto-build
4. **Document Any Issues:** Note any remaining problems
5. **Optimize:** Once stable, optimize build times if needed

---

**Status:** Ready for Manual Configuration  
**Last Updated:** February 4, 2026  
**Priority:** P0 - Critical
