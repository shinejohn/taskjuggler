# Railway Setup - What You Do vs What I Do

## Summary

**You need to do:** Create 4 services in Railway Dashboard (CLI cannot create services)
**I will do:** Configure environment variables, domains, and run migrations via CLI

---

## Services You Need to Create (via Dashboard)

Create **4 services** in the Railway dashboard by connecting the GitHub repo:

### Service 1: API Web
- **Action:** Dashboard → "New" → "GitHub Repo"
- **Repo:** `shinejohn/taskjuggler`
- **Root Directory:** `taskjuggler-api`
- **Name:** `api-web` (or it will auto-name, you can rename later)
- **What it does:** Serves the Laravel API (handles HTTP requests)

### Service 2: API Worker
- **Action:** Dashboard → "New" → "GitHub Repo"
- **Repo:** `shinejohn/taskjuggler` (same repo)
- **Root Directory:** `taskjuggler-api`
- **Name:** `api-worker` (rename after creation)
- **Start Command:** `worker` (set in Deploy → Start Command)
- **What it does:** Processes queue jobs (background tasks)

### Service 3: API Scheduler
- **Action:** Dashboard → "New" → "GitHub Repo"
- **Repo:** `shinejohn/taskjuggler` (same repo)
- **Root Directory:** `taskjuggler-api`
- **Name:** `api-scheduler` (rename after creation)
- **Start Command:** `scheduler` (set in Deploy → Start Command)
- **What it does:** Runs scheduled tasks (cron jobs)

### Service 4: Task Juggler Frontend
- **Action:** Dashboard → "New" → "GitHub Repo"
- **Repo:** `shinejohn/taskjuggler` (same repo)
- **Root Directory:** `taskjuggler-web`
- **Name:** `taskjuggler` (or rename after creation)
- **What it does:** Serves the Vue.js frontend (user interface)

---

## What I Will Do (via CLI)

Once you create the services, I can:

### 1. Link to Each Service
```bash
railway service  # Select service from list
```

### 2. Set Environment Variables for API Services
```bash
# For api-web, api-worker, api-scheduler
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

**Note:** `DATABASE_URL` and `REDIS_URL` are automatically injected by Railway - no need to set them!

### 3. Set Environment Variables for Frontend
```bash
# For taskjuggler frontend
railway variables --set VITE_API_URL=https://your-api-domain.up.railway.app \
  --set VITE_APP_NAME="Task Juggler"
```

### 4. Generate Domains
```bash
railway domain generate  # For each service
```

### 5. Run Migrations
```bash
railway run php artisan migrate --force
```

---

## Detailed Steps for You (Dashboard)

### Step-by-Step: Creating a Service

1. Go to Railway Dashboard: https://railway.app
2. Select workspace: **shinejohn**
3. Select project: **Fibonacco AI**
4. Click **"New"** button (top right)
5. Click **"GitHub Repo"**
6. Select repository: **shinejohn/taskjuggler**
7. Configure:
   - **Root Directory:** Enter `taskjuggler-api` or `taskjuggler-web`
   - Railway will auto-detect build settings
8. Wait for service to be created (about 30 seconds)
9. Rename service if needed: Settings → Name
10. For worker/scheduler: Deploy → Start Command → Enter `worker` or `scheduler`

**Repeat this process 4 times** (once for each service above)

---

## What Railway CLI CANNOT Do

❌ Cannot create services (must use dashboard)
❌ Cannot connect GitHub repos (must use dashboard)
❌ Cannot set root directory (must use dashboard)
❌ Cannot rename services (must use dashboard, though you can set name during creation)

## What Railway CLI CAN Do

✅ Link to existing services
✅ Set environment variables
✅ Generate domains
✅ Run commands (like migrations)
✅ View logs
✅ Check status

---

## Quick Checklist

**You do (Dashboard):**
- [ ] Create `api-web` service (root: `taskjuggler-api`)
- [ ] Create `api-worker` service (root: `taskjuggler-api`, start: `worker`)
- [ ] Create `api-scheduler` service (root: `taskjuggler-api`, start: `scheduler`)
- [ ] Create `taskjuggler` service (root: `taskjuggler-web`)

**I do (CLI):**
- [ ] Link to each service
- [ ] Set environment variables for all services
- [ ] Generate domains
- [ ] Run migrations
- [ ] Verify everything works

---

## After You Create Services

Once you've created all 4 services in the dashboard, **let me know** and I'll:
1. Link to each service
2. Configure all environment variables
3. Generate domains
4. Run migrations
5. Verify deployment

This will take about 5-10 minutes once the services exist.

