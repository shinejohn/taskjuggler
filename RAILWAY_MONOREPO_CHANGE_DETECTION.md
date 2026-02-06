# Railway Monorepo Change Detection - How It Works

## 🔍 Current Setup Analysis

### Configuration:
- **Root Directory:** `/` (monorepo root) for all services
- **railway.json:** Located in each service directory (e.g., `official-notice-web/railway.json`)
- **GitHub Integration:** Connected, auto-builds on push

## ❓ Question: Will One Code Change Trigger All Builds?

### Answer: **It Depends on Railway's Change Detection**

Railway has two modes of operation:

### Mode 1: Smart Change Detection (Default Behavior)

**Railway automatically detects which services need rebuilding:**

- ✅ **If you change:** `official-notice-web/src/App.vue`
  - Railway detects change in `official-notice-web/` directory
  - **Only rebuilds:** Official Notice service
  - Other services are NOT rebuilt

- ✅ **If you change:** `shared-ui/src/components/Button.vue`
  - Railway detects change in `shared-ui/` directory
  - **Rebuilds:** All services that depend on shared-ui
  - Since all services depend on shared-ui, **all services rebuild**

- ✅ **If you change:** Root `package.json` or `package-lock.json`
  - Railway detects root-level change
  - **Rebuilds:** All services (affects all workspaces)

### Mode 2: Watch Paths (If Configured)

**You can configure explicit watch paths in railway.json:**

```json
{
  "build": {
    "watchPaths": [
      "official-notice-web/**",
      "shared-ui/**"
    ]
  }
}
```

**Current Status:**
- ❌ No watch paths configured
- Railway uses **default smart detection**

## 📊 Expected Behavior with Current Setup

### Scenario 1: Change in One App
**Change:** `scanner-web/src/Dashboard.vue`

**Railway Behavior:**
- Detects change in `scanner-web/` directory
- **Rebuilds:** Only scanner-web service
- **Other services:** NOT rebuilt ✅

### Scenario 2: Change in Shared UI
**Change:** `shared-ui/src/components/Button.vue`

**Railway Behavior:**
- Detects change in `shared-ui/` directory
- **Rebuilds:** All services (since all depend on shared-ui)
- **Reason:** All services have `"@taskjuggler/ui": "file:../shared-ui"` dependency

### Scenario 3: Change in Root Files
**Change:** `package.json` or `monorepo-build.sh`

**Railway Behavior:**
- Detects root-level change
- **Rebuilds:** All services
- **Reason:** Affects all workspaces

### Scenario 4: Change in railway.json
**Change:** `official-notice-web/railway.json`

**Railway Behavior:**
- Detects change in service's railway.json
- **Rebuilds:** Only Official Notice service ✅

## ✅ Recommendation: Add Watch Paths for Precision

To ensure Railway only rebuilds what's necessary, add `watchPaths` to each railway.json:

### Example for official-notice-web:

```json
{
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "npm install && npm run build -w shared-ui && npm run build -w official-notice-web",
    "watchPaths": [
      "official-notice-web/**",
      "shared-ui/**"
    ]
  }
}
```

**This ensures:**
- ✅ Changes in `official-notice-web/` → Rebuild Official Notice
- ✅ Changes in `shared-ui/` → Rebuild Official Notice (needs shared-ui)
- ✅ Changes in other apps → Do NOT rebuild Official Notice

## 🎯 Current Behavior (Without Watch Paths)

**Railway's default behavior:**
- ✅ **Smart detection** - Usually only rebuilds affected services
- ⚠️ **May rebuild all** - If change is ambiguous (root files, shared-ui)
- ⚠️ **Not guaranteed** - Behavior can vary

**With watch paths:**
- ✅ **Explicit control** - Only rebuilds when specified paths change
- ✅ **More predictable** - Clear rules for when services rebuild
- ✅ **Faster builds** - Avoids unnecessary rebuilds

## 📋 Summary

### Current Setup (No Watch Paths):
- ✅ Railway uses smart change detection
- ✅ Usually only rebuilds affected services
- ⚠️ May rebuild all if shared-ui or root files change
- ⚠️ Behavior not guaranteed

### Recommended Setup (With Watch Paths):
- ✅ Explicit control over rebuild triggers
- ✅ More predictable behavior
- ✅ Faster builds (fewer unnecessary rebuilds)
- ✅ Better for monorepo management

---

## 🚀 Next Steps

**Option 1: Keep Current Setup**
- Railway's smart detection usually works
- May rebuild all services when shared-ui changes (expected)
- Simpler configuration

**Option 2: Add Watch Paths**
- More explicit and predictable
- Better control over rebuilds
- Recommended for production

**Recommendation:** Add watch paths for production reliability.
