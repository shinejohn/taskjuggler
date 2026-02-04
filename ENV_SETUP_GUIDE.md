# AI Tools Platform - Environment Setup Quick Guide

## 📋 What I Created for You

### 1. **AI_TOOLS_ENV_VARIABLES.md**
Complete documentation of all environment variables:
- ✅ Database configuration (Postgres - AI TOOLs)
- ✅ Redis/Valkey configuration
- ✅ Shared platform variables
- ✅ Service-specific variables
- ✅ What's different from Publishing platform
- ✅ What's NOT needed from Publishing

### 2. **setup-ai-tools-env.sh**
Automated script to set everything up in one command.

---

## 🚀 Quick Start

### Step 1: Rename the Service (Manual)

In Railway Dashboard:
1. Go to: https://railway.app/project/7e7372dd-373a-4e78-a51e-15eab332b67d
2. Click on `taskjuggler` service
3. Settings → Service Name → Change to: `ai-tools-api`
4. Save

### Step 2: Run the Setup Script

```bash
cd /Users/johnshine/Dropbox/Fibonacco/taskjuggler/Code
./setup-ai-tools-env.sh
```

This will automatically:
- ✅ Set all shared variables (database, Redis, core settings)
- ✅ Generate a new APP_KEY for the API
- ✅ Configure all 6 frontend services with the new API URL
- ✅ Set platform-specific variables

### Step 3: Create Missing Services

Manually create these 3 services in Railway:

#### taskjuggler-web
```
Service Name: taskjuggler-web
Root Directory: taskjuggler-web
Variables:
  VITE_API_URL=https://ai-tools-api-production.up.railway.app
  NODE_ENV=production
  APP_NAME=TaskJuggler
  VITE_APP_NAME=TaskJuggler
```

#### coordinator
```
Service Name: coordinator
Root Directory: coordinator-web
Variables:
  VITE_API_URL=https://ai-tools-api-production.up.railway.app
  NODE_ENV=production
  APP_NAME=Coordinator
  VITE_APP_NAME=Coordinator
```

#### official-notice
```
Service Name: official-notice
Root Directory: official-notice-web
Variables:
  VITE_API_URL=https://ai-tools-api-production.up.railway.app
  NODE_ENV=production
  APP_NAME=Official Notice
  VITE_APP_NAME=Official Notice
```

---

## 🔍 Key Differences from Publishing Platform

### ✅ Included (AI Tools Specific)
- Postgres - AI TOOLs database (different from Publishing)
- Valkey Redis instance
- Workspace features enabled
- Password authentication enabled
- No multisite domains (single platform)

### ❌ Excluded (Not Needed)
- Inertia.js SSR (we use API architecture)
- News workflow AI models
- Scraping services (ScrapingBee, SerpAPI)
- Unsplash integration
- Multisite domain variables
- Nightwatch monitoring (optional)

### 🔄 Modified
- `APP_URL` points to ai-tools-api (not individual domains)
- `VITE_API_URL` for frontends (not Inertia)
- Single database (not multisite shared DB)

---

## 📊 Complete Service List

After setup, you'll have:

### Infrastructure (2)
- Postgres - AI TOOLs
- Valkey

### Backend (1)
- ai-tools-api (renamed from taskjuggler)

### Frontend (9)
- taskjuggler-web (needs creation)
- 4Doctors ✅
- URPA ✅
- 4process ✅
- 4projects ✅
- Site Health ✅
- Idea Circuit ✅
- coordinator (needs creation)
- official-notice (needs creation)

---

## ✅ Verification Commands

### Check Variables Were Set
```bash
# Check API service
railway variables --service ai-tools-api

# Check a frontend service
railway variables --service 4Doctors

# Check database connection
railway run --service ai-tools-api "php artisan tinker --execute='echo DB::connection()->getDatabaseName();'"
```

### Test Connections
```bash
# Test database
railway run --service ai-tools-api "php artisan migrate:status"

# Test Redis
railway run --service ai-tools-api "php artisan tinker --execute='Cache::put(\"test\", \"works\", 60); echo Cache::get(\"test\");'"
```

---

## 🎯 Success Criteria

After running the setup:

- [ ] ai-tools-api service renamed
- [ ] All shared variables set
- [ ] Database connection works
- [ ] Redis connection works
- [ ] All 6 existing frontends updated with new API URL
- [ ] 3 new frontend services created
- [ ] All services deploy successfully
- [ ] Migrations run successfully

---

## 📞 If Something Goes Wrong

### Service Not Found Error
If you get "service not found" for ai-tools-api:
- You need to rename `taskjuggler` to `ai-tools-api` first
- Then re-run the script

### Variable Not Set
```bash
# Set individual variable
railway variables --service ai-tools-api --set "VARIABLE_NAME=value"
```

### Check Current Variables
```bash
# List all variables for a service
railway variables --service ai-tools-api --json | jq
```

---

**Everything is ready! Just rename the service and run the script.** 🚀
