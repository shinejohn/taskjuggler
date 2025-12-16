# Railway Deployment Guide - Unified Fibonacco AI Platform

## Overview

This guide covers deploying the unified Fibonacco AI Platform backend and all three frontends to Railway.

**Architecture:**
- **1 Backend:** Fibonacco AI Platform (Laravel API)
- **3 Frontends:** taskjuggler-web, process-web, projects-web (Vue 3)
- **Shared:** Database, Authentication, APIs

---

## Prerequisites

1. Railway account
2. Railway CLI installed (`npm i -g @railway/cli`)
3. All code committed to git
4. Database service ready (PostgreSQL recommended)

---

## Deployment Structure

```
Railway Project: fibonacco-platform
├── fibonacco-api (Backend)
│   ├── PostgreSQL Database
│   ├── Redis (for queues/cache)
│   └── Worker (Horizon)
├── taskjuggler-web (Frontend)
├── process-web (Frontend)
└── projects-web (Frontend)
```

---

## Step 1: Deploy Backend (Fibonacco AI Platform)

### 1.1: Create Railway Project

```bash
cd "/Users/johnshine/Dropbox/Fibonacco/taskjuggler/Code/Fibonacco AI Platform"
railway login
railway init
railway link  # Link to existing project or create new
```

### 1.2: Add PostgreSQL Database

```bash
railway add postgresql
```

This will create a PostgreSQL service and set `DATABASE_URL` environment variable.

### 1.3: Add Redis (Optional but Recommended)

```bash
railway add redis
```

This will create a Redis service and set `REDIS_URL` environment variable.

### 1.4: Set Environment Variables

```bash
# Core Laravel
railway variables set APP_NAME="Fibonacco AI Platform"
railway variables set APP_ENV=production
railway variables set APP_KEY=  # Generate: php artisan key:generate --show
railway variables set APP_DEBUG=false
railway variables set APP_URL=https://fibonacco-api.up.railway.app

# Database (auto-set by Railway PostgreSQL service)
# DATABASE_URL is automatically set

# Redis (auto-set by Railway Redis service)
# REDIS_URL is automatically set

# Queue
railway variables set QUEUE_CONNECTION=redis

# Cache
railway variables set CACHE_DRIVER=redis
railway variables set SESSION_DRIVER=redis

# Broadcasting (if using Reverb)
railway variables set BROADCAST_DRIVER=reverb
railway variables set REVERB_APP_ID=your-reverb-app-id
railway variables set REVERB_APP_KEY=your-reverb-app-key
railway variables set REVERB_APP_SECRET=your-reverb-app-secret
railway variables set REVERB_HOST=your-reverb-host
railway variables set REVERB_PORT=443
railway variables set REVERB_SCHEME=https

# Mail (if using)
railway variables set MAIL_MAILER=smtp
railway variables set MAIL_HOST=smtp.sendgrid.net
railway variables set MAIL_PORT=587
railway variables set MAIL_USERNAME=apikey
railway variables set MAIL_PASSWORD=your-sendgrid-api-key
railway variables set MAIL_ENCRYPTION=tls
railway variables set MAIL_FROM_ADDRESS=noreply@fibonacco.ai
railway variables set MAIL_FROM_NAME="Fibonacco AI Platform"

# Twilio (if using)
railway variables set TWILIO_ACCOUNT_SID=your-twilio-sid
railway variables set TWILIO_AUTH_TOKEN=your-twilio-token
railway variables set TWILIO_PHONE_NUMBER=your-twilio-number

# OpenAI/OpenRouter (if using)
railway variables set OPENROUTER_API_KEY=your-openrouter-key

# Sanctum
railway variables set SANCTUM_STATEFUL_DOMAINS=fibonacco-api.up.railway.app,taskjuggler-web.up.railway.app,process-web.up.railway.app,projects-web.up.railway.app
railway variables set SESSION_DOMAIN=.up.railway.app
```

### 1.5: Deploy Backend

```bash
railway up
```

The backend will:
1. Build using Nixpacks
2. Run `composer install`
3. Run `npm install && npm run build`
4. Run migrations
5. Start PHP server

### 1.6: Add Worker Service

Create a new service in Railway for the queue worker:

```bash
railway service create worker
railway service use worker
railway variables set RAILWAY_SERVICE_NAME=worker
```

Update the service to use the Procfile worker command:
- In Railway dashboard, set start command to: `worker`

---

## Step 2: Deploy Frontends

### 2.1: Deploy taskjuggler-web

```bash
cd "/Users/johnshine/Dropbox/Fibonacco/taskjuggler/Code/taskjuggler-web"
railway init
railway link  # Link to same Railway project
```

**Set Environment Variables:**
```bash
railway variables set VITE_API_URL=https://fibonacco-api.up.railway.app/api
railway variables set VITE_APP_NAME="Task Juggler"
```

**Deploy:**
```bash
railway up
```

### 2.2: Deploy process-web

```bash
cd "/Users/johnshine/Dropbox/Fibonacco/taskjuggler/Code/process-web"
railway init
railway link  # Link to same Railway project
```

**Set Environment Variables:**
```bash
railway variables set VITE_API_URL=https://fibonacco-api.up.railway.app/api
railway variables set VITE_APP_NAME="Process.ai"
```

**Deploy:**
```bash
railway up
```

### 2.3: Deploy projects-web

```bash
cd "/Users/johnshine/Dropbox/Fibonacco/taskjuggler/Code/projects-web"
railway init
railway link  # Link to same Railway project
```

**Set Environment Variables:**
```bash
railway variables set VITE_API_URL=https://fibonacco-api.up.railway.app/api
railway variables set VITE_APP_NAME="Projects.ai"
```

**Deploy:**
```bash
railway up
```

---

## Step 3: Configure Custom Domains (Optional)

### Backend API
- Domain: `api.fibonacco.ai` → `fibonacco-api.up.railway.app`
- Update `APP_URL` and `SANCTUM_STATEFUL_DOMAINS`

### Frontends
- `taskjuggler.fibonacco.ai` → `taskjuggler-web.up.railway.app`
- `process.fibonacco.ai` → `process-web.up.railway.app`
- `projects.fibonacco.ai` → `projects-web.up.railway.app`

---

## Step 4: Database Migration

### 4.1: Run Migrations

Migrations will run automatically on deploy, but you can also run manually:

```bash
railway run php artisan migrate --force
```

### 4.2: Seed Database (Optional)

```bash
railway run php artisan db:seed
```

---

## Step 5: Verify Deployment

### 5.1: Health Check

```bash
curl https://fibonacco-api.up.railway.app/api/health
# Should return: {"status":"ok"}
```

### 5.2: Test API Endpoints

```bash
# Test auth
curl -X POST https://fibonacco-api.up.railway.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","password":"password","password_confirmation":"password","organization_name":"Test Org"}'

# Test processes
curl https://fibonacco-api.up.railway.app/api/processes \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 5.3: Test Frontends

1. Visit `https://taskjuggler-web.up.railway.app`
2. Visit `https://process-web.up.railway.app`
3. Visit `https://projects-web.up.railway.app`

All should connect to the unified backend.

---

## Environment Variables Summary

### Backend (Fibonacco AI Platform)

**Required:**
- `APP_NAME`, `APP_ENV`, `APP_KEY`, `APP_URL`
- `DATABASE_URL` (auto-set by Railway PostgreSQL)
- `REDIS_URL` (auto-set by Railway Redis, if using)

**Optional:**
- `QUEUE_CONNECTION=redis`
- `CACHE_DRIVER=redis`
- `SESSION_DRIVER=redis`
- `BROADCAST_DRIVER=reverb`
- `MAIL_*` (for email)
- `TWILIO_*` (for SMS/voice)
- `OPENROUTER_API_KEY` (for AI features)

### Frontends

**Required:**
- `VITE_API_URL` - Backend API URL
- `VITE_APP_NAME` - App display name

---

## Troubleshooting

### Backend Issues

1. **Migrations fail:**
   - Check `DATABASE_URL` is set
   - Run manually: `railway run php artisan migrate --force`

2. **Queue not working:**
   - Ensure Redis is added and `REDIS_URL` is set
   - Ensure worker service is running

3. **CORS issues:**
   - Check `SANCTUM_STATEFUL_DOMAINS` includes all frontend domains
   - Check `SESSION_DOMAIN` is set correctly

### Frontend Issues

1. **API connection fails:**
   - Verify `VITE_API_URL` is set correctly
   - Check backend is running and accessible
   - Check CORS settings in backend

2. **Build fails:**
   - Check Node.js version (should be >= 18)
   - Check all dependencies are in package.json

---

## Monitoring

### Railway Dashboard

- View logs for each service
- Monitor resource usage
- Check deployment status

### Application Monitoring

- Laravel Horizon dashboard (if enabled)
- Application logs: `railway logs`
- Database queries: Enable query logging in development

---

## Production Checklist

- [ ] All environment variables set
- [ ] Database migrations run successfully
- [ ] Backend health check passes
- [ ] All three frontends deploy successfully
- [ ] Frontends can connect to backend
- [ ] Authentication works across all apps
- [ ] CORS configured correctly
- [ ] SSL certificates active (Railway handles this)
- [ ] Worker service running (for queues)
- [ ] Redis connected (if using)
- [ ] Custom domains configured (if using)

---

## Quick Deploy Commands

```bash
# Backend
cd "/Users/johnshine/Dropbox/Fibonacco/taskjuggler/Code/Fibonacco AI Platform"
railway up

# Frontends
cd "/Users/johnshine/Dropbox/Fibonacco/taskjuggler/Code/taskjuggler-web" && railway up
cd "/Users/johnshine/Dropbox/Fibonacco/taskjuggler/Code/process-web" && railway up
cd "/Users/johnshine/Dropbox/Fibonacco/taskjuggler/Code/projects-web" && railway up
```

---

## Next Steps

1. Set up monitoring/alerting
2. Configure backups for database
3. Set up CI/CD pipeline
4. Configure staging environment
5. Set up error tracking (Sentry, etc.)
