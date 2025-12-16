# Create Valkey Service in Railway

## Quick Command

Run this script to automatically add Valkey service:

```bash
cd /Users/johnshine/Dropbox/Fibonacco/taskjuggler/Code
./add-valkey-service.sh
```

## Manual Steps (Via Railway Dashboard)

If the script doesn't work, follow these steps:

### Step 1: Add Valkey Service

1. Go to [Railway Dashboard](https://railway.app)
2. Open your **"AI Task Juggler"** project (or your project name)
3. Click **"New"** button (top right)
4. Select **"Database"** from the dropdown
5. Choose **"Valkey"** (or **"Redis"** if Valkey is not available - they're compatible)
6. Railway will automatically:
   - Create the Valkey/Redis service
   - Set up a volume for persistence
   - Make it available to link

### Step 2: Link Valkey to Main Service

After creating the service, link it to your main `taskjuggler` service:

1. Click on your **`taskjuggler`** service (the main application)
2. Go to the **"Variables"** tab
3. Click **"New Variable"** or **"Add Reference"**
4. Select **"Add from Service"** or **"Reference"**
5. Choose your **Valkey** (or **Redis**) service from the list
6. Railway will automatically:
   - Create a `REDIS_URL` environment variable
   - Link the services
   - Make Redis accessible to your application

### Step 3: Verify REDIS_URL is Set

1. In the **Variables** tab of your `taskjuggler` service
2. Look for `REDIS_URL` - it should be something like:
   ```
   redis://default:password@redis.railway.internal:6379
   ```
3. If `REDIS_URL` is present, the link is successful ✅

### Step 4: Remove Manual Redis Settings

If you have these variables set manually, **delete them**:

- `REDIS_HOST` (especially if set to `valkey.railway.internal`)
- `REDIS_PORT`
- `REDIS_PASSWORD`

Railway uses `REDIS_URL` instead, which contains all connection information.

### Step 5: Set Redis Drivers (Optional)

If you want to use Redis for cache, sessions, and queues:

1. In the **Variables** tab, add these variables:
   - `CACHE_STORE=redis`
   - `SESSION_DRIVER=redis`
   - `QUEUE_CONNECTION=redis`

**Note**: These are optional. The defaults work fine:
- Cache: `array` (in-memory, fast)
- Session: `database` (uses PostgreSQL)
- Queue: `database` (uses PostgreSQL)

### Step 6: Redeploy

After linking:
- Railway will automatically redeploy, OR
- You can manually trigger a redeploy from the dashboard

## Verify Connection

Test that Redis is working:

```bash
railway run --service taskjuggler php artisan tinker
```

Then in tinker:
```php
>>> \Illuminate\Support\Facades\Redis::ping()
# Should return: "PONG"
```

## Troubleshooting

### If REDIS_URL is not set after linking:

1. Make sure you're in the **Variables** tab of the **main service** (not the Valkey service)
2. Try unlinking and re-linking:
   - Remove the reference
   - Add it again
3. Check that both services are in the same project

### If connection still fails:

1. Verify `REDIS_URL` is set correctly
2. Make sure `REDIS_HOST` is not set (it conflicts with `REDIS_URL`)
3. Check Railway logs for connection errors
4. Ensure the Valkey service is **Online** (green status)

## Summary

✅ **Create** Valkey service: Dashboard → New → Database → Valkey  
✅ **Link** to main service: taskjuggler → Variables → Add Reference → Select Valkey  
✅ **Verify** `REDIS_URL` is set automatically  
✅ **Remove** manual `REDIS_HOST` setting  
✅ **Test** connection with `Redis::ping()`

Once linked, Railway handles everything automatically! 🚀
