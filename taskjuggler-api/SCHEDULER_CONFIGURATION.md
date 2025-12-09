# Scheduler Service Configuration

## Status

The `_scheduler` service is being created in Railway. Once it's fully provisioned, configure it with the following:

## Configuration Steps

### 1. Link to Scheduler Service

```bash
railway service _scheduler
```

If that doesn't work, try:
```bash
railway service scheduler
```

### 2. Set Environment Variables

Once linked, set these variables:

```bash
# Core app configuration
railway variables --set "APP_NAME=Task Juggler"
railway variables --set "APP_ENV=production"
railway variables --set "APP_DEBUG=false"
railway variables --set "APP_KEY=base64:SZGbzKepGX1iCqcluQIDwoa0QidaXLtp7n8qsVWKIFg="

# Redis/Cache configuration
railway variables --set "QUEUE_CONNECTION=redis"
railway variables --set "CACHE_DRIVER=redis"
railway variables --set "SESSION_DRIVER=redis"
```

### 3. Verify Start Command

In Railway Dashboard, ensure the scheduler service has:
- **Start Command:** `php artisan schedule:work`

This command runs the Laravel scheduler continuously (Laravel 11+ approach).

### 4. Verify Scheduled Tasks

Once the service is running, test it:

```bash
railway run --service _scheduler php artisan schedule:list
```

This should show:
- Cleanup Old Notifications (daily at 2:00 AM)
- Cleanup Old Inbox Items (weekly on Sundays at 3:00 AM)
- Monitor Stale Tasks (hourly)
- Cleanup Failed Jobs (daily at 4:00 AM)

### 5. Check Logs

```bash
railway logs --service _scheduler
```

You should see the scheduler running and executing tasks at their scheduled times.

## Alternative: If Service Name is Different

If the service has a different name, find it:

1. Go to Railway Dashboard
2. Look for the scheduler service (might be named differently)
3. Note the exact service name
4. Use: `railway service <exact-name>`

## Troubleshooting

**Service not found:**
- Wait a few minutes for Railway to fully provision the service
- Check Railway dashboard to see the exact service name
- Services sometimes take 1-2 minutes to appear in CLI

**Scheduler not running:**
- Verify start command is: `php artisan schedule:work`
- Check logs: `railway logs --service _scheduler`
- Ensure environment variables are set correctly

**Tasks not executing:**
- Verify database connection (scheduler needs DB access)
- Check Redis connection (if tasks use queues)
- Review scheduled task definitions in `routes/console.php`

## Current Configuration

The scheduler service needs:
- ✅ Same environment variables as other services
- ✅ Access to PostgreSQL database
- ✅ Access to Redis (for queue-based tasks)
- ✅ Start command: `php artisan schedule:work`

All scheduled tasks are defined in `routes/console.php` and will run automatically once the service is configured and running.
