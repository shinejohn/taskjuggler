# Railway Configuration - shinejohn Workspace / Fibonacco Project

## Configuration Details

**Workspace:** shinejohn  
**Project:** Fibonacco AI  
**GitHub Repo:** `shinejohn/taskjuggler`

## Current Setup

### Railway CLI Status
- ✅ Logged in as: john_shine@hotmail.com
- ✅ Project linked: Fibonacco AI
- ✅ Environment: production

### Repository Structure
```
shinejohn/taskjuggler (GitHub)
├── taskjuggler-api/    (Laravel backend)
└── taskjuggler-web/    (Vue.js frontend)
```

### Databases (Railway)
- ✅ Postgres (1 instance - with volume)
- ✅ Redis (1 instance - with volume)

## Services to Create

When connecting GitHub repos in Railway dashboard, use:

**Workspace:** shinejohn  
**Project:** Fibonacco AI

**Services needed:**
1. `api-web` - Root: `taskjuggler-api`
2. `api-worker` - Root: `taskjuggler-api`, Start: `worker`
3. `api-scheduler` - Root: `taskjuggler-api`, Start: `scheduler`
4. `taskjuggler` - Root: `taskjuggler-web`

## Commands Reference

```bash
# Check current status
railway status

# View project info
railway status

# Link to service (after creation in dashboard)
cd taskjuggler-api
railway service  # Select service from list

# Set environment variables
railway variables --set KEY=value

# Generate domain
railway domain generate

# Run migrations
railway run php artisan migrate --force
```

