# AI Tools Platform - Shared Environment Variables

## Overview
This document defines the shared environment variables for the AI Tools platform.
These variables should be set as "Shared Variables" in Railway for the AI TOOLS group.

---

## Database Configuration (Postgres - AI TOOLs)

```bash
# Database Connection
DB_CONNECTION=pgsql
DB_HOST=postgres-ea870ea6.railway.internal
DB_PORT=5432
DB_DATABASE=railway
DB_USERNAME=postgres
DB_PASSWORD=FzULulOrNbBNaiUkYutiRcTQMSqPlhhR

# PostgreSQL Internal Variables (auto-set by Railway)
PGHOST=postgres-ea870ea6.railway.internal
PGPORT=5432
PGDATABASE=railway
PGUSER=postgres
PGPASSWORD=FzULulOrNbBNaiUkYutiRcTQMSqPlhhR
PGDATA=/var/lib/postgresql/data/pgdata

# Database URLs
DATABASE_URL=postgresql://postgres:FzULulOrNbBNaiUkYutiRcTQMSqPlhhR@postgres-ea870ea6.railway.internal:5432/railway
DATABASE_PUBLIC_URL=postgresql://postgres:FzULulOrNbBNaiUkYutiRcTQMSqPlhhR@tramway.proxy.rlwy.net:21938/railway
```

---

## Redis/Valkey Configuration

```bash
# Redis Connection (Valkey)
REDIS_CLIENT=predis
REDIS_HOST=Valkey.railway.internal
REDIS_PORT=6379
REDIS_PASSWORD=
CACHE_STORE=redis
QUEUE_CONNECTION=redis
SESSION_DRIVER=redis
```

---

## Application Core Settings

```bash
# Environment
APP_ENV=production
APP_DEBUG=false
APP_TIMEZONE=America/New_York
APP_LOCALE=en
APP_FALLBACK_LOCALE=en
APP_FAKER_LOCALE=en_US
APP_MAINTENANCE_DRIVER=file

# Security
BCRYPT_ROUNDS=12
SESSION_ENCRYPT=false
SESSION_LIFETIME=120
SESSION_PATH=/
```

---

## Logging & Monitoring

```bash
# Logging
LOG_CHANNEL=stderr
LOG_LEVEL=info
LOG_STACK=single
LOG_DEPRECATIONS_CHANNEL=null
```

---

## File Storage

```bash
# Filesystem
FILESYSTEM_DISK=local
AWS_USE_PATH_STYLE_ENDPOINT=false
```

---

## Mail Configuration

```bash
# Mail Settings
MAIL_MAILER=smtp
MAIL_FROM_ADDRESS=noreply@aitools.example.com
MAIL_FROM_NAME="AI Tools Platform"
```

---

## Broadcasting & Queues

```bash
# Broadcasting
BROADCAST_CONNECTION=log

# Queue
QUEUE_CONNECTION=redis
```

---

## AI Tools Platform Specific

```bash
# Platform Features
WORKSPACES_ENABLED=true
WORKSPACES_CAN_CREATE_WORKSPACE=true

# Authentication Methods
PASSWORD_ENABLED=true
MAGICLINK_ENABLED=false
SOCIALITE_ENABLED=false
SOCIALITE_PROVIDERS=

# Admin
ADMIN_EMAILS=admin@aitools.example.com
```

---

## Railway Specific

```bash
# Railway Configuration
RAILWAY_DEPLOYMENT_DRAINING_SECONDS=60
PHP_CLI_SERVER_WORKERS=4
```

---

## Service-Specific Variables

### For ai-tools-api Service

```bash
# Service Identity
APP_NAME="AI Tools API"
APP_URL=https://ai-tools-api-production.up.railway.app

# Generate unique APP_KEY
APP_KEY=base64:[GENERATE_NEW_KEY]

# API Specific
API_RATE_LIMIT=60
API_RATE_LIMIT_WINDOW=1
```

### For Frontend Services (taskjuggler-web, 4Doctors, URPA, etc.)

```bash
# Frontend Common
NODE_ENV=production
VITE_API_URL=https://ai-tools-api-production.up.railway.app

# Service-Specific APP_NAME (set individually)
# taskjuggler-web:
APP_NAME="TaskJuggler"
VITE_APP_NAME="TaskJuggler"

# 4Doctors:
APP_NAME="4Healthcare"
VITE_APP_NAME="4Healthcare"

# URPA:
APP_NAME="URPA Scheduler"
VITE_APP_NAME="URPA Scheduler"

# etc.
```

---

## Optional Third-Party Integrations

### Stripe (if needed)
```bash
STRIPE_KEY=
STRIPE_SECRET=
STRIPE_WEBHOOK_SECRET=
```

### Google Services (if needed)
```bash
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_MAPS_API_KEY=
```

### AI Services (if needed)
```bash
OPENROUTER_API_KEY=
PRISM_MODEL=
PRISM_SERVER_ENABLED=false
```

### Error Tracking (if needed)
```bash
SENTRY_ENABLED=false
SENTRY_LARAVEL_DSN=
SENTRY_SEND_DEFAULT_PII=false
SENTRY_TRACES_SAMPLE_RATE=0.1
```

---

## Variables NOT Needed for AI Tools

The following from Publishing platform are NOT needed:

```bash
# Multisite-specific (not applicable)
DAYNEWS_DOMAIN
DOWNTOWNGUIDE_DOMAIN
GOEVENTCITY_DOMAIN
INERTIA_SSR_ENABLED
INERTIA_SSR_URL
SESSION_DOMAIN

# News-specific (not applicable)
NEWS_WORKFLOW_AI_MODEL_FACT_CHECKING
NEWS_WORKFLOW_AI_MODEL_GENERATION
NEWS_WORKFLOW_AI_MODEL_SCORING
SCRAPINGBEE_API_KEY
SERPAPI_KEY
UNSPLASH_ACCESS_KEY
UNSPLASH_STORAGE_DISK
UNSPLASH_STORAGE_ENABLED

# Monitoring tools (optional)
NIGHTWATCH_COMMAND_SAMPLE_RATE
NIGHTWATCH_EXCEPTION_SAMPLE_RATE
NIGHTWATCH_REQUEST_SAMPLE_RATE
NIGHTWATCH_TOKEN
MAXMIND_LICENSE_KEY

# Docker-specific (Railway handles this)
RAILWAY_DOCKERFILE_PATH
RAILWAY_RUN_UID
```

---

## Implementation Steps

### 1. Set Shared Variables in Railway

Go to Railway project → AI TOOLS group → Shared Variables

Add all variables from the "Shared" sections above.

### 2. Set Service-Specific Variables

For each service, set the service-specific variables:

#### ai-tools-api
```bash
APP_NAME="AI Tools API"
APP_URL=https://ai-tools-api-production.up.railway.app
APP_KEY=[generate new key]
```

#### taskjuggler-web
```bash
APP_NAME="TaskJuggler"
VITE_APP_NAME="TaskJuggler"
VITE_API_URL=https://ai-tools-api-production.up.railway.app
NODE_ENV=production
```

#### 4Doctors
```bash
APP_NAME="4Healthcare"
VITE_APP_NAME="4Healthcare"
VITE_API_URL=https://ai-tools-api-production.up.railway.app
NODE_ENV=production
```

(Repeat for all frontend services)

### 3. Generate New APP_KEY

```bash
cd taskjuggler-api
php artisan key:generate --show
```

Use this value for the ai-tools-api service.

---

## Railway CLI Commands

### Set Shared Variables (Run from taskjuggler-api directory)

```bash
# Database
railway variables --set "DB_CONNECTION=pgsql"
railway variables --set "DB_HOST=postgres-ea870ea6.railway.internal"
railway variables --set "DB_PORT=5432"
railway variables --set "DB_DATABASE=railway"
railway variables --set "DB_USERNAME=postgres"
railway variables --set "DB_PASSWORD=FzULulOrNbBNaiUkYutiRcTQMSqPlhhR"

# Redis
railway variables --set "REDIS_HOST=Valkey.railway.internal"
railway variables --set "REDIS_PORT=6379"
railway variables --set "CACHE_STORE=redis"
railway variables --set "QUEUE_CONNECTION=redis"
railway variables --set "SESSION_DRIVER=redis"

# App Core
railway variables --set "APP_ENV=production"
railway variables --set "APP_DEBUG=false"
railway variables --set "LOG_CHANNEL=stderr"
railway variables --set "LOG_LEVEL=info"
```

### Set Service-Specific Variables

```bash
# For ai-tools-api
railway variables --service "ai-tools-api" \
  --set "APP_NAME=AI Tools API" \
  --set "APP_URL=https://ai-tools-api-production.up.railway.app"

# For frontends (example: 4Doctors)
railway variables --service "4Doctors" \
  --set "VITE_API_URL=https://ai-tools-api-production.up.railway.app" \
  --set "NODE_ENV=production"
```

---

## Validation Checklist

After setting variables:

- [ ] Database connection works from ai-tools-api
- [ ] Redis connection works (cache, queue, sessions)
- [ ] Migrations run successfully
- [ ] Frontend apps can reach the API
- [ ] Authentication works
- [ ] File uploads work (if applicable)
- [ ] Queue jobs process
- [ ] Logs are visible in Railway

---

**This configuration provides a clean, AI Tools-specific environment that avoids conflicts with the Publishing platform while maintaining best practices.**
