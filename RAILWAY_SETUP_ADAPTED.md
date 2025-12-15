# Railway Setup - Adapted for Current State

## ✅ Already Complete

- **Project Created:** "Fibonacco AI" ✅
- **Linked:** Current directory linked to project ✅
- **Databases:** PostgreSQL (3 instances - need to keep 1) and Redis (1) ✅

## Current Status

```
Project: Fibonacco AI
Environment: production
Service: None

Databases (visible in dashboard):
- Postgres-4f8P (delete - duplicate)
- Postgres-vc_Z (delete - duplicate)
- Postgres (KEEP - this one)
- Redis (KEEP - only need one)
```

## Setup Steps (Adapted from Instructions)

### Step 1: Clean Up Databases (Do This First in Dashboard)

In Railway dashboard:
1. Delete `Postgres-4f8P` → Settings → Delete Service
2. Delete `Postgres-vc_Z` → Settings → Delete Service
3. Keep `Postgres` (the clean one)
4. Keep `Redis` (already correct)

### Step 2: Connect GitHub Repository for API

**Via Railway Dashboard:**
1. Go to "Fibonacco AI" project
2. Click **"New"** → **"GitHub Repo"**
3. Select your `taskjuggler-api` repository (or whatever your API repo is named)
4. This creates a service automatically - Railway will auto-detect build settings

**After service is created, link it via CLI:**
```bash
cd taskjuggler-api
railway service  # This will prompt you to select the service, select the one that was just created
```

### Step 3: Set API Environment Variables

After linking the service, set variables:

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

**Note:** DATABASE_URL and REDIS_URL are automatically injected by Railway from the database services.

### Step 4: Create Worker Service

**Via Railway Dashboard:**
1. Click **"New"** → **"GitHub Repo"**
2. Select the **same** `taskjuggler-api` repository
3. Name it or it will auto-name - you can rename it to `api-worker` in settings

**Then via CLI:**
```bash
cd taskjuggler-api
railway service  # Link to api-worker service
```

**Set start command and variables:**
```bash
# Set start command (Procfile has "worker" defined, Railway should auto-detect)
# If not, set it in dashboard: Deploy → Start Command = "worker"

# Set environment variables (copy from api-web)
railway variables --set APP_NAME="Fibonacco AI Worker" \
  --set APP_ENV=production \
  --set APP_DEBUG=false \
  --set LOG_CHANNEL=stderr \
  --set DB_CONNECTION=pgsql \
  --set CACHE_STORE=redis \
  --set QUEUE_CONNECTION=redis
```

### Step 5: Create Scheduler Service

**Via Railway Dashboard:**
1. Click **"New"** → **"GitHub Repo"**
2. Select the **same** `taskjuggler-api` repository
3. Rename to `api-scheduler` in settings

**Then via CLI:**
```bash
cd taskjuggler-api
railway service  # Link to api-scheduler service
```

**Set start command and variables:**
```bash
# Set start command in dashboard: Deploy → Start Command = "scheduler"

railway variables --set APP_NAME="Fibonacco AI Scheduler" \
  --set APP_ENV=production \
  --set APP_DEBUG=false \
  --set LOG_CHANNEL=stderr \
  --set DB_CONNECTION=pgsql \
  --set CACHE_STORE=redis \
  --set QUEUE_CONNECTION=redis
```

### Step 6: Generate API Domain

After API web service is deployed:

```bash
cd taskjuggler-api
railway service  # Link to api-web service
railway domain generate
```

Or via dashboard: Service → Settings → Networking → Generate Domain

Save the domain URL (e.g., `https://api-web-production.up.railway.app`)

### Step 7: Create Task Juggler Frontend Service

**Via Railway Dashboard:**
1. Click **"New"** → **"GitHub Repo"**
2. Select your `taskjuggler-web` repository
3. Railway will auto-detect build settings

**Then via CLI:**
```bash
cd ../taskjuggler-web
railway link --project "Fibonacco AI"  # Or use project ID
railway service  # Link to the taskjuggler service
```

**Set environment variables:**
```bash
# Use the API domain from Step 6
railway variables --set VITE_API_URL=https://your-api-domain.up.railway.app \
  --set VITE_APP_NAME="Task Juggler"
```

### Step 8: Generate Frontend Domain

```bash
cd taskjuggler-web
railway domain generate
```

### Step 9: Run Migrations

After API is deployed:

```bash
cd taskjuggler-api
railway service  # Link to api-web service
railway run php artisan migrate --force
```

## Skipped (Not Ready Yet)

- ❌ Process.ai frontend (code not ready)
- ❌ Projects.ai frontend (code not ready)

These can be added later following the same pattern as taskjuggler frontend.

## Final Structure

```
Railway Project: Fibonacco AI
│
├── Postgres          (Database - keep this one, delete others)
├── Redis             (Database)
│
├── api-web           (Service - from GitHub repo, start: web)
├── api-worker        (Service - from GitHub repo, start: worker)
├── api-scheduler     (Service - from GitHub repo, start: scheduler)
│
└── taskjuggler       (Frontend service - from GitHub repo)
```

## Verification Commands

```bash
# Check project status
railway status

# List all services
railway service list  # May not work, use dashboard

# View variables for a service
railway variables --service <service-name>

# View logs
railway logs --service <service-name>

# Check health
curl https://your-api-domain.up.railway.app/api/health
```

