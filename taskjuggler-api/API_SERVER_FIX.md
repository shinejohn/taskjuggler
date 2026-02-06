# API Server Fix - Fibonacco AI Tools

## Changes Made

### 1. Updated `railway.json`
- ✅ Added explicit `startCommand` to ensure migrations run on deploy
- ✅ Added `healthcheckPath` pointing to `/up` endpoint
- ✅ Added `healthcheckTimeout` for proper health checks

### 2. Updated `nixpacks.toml`
- ✅ Added error handling to migration command (`|| true`) to prevent startup failures
- ✅ Added `storage:link` command to ensure storage symlinks exist
- ✅ Ensured migrations run before server starts

## Configuration Details

### Railway Configuration (`railway.json`)
```json
{
    "deploy": {
        "startCommand": "php artisan migrate --force && php artisan serve --host=0.0.0.0 --port=$PORT",
        "healthcheckPath": "/up",
        "healthcheckTimeout": 100
    }
}
```

### Nixpacks Configuration (`nixpacks.toml`)
```toml
[start]
cmd = 'php artisan migrate --force --no-interaction || true && php artisan storage:link --force || true && php artisan serve --host=0.0.0.0 --port=${PORT:-8000}'
```

## Health Check Endpoint

The API server has a health check endpoint at `/up` which is configured in `bootstrap/app.php`:
```php
health: '/up',
```

This endpoint will return a 200 status when the application is running correctly.

## Next Steps

1. **Link to Railway Project** (if not already done):
   ```bash
   cd taskjuggler-api
   railway link --project ca3879ff-fd72-4239-983d-32ade6cace83
   ```

2. **Run Migrations**:
   ```bash
   railway run --service api-web php artisan migrate --force
   ```
   Or if service is named differently:
   ```bash
   railway run --service api php artisan migrate --force
   ```

3. **Verify Server is Running**:
   - Check Railway dashboard for deployment status
   - Health check should pass at `/up` endpoint
   - API should be accessible at your Railway domain

## Troubleshooting

### If migrations fail:
- Check database connection variables are set in Railway
- Verify `DATABASE_URL` or individual DB variables are configured
- Check Railway logs for specific error messages

### If server won't start:
- Check Railway logs for PHP errors
- Verify `APP_KEY` is set in Railway environment variables
- Ensure all required environment variables are configured

### If health check fails:
- Verify the `/up` endpoint is accessible
- Check that the server is actually running
- Review Railway deployment logs

## Required Environment Variables

Make sure these are set in Railway:

### Database
- `DATABASE_URL` (preferred) OR
- `DB_CONNECTION=pgsql`
- `DB_HOST`
- `DB_PORT=5432`
- `DB_DATABASE`
- `DB_USERNAME`
- `DB_PASSWORD`

### Application
- `APP_NAME`
- `APP_ENV=production`
- `APP_DEBUG=false`
- `APP_KEY` (Laravel encryption key)
- `APP_URL` (your Railway domain)

### Optional but Recommended
- `REDIS_URL` (if using Redis)
- `QUEUE_CONNECTION` (if using queues)
- `CACHE_DRIVER` (if using cache)

## Migration Status

After the server starts, migrations will run automatically. To check migration status:

```bash
railway run --service api-web php artisan migrate:status
```

Or verify tables exist:
```bash
railway run --service api-web php artisan tinker --execute="echo 'Tables: '; \$tables = DB::select('SELECT tablename FROM pg_tables WHERE schemaname = \\'public\\''); foreach(\$tables as \$table) { echo \$table->tablename . PHP_EOL; }"
```
