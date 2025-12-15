# Railway Deployment Instructions for Cursor

## Context

This project deploys to Railway using the multi-service architecture pattern. When working on deployment-related issues, follow these guidelines.

## Architecture

Railway deployments use SEPARATE SERVICES for different concerns:

1. **Web Service** - Runs `php artisan serve`
2. **Horizon Service** - Runs `php artisan horizon` (queue workers)
3. **Scheduler Service** - Runs `php artisan schedule:work` (cron jobs)
4. **PostgreSQL** - Managed database service
5. **Valkey/Redis** - Managed cache/queue service

**NEVER** try to run multiple processes (web + queue + scheduler) in a single container.

## Critical Files

### nixpacks.toml (BUILD CONFIGURATION)

Must include ALL required PHP extensions:

```toml
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
    "php83Extensions.dom",
    "php83Extensions.zip",
    "php83Extensions.curl",
    "php83Extensions.fileinfo",
    "php83Extensions.tokenizer",
    "php83Extensions.ctype",
    "php83Extensions.openssl",
    "php83Extensions.sodium",
    "nodejs_20",
    "npm"
]
```

If a build fails with "extension not found", add it here.

### config/database.php (DATABASE CONFIGURATION)

Must parse DATABASE_URL and REDIS_URL from Railway:

```php
$databaseUrl = env('DATABASE_URL');
if ($databaseUrl) {
    $parsedUrl = parse_url($databaseUrl);
    // Use parsed values for host, port, database, username, password
}
```

Railway provides these URLs automatically when you add database services.

### Procfile (START COMMAND)

Web service default:
```procfile
web: php artisan migrate --force && php artisan storage:link --force || true && php artisan serve --host=0.0.0.0 --port=${PORT:-8080}
```

### Health Check

Must have `/api/health` endpoint that returns 200 when healthy:

```php
Route::get('/health', function () {
    DB::connection()->getPdo();
    return response()->json(['status' => 'healthy']);
});
```

## Environment Variables

Railway auto-sets these when you add services:
- `DATABASE_URL` - PostgreSQL connection string
- `REDIS_URL` - Redis connection string
- `PORT` - Port to listen on
- `RAILWAY_PUBLIC_DOMAIN` - Your app's domain

You must set these manually:
- `APP_KEY` - Laravel encryption key
- `APP_ENV=production`
- `APP_DEBUG=false`
- `CACHE_STORE=redis`
- `SESSION_DRIVER=redis`
- `QUEUE_CONNECTION=redis`
- API keys (OPENROUTER_API_KEY, TWILIO_*, STRIPE_*, etc.)

## Common Issues and Solutions

### Issue: Build fails with "extension not found"
**Solution:** Add the extension to nixpacks.toml nixPkgs array

### Issue: Build fails with npm memory error
**Solution:** Use `npm ci` instead of `npm install` in nixpacks.toml

### Issue: App runs but 500 errors
**Solution:** Check APP_KEY is set, clear caches:
```bash
railway run php artisan config:clear
railway run php artisan cache:clear
```

### Issue: Cannot connect to database
**Solution:** Ensure DATABASE_URL is being parsed correctly in config/database.php

### Issue: Queue jobs not processing
**Solution:** Add a separate Horizon service with start command `php artisan horizon`

### Issue: Scheduled tasks not running
**Solution:** Add a separate Scheduler service with start command `php artisan schedule:work`

### Issue: Storage link errors
**Solution:** The start command should include `php artisan storage:link --force || true`

## Commands

```bash
# Deploy
railway up

# View logs
railway logs -f

# Run artisan commands
railway run php artisan migrate
railway run php artisan tinker

# Set variables
railway variables --set "KEY=value"

# SSH into container
railway shell
```

## When Making Changes

1. Test locally first with `composer dev` or similar
2. Ensure nixpacks.toml has all required extensions
3. Ensure config/database.php parses DATABASE_URL
4. Ensure /api/health endpoint exists
5. Commit and push - Railway auto-deploys from GitHub
6. Check `railway logs -f` for issues

## Do NOT

- Try to run web + queue + scheduler in one container
- Use `npm install` (use `npm ci` instead)
- Hardcode database credentials
- Skip the health check endpoint
- Forget to set APP_KEY
- Use file-based sessions/cache in production (use Redis)
