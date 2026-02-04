# Railway AI Tools Deployment Guide

## Current Status

✅ **Database Created**: Postgres - AI TOOLs (ID: 9d88de97-326b-48f1-9094-d1ed206ea084)
✅ **Backend Configured**: taskjuggler service has database and Redis variables set
✅ **Deployment Files Created**: railway.json and nixpacks.toml created for all apps

## Database Connection Details

The Postgres - AI TOOLs database uses Railway's variable reference system:

```bash
RAILWAY_PRIVATE_DOMAIN="postgres-ea870ea6.railway.internal"
POSTGRES_PASSWORD="FzULulOrNbBNaiUkYutiRcTQMSqPlhhR"
POSTGRES_USER="postgres"
POSTGRES_DB="railway"
DATABASE_URL="postgresql://postgres:FzULulOrNbBNaiUkYutiRcTQMSqPlhhR@postgres-ea870ea6.railway.internal:5432/railway"
```

## Service Mapping

| Local Directory | Railway Service | Status | Notes |
|----------------|----------------|--------|-------|
| taskjuggler-api | taskjuggler | ✅ Configured | Backend API with DB + Redis |
| 4doctors-web | 4Doctors | ✅ Configured | Healthcare UI |
| urpa-web | URPA | ⏳ Pending | Scheduler UI |
| process-web | 4process | ⏳ Pending | Process management |
| projects-web | 4projects | ⏳ Pending | Project management |
| scanner-web | Site Health | ⏳ Pending | Scanner UI |
| ideacircuit-web | Idea Circuit | ⏳ Pending | Idea management |
| coordinator-web | coordinator | ❌ Not found | Need to create service |
| official-notice-web | official-notice | ❌ Not found | Need to create service |

## Next Steps

### 1. Complete Frontend Configuration

Run these commands to configure remaining frontend services:

```bash
cd /Users/johnshine/Dropbox/Fibonacco/taskjuggler/Code/taskjuggler-api

# Configure URPA
railway variables --service "URPA" \
  --set "VITE_API_URL=https://taskjuggler-production.up.railway.app" \
  --set "NODE_ENV=production"

# Configure 4process
railway variables --service "4process" \
  --set "VITE_API_URL=https://taskjuggler-production.up.railway.app" \
  --set "NODE_ENV=production"

# Configure 4projects
railway variables --service "4projects" \
  --set "VITE_API_URL=https://taskjuggler-production.up.railway.app" \
  --set "NODE_ENV=production"

# Configure Site Health
railway variables --service "Site Health" \
  --set "VITE_API_URL=https://taskjuggler-production.up.railway.app" \
  --set "NODE_ENV=production"

# Configure Idea Circuit
railway variables --service "Idea Circuit" \
  --set "VITE_API_URL=https://taskjuggler-production.up.railway.app" \
  --set "NODE_ENV=production"
```

### 2. Create Missing Services

For `coordinator` and `official-notice`, create new services in Railway:
1. Go to Railway dashboard
2. Click "+ New Service"
3. Select "GitHub Repo"
4. Configure the service to point to the correct directory

### 3. Commit and Push Configuration Files

```bash
cd /Users/johnshine/Dropbox/Fibonacco/taskjuggler/Code

# Add all railway.json files
git add taskjuggler-api/railway.json
git add taskjuggler-api/nixpacks.toml
git add */railway.json

# Commit
git commit -m "feat: add Railway deployment configurations for AI Tools platform"

# Push to trigger deployments
git push origin main
```

### 4. Monitor Deployments

```bash
# Check taskjuggler API deployment
railway logs --service taskjuggler

# Check build status
railway status

# Verify database migrations
railway run --service taskjuggler "php artisan migrate:status"
```

### 5. Verify Each Service

After deployments complete, verify:
- [ ] taskjuggler API is online and responding
- [ ] Database migrations completed successfully
- [ ] All frontend apps are building successfully
- [ ] Frontend apps can connect to the API
- [ ] No build errors in Railway dashboard

## Troubleshooting

### If API fails to start:
```bash
# Check logs
railway logs --service taskjuggler

# Verify database connection
railway variables --service taskjuggler | grep DB_

# Test database connectivity
railway run --service taskjuggler "php artisan tinker --execute='DB::connection()->getPdo();'"
```

### If frontend fails to build:
```bash
# Check logs for specific service
railway logs --service "4Doctors"

# Verify environment variables
railway variables --service "4Doctors"

# Check package.json exists
ls -la 4doctors-web/package.json
```

### If migrations fail:
```bash
# Run migrations manually
railway run --service taskjuggler "php artisan migrate --force"

# Check migration status
railway run --service taskjuggler "php artisan migrate:status"

# Rollback if needed
railway run --service taskjuggler "php artisan migrate:rollback"
```

## Database Migration Strategy

The taskjuggler-api service is configured to run migrations automatically on startup via nixpacks.toml:

```toml
[start]
cmd = 'php artisan migrate --force && php artisan serve --host=0.0.0.0 --port=${PORT:-8000}'
```

This ensures the database schema is always up-to-date when the service deploys.

## Success Criteria

- [x] Postgres - AI TOOLs database created
- [x] taskjuggler service configured with database variables
- [x] taskjuggler service configured with Redis variables
- [x] railway.json created for all applications
- [x] 4Doctors frontend configured
- [ ] All remaining frontends configured
- [ ] All services building successfully
- [ ] Database migrations completed
- [ ] All services showing "Online" status in Railway
- [ ] Zero build failures in AI TOOLS group
