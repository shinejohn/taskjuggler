# Railway Setup Guide for Fibonacci Platform

## Current Status
- ✅ API code is ready (taskjuggler-api)
- ✅ Task Juggler frontend is ready (taskjuggler-web)
- ⏳ Process.ai frontend - not ready yet
- ⏳ Projects.ai frontend - not ready yet

## Step 1: Create Railway Project

You need to create the project manually via Railway dashboard since `railway init` requires interactive input.

### Option A: Via Railway Dashboard (Recommended)
1. Go to https://railway.app/new
2. Click "New Project"
3. Name it: `fibonacci`
4. Select "Empty Project"

### Option B: Use Existing Project
If you want to use an existing project:
```bash
cd taskjuggler-api
railway link --project <project-id>
```

## Step 2: Link API to Railway Project

Once project is created, link the API directory:

```bash
cd taskjuggler-api
railway link --project <project-id>
# OR if already in project:
railway link
```

## Step 3: Add Databases

```bash
cd taskjuggler-api

# Add PostgreSQL
railway add --database postgres

# Wait a few seconds, then add Redis
railway add --database redis
```

## Step 4: Set API Environment Variables

```bash
cd taskjuggler-api

railway variables set \
  APP_NAME="Fibonacci API" \
  APP_ENV=production \
  APP_DEBUG=false \
  LOG_CHANNEL=stderr \
  LOG_LEVEL=info \
  DB_CONNECTION=pgsql \
  CACHE_STORE=redis \
  SESSION_DRIVER=redis \
  QUEUE_CONNECTION=redis \
  MODULE_TASKS_ENABLED=true \
  MODULE_PROCESSES_ENABLED=false \
  MODULE_PROJECTS_ENABLED=false
```

## Step 5: Connect GitHub Repository

In Railway dashboard:
1. Go to your project
2. Click "GitHub" to connect repository
3. Select: `taskjuggler-api` repository (or whatever your API repo is named)
4. Railway will auto-detect the build settings

## Step 6: Create API Services

The API needs 3 services that share the same codebase but different start commands:

### Service 1: API Web (Main Server)
- In Railway dashboard, this is created automatically when you connect GitHub
- Ensure start command is: `web` (or check your Procfile/railway.json)
- Environment variables are already set from Step 4

### Service 2: API Worker (Queue Worker)
1. In Railway dashboard, click "New Service"
2. Select "GitHub Repo" → select same `taskjuggler-api` repo
3. Set start command to: `worker`
4. Copy environment variables from web service

### Service 3: API Scheduler (Cron Jobs)
1. In Railway dashboard, click "New Service"
2. Select "GitHub Repo" → select same `taskjuggler-api` repo
3. Set start command to: `scheduler`
4. Copy environment variables from web service

## Step 7: Generate API Domain

```bash
cd taskjuggler-api
railway domain generate
```

Or in dashboard: Click on API web service → Settings → Generate Domain

Save the domain URL (e.g., `https://api-web-production.up.railway.app`)

## Step 8: Set Up Task Juggler Frontend

```bash
# Navigate to frontend
cd ../taskjuggler-web

# Link to same Railway project
railway link --project <same-project-id>

# Set environment variables (use the API domain from Step 7)
railway variables set \
  VITE_API_URL=https://YOUR-API-DOMAIN.up.railway.app \
  VITE_APP_NAME="Task Juggler"
```

## Step 9: Connect Frontend GitHub Repo

1. In Railway dashboard, click "New Service"
2. Select "GitHub Repo" → select `taskjuggler-web` repository
3. Railway will auto-detect Dockerfile/build settings
4. Environment variables are already set

## Step 10: Generate Frontend Domain

```bash
cd taskjuggler-web
railway domain generate
```

Or in dashboard: Click on taskjuggler service → Settings → Generate Domain

## Step 11: Run Migrations

After first deployment:

```bash
cd taskjuggler-api
railway run php artisan migrate --force
```

## Verification Checklist

- [ ] Railway project created and linked
- [ ] PostgreSQL database added
- [ ] Redis database added
- [ ] API environment variables set
- [ ] API web service connected to GitHub and deployed
- [ ] API worker service created and deployed
- [ ] API scheduler service created and deployed
- [ ] API domain generated
- [ ] Task Juggler frontend linked to project
- [ ] Frontend environment variables set (VITE_API_URL)
- [ ] Frontend service connected to GitHub and deployed
- [ ] Frontend domain generated
- [ ] Database migrations run
- [ ] API health check works: `curl https://your-api-domain/api/health`
- [ ] Frontend loads and can connect to API

## Useful Commands

```bash
# View project status
railway status

# View logs
railway logs
railway logs --service <service-name>

# View environment variables
railway variables

# Run migrations
railway run php artisan migrate --force

# Open Railway dashboard
railway open
```

## Future: Process.ai and Projects.ai Frontends

When those frontends are ready, repeat Step 8-10 for each:
- `process-web` service
- `projects-web` service

Both will use the same API URL as taskjuggler-web.

