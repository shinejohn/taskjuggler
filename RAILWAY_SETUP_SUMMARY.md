# Railway Setup Summary

## What's Been Prepared

✅ **Configuration Files Created:**
- `taskjuggler-api/railway.json` - Railway config for API
- `taskjuggler-api/Procfile` - Service commands (web, worker, scheduler)
- `taskjuggler-web/railway.json` - Railway config for frontend
- Setup scripts and guides created

✅ **Ready to Deploy:**
- **fibonacci-api** (taskjuggler-api) - Backend with modular structure
- **taskjuggler-web** - Vue frontend

⏳ **Not Ready Yet:**
- process-web (Process.ai frontend)
- projects-web (Projects.ai frontend)

## Quick Start Commands

### 1. Create/Link Railway Project

First, create the project in Railway dashboard OR link to existing:

```bash
cd taskjuggler-api
railway link --project <project-id>
```

### 2. Run Automated Setup

```bash
# From project root
./RAILWAY_QUICK_SETUP.sh
```

This will:
- Add PostgreSQL and Redis databases
- Set all API environment variables
- Provide instructions for frontend setup

### 3. Manual Steps Required

Since Railway CLI requires interactive input for some operations:

1. **Connect GitHub Repos** (in Railway dashboard):
   - Link `taskjuggler-api` repo → creates web service
   - Link `taskjuggler-web` repo → creates frontend service

2. **Create Additional API Services** (in Railway dashboard):
   - Worker service: same repo, start command = `worker`
   - Scheduler service: same repo, start command = `scheduler`

3. **Set Frontend Environment Variable**:
   ```bash
   cd taskjuggler-web
   railway link --project <same-project-id>
   railway variables set VITE_API_URL=https://your-api-domain.up.railway.app
   ```

4. **Generate Domains**:
   ```bash
   # In each service directory
   railway domain generate
   ```

5. **Run Migrations**:
   ```bash
   cd taskjuggler-api
   railway run php artisan migrate --force
   ```

## Environment Variables Reference

### API Service Variables
```
APP_NAME=Fibonacci API
APP_ENV=production
APP_DEBUG=false
LOG_CHANNEL=stderr
LOG_LEVEL=info
DB_CONNECTION=pgsql
CACHE_STORE=redis
SESSION_DRIVER=redis
QUEUE_CONNECTION=redis
MODULE_TASKS_ENABLED=true
MODULE_PROCESSES_ENABLED=false
MODULE_PROJECTS_ENABLED=false
```

### Frontend Service Variables
```
VITE_API_URL=https://your-api-domain.up.railway.app
VITE_APP_NAME=Task Juggler
```

## Service Structure

```
Railway Project: fibonacci
│
├── postgres          (Database - auto-provisioned)
├── redis             (Cache/Queue - auto-provisioned)
│
├── api-web           (Laravel API - start: web)
├── api-worker        (Laravel Horizon - start: worker)
├── api-scheduler     (Laravel scheduler - start: scheduler)
│
└── taskjuggler       (Vue frontend)
```

## Verification

After deployment, verify:

1. **API Health Check:**
   ```bash
   curl https://your-api-domain.up.railway.app/api/health
   # Should return: {"status":"ok","timestamp":"..."}
   ```

2. **Frontend:**
   - Visit frontend domain
   - Should load Vue app
   - Should be able to connect to API

3. **Database:**
   ```bash
   railway run php artisan migrate:status
   ```

## Detailed Guide

See `RAILWAY_SETUP_GUIDE.md` for complete step-by-step instructions.

## Next Steps When Process/Projects Are Ready

When Process.ai and Projects.ai frontends are ready:

1. Repeat frontend setup for each:
   ```bash
   cd process-web  # or projects-web
   railway link --project <same-project-id>
   railway variables set VITE_API_URL=https://your-api-domain.up.railway.app
   ```

2. Connect GitHub repos in Railway dashboard

3. Generate domains for each service

