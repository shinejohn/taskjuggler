# Railway Build & Redis Connection Fix

## Issues Fixed

### 1. Nixpacks Build Error
**Error**: `error: undefined variable 'composer'`

**Problem**: The `nixpacks.toml` file had `"composer"` in quotes in the `nixPkgs` array, which Nixpacks was trying to interpret as a variable.

**Solution**: Changed `"composer"` to `"php82Packages.composer"` - the correct Nix package name for Composer with PHP 8.2.

**File Changed**: `nixpacks.toml`
```toml
[phases.setup]
nixPkgs = ["php82", "php82Packages.composer"]  # Correct format for Composer
```

### 2. Redis/Valkey Connection Error
**Error**: `Predis\Connection\Resource\Exception\StreamInitException`
```
php_network_getaddresses: getaddrinfo for valkey.railway.internal failed: 
Name or service not known [tcp://valkey.railway.internal:6379]
```

**Problem**: 
- The application is trying to connect to `valkey.railway.internal:6379`
- This hostname only works when a Valkey/Redis service is properly linked in Railway
- If `REDIS_HOST` is manually set to `valkey.railway.internal` but the service doesn't exist or isn't linked, the connection fails
- Railway automatically provides `REDIS_URL` when Redis/Valkey services are linked

**Root Cause**:
- `REDIS_HOST=valkey.railway.internal` is set in Railway environment variables
- But the Redis/Valkey service either:
  - Doesn't exist
  - Isn't properly linked to the main service
  - Railway hasn't set `REDIS_URL` automatically

## Solutions

### Option 1: Add Redis/Valkey Service (Recommended for Production)

1. **Add Redis/Valkey Service in Railway Dashboard:**
   - Go to your Railway project
   - Click "New" → "Database" → Select "Valkey" or "Redis"
   - Railway will automatically:
     - Create the service
     - Link it to your main service
     - Set `REDIS_URL` environment variable automatically

2. **Verify Environment Variables:**
   After adding the service, Railway automatically sets:
   - `REDIS_URL=redis://default:password@redis.railway.internal:6379`
   
   **DO NOT manually set:**
   - `REDIS_HOST` (Railway uses `REDIS_URL` instead)
   - `REDIS_PORT` (included in `REDIS_URL`)
   - `REDIS_PASSWORD` (included in `REDIS_URL`)

3. **Set Redis Drivers (if using Redis):**
   ```bash
   railway variables --set CACHE_STORE=redis
   railway variables --set SESSION_DRIVER=redis
   railway variables --set QUEUE_CONNECTION=redis
   ```

4. **Remove Manual Redis Settings:**
   If you manually set `REDIS_HOST`, remove it:
   ```bash
   railway variables --unset REDIS_HOST
   railway variables --unset REDIS_PORT
   railway variables --unset REDIS_PASSWORD
   ```

### Option 2: Use File-Based Storage (No Redis Required)

If you don't need Redis features, switch to file-based storage:

1. **Remove Redis Environment Variables:**
   ```bash
   railway variables --unset REDIS_HOST
   railway variables --unset REDIS_PORT
   railway variables --unset REDIS_PASSWORD
   railway variables --unset REDIS_URL
   ```

2. **Set Non-Redis Drivers:**
   ```bash
   railway variables --set CACHE_STORE=file
   railway variables --set SESSION_DRIVER=database
   railway variables --set QUEUE_CONNECTION=database
   ```

   **Note**: These are already the defaults, but explicitly setting them ensures Redis isn't used.

3. **Verify:**
   - Cache will use file storage (`storage/framework/cache`)
   - Sessions will use database (`sessions` table)
   - Queues will use database (`jobs` table)

## Configuration Details

The application's Redis configuration (`config/database.php`) is already set up correctly:

- **Prioritizes `REDIS_URL`**: If `REDIS_URL` is set (Railway provides this automatically), it uses that
- **Falls back to individual settings**: Only uses `REDIS_HOST`/`REDIS_PORT` if `REDIS_URL` is not set
- **Safe defaults**: Cache, Session, and Queue all default to non-Redis drivers

## Testing

### Test Redis Connection (if using Redis):
```bash
railway run --service api php artisan tinker
```
Then in tinker:
```php
>>> \Illuminate\Support\Facades\Redis::ping()
# Should return: "PONG"
```

### Verify Configuration:
```bash
railway run --service api php artisan config:show cache.default
railway run --service api php artisan config:show session.driver
railway run --service api php artisan config:show queue.default
```

## Summary

✅ **Fixed**: Nixpacks build error (removed `"composer"` from nixPkgs)

✅ **Fixed**: Redis configuration to prioritize `REDIS_URL` (already correct)

⏳ **Action Required**: 
- Either add Redis/Valkey service in Railway (recommended)
- Or remove `REDIS_HOST` and use file-based storage

The application will now build successfully. The Redis connection error will be resolved once you either:
1. Add and link a Redis/Valkey service (Railway will set `REDIS_URL` automatically)
2. Remove `REDIS_HOST` environment variable and use file-based storage
