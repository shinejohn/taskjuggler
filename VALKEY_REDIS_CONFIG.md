# Valkey/Redis Configuration for AI Tools Platform

## Service Information

**Service Name in Railway**: `Valkey-CTyp` (or just `Valkey`)
**Type**: Valkey (Redis-compatible in-memory data store)
**Purpose**: Cache, Queue, Sessions

---

## Connection Details

### Internal Connection (Railway Services → Valkey)

Use this for services running **inside Railway** (like ai-tools-api):

```bash
# If service is named "Valkey-CTyp"
REDIS_HOST=Valkey-CTyp.railway.internal
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_CLIENT=predis

# OR if service is named just "Valkey"
REDIS_HOST=Valkey.railway.internal
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_CLIENT=predis
```

### External Connection (Local Machine → Valkey)

Use this for **local development** or external access:

```bash
REDIS_HOST=ballast.proxy.rlwy.net
REDIS_PORT=[check Railway dashboard for specific port]
REDIS_PASSWORD=[if set]
```

---

## How to Verify the Correct Service Name

### Option 1: Check Railway Dashboard
1. Go to: https://railway.app/project/7e7372dd-373a-4e78-a51e-15eab332b67d
2. Look for the Valkey/Redis service
3. Note the exact service name (e.g., "Valkey" or "Valkey-CTyp")

### Option 2: Use Railway CLI
```bash
railway list --json | jq '.[] | select(.name == "Shine Dev Environment") | .services[] | select(.name | contains("Valkey"))'
```

---

## Correct Environment Variables

Based on the service name, use **ONE** of these configurations:

### If Service is Named "Valkey-CTyp":

```bash
# Redis/Valkey Connection
REDIS_CLIENT=predis
REDIS_HOST=Valkey-CTyp.railway.internal
REDIS_PORT=6379
REDIS_PASSWORD=

# Cache Configuration
CACHE_STORE=redis
CACHE_PREFIX=aitools_cache

# Queue Configuration
QUEUE_CONNECTION=redis
QUEUE_PREFIX=aitools_queue

# Session Configuration
SESSION_DRIVER=redis
SESSION_LIFETIME=120
```

### If Service is Named "Valkey":

```bash
# Redis/Valkey Connection
REDIS_CLIENT=predis
REDIS_HOST=Valkey.railway.internal
REDIS_PORT=6379
REDIS_PASSWORD=

# Cache Configuration
CACHE_STORE=redis
CACHE_PREFIX=aitools_cache

# Queue Configuration
QUEUE_CONNECTION=redis
QUEUE_PREFIX=aitools_queue

# Session Configuration
SESSION_DRIVER=redis
SESSION_LIFETIME=120
```

---

## Laravel Configuration

Your `config/database.php` should have:

```php
'redis' => [
    'client' => env('REDIS_CLIENT', 'predis'),
    
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
```

---

## Testing the Connection

### Test from Railway CLI:

```bash
# Test Redis connection
railway run --service ai-tools-api "php artisan tinker --execute='
  use Illuminate\Support\Facades\Redis;
  Redis::set(\"test_key\", \"Hello from Valkey!\");
  echo Redis::get(\"test_key\");
'"
```

### Test Cache:

```bash
railway run --service ai-tools-api "php artisan tinker --execute='
  Cache::put(\"test\", \"works\", 60);
  echo Cache::get(\"test\");
'"
```

### Test Queue:

```bash
# Dispatch a test job
railway run --service ai-tools-api "php artisan queue:work --once"
```

---

## Common Issues & Solutions

### Issue: "Connection refused"
**Cause**: Wrong REDIS_HOST
**Solution**: Verify the exact service name in Railway dashboard

### Issue: "No such host"
**Cause**: Service name doesn't match
**Solution**: 
- Check if it's `Valkey.railway.internal` or `Valkey-CTyp.railway.internal`
- Update REDIS_HOST accordingly

### Issue: "Authentication failed"
**Cause**: REDIS_PASSWORD mismatch
**Solution**: 
- Check if Valkey has a password set in Railway
- Update REDIS_PASSWORD or leave empty if no password

---

## Recommended Configuration for AI Tools

Based on best practices:

```bash
# Use the internal Railway hostname
REDIS_CLIENT=predis
REDIS_HOST=Valkey-CTyp.railway.internal  # or Valkey.railway.internal
REDIS_PORT=6379
REDIS_PASSWORD=  # Empty unless you set one

# Cache
CACHE_STORE=redis
CACHE_PREFIX=aitools_

# Queue
QUEUE_CONNECTION=redis

# Session
SESSION_DRIVER=redis
SESSION_LIFETIME=120
SESSION_ENCRYPT=false
```

---

## Update the Setup Script

The `setup-ai-tools-env.sh` script should use the correct service name.

If your service is `Valkey-CTyp`, update this line:

```bash
# Change from:
--set "REDIS_HOST=Valkey.railway.internal" \

# To:
--set "REDIS_HOST=Valkey-CTyp.railway.internal" \
```

---

## Quick Fix Command

Run this to update the REDIS_HOST if needed:

```bash
# If service is Valkey-CTyp:
railway variables --set "REDIS_HOST=Valkey-CTyp.railway.internal"

# If service is just Valkey:
railway variables --set "REDIS_HOST=Valkey.railway.internal"
```

---

**Bottom Line**: Check your Railway dashboard for the exact service name, then use `[ServiceName].railway.internal` as the REDIS_HOST. The current configuration with `Valkey.railway.internal` is likely correct unless the service is specifically named `Valkey-CTyp`.
