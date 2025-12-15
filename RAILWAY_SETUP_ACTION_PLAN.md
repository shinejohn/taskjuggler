# Railway Setup Action Plan - Fibonacco AI

## Current State ✅

- **Railway Project:** Fibonacco AI (linked)
- **GitHub Repo:** `shinejohn/taskjuggler`
- **API Location:** `taskjuggler-api/` directory in repo
- **Web Location:** `taskjuggler-web/` directory in repo
- **Databases:** Postgres (1) + Redis (1) - ready

## Setup Process

### Part 1: Create Services (Dashboard Required)

**You need to create services via Railway Dashboard** by connecting the GitHub repo:

1. **API Web Service:**
   - Dashboard → "New" → "GitHub Repo"
   - Select: `shinejohn/taskjuggler`
   - Root Directory: `taskjuggler-api`
   - Name: `api-web` (or rename after creation)

2. **API Worker Service:**
   - Dashboard → "New" → "GitHub Repo"
   - Select: `shinejohn/taskjuggler` (same repo)
   - Root Directory: `taskjuggler-api`
   - Name: `api-worker`
   - Start Command: `worker` (set in Deploy settings)

3. **API Scheduler Service:**
   - Dashboard → "New" → "GitHub Repo"
   - Select: `shinejohn/taskjuggler` (same repo)
   - Root Directory: `taskjuggler-api`
   - Name: `api-scheduler`
   - Start Command: `scheduler` (set in Deploy settings)

4. **Task Juggler Frontend:**
   - Dashboard → "New" → "GitHub Repo"
   - Select: `shinejohn/taskjuggler` (same repo)
   - Root Directory: `taskjuggler-web`
   - Name: `taskjuggler`

### Part 2: Configure Services (CLI Ready)

**After services are created in dashboard, I can help configure them via CLI:**

```bash
# Link to each service and set environment variables
cd taskjuggler-api
railway service  # Select api-web
railway variables --set APP_NAME="Fibonacco AI" \
  --set APP_ENV=production \
  --set APP_DEBUG=false \
  # ... etc

railway service  # Select api-worker
railway variables --set ...  # Same variables

railway service  # Select api-scheduler  
railway variables --set ...  # Same variables

cd ../taskjuggler-web
railway service  # Select taskjuggler
railway variables --set VITE_API_URL=... \
  --set VITE_APP_NAME="Task Juggler"
```

## Next Step

**Please create the services in the Railway dashboard first**, then let me know when they're created and I'll help configure them via CLI with all the environment variables.

---

## Summary

- ✅ Project linked: Fibonacco AI
- ✅ Repo identified: shinejohn/taskjuggler
- ⏳ **Action needed:** Create 4 services in dashboard
- ⏳ **Then:** I'll configure them via CLI

