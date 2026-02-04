# Railway AI Tools Deployment Plan

## Overview
Migrate the TaskJuggler platform (now called "AI Tools") to Railway with a dedicated database and service group.

## Current State Analysis
From the uploaded image, the AI TOOLS group in Railway's Shine Dev Environment contains:
- **taskjuggler** (Build failed 12 hours ago)
- **Postgres** (postgres-internal-M5cg)
- **Site Health** (Build failed 12 hours ago)
- **Idea Circuit** (Build failed 12 hours ago)
- **Valkey-CTjp** (Online)
- **4process** (Build failed 12 hours ago)
- **4projects** (Build failed 12 hours ago)
- **URPA** (Build failed 12 hours ago)
- **4calls** (Build failed 12 hours ago)
- **AI Storage???** (empty)
- **Nutrisoft** (Build failed 12 hours ago)

## Local Codebase Structure
The `/Users/johnshine/Dropbox/Fibonacco/taskjuggler/Code` directory contains:

### Backend API
- **taskjuggler-api** - Laravel API (main backend)

### Frontend Applications
1. **taskjuggler-web** - Main TaskJuggler web interface
2. **taskjuggler-app** - TaskJuggler mobile/app interface
3. **4doctors-web** - 4Healthcare/ScribeMD interface
4. **urpa-web** - URPA (Scheduler) interface
5. **process-web** - 4Process interface
6. **projects-web** - 4Projects interface
7. **coordinator-web** - Coordinator interface
8. **scanner-web** - Site Health Scanner interface
9. **ideacircuit-web** - Idea Circuit interface
10. **official-notice-web** - Official Notice interface

### Supporting Services
- **scanner-worker** - Background worker for scanner
- **scanner-mcp** - MCP server for scanner
- **shared-ui** - Shared UI components library

## Deployment Architecture

### Database Strategy
**Create: Postgres - AI TOOLS**
- New dedicated PostgreSQL database for the AI Tools ecosystem
- Will replace the existing "Postgres" service in the AI TOOLS group
- Connection pattern: `postgres-aitools.railway.internal:5432`

### Service Mapping

| Local Directory | Railway Service Name | Type | Port | Notes |
|----------------|---------------------|------|------|-------|
| taskjuggler-api | taskjuggler-api | Laravel API | 8000 | Main backend API |
| taskjuggler-web | taskjuggler | Vite/Vue | 5173 | Main web UI |
| 4doctors-web | 4healthcare | Vite/Vue | 5173 | Healthcare module |
| urpa-web | URPA | Vite/Vue | 5173 | Scheduler |
| process-web | 4process | Vite/Vue | 5173 | Process management |
| projects-web | 4projects | Vite/Vue | 5173 | Project management |
| scanner-web | Site Health | Vite/Vue | 5173 | Site scanner UI |
| ideacircuit-web | Idea Circuit | Vite/Vue | 5173 | Idea management |
| coordinator-web | coordinator | Vite/Vue | 5173 | Coordinator UI |
| official-notice-web | official-notice | Vite/Vue | 5173 | Legal notices |
| scanner-worker | scanner-worker | Node Worker | N/A | Background jobs |

### Shared Infrastructure
- **Valkey-CTjp** - Already exists, will be used for Redis/cache
- **Postgres - AI TOOLS** - New database to be created

## Implementation Steps

### Phase 1: Database Setup
1. ✅ Create new PostgreSQL database "Postgres - AI TOOLS" in Railway
2. ✅ Configure shared database variables
3. ✅ Run migrations from taskjuggler-api

### Phase 2: Backend API Deployment
1. ✅ Create/update `taskjuggler-api` service
2. ✅ Configure railway.json for Laravel deployment
3. ✅ Set environment variables (DB, Redis, APP_KEY, etc.)
4. ✅ Deploy and verify migrations run successfully

### Phase 3: Frontend Applications Deployment
For each frontend app:
1. ✅ Create/update Railway service
2. ✅ Create railway.json with Nixpacks configuration
3. ✅ Set VITE_API_URL to point to taskjuggler-api
4. ✅ Deploy and verify build succeeds

### Phase 4: Worker Services
1. ✅ Deploy scanner-worker
2. ✅ Configure queue connections

### Phase 5: Verification
1. ✅ All services building successfully
2. ✅ All services deploying without errors
3. ✅ Database connections verified
4. ✅ API endpoints responding
5. ✅ Frontend apps loading and connecting to API

## Environment Variables Strategy

### Shared Variables (All Services)
```bash
APP_ENV=production
APP_DEBUG=false
LOG_CHANNEL=stderr
LOG_LEVEL=info
```

### Database Variables (Backend + Workers)
```bash
DB_CONNECTION=pgsql
DB_HOST=postgres-aitools.railway.internal
DB_PORT=5432
DB_DATABASE=railway
DB_USERNAME=postgres
DB_PASSWORD=[from Railway Postgres service]
DATABASE_URL=postgresql://postgres:[password]@postgres-aitools.railway.internal:5432/railway
```

### Redis Variables (Backend + Workers)
```bash
REDIS_HOST=Valkey.railway.internal
REDIS_PORT=6379
REDIS_PASSWORD=[if set]
CACHE_STORE=redis
QUEUE_CONNECTION=redis
SESSION_DRIVER=redis
```

### Backend-Specific (taskjuggler-api)
```bash
APP_NAME="TaskJuggler AI Tools"
APP_KEY=[generate via php artisan key:generate]
APP_URL=https://taskjuggler-api-production.up.railway.app
```

### Frontend-Specific (Each Vue App)
```bash
VITE_API_URL=https://taskjuggler-api-production.up.railway.app
```

## Build Configuration

### Laravel API (taskjuggler-api)
**railway.json:**
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS",
    "nixpacksConfigPath": "nixpacks.toml"
  },
  "deploy": {
    "numReplicas": 1,
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

**nixpacks.toml:**
```toml
[phases.setup]
nixPkgs = ['php83', 'php83Packages.composer', 'nodejs_20']

[phases.install]
cmds = ['composer install --no-dev --optimize-autoloader']

[phases.build]
cmds = ['php artisan config:cache', 'php artisan route:cache', 'php artisan view:cache']

[start]
cmd = 'php artisan migrate --force && php artisan serve --host=0.0.0.0 --port=${PORT:-8000}'
```

### Vue/Vite Frontends
**railway.json:**
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "numReplicas": 1,
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

Nixpacks will auto-detect Vite and build appropriately.

## Success Criteria
- [ ] New "Postgres - AI TOOLS" database created and accessible
- [ ] All 11 services deployed and showing "Online" status
- [ ] Zero build failures in the AI TOOLS group
- [ ] Database migrations completed successfully
- [ ] All frontend apps can connect to the API
- [ ] Health checks passing for all services

## Risk Mitigation
1. **Database Migration**: Run migrations in a transaction, test locally first
2. **Build Failures**: Start with API, then add frontends incrementally
3. **Environment Variables**: Use Railway's shared variables feature for common configs
4. **Rollback Plan**: Keep existing services until new deployment is verified

## Next Steps
1. Review and approve this plan
2. Create the new Postgres database
3. Begin Phase 1 implementation
