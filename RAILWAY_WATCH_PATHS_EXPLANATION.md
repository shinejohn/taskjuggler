# Railway Watch Paths - Rebuild Control

## ✅ Fix Applied: Added Watch Paths to All Services

All services now have explicit `watchPaths` configuration in `railway.json`:

```json
{
  "build": {
    "watchPaths": [
      "<service>/**",
      "shared-ui/**"
    ]
  }
}
```

## 🎯 How This Works

### Before (Without Watch Paths):

**Change:** `scanner-web/src/Dashboard.vue`

**Railway Behavior:**
- ⚠️ **Unpredictable** - May rebuild all services or just scanner-web
- ⚠️ Depends on Railway's smart detection
- ⚠️ May rebuild unnecessarily

### After (With Watch Paths):

**Change:** `scanner-web/src/Dashboard.vue`

**Railway Behavior:**
- ✅ **Only rebuilds:** scanner-web service
- ✅ **Other services:** NOT rebuilt
- ✅ **Predictable** - Explicit rules

## 📊 Rebuild Scenarios

### Scenario 1: Change in One App
**Change:** `official-notice-web/src/App.vue`

**Rebuilds:**
- ✅ Official Notice only
- ❌ Other services NOT rebuilt

### Scenario 2: Change in Shared UI
**Change:** `shared-ui/src/components/Button.vue`

**Rebuilds:**
- ✅ **ALL services** (because all depend on shared-ui)
- ✅ This is expected and correct!

### Scenario 3: Change in Another App
**Change:** `scanner-web/src/Dashboard.vue`

**Rebuilds:**
- ✅ Scanner-web only
- ❌ Official Notice NOT rebuilt
- ❌ Other services NOT rebuilt

### Scenario 4: Change in Root Files
**Change:** `package.json` or `monorepo-build.sh`

**Rebuilds:**
- ⚠️ **May rebuild all** (root files affect all workspaces)
- This is expected for root-level changes

## ✅ Benefits

1. **Precise Control** - Only rebuilds what's necessary
2. **Faster Builds** - Avoids unnecessary rebuilds
3. **Cost Savings** - Fewer build minutes used
4. **Predictable** - Clear rules for when services rebuild

## 📋 Summary

**Question:** Will one code change trigger all builds?

**Answer:** 
- ✅ **No** - Changes in one app only rebuild that app
- ✅ **Yes** - Changes in shared-ui rebuild all apps (expected)
- ✅ **Maybe** - Changes in root files may rebuild all (expected)

**With watchPaths configured, rebuilds are now precise and predictable!**
