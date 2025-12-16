# Railway Setup - Complete Action Plan

## What You Need to Do vs What I Can Do

### ❌ What I CANNOT Do (You Must Do)

**Create services from GitHub repos** - Railway CLI `add --repo` exists but requires interactive prompts that don't work in non-TTY environments.

**Solution:** Create services in Railway Dashboard

---

## ✅ What YOU Need to Do (Dashboard - 5 minutes)

### Create 4 Services

Go to: https://railway.app → shinejohn workspace → Fibonacco AI project

**Service 1: API Web**
1. Click "New" → "GitHub Repo"
2. Select: `shinejohn/taskjuggler`
3. Root Directory: `taskjuggler-api`
4. Name: `api-web`

**Service 2: API Worker**
1. Click "New" → "GitHub Repo"
2. Select: `shinejohn/taskjuggler`
3. Root Directory: `taskjuggler-api`
4. Name: `api-worker`
5. Go to: Deploy → Start Command → Enter: `worker`

**Service 3: API Scheduler**
1. Click "New" → "GitHub Repo"
2. Select: `shinejohn/taskjuggler`
3. Root Directory: `taskjuggler-api`
4. Name: `api-scheduler`
5. Go to: Deploy → Start Command → Enter: `scheduler`

**Service 4: Task Juggler Frontend**
1. Click "New" → "GitHub Repo"
2. Select: `shinejohn/taskjuggler`
3. Root Directory: `taskjuggler-web`
4. Name: `taskjuggler`

---

## ✅ What I WILL Do (CLI - After You Create Services)

Once you've created the 4 services, tell me and I'll:

### 1. Link to Each Service & Set Variables

**For api-web:**
```bash
cd taskjuggler-api
railway service api-web
railway variables --set APP_NAME="Fibonacco AI" \
  --set APP_ENV=production \
  --set APP_DEBUG=false \
  --set LOG_CHANNEL=stderr \
  --set DB_CONNECTION=pgsql \
  --set CACHE_STORE=redis \
  --set SESSION_DRIVER=redis \
  --set QUEUE_CONNECTION=redis \
  --set MODULE_TASKS_ENABLED=true \
  --set MODULE_PROCESSES_ENABLED=false \
  --set MODULE_PROJECTS_ENABLED=false
```

**For api-worker:**
```bash
railway service api-worker
railway variables --set APP_NAME="Fibonacco AI Worker" \
  --set APP_ENV=production \
  --set APP_DEBUG=false \
  --set LOG_CHANNEL=stderr \
  --set DB_CONNECTION=pgsql \
  --set CACHE_STORE=redis \
  --set QUEUE_CONNECTION=redis
```

**For api-scheduler:**
```bash
railway service api-scheduler
railway variables --set APP_NAME="Fibonacco AI Scheduler" \
  --set APP_ENV=production \
  --set APP_DEBUG=false \
  --set LOG_CHANNEL=stderr \
  --set DB_CONNECTION=pgsql \
  --set CACHE_STORE=redis \
  --set QUEUE_CONNECTION=redis
```

**For taskjuggler frontend:**
```bash
cd ../taskjuggler-web
railway service taskjuggler
railway variables --set VITE_APP_NAME="Task Juggler"
# VITE_API_URL will be set after api-web gets its domain
```

### 2. Generate Domains

```bash
cd taskjuggler-api
railway service api-web
railway domain generate  # Get the domain URL

cd ../taskjuggler-web
railway service taskjuggler
# Update VITE_API_URL with the api-web domain
railway variables --set VITE_API_URL=https://api-web-xxxxx.up.railway.app
railway domain generate
```

### 3. Run Migrations

```bash
cd taskjuggler-api
railway service api-web
railway run php artisan migrate --force
```

---

## Summary

| Task | Who Does It | Time |
|------|-------------|------|
| Create 4 services in dashboard | **YOU** | ~5 min |
| Link services & set variables | **ME** (CLI) | ~3 min |
| Generate domains | **ME** (CLI) | ~1 min |
| Run migrations | **ME** (CLI) | ~1 min |
| **Total** | | **~10 min** |

---

## Next Step

**Create the 4 services in the Railway dashboard, then tell me "services created" and I'll configure everything via CLI.**

