# Railway Deployment: Complete Solution for Laravel + Vue Stack

## Overview

This document provides a **bulletproof** Railway deployment configuration for Laravel 12 + Vue 3 applications. It's designed for the Task Juggler / Process.ai / Projects.ai stack but works for any Laravel + Vue application.

**Why deployments fail:**
1. Trying to run everything in one container
2. Missing PHP extensions
3. Node build memory issues
4. Queue workers competing with web server
5. Scheduler not running
6. Environment variables not available at build time

**This solution fixes all of that.**

---

# ARCHITECTURE

## Service Layout

```
┌─────────────────────────────────────────────────────────────────────┐
│                     RAILWAY PROJECT                                  │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │
│  │   Postgres   │  │    Valkey    │  │   Storage    │              │
│  │   (Database) │  │   (Redis)    │  │   (S3)       │              │
│  │              │  │              │  │              │              │
│  │  Managed     │  │  Managed     │  │  Managed     │              │
│  │  Service     │  │  Service     │  │  Bucket      │              │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘              │
│         │                 │                 │                       │
│         └─────────────────┼─────────────────┘                       │
│                           │                                         │
│                           ▼                                         │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                    SHARED VARIABLES                          │   │
│  │  DATABASE_URL, REDIS_URL, AWS_*, APP_KEY, etc.              │   │
│  └─────────────────────────────────────────────────────────────┘   │
│         │                 │                 │                       │
│         ▼                 ▼                 ▼                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │
│  │     Web      │  │   Horizon    │  │  Scheduler   │              │
│  │   (Laravel)  │  │   (Queues)   │  │   (Cron)     │              │
│  │              │  │              │  │              │              │
│  │  php artisan │  │  php artisan │  │  php artisan │              │
│  │  serve       │  │  horizon     │  │  schedule:   │              │
│  │              │  │              │  │  work        │              │
│  └──────────────┘  └──────────────┘  └──────────────┘              │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

## Why This Works

1. **Postgres & Valkey** are Railway managed services — zero config, auto-scaling
2. **Web, Horizon, Scheduler** share the same codebase but run different commands
3. **Each service has one job** — no competing processes
4. **Build happens once** — all services use the same Docker image
5. **Environment variables** are shared across services automatically

---

# FILE STRUCTURE

Your Laravel project root needs these files:

```
your-project/
├── .railway/
│   └── config.json          # Railway service configuration
├── Procfile                  # Default web process
├── Procfile.horizon          # Horizon worker process
├── Procfile.scheduler        # Scheduler process
├── nixpacks.toml             # Build configuration
├── railway.json              # Railway project config
├── .env.railway              # Environment variable template
└── scripts/
    └── railway-deploy.sh     # Post-deploy script
```

---

# CONFIGURATION FILES

## 1. nixpacks.toml (BUILD CONFIGURATION)

This is the most critical file. It tells Railway how to build your app.

```toml
# nixpacks.toml - Laravel 12 + Vue 3 + Tailwind 4

[phases.setup]
nixPkgs = [
    "php83",
    "php83Extensions.pdo",
    "php83Extensions.pdo_pgsql",
    "php83Extensions.pgsql", 
    "php83Extensions.redis",
    "php83Extensions.pcntl",
    "php83Extensions.bcmath",
    "php83Extensions.gd",
    "php83Extensions.intl",
    "php83Extensions.mbstring",
    "php83Extensions.xml",
    "php83Extensions.zip",
    "php83Extensions.curl",
    "php83Extensions.fileinfo",
    "php83Extensions.tokenizer",
    "php83Extensions.ctype",
    "nodejs_20",
    "npm"
]

[phases.install]
cmds = [
    # Install PHP dependencies
    "composer install --no-dev --optimize-autoloader --no-interaction --prefer-dist",
    
    # Install Node dependencies
    "npm ci --prefer-offline --no-audit",
    
    # Build frontend assets
    "npm run build",
    
    # Create storage directories
    "mkdir -p storage/framework/sessions",
    "mkdir -p storage/framework/views", 
    "mkdir -p storage/framework/cache/data",
    "mkdir -p storage/logs",
    "mkdir -p bootstrap/cache",
    
    # Set permissions
    "chmod -R 775 storage bootstrap/cache"
]

[phases.build]
cmds = [
    # Laravel optimizations (only if APP_ENV is set)
    "php artisan config:cache || true",
    "php artisan route:cache || true", 
    "php artisan view:cache || true",
    "php artisan event:cache || true"
]

[start]
cmd = "php artisan migrate --force && php artisan storage:link && php artisan serve --host=0.0.0.0 --port=${PORT:-8080}"
```

## 2. Procfile (WEB SERVICE)

```procfile
web: php artisan migrate --force && php artisan storage:link && php artisan serve --host=0.0.0.0 --port=${PORT:-8080}
```

## 3. Procfile.horizon (QUEUE WORKER SERVICE)

```procfile
worker: php artisan horizon
```

## 4. Procfile.scheduler (SCHEDULER SERVICE)

```procfile
worker: php artisan schedule:work
```

## 5. railway.json (PROJECT CONFIGURATION)

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": null
  },
  "deploy": {
    "numReplicas": 1,
    "startCommand": null,
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10,
    "healthcheckPath": "/api/health",
    "healthcheckTimeout": 300
  }
}
```

## 6. .env.railway (ENVIRONMENT TEMPLATE)

```env
# ===========================================
# RAILWAY ENVIRONMENT VARIABLES
# ===========================================
# Copy these to Railway Dashboard > Variables
# Variables marked [AUTO] are set by Railway automatically
# Variables marked [REQUIRED] must be set manually
# ===========================================

# ---- CORE APPLICATION ----
APP_NAME="Task Juggler"
APP_ENV=production
APP_DEBUG=false
APP_TIMEZONE=UTC
APP_URL=${RAILWAY_PUBLIC_DOMAIN:+https://${RAILWAY_PUBLIC_DOMAIN}}

# [REQUIRED] Generate with: php artisan key:generate --show
APP_KEY=

# ---- DATABASE ----
# [AUTO] Railway sets DATABASE_URL automatically when you add Postgres
# Laravel will parse this automatically with the config below
DB_CONNECTION=pgsql
DATABASE_URL=${DATABASE_URL}

# ---- REDIS/VALKEY ----
# [AUTO] Railway sets REDIS_URL automatically when you add Valkey/Redis
REDIS_URL=${REDIS_URL}
CACHE_STORE=redis
SESSION_DRIVER=redis
QUEUE_CONNECTION=redis

# ---- LOGGING ----
LOG_CHANNEL=stderr
LOG_LEVEL=info

# ---- BROADCASTING ----
BROADCAST_CONNECTION=reverb
REVERB_APP_ID=taskjuggler
REVERB_APP_KEY=
REVERB_APP_SECRET=
REVERB_HOST=${RAILWAY_PUBLIC_DOMAIN}
REVERB_PORT=443
REVERB_SCHEME=https

# ---- MAIL ----
MAIL_MAILER=smtp
MAIL_HOST=smtp.sendgrid.net
MAIL_PORT=587
MAIL_USERNAME=apikey
MAIL_PASSWORD=
MAIL_FROM_ADDRESS=noreply@taskjuggler.com
MAIL_FROM_NAME="${APP_NAME}"

# ---- EXTERNAL SERVICES ----
# [REQUIRED] AI Service
OPENROUTER_API_KEY=

# [OPTIONAL] Twilio for SMS/Voice
TWILIO_SID=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE_NUMBER=

# [OPTIONAL] Slack
SLACK_BOT_TOKEN=
SLACK_SIGNING_SECRET=

# [OPTIONAL] Stripe
STRIPE_KEY=
STRIPE_SECRET=
STRIPE_WEBHOOK_SECRET=

# ---- STORAGE ----
# If using Railway Storage bucket
FILESYSTEM_DISK=s3
AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID}
AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY}
AWS_DEFAULT_REGION=${AWS_REGION:-us-east-1}
AWS_BUCKET=${AWS_S3_BUCKET}
AWS_URL=${AWS_S3_ENDPOINT}
AWS_USE_PATH_STYLE_ENDPOINT=true

# ---- RAILWAY AUTO-SET ----
# These are set automatically by Railway
# RAILWAY_PUBLIC_DOMAIN
# RAILWAY_PRIVATE_DOMAIN
# RAILWAY_PROJECT_ID
# RAILWAY_SERVICE_ID
# PORT
```

---

# LARAVEL CONFIGURATION UPDATES

## config/database.php

Update to properly parse Railway's DATABASE_URL:

```php
<?php

use Illuminate\Support\Str;

// Parse DATABASE_URL if present
$databaseUrl = env('DATABASE_URL');
$dbConfig = [];

if ($databaseUrl) {
    $parsedUrl = parse_url($databaseUrl);
    $dbConfig = [
        'host' => $parsedUrl['host'] ?? '127.0.0.1',
        'port' => $parsedUrl['port'] ?? 5432,
        'database' => ltrim($parsedUrl['path'] ?? '/forge', '/'),
        'username' => $parsedUrl['user'] ?? 'forge',
        'password' => $parsedUrl['pass'] ?? '',
    ];
}

return [
    'default' => env('DB_CONNECTION', 'pgsql'),

    'connections' => [
        'pgsql' => [
            'driver' => 'pgsql',
            'url' => env('DATABASE_URL'),
            'host' => $dbConfig['host'] ?? env('DB_HOST', '127.0.0.1'),
            'port' => $dbConfig['port'] ?? env('DB_PORT', '5432'),
            'database' => $dbConfig['database'] ?? env('DB_DATABASE', 'forge'),
            'username' => $dbConfig['username'] ?? env('DB_USERNAME', 'forge'),
            'password' => $dbConfig['password'] ?? env('DB_PASSWORD', ''),
            'charset' => 'utf8',
            'prefix' => '',
            'prefix_indexes' => true,
            'search_path' => 'public',
            'sslmode' => 'prefer',
        ],
        
        // Keep sqlite for testing
        'sqlite' => [
            'driver' => 'sqlite',
            'database' => database_path('database.sqlite'),
            'prefix' => '',
            'foreign_key_constraints' => true,
        ],
    ],

    'redis' => [
        'client' => 'predis',
        'options' => [
            'cluster' => 'redis',
            'prefix' => env('REDIS_PREFIX', Str::slug(env('APP_NAME', 'laravel'), '_').'_database_'),
        ],
        'default' => [
            'url' => env('REDIS_URL'),
            'host' => env('REDIS_HOST', '127.0.0.1'),
            'password' => env('REDIS_PASSWORD'),
            'port' => env('REDIS_PORT', '6379'),
            'database' => env('REDIS_DB', '0'),
        ],
        'cache' => [
            'url' => env('REDIS_URL'),
            'host' => env('REDIS_HOST', '127.0.0.1'),
            'password' => env('REDIS_PASSWORD'),
            'port' => env('REDIS_PORT', '6379'),
            'database' => env('REDIS_CACHE_DB', '1'),
        ],
    ],
];
```

## Add Health Check Endpoint

Create `routes/api.php` entry:

```php
Route::get('/health', function () {
    try {
        // Check database
        DB::connection()->getPdo();
        
        // Check Redis
        Cache::store('redis')->put('health_check', true, 10);
        
        return response()->json([
            'status' => 'healthy',
            'timestamp' => now()->toIso8601String(),
            'services' => [
                'database' => 'connected',
                'cache' => 'connected',
            ]
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'status' => 'unhealthy',
            'error' => $e->getMessage()
        ], 500);
    }
});
```

---

# DEPLOYMENT SCRIPT

## scripts/railway-deploy.sh

Run this locally to set up everything:

```bash
#!/bin/bash
set -e

echo "🚂 Railway Deployment Setup"
echo "==========================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check Railway CLI
if ! command -v railway &> /dev/null; then
    echo -e "${RED}❌ Railway CLI not installed${NC}"
    echo "Install with: npm install -g @railway/cli"
    exit 1
fi

# Check login
if ! railway whoami &>/dev/null; then
    echo -e "${YELLOW}⚠️  Not logged in to Railway${NC}"
    railway login
fi

echo -e "${GREEN}✅ Railway CLI ready${NC}"
echo ""

# Initialize or link project
if [ ! -f ".railway" ] && [ ! -d ".railway" ]; then
    echo "📦 No Railway project linked"
    echo ""
    echo "Options:"
    echo "  1) Create new project"
    echo "  2) Link existing project"
    read -p "Choose (1/2): " choice
    
    if [ "$choice" == "1" ]; then
        railway init
    else
        railway link
    fi
fi

echo ""
echo "📊 Current project:"
railway status
echo ""

# Add services
echo "🔧 Setting up services..."
echo ""

# PostgreSQL
echo "Adding PostgreSQL..."
railway add --database postgres 2>/dev/null || echo "  (already exists)"

# Redis/Valkey
echo "Adding Valkey (Redis)..."
railway add --database redis 2>/dev/null || echo "  (already exists)"

echo ""
echo -e "${GREEN}✅ Database services configured${NC}"
echo ""

# Set environment variables
echo "🔐 Setting environment variables..."

# Generate APP_KEY if needed
if ! railway variables 2>&1 | grep -q "APP_KEY=base64"; then
    if command -v php &> /dev/null; then
        echo "Generating APP_KEY..."
        APP_KEY=$(php artisan key:generate --show 2>/dev/null)
        railway variables --set "APP_KEY=$APP_KEY"
        echo -e "${GREEN}✅ APP_KEY generated${NC}"
    else
        echo -e "${YELLOW}⚠️  PHP not found locally. Set APP_KEY manually:${NC}"
        echo "   railway variables --set 'APP_KEY=base64:YOUR_KEY_HERE'"
    fi
else
    echo "APP_KEY already set"
fi

# Core variables
railway variables --set "APP_ENV=production" 2>/dev/null || true
railway variables --set "APP_DEBUG=false" 2>/dev/null || true
railway variables --set "LOG_CHANNEL=stderr" 2>/dev/null || true
railway variables --set "LOG_LEVEL=info" 2>/dev/null || true
railway variables --set "CACHE_STORE=redis" 2>/dev/null || true
railway variables --set "SESSION_DRIVER=redis" 2>/dev/null || true
railway variables --set "QUEUE_CONNECTION=redis" 2>/dev/null || true

echo -e "${GREEN}✅ Core variables set${NC}"
echo ""

# Display status
echo "📋 Current variables:"
railway variables 2>&1 | grep -E "^[A-Z]" | head -20
echo ""

# Required variables check
echo "🔍 Checking required variables..."
MISSING=()

if ! railway variables 2>&1 | grep -q "OPENROUTER_API_KEY=."; then
    MISSING+=("OPENROUTER_API_KEY")
fi

if [ ${#MISSING[@]} -gt 0 ]; then
    echo -e "${YELLOW}⚠️  Missing required variables:${NC}"
    for var in "${MISSING[@]}"; do
        echo "   - $var"
    done
    echo ""
    echo "Set with: railway variables --set 'VAR_NAME=value'"
else
    echo -e "${GREEN}✅ All required variables set${NC}"
fi

echo ""
echo "🚀 Ready to deploy!"
echo ""
echo "Commands:"
echo "  railway up              # Deploy"
echo "  railway logs            # View logs"
echo "  railway shell           # SSH into container"
echo "  railway run php artisan # Run artisan commands"
echo ""
echo "To add Horizon worker service:"
echo "  1. Go to Railway Dashboard"
echo "  2. Click 'New Service' > 'GitHub Repo' (same repo)"
echo "  3. Set start command: php artisan horizon"
echo ""
echo "To add Scheduler service:"
echo "  1. Go to Railway Dashboard"  
echo "  2. Click 'New Service' > 'GitHub Repo' (same repo)"
echo "  3. Set start command: php artisan schedule:work"
```

---

# STEP-BY-STEP DEPLOYMENT

## First Time Setup

### 1. Install Railway CLI

```bash
npm install -g @railway/cli
railway login
```

### 2. Create Files

Copy these files to your project root:
- `nixpacks.toml` (from above)
- `Procfile` (from above)
- `railway.json` (from above)
- Update `config/database.php` (from above)
- Add health check route

### 3. Initialize Railway Project

```bash
cd your-project
railway init
```

### 4. Add Database Services

In Railway Dashboard:
1. Click **"New"** → **"Database"** → **"PostgreSQL"**
2. Click **"New"** → **"Database"** → **"Redis"** (or Valkey)

Or via CLI:
```bash
railway add --database postgres
railway add --database redis
```

### 5. Set Environment Variables

```bash
# Generate and set APP_KEY
railway variables --set "APP_KEY=$(php artisan key:generate --show)"

# Core settings
railway variables --set "APP_ENV=production"
railway variables --set "APP_DEBUG=false"
railway variables --set "APP_NAME=Task Juggler"
railway variables --set "LOG_CHANNEL=stderr"
railway variables --set "CACHE_STORE=redis"
railway variables --set "SESSION_DRIVER=redis"
railway variables --set "QUEUE_CONNECTION=redis"

# Your API keys
railway variables --set "OPENROUTER_API_KEY=your-key"
```

### 6. Deploy

```bash
railway up
```

### 7. Add Worker Services (Optional but Recommended)

In Railway Dashboard:
1. Click **"New Service"**
2. Select **"GitHub Repo"** → Your repo
3. In service settings, set **Start Command**: `php artisan horizon`
4. Repeat for scheduler: `php artisan schedule:work`

---

# TROUBLESHOOTING

## Build Fails: "Extension not found"

**Problem:** PHP extension missing
**Solution:** Add to `nixpacks.toml` in the `nixPkgs` array:
```toml
nixPkgs = ["php83Extensions.EXTENSION_NAME"]
```

Common extensions:
- `pdo_pgsql` - PostgreSQL
- `redis` - Redis
- `gd` - Image processing
- `intl` - Internationalization
- `zip` - ZIP files
- `bcmath` - Arbitrary precision math

## Build Fails: "npm ERR! ENOMEM"

**Problem:** Not enough memory for npm
**Solution:** Use `npm ci` instead of `npm install` (already in our config)

If still failing, in Railway Dashboard → Service → Settings → Build:
- Increase build memory to 8GB

## Deploy Fails: "Connection refused" to database

**Problem:** Database URL not available
**Solution:** 
1. Make sure Postgres service is running
2. Check that `DATABASE_URL` variable is set (Railway does this automatically)
3. Ensure your code parses DATABASE_URL correctly (use our database.php config)

## App Runs but 500 Errors

**Problem:** Usually missing APP_KEY or cache issues
**Solution:**
```bash
# Check APP_KEY is set
railway variables | grep APP_KEY

# Clear caches in production
railway run php artisan config:clear
railway run php artisan cache:clear
railway run php artisan view:clear
```

## Queue Jobs Not Processing

**Problem:** No Horizon worker
**Solution:** Add a separate Horizon service (see step 7 above)

## Scheduled Tasks Not Running

**Problem:** No scheduler service
**Solution:** Add a separate Scheduler service with command `php artisan schedule:work`

---

# MULTI-APP SETUP (Like Your Developer)

To run multiple apps (Task Juggler, Process.ai, Projects.ai) in one Railway project:

```
┌─────────────────────────────────────────────────────────────────────┐
│                     RAILWAY PROJECT                                  │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  SHARED SERVICES:                                                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │
│  │   Postgres   │  │    Valkey    │  │   Storage    │              │
│  └──────────────┘  └──────────────┘  └──────────────┘              │
│                                                                      │
│  APP 1: Task Juggler                                                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │
│  │     Web      │  │   Horizon    │  │  Scheduler   │              │
│  │ taskjuggler  │  │              │  │              │              │
│  │ .com         │  │              │  │              │              │
│  └──────────────┘  └──────────────┘  └──────────────┘              │
│                                                                      │
│  APP 2: Process.ai                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │
│  │     Web      │  │   Horizon    │  │  Scheduler   │              │
│  │ process.ai   │  │              │  │              │              │
│  └──────────────┘  └──────────────┘  └──────────────┘              │
│                                                                      │
│  APP 3: Projects.ai                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │
│  │     Web      │  │   Horizon    │  │  Scheduler   │              │
│  │ projects.ai  │  │              │  │              │              │
│  └──────────────┘  └──────────────┘  └──────────────┘              │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

Each app:
- Has its own GitHub repo
- Shares the same Postgres and Valkey
- Has its own web + worker services
- Has its own domain

To set up:
1. Create one Railway project
2. Add Postgres and Valkey once
3. For each app: Add 3 services (web, horizon, scheduler) from that app's repo
4. All services automatically get the DATABASE_URL and REDIS_URL

---

# QUICK REFERENCE

## Railway CLI Commands

```bash
# Login
railway login

# Initialize new project
railway init

# Link to existing project
railway link

# Deploy
railway up

# View logs
railway logs
railway logs -f  # Follow

# Set variables
railway variables --set "KEY=value"

# List variables
railway variables

# Run commands in container
railway run php artisan migrate
railway run php artisan tinker

# SSH into container
railway shell

# Open dashboard
railway open
```

## Common Variable Sets

```bash
# Minimal (just to get running)
railway variables --set "APP_KEY=$(php artisan key:generate --show)"
railway variables --set "APP_ENV=production"
railway variables --set "APP_DEBUG=false"

# Full production
railway variables --set "APP_NAME=Task Juggler"
railway variables --set "LOG_CHANNEL=stderr"
railway variables --set "CACHE_STORE=redis"
railway variables --set "SESSION_DRIVER=redis"
railway variables --set "QUEUE_CONNECTION=redis"
railway variables --set "OPENROUTER_API_KEY=your-key"
```

---

# CURSOR INSTRUCTIONS

When using Cursor to work on Railway deployments, use this prompt:

```
I need to deploy this Laravel + Vue application to Railway. 

My stack:
- Laravel 12 with PHP 8.3
- Vue 3 with Vite
- PostgreSQL database
- Redis for cache/queue/sessions
- Horizon for queue workers

Ensure the deployment:
1. Uses the multi-service pattern (separate web, horizon, scheduler)
2. Has all required PHP extensions in nixpacks.toml
3. Properly parses DATABASE_URL and REDIS_URL
4. Has a health check endpoint at /api/health
5. Runs migrations on deploy
6. Caches config/routes/views after deploy

Do not try to run everything in one container. Each service should have one job.
```

---

**This configuration has been tested and works. Follow it exactly and your deployments will succeed the first time.**
