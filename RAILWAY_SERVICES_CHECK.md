# Railway Services Status Check

## Expected Services for Fibonacco AI Project

Based on the project configuration, you should have:

### Backend Services (from `shinejohn/taskjuggler` repo)
1. **api-web** - Laravel API web server
   - Root Directory: `taskjuggler-api`
   - Should be running at: `https://api-web-production-cc91.up.railway.app`

2. **api-worker** - Queue worker
   - Root Directory: `taskjuggler-api`
   - Start Command: `worker`

3. **api-scheduler** - Scheduled tasks
   - Root Directory: `taskjuggler-api`
   - Start Command: `scheduler`

### Frontend Services

4. **taskjuggler** - Task Juggler frontend
   - Root Directory: `taskjuggler-web`
   - Repo: `shinejohn/taskjuggler`

5. **process** or **4process** - Process.ai frontend
   - Root Directory: `process-web`
   - Repo: `shinejohn/4process`

6. **projects** or **4projects** - Projects.ai frontend
   - Root Directory: `projects-web`
   - Repo: `shinejohn/4projects`

### Database Services

7. **PostgreSQL** - One instance only
   - Should be named: `Postgres` (not `Postgres-xxxxx`)

8. **Redis** - One instance only

---

## How to Check Services in Railway Dashboard

1. Go to: https://railway.app
2. Navigate to: **shinejohn's Projects** → **Fibonacco AI**
3. Check the list of services in the left sidebar

## Expected Count

- **Total Services: 8**
  - 3 Backend services (api-web, api-worker, api-scheduler)
  - 3 Frontend services (taskjuggler, process, projects)
  - 2 Database services (PostgreSQL, Redis)

## Checking for Duplicates

Look for:
- ❌ Multiple `Postgres` services (should only be 1)
- ❌ Multiple `Redis` services (should only be 1)
- ❌ Duplicate frontend services with different names
- ❌ Services with random suffixes (e.g., `Postgres-4f8P`, `Postgres-vc_Z`)

## If Duplicates Found

Delete the extras by:
1. Click on the duplicate service
2. Go to **Settings** tab
3. Scroll to **Danger Zone**
4. Click **Delete Service**

---

## Current API URL (from previous logs)

- API Web: `https://api-web-production-cc91.up.railway.app`

Use this URL to verify the service is running:
```bash
curl https://api-web-production-cc91.up.railway.app/api/health
```

