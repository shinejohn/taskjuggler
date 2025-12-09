# Worker & Scheduler Configuration - Complete ✅

**Date:** December 2025  
**Status:** ✅ **CONFIGURED**

---

## Configuration Summary

Both `worker` and `scheduler` services have been fully configured via Railway CLI.

---

## Worker Service Configuration ✅

### Start Command
- ✅ `php artisan queue:work --tries=3 --timeout=300 --sleep=3`

### Environment Variables Set
- ✅ `START_COMMAND=php artisan queue:work --tries=3 --timeout=300 --sleep=3`
- ✅ `APP_KEY=base64:SZGbzKepGX1iCqcluQIDwoa0QidaXLtp7n8qsVWKIFg=`
- ✅ `APP_ENV=production`
- ✅ `APP_DEBUG=false`
- ✅ `APP_NAME=Task Juggler`
- ✅ `DATABASE_URL=postgresql://...` (from Postgres service)
- ✅ `DB_URL=postgresql://...` (from Postgres service)
- ✅ `DB_CONNECTION=pgsql`
- ✅ `REDIS_URL=redis://...` (from Redis service)
- ✅ `QUEUE_CONNECTION=redis`
- ✅ `CACHE_DRIVER=redis`
- ✅ `SESSION_DRIVER=redis`
- ✅ `RAILWAY_ROOT_DIRECTORY=taskjuggler-api`

### Status
- ✅ All required variables configured
- ✅ Database connection set
- ✅ Redis connection set
- ✅ Ready to process queue jobs

---

## Scheduler Service Configuration ✅

### Start Command
- ✅ `php artisan schedule:work`

### Environment Variables Set
- ✅ `START_COMMAND=php artisan schedule:work`
- ✅ `APP_KEY=base64:SZGbzKepGX1iCqcluQIDwoa0QidaXLtp7n8qsVWKIFg=`
- ✅ `APP_ENV=production`
- ✅ `APP_DEBUG=false`
- ✅ `APP_NAME=Task Juggler`
- ✅ `DATABASE_URL=postgresql://...` (from Postgres service)
- ✅ `DB_URL=postgresql://...` (from Postgres service)
- ✅ `DB_CONNECTION=pgsql`
- ✅ `REDIS_URL=redis://...` (from Redis service)
- ✅ `QUEUE_CONNECTION=redis`
- ✅ `CACHE_DRIVER=redis`
- ✅ `SESSION_DRIVER=redis`
- ✅ `RAILWAY_ROOT_DIRECTORY=taskjuggler-api`

### Status
- ✅ All required variables configured
- ✅ Database connection set
- ✅ Redis connection set
- ✅ Ready to run scheduled tasks

---

## Scheduled Tasks Configured

The scheduler will run these tasks automatically:

1. **Cleanup Old Notifications** - Daily at 2:00 AM
   - Removes read notifications older than 30 days

2. **Cleanup Old Inbox Items** - Weekly on Sundays at 3:00 AM
   - Removes processed inbox items older than 90 days

3. **Monitor Stale Tasks** - Hourly
   - Logs tasks with no activity for 7+ days

4. **Cleanup Failed Jobs** - Daily at 4:00 AM
   - Removes failed jobs older than 7 days

---

## Verification

### Check Worker Service
```bash
railway service worker
railway variables
railway logs --service worker
```

### Check Scheduler Service
```bash
railway service scheduler
railway variables
railway logs --service scheduler
```

### Test Queue Processing
```bash
railway run --service worker php artisan tinker
>>> \Illuminate\Support\Facades\Queue::connection('redis')->size()
```

### Test Scheduled Tasks
```bash
railway run --service scheduler php artisan schedule:list
```

---

## Next Steps

1. ✅ **Worker configured** - Should start processing queue jobs
2. ✅ **Scheduler configured** - Should start running scheduled tasks
3. ⚠️ **Verify services are running** - Check Railway dashboard
4. ⚠️ **Monitor logs** - Ensure no errors on startup

---

## Troubleshooting

### Worker Not Starting
- Check logs: `railway logs --service worker`
- Verify `START_COMMAND` is set correctly
- Ensure `DATABASE_URL` and `REDIS_URL` are set
- Check `RAILWAY_ROOT_DIRECTORY` is set to `taskjuggler-api`

### Scheduler Not Starting
- Check logs: `railway logs --service scheduler`
- Verify `START_COMMAND` is set correctly
- Ensure `DATABASE_URL` is set (scheduler needs DB access)
- Check `RAILWAY_ROOT_DIRECTORY` is set to `taskjuggler-api`

### Connection Issues
- Verify database service is online
- Verify Redis service is online
- Check environment variables are set correctly
- Ensure services are in the same Railway project

---

## Configuration Complete! ✅

Both services are now fully configured and ready to run. They should automatically start when Railway detects the configuration changes.
