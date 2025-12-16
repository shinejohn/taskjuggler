# Railway Setup Guide - "Fibonacco AI" Project

## Current Status

✅ **Project:** "Fibonacco AI" (linked)  
✅ **Databases:** PostgreSQL (3 - need to clean up to 1), Redis (1)  
✅ **Configuration Files:** Ready  
⚠️ **Services:** None yet (need to connect GitHub repos)

## Important Note

Railway CLI cannot create services directly - they're created when you connect GitHub repositories in the Railway dashboard. The CLI is used to:
- Link to existing services
- Set environment variables
- Generate domains
- Run commands

## Setup Steps

### Phase 1: Clean Up Databases ✅ (Do This First)

**In Railway Dashboard:**
1. Delete `Postgres-4f8P` → Settings → Delete Service
2. Delete `Postgres-vc_Z` → Settings → Delete Service
3. **Keep:** `Postgres` (the clean one)
4. **Keep:** `Redis`

### Phase 2: Connect API Repository (Dashboard Required)

**In Railway Dashboard:**
1. Go to "Fibonacco AI" project
2. Click **"New"** → **"GitHub Repo"**
3. Select repository: `shinejohn/taskjuggler`
4. Railway will:
   - Create a service automatically
   - Auto-detect build settings from `railway.json` and `Procfile`
   - Auto-deploy

**After service is created, link and configure via CLI:**
```bash
cd taskjuggler-api
railway service  # Select the service that was just created

# Set environment variables
railway variables --set APP_NAME="Fibonacco AI" \
  --set APP_ENV=production \
  --set APP_DEBUG=false \
  --set LOG_CHANNEL=stderr \
  --set LOG_LEVEL=info \
  --set DB_CONNECTION=pgsql \
  --set CACHE_STORE=redis \
  --set SESSION_DRIVER=redis \
  --set QUEUE_CONNECTION=redis \
  --set MODULE_TASKS_ENABLED=true \
  --set MODULE_PROCESSES_ENABLED=false \
  --set MODULE_PROJECTS_ENABLED=false
```

**Note:** DATABASE_URL and REDIS_URL are automatically injected by Railway.

### Phase 3: Create Worker Service (Dashboard Required)

**In Railway Dashboard:**
1. Click **"New"** → **"GitHub Repo"**
2. Select the **same** repository: `shinejohn/taskjuggler`
3. In service settings, rename to: `api-worker`
4. Go to **Deploy** → **Start Command**: `worker`

**Then via CLI:**
```bash
cd taskjuggler-api
railway service  # Link to api-worker service

# Set environment variables (same as api-web)
railway variables --set APP_NAME="Fibonacco AI Worker" \
  --set APP_ENV=production \
  --set APP_DEBUG=false \
  --set LOG_CHANNEL=stderr \
  --set DB_CONNECTION=pgsql \
  --set CACHE_STORE=redis \
  --set QUEUE_CONNECTION=redis
```

### Phase 4: Create Scheduler Service (Dashboard Required)

**In Railway Dashboard:**
1. Click **"New"** → **"GitHub Repo"**
2. Select the **same** repository: `shinejohn/taskjuggler`
3. In service settings, rename to: `api-scheduler`
4. Go to **Deploy** → **Start Command**: `scheduler`

**Then via CLI:**
```bash
cd taskjuggler-api
railway service  # Link to api-scheduler service

railway variables --set APP_NAME="Fibonacco AI Scheduler" \
  --set APP_ENV=production \
  --set APP_DEBUG=false \
  --set LOG_CHANNEL=stderr \
  --set DB_CONNECTION=pgsql \
  --set CACHE_STORE=redis \
  --set QUEUE_CONNECTION=redis
```

### Phase 5: Generate API Domain (CLI Ready)

After API web service is deployed:

```bash
cd taskjuggler-api
railway service  # Link to api-web service
railway domain generate
```

Or via dashboard: Service → Settings → Networking → Generate Domain

**Save the domain URL** (e.g., `https://api-web-production.up.railway.app`)

### Phase 6: Connect Frontend Repository (Dashboard Required)

**In Railway Dashboard:**
1. Click **"New"** → **"GitHub Repo"**
2. Select repository: `shinejohn/taskjuggler` 
   - **Note:** Since both repos point to same GitHub repo, you may need to specify a subdirectory or Railway will auto-detect
3. Railway will auto-detect it's a Vue/Vite project

**Then via CLI:**
```bash
cd taskjuggler-web
railway link --project "Fibonacco AI"  # Or use project ID
railway service  # Link to the frontend service

# Set environment variables (use API domain from Phase 5)
railway variables --set VITE_API_URL=https://your-api-domain.up.railway.app \
  --set VITE_APP_NAME="Task Juggler"
```

### Phase 7: Generate Frontend Domain (CLI Ready)

```bash
cd taskjuggler-web
railway domain generate
```

### Phase 8: Run Migrations (CLI Ready)

After API is deployed:

```bash
cd taskjuggler-api
railway service  # Link to api-web service
railway run php artisan migrate --force
```

## Summary: What Requires Dashboard vs CLI

### Dashboard Required (Cannot be done via CLI):
- ✅ Connect GitHub repositories (creates services)
- ✅ Set start commands for services (worker, scheduler)
- ✅ Delete duplicate databases

### CLI Ready (Can automate):
- ✅ Link to services after creation
- ✅ Set environment variables
- ✅ Generate domains
- ✅ Run migrations
- ✅ View logs and status

## Final Structure

```
Railway Project: Fibonacco AI
│
├── Postgres          (1 database - keep this)
├── Redis             (1 database)
│
├── api-web           (Service - from GitHub, start: web)
├── api-worker        (Service - from GitHub, start: worker)
├── api-scheduler     (Service - from GitHub, start: scheduler)
│
└── taskjuggler       (Frontend service - from GitHub)
```

## Quick Command Reference

```bash
# Link to a service
railway service <service-name>

# Set variables
railway variables --set KEY=value --set KEY2=value2

# Generate domain
railway domain generate

# Run migrations
railway run php artisan migrate --force

# View logs
railway logs --service <service-name>

# Check status
railway status
```

