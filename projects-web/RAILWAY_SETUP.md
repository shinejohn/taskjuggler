# Railway Setup Guide - Fibonacco AI Platform

## Quick Setup

This guide will help you set up the Fibonacco AI Platform on Railway.

## Prerequisites

1. Railway account (https://railway.app)
2. Railway CLI installed: `npm install -g @railway/cli`
3. Git repository connected

## Step 1: Initialize Railway Project

```bash
cd "/Users/johnshine/Dropbox/Fibonacco/taskjuggler/Code/Fibonacco AI Platform"
railway login
railway init
```

Choose to create a new project or link to existing one.

## Step 2: Add Database Services

### Add PostgreSQL

```bash
railway add postgresql
```

This automatically sets `DATABASE_URL` environment variable.

### Add Redis/Valkey (Optional but Recommended)

```bash
railway add redis
```

This automatically sets `REDIS_URL` environment variable.

## Step 3: Set Environment Variables

### Core Application Variables

```bash
# Generate APP_KEY first
php artisan key:generate --show
# Copy the output, then:

railway variables set APP_KEY="base64:YOUR_GENERATED_KEY_HERE"
railway variables set APP_NAME="Fibonacco AI Platform"
railway variables set APP_ENV=production
railway variables set APP_DEBUG=false
railway variables set APP_URL="https://your-service.up.railway.app"
```

### Database (Auto-set by Railway)

- `DATABASE_URL` - Automatically set when you add PostgreSQL
- `DB_CONNECTION=pgsql` - Set manually if needed

### Redis/Cache (Auto-set by Railway)

```bash
railway variables set CACHE_STORE=redis
railway variables set SESSION_DRIVER=redis
railway variables set QUEUE_CONNECTION=redis
```

- `REDIS_URL` - Automatically set when you add Redis

### Logging

```bash
railway variables set LOG_CHANNEL=stderr
railway variables set LOG_LEVEL=info
```

### Sanctum (for API authentication)

```bash
railway variables set SANCTUM_STATEFUL_DOMAINS="your-api-domain.up.railway.app,your-frontend-domain.up.railway.app"
railway variables set SESSION_DOMAIN=".up.railway.app"
```

### External Services (Optional)

```bash
# AI Service
railway variables set OPENROUTER_API_KEY="your-key"

# Twilio (if using)
railway variables set TWILIO_ACCOUNT_SID="your-sid"
railway variables set TWILIO_AUTH_TOKEN="your-token"
railway variables set TWILIO_PHONE_NUMBER="your-number"

# Mail (if using)
railway variables set MAIL_MAILER=smtp
railway variables set MAIL_HOST=smtp.sendgrid.net
railway variables set MAIL_PORT=587
railway variables set MAIL_USERNAME=apikey
railway variables set MAIL_PASSWORD="your-sendgrid-key"
railway variables set MAIL_FROM_ADDRESS="noreply@fibonacco.ai"
railway variables set MAIL_FROM_NAME="Fibonacco AI Platform"
```

## Step 4: Deploy

```bash
railway up
```

This will:
1. Build the application using Nixpacks
2. Install dependencies (Composer + npm)
3. Build frontend assets
4. Run migrations
5. Start the web server

## Step 5: Add Worker Services

### Horizon Worker (for queues)

1. Go to Railway Dashboard
2. Click "New Service" → "GitHub Repo" (select same repo)
3. Set **Start Command**: `worker`
4. The service will use the `worker` process from Procfile

### Scheduler Service (for cron jobs)

1. Go to Railway Dashboard
2. Click "New Service" → "GitHub Repo" (select same repo)
3. Set **Start Command**: `scheduler`
4. The service will use the `scheduler` process from Procfile

## Step 6: Verify Deployment

### Health Check

```bash
curl https://your-service.up.railway.app/api/health
```

Should return:
```json
{
  "status": "healthy",
  "timestamp": "2025-12-14T...",
  "services": {
    "database": "connected",
    "cache": "connected"
  }
}
```

### Test API

```bash
# Register a user
curl -X POST https://your-service.up.railway.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password",
    "password_confirmation": "password",
    "organization_name": "Test Org"
  }'
```

## Architecture

```
Railway Project: fibonacco-platform
├── PostgreSQL (Database)
├── Redis/Valkey (Cache/Queue)
├── Web Service (Laravel API)
│   └── Start: web (from Procfile)
├── Horizon Worker (Queue Processing)
│   └── Start: worker (from Procfile)
└── Scheduler (Cron Jobs)
    └── Start: scheduler (from Procfile)
```

## Files Configured

- ✅ `nixpacks.toml` - Build configuration with all PHP extensions
- ✅ `Procfile` - Process definitions (web, worker, scheduler)
- ✅ `railway.json` - Railway project configuration
- ✅ `config/database.php` - Parses DATABASE_URL from Railway
- ✅ `routes/api.php` - Health check endpoint at `/api/health`

## Troubleshooting

### Build Fails: "Extension not found"

Add the missing extension to `nixpacks.toml` in the `nixPkgs` array.

### Database Connection Fails

1. Verify `DATABASE_URL` is set: `railway variables | grep DATABASE_URL`
2. Check database service is running in Railway dashboard
3. Verify `config/database.php` parses `DATABASE_URL` correctly

### 500 Errors

```bash
# Check APP_KEY is set
railway variables | grep APP_KEY

# Clear caches
railway run php artisan config:clear
railway run php artisan cache:clear
railway run php artisan view:clear
```

### Queue Jobs Not Processing

1. Verify Horizon worker service is running
2. Check `REDIS_URL` is set
3. Verify `QUEUE_CONNECTION=redis` is set

### Scheduled Tasks Not Running

1. Verify Scheduler service is running
2. Check start command is `scheduler`

## Useful Commands

```bash
# View logs
railway logs
railway logs -f  # Follow

# Run artisan commands
railway run php artisan migrate
railway run php artisan tinker

# Set variables
railway variables set "KEY=value"

# List variables
railway variables

# SSH into container
railway shell

# Open dashboard
railway open
```

## Next Steps

1. Set up custom domain (optional)
2. Configure monitoring/alerting
3. Set up database backups
4. Configure CI/CD pipeline
5. Set up staging environment

---

**Setup Complete!** Your Fibonacco AI Platform is now deployed on Railway. 🚀
