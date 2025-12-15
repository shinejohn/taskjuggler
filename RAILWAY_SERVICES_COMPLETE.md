# Railway Services - Complete List

## All Services Needed

### Backend Services (API)
1. **api-web** - Laravel API web server
2. **api-worker** - Queue worker
3. **api-scheduler** - Scheduled tasks

### Frontend Services (Vue.js)
4. **taskjuggler** - Task Juggler frontend
5. **process** - Process.ai frontend
6. **projects** - Projects.ai frontend

**Total: 6 services**

---

## Services You Need to Create (Dashboard)

All from repo: `shinejohn/taskjuggler`

### Backend Services

**1. api-web**
- Root Directory: `taskjuggler-api`
- Start Command: `web` (default, from Procfile)

**2. api-worker**
- Root Directory: `taskjuggler-api`
- Start Command: `worker`

**3. api-scheduler**
- Root Directory: `taskjuggler-api`
- Start Command: `scheduler`

### Frontend Services

**4. taskjuggler**
- Root Directory: `taskjuggler-web`

**5. process**
- Root Directory: `process-web`

**6. projects**
- Root Directory: `projects-web`

---

## What I'll Configure (CLI)

### Backend Services (api-web, api-worker, api-scheduler)
- Environment variables:
  - `APP_NAME="Fibonacco AI"` (or "Worker"/"Scheduler")
  - `APP_ENV=production`
  - `APP_DEBUG=false`
  - `DB_CONNECTION=pgsql`
  - `CACHE_STORE=redis`
  - `SESSION_DRIVER=redis`
  - `QUEUE_CONNECTION=redis`
  - `MODULE_TASKS_ENABLED=true`
  - `MODULE_PROCESSES_ENABLED=false`
  - `MODULE_PROJECTS_ENABLED=false`

### Frontend Services (taskjuggler, process, projects)
- Environment variables:
  - `VITE_API_URL=https://api-web-xxxxx.up.railway.app` (after api-web gets domain)
  - `VITE_APP_NAME="Task Juggler"` / `"Process.ai"` / `"Projects.ai"`

### Domains
- Generate domain for each service
- Update frontend `VITE_API_URL` with api-web domain

### Migrations
- Run migrations: `railway run php artisan migrate --force`

---

## Summary

**Create 6 services in Railway dashboard:**
1. api-web (taskjuggler-api)
2. api-worker (taskjuggler-api, start: worker)
3. api-scheduler (taskjuggler-api, start: scheduler)
4. taskjuggler (taskjuggler-web)
5. process (process-web)
6. projects (projects-web)

**Then I'll configure all 6 via CLI.**

