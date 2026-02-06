# 🚨 FIX THE API SERVER NOW - 2 CLICKS

## The Problem
Railway is reading from **ROOT directory** (`/`) instead of `taskjuggler-api/`, so it:
- Finds `package.json` in root → thinks it's Node.js
- Uses Railpack instead of NIXPACKS
- Never reads `taskjuggler-api/railway.json`

## The Fix (2 Settings)

### Go to Railway Dashboard:
1. **Fibonacco AI Tools** project
2. **ai-tools-api** service  
3. **Settings** tab

### Change These 2 Things:

#### 1. Builder Setting
- **Current:** "Railpack (Default)" ❌
- **Change to:** "NIXPACKS" ✅
- **Location:** Settings → Build → Builder dropdown

#### 2. Root Directory Setting  
- **Current:** `/` (empty or root) ❌
- **Change to:** `taskjuggler-api` ✅
- **Location:** Settings → Build → Root Directory input

### Then:
- Click **Save**
- Go to **Deployments** → **Redeploy**

## Why This Works

When Root Directory = `taskjuggler-api`:
- ✅ Railway reads from `taskjuggler-api/` directory
- ✅ Finds `composer.json` → knows it's PHP
- ✅ Finds `railway.json` → uses NIXPACKS
- ✅ Finds `nixpacks.toml` → builds PHP correctly
- ✅ Installs PHP 8.2, Composer, runs migrations, starts server

When Root Directory = `/` (current):
- ❌ Railway reads from root
- ❌ Finds root `package.json` → thinks Node.js
- ❌ Uses Railpack → tries to build as workspace → FAILS

## That's It!

These 2 dashboard settings override everything. The code is already correct - Railway just needs to read from the right directory.
