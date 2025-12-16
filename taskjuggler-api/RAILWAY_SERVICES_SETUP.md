# Railway Services Setup Guide

## Overview

This guide will help you set up all required services in Railway for the Task Juggler application.

## Required Services

1. **api** - Main Laravel web application
2. **worker** - Queue worker for background jobs
3. **scheduler** - Laravel scheduler for cron tasks
4. **postgres** - PostgreSQL database
5. **redis** - Redis/Valkey for queues and cache

---

## Step 1: Add Database Services

### PostgreSQL

**Via Railway Dashboard:**
1. Go to your Railway project
2. Click "New" → "Database" → "PostgreSQL"
3. Railway will automatically create and configure the database
4. The `DATABASE_URL` environment variable will be automatically set

**Via Railway CLI:**
```bash
railway add --database postgres
```

### Redis/Valkey

**Via Railway Dashboard:**
1. Go to your Railway project
2. Click "New" → "Database" → "Redis" (or "Valkey" if available)
3. Railway will automatically create and configure Redis
4. The `REDIS_URL` environment variable will be automatically set

**Via Railway CLI:**
```bash
railway add --database redis
```

---

## Step 2: Create Application Services

### Main API Service

**Via Railway Dashboard:**
1. Click "New" → "GitHub Repo" (if connecting GitHub)
   - OR "New" → "Empty Service" (for manual deployment)
2. Name it: `api`
3. Set the start command: `php artisan serve --host=0.0.0.0 --port=$PORT`
4. Set root directory: `taskjuggler-api` (if repo is at root)

**Via Railway CLI:**
```bash
railway service --name api
railway variables set START_COMMAND="php artisan serve --host=0.0.0.0 --port=\$PORT"
```

### Queue Worker Service

**Via Railway Dashboard:**
1. Click "New" → "Empty Service"
2. Name it: `worker`
3. Set the start command: `php artisan queue:work --tries=3 --timeout=300 --sleep=3`
4. Link to the same GitHub repo or source as `api` service
5. Set root directory: `taskjuggler-api`

**Via Railway CLI:**
```bash
railway service --name worker
railway variables set START_COMMAND="php artisan queue:work --tries=3 --timeout=300 --sleep=3"
```

### Scheduler Service

**Via Railway Dashboard:**
1. Click "New" → "Empty Service"
2. Name it: `scheduler`
3. Set the start command: `php artisan schedule:work`
4. Link to the same GitHub repo or source as `api` service
5. Set root directory: `taskjuggler-api`

**Via Railway CLI:**
```bash
railway service --name scheduler
railway variables set START_COMMAND="php artisan schedule:work"
```

---

## Step 3: Configure Environment Variables

### Shared Variables (Set for all services)

Set these in Railway project settings (shared across all services):

```bash
# App Configuration
APP_NAME="Task Juggler"
APP_ENV=production
APP_DEBUG=false
APP_URL=https://your-app.railway.app

# Queue
QUEUE_CONNECTION=redis

# Broadcasting
BROADCAST_DRIVER=pusher

# Cache
CACHE_DRIVER=redis
SESSION_DRIVER=redis
```

### Service-Specific Variables

**For `api`, `worker`, and `scheduler` services:**

```bash
# Database (auto-set by Railway PostgreSQL service)
# DATABASE_URL is automatically set - no action needed

# Redis (auto-set by Railway Redis service)
# REDIS_URL is automatically set - no action needed
```

**External Service API Keys (set in `api` service):**

```bash
# Twilio
TWILIO_ACCOUNT_SID=your-sid
TWILIO_AUTH_TOKEN=your-token
TWILIO_VERIFY_SIGNATURE=true

# SendGrid
SENDGRID_API_KEY=your-key
SENDGRID_INBOUND_DOMAIN=assistant.taskjuggler.com
SENDGRID_WEBHOOK_SECRET=your-secret

# OpenRouter
OPENROUTER_API_KEY=your-key
OPENROUTER_BASE_URL=https://openrouter.ai/api/v1
OPENROUTER_DEFAULT_MODEL=openai/gpt-4o
OPENROUTER_EXTRACTION_MODEL=openai/gpt-4o

# Stripe
STRIPE_KEY=your-key
STRIPE_SECRET=your-secret
STRIPE_WEBHOOK_SECRET=your-webhook-secret

# Pusher
PUSHER_APP_ID=your-id
PUSHER_APP_KEY=your-key
PUSHER_APP_SECRET=your-secret
PUSHER_APP_CLUSTER=mt1
```

---

## Step 4: Generate and Set APP_KEY

```bash
# Link to api service
railway service --name api

# Generate APP_KEY
railway run php artisan key:generate --show

# Copy the output and set it
railway variables set APP_KEY="base64:..."
```

---

## Step 5: Run Migrations

```bash
# Link to api service
railway service --name api

# Run migrations
railway run php artisan migrate --force
```

---

## Step 6: Verify Services

### Check Service Status

```bash
railway status
```

### View Logs

```bash
# API service logs
railway logs --service api

# Worker service logs
railway logs --service worker

# Scheduler service logs
railway logs --service scheduler
```

### Test Redis Connection

```bash
railway run --service api php artisan tinker
>>> Redis::ping()
# Should return: "PONG"
```

### Test Queue Connection

```bash
railway run --service api php artisan tinker
>>> \Queue::connection('redis')->size()
# Should return a number (0 if queue is empty)
```

---

## Step 7: Verify Scheduled Tasks

```bash
# List all scheduled tasks
railway run --service scheduler php artisan schedule:list

# Test scheduler (runs once)
railway run --service scheduler php artisan schedule:run
```

---

## Service Architecture

```
┌─────────────────┐
│   PostgreSQL    │  (Database)
└────────┬────────┘
         │
┌────────┴────────┐
│     Redis       │  (Queue & Cache)
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
┌───▼───┐ ┌──▼──────┐ ┌──────────┐
│  API  │ │ Worker  │ │Scheduler │
│ (Web) │ │(Queues) │ │  (Cron)  │
└───────┘ └─────────┘ └──────────┘
```

---

## Troubleshooting

### Queue Worker Not Processing Jobs

1. Check `QUEUE_CONNECTION=redis` is set
2. Verify Redis service is running
3. Check worker service logs: `railway logs --service worker`
4. Verify worker service is running: `railway status`

### Scheduler Not Running

1. Verify scheduler service is running: `railway status`
2. Check scheduler logs: `railway logs --service scheduler`
3. Test scheduler manually: `railway run --service scheduler php artisan schedule:run`

### Redis Connection Issues

1. Verify `REDIS_URL` is set (auto-set by Railway)
2. Check Redis service is running
3. Test connection: `railway run --service api php artisan tinker` → `Redis::ping()`

### Database Connection Issues

1. Verify `DATABASE_URL` is set (auto-set by Railway)
2. Check PostgreSQL service is running
3. Test connection: `railway run --service api php artisan migrate:status`

---

## Next Steps

1. ✅ All services created and running
2. ✅ Environment variables configured
3. ✅ Migrations run
4. ✅ Queue worker processing jobs
5. ✅ Scheduler running tasks
6. 🔄 Configure webhooks (Twilio, SendGrid, Stripe)
7. 🔄 Set up custom domain
8. 🔄 Configure monitoring and alerts

---

## Scheduled Tasks Reference

The following tasks are configured in `routes/console.php`:

1. **Cleanup Old Notifications** - Daily at 2:00 AM
   - Removes read notifications older than 30 days

2. **Cleanup Old Inbox Items** - Weekly on Sundays at 3:00 AM
   - Removes processed inbox items older than 90 days

3. **Monitor Stale Tasks** - Hourly
   - Logs tasks with no activity for 7+ days

4. **Cleanup Failed Jobs** - Daily at 4:00 AM
   - Removes failed jobs older than 7 days

View all scheduled tasks:
```bash
railway run --service scheduler php artisan schedule:list
```
