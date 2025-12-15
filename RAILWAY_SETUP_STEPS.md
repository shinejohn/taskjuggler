# Railway Setup Steps - Fibonacco AI Project

## Current State

✅ **Project:** Fibonacco AI (linked)  
✅ **Databases:** Postgres (1) + Redis (1) - cleaned up  
✅ **GitHub Repos:** 
- `shinejohn/taskjuggler` (API repo)
- `shinejohn/taskjuggler` (Web repo - same repo, different directory)

## Setup Steps

### Step 1: Connect API Repository (via Dashboard)

**In Railway Dashboard:**
1. Go to "Fibonacco AI" project
2. Click **"New"** → **"GitHub Repo"**
3. Select repository: `shinejohn/taskjuggler`
4. Configure:
   - Root directory: `taskjuggler-api` (if repo is monorepo)
   - Or connect as separate repo if it's already separate
5. Railway will auto-detect build settings from `railway.json` and `nixpacks.toml`

**After service is created, link via CLI:**
```bash
cd taskjuggler-api
railway link  # Select the service that was just created
railway service  # Verify you're linked
```

### Step 2: Set API Environment Variables

```bash
cd taskjuggler-api
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

**Note:** `DATABASE_URL` and `REDIS_URL` are automatically injected by Railway from the database services.

### Step 3: Create Worker Service

**In Railway Dashboard:**
1. Click **"New"** → **"GitHub Repo"**
2. Select the **same** repository: `shinejohn/taskjuggler`
3. Configure:
   - Root directory: `taskjuggler-api`
   - Name the service: `api-worker` (or rename in settings)
4. In service settings → **Deploy** → Set **Start Command**: `worker`

**Then via CLI:**
```bash
cd taskjuggler-api
railway service  # Link to api-worker service
railway variables --set APP_NAME="Fibonacco AI Worker" \
  --set APP_ENV=production \
  --set APP_DEBUG=false \
  --set LOG_CHANNEL=stderr \
  --set DB_CONNECTION=pgsql \
  --set CACHE_STORE=redis \
  --set QUEUE_CONNECTION=redis
```

### Step 4: Create Scheduler Service

**In Railway Dashboard:**
1. Click **"New"** → **"GitHub Repo"**
2. Select the **same** repository: `shinejohn/taskjuggler`
3. Configure:
   - Root directory: `taskjuggler-api`
   - Name the service: `api-scheduler`
4. In service settings → **Deploy** → Set **Start Command**: `scheduler`

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

### Step 5: Generate API Domain

After API web service is deployed:

```bash
cd taskjuggler-api
railway service  # Link to api-web service (first service created)
railway domain generate
```

Or via dashboard: Service → Settings → Networking → Generate Domain

**Save the domain URL** (e.g., `https://api-web-production.up.railway.app`)

### Step 6: Connect Frontend Repository

**In Railway Dashboard:**
1. Click **"New"** → **"GitHub Repo"**
2. Select repository: `shinejohn/taskjuggler`
3. Configure:
   - Root directory: `taskjuggler-web`
   - Railway will auto-detect Vue/Vite project

**Then via CLI:**
```bash
cd taskjuggler-web
railway link  # Link to Fibonacco AI project
railway service  # Link to the frontend service

# Set environment variables (use API domain from Step 5)
railway variables --set VITE_API_URL=https://your-api-domain.up.railway.app \
  --set VITE_APP_NAME="Task Juggler"
```

### Step 7: Generate Frontend Domain

```bash
cd taskjuggler-web
railway domain generate
```

### Step 8: Run Migrations

After API is deployed:

```bash
cd taskjuggler-api
railway service  # Link to api-web service
railway run php artisan migrate --force
```

---

## Expected Final Structure

```
Railway Project: Fibonacco AI
│
├── Postgres          (Database - 1 instance)
├── Redis             (Database - 1 instance)
│
├── api-web           (Service - from shinejohn/taskjuggler, root: taskjuggler-api)
├── api-worker        (Service - from shinejohn/taskjuggler, root: taskjuggler-api, cmd: worker)
├── api-scheduler     (Service - from shinejohn/taskjuggler, root: taskjuggler-api, cmd: scheduler)
│
└── taskjuggler       (Frontend - from shinejohn/taskjuggler, root: taskjuggler-web)
```

---

## Important Notes

1. **GitHub Repo:** All services use `shinejohn/taskjuggler` but different root directories
2. **Root Directories:**
   - API services: `taskjuggler-api`
   - Frontend: `taskjuggler-web`
3. **Start Commands:**
   - api-web: `web` (from Procfile, or default)
   - api-worker: `worker` (from Procfile)
   - api-scheduler: `scheduler` (from Procfile)
4. **Environment Variables:** Set per service via CLI or dashboard
5. **Domains:** Generate after services are created and deployed

