# Railway Root Directory Configuration Guide

## 📁 File Structure

Based on your file structure:

```
/Users/johnshine/Dropbox/Fibonacco/taskjuggler/Code/
├── package.json          ← Root package.json (defines workspaces)
├── node_modules/         ← Root node_modules
├── shared-ui/            ← Shared UI workspace
├── taskjuggler-api/      ← Backend API
├── taskjuggler-web/      ← Frontend app
├── ideacircuit-web/      ← Frontend app
├── official-notice-web/  ← Frontend app
├── scanner-web/          ← Frontend app
├── urpa-web/             ← Frontend app
├── projects-web/         ← Frontend app
├── coordinator-web/       ← Frontend app
└── process-web/          ← Frontend app
```

## 🎯 Root Directory Setting

### If GitHub Repository Root = `Code` directory:

**Root Directory:** `/` (monorepo root)

**Why:**
- Root `package.json` is at `/Code/package.json`
- Workspaces are defined in root `package.json`
- `npm install` needs to run from root to resolve workspaces
- All `railway.json` files reference workspaces relative to root

### If GitHub Repository Root = `taskjuggler` directory:

**Root Directory:** `/Code` (relative to repo root)

**Why:**
- Root `package.json` would be at `/Code/package.json` relative to repo
- Railway needs to know where the monorepo root is

## ✅ How to Determine

### Check 1: Where is `.git` folder?
```bash
cd /Users/johnshine/Dropbox/Fibonacco/taskjuggler/Code
ls -la .git
```

- **If `.git` exists in `Code/`:** Repository root = `Code`, use `/`
- **If `.git` exists in `taskjuggler/`:** Repository root = `taskjuggler`, use `/Code`

### Check 2: What does GitHub show?
- Go to your GitHub repository
- Check if `package.json` is at the root level
- If yes → Root Directory = `/`
- If it's in a `Code/` subfolder → Root Directory = `/Code`

## 🔍 Current Working Services

**taskjuggler-web** and **ideacircuit-web** are working, which means:
- Their root directory is set correctly
- Check what their root directory is set to in Railway dashboard
- Use the same setting for all other services

## 📋 Railway Dashboard Configuration

### For Each Service:

1. **Open Railway Dashboard**
2. **Navigate to Service** (e.g., "Official Notice")
3. **Go to:** Settings → Source
4. **Find:** Root Directory field
5. **Set to:** 
   - `/` if repo root is `Code` directory
   - `/Code` if repo root is `taskjuggler` directory
6. **Save**

## ✅ Verification

After setting root directory, Railway build logs should show:

```
Running from: /app (or /app/Code if root is /Code)
Found package.json: ✓
Found workspaces: ✓
Running: npm install
Running: npm run build -w shared-ui
Running: npm run build -w <service>
```

## 🎯 Most Likely Answer

**Based on standard monorepo structure: Root Directory = `/`**

This means Railway starts from the `Code` directory where:
- Root `package.json` exists
- Workspaces are defined
- `npm install` can resolve all workspaces
