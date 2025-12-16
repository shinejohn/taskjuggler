# Railway CLI Setup - Step by Step

## Current Limitation

Railway CLI requires **interactive mode** for creating services. However, we can automate:
- ✅ Adding databases (PostgreSQL, Redis)
- ✅ Setting environment variables (once services exist)
- ✅ Running migrations (once services are linked)
- ❌ Creating worker/scheduler services (requires dashboard)

## Quick Setup (Hybrid Approach)

### Step 1: Add Databases via CLI

```bash
cd taskjuggler-api

# Add PostgreSQL
railway add --database postgres

# Add Redis  
railway add --database redis
```

### Step 2: Create Services via Dashboard

Go to https://railway.app → "AI Task Juggler" project:

1. **Create API Service:**
   - Click "New" → "GitHub Repo" (link your repo) OR "Empty Service"
   - Name: `api` (or leave default)
   - Start command: `php artisan serve --host=0.0.0.0 --port=$PORT`

2. **Create Worker Service:**
   - Click "New" → "Empty Service"
   - Name: `worker`
   - Start command: `php artisan queue:work --tries=3 --timeout=300 --sleep=3`
   - Link to same source as API service

3. **Create Scheduler Service:**
   - Click "New" → "Empty Service"  
   - Name: `scheduler`
   - Start command: `php artisan schedule:work`
   - Link to same source as API service

### Step 3: Set Environment Variables via CLI

After services are created, link to API service and set variables:

```bash
# Link to API service
railway service api

# Set queue and cache drivers
railway variables --set "QUEUE_CONNECTION=redis"
railway variables --set "CACHE_DRIVER=redis"
railway variables --set "SESSION_DRIVER=redis"

# Set app configuration
railway variables --set "APP_NAME=Task Juggler"
railway variables --set "APP_ENV=production"
railway variables --set "APP_DEBUG=false"
```

### Step 4: Generate APP_KEY and Run Migrations

```bash
# Generate APP_KEY
railway run php artisan key:generate --show
# Copy the output, then:
railway variables --set "APP_KEY=base64:..."

# Run migrations
railway run php artisan migrate --force
```

### Step 5: Verify Services

```bash
# Check status
railway status

# View logs
railway logs --service api
railway logs --service worker
railway logs --service scheduler

# Test Redis connection
railway run --service api php artisan tinker
>>> Redis::ping()
# Should return: "PONG"

# Test queue
>>> Queue::connection('redis')->size()
# Should return a number
```

## Alternative: Use Provided Scripts

I've created helper scripts:

1. **`setup-railway-services.sh`** - Initial setup guide
2. **`railway-setup-complete.sh`** - Complete configuration and migrations

Run them after creating services in the dashboard.

## What Gets Auto-Configured

When you add PostgreSQL and Redis via CLI:
- ✅ `DATABASE_URL` is automatically set
- ✅ `REDIS_URL` is automatically set
- ✅ Services are linked to your project

## Troubleshooting

**Can't set variables:**
- Make sure you've linked to a service: `railway service <name>`

**Migrations fail:**
- Check `DATABASE_URL` is set: `railway variables`
- Verify PostgreSQL service is running in dashboard

**Queue not working:**
- Check `QUEUE_CONNECTION=redis` is set
- Verify Redis service is running
- Check worker service logs: `railway logs --service worker`
