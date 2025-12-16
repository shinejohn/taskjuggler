# Railway Services Verification & Setup Report

## PART 1: VERIFICATION RESULTS

### A. Valkey (Redis) Service

- ❌ **Is there a Valkey plugin added to the Railway project?** 
  - **Status:** NOT VERIFIED - Need to check Railway dashboard or CLI
  - **Action Required:** Add Redis/Valkey service via Railway dashboard or CLI

- ❌ **Is REDIS_HOST set in environment variables?**
  - **Status:** NOT SET - Railway typically uses REDIS_URL instead
  - **Action Required:** Railway auto-sets REDIS_URL when Redis service is added

- ❌ **Is REDIS_PORT set (usually 6379)?**
  - **Status:** NOT SET - Railway auto-configures via REDIS_URL
  - **Action Required:** Railway handles this automatically

- ❌ **Can the app connect to Valkey? (test with php artisan tinker → Redis::ping())**
  - **Status:** NOT TESTED - Cannot test until Redis service is added
  - **Action Required:** Test connection after Redis service is added

**Configuration Status:**
- ✅ Redis configuration exists in `config/database.php`
- ✅ Supports both REDIS_URL and individual REDIS_HOST/REDIS_PORT/REDIS_PASSWORD
- ✅ Queue connection supports Redis (`config/queue.php`)

---

### B. Laravel Horizon (Queue Worker)

- ❌ **Is laravel/horizon in composer.json?**
  - **Status:** NOT INSTALLED
  - **Current:** Using basic `php artisan queue:work` (Procfile line 2)
  - **Action Required:** Decide between Horizon (dashboard) or basic queue worker

- ❌ **Does config/horizon.php exist?**
  - **Status:** DOES NOT EXIST
  - **Action Required:** Only needed if installing Horizon

- ❌ **Is there a separate Railway service named ops-horizon (or similar)?**
  - **Status:** NOT CREATED
  - **Current:** Procfile defines `worker` process
  - **Action Required:** Create separate Railway service for queue worker

- ❌ **Is that service's start command set to php artisan horizon?**
  - **Status:** N/A - Horizon not installed
  - **Current:** Procfile uses `php artisan queue:work --tries=3 --timeout=300`
  - **Action Required:** If using Horizon, change to `php artisan horizon`

- ✅ **Is QUEUE_CONNECTION=redis in .env?**
  - **Status:** CONFIGURED - Queue config supports Redis
  - **Action Required:** Set `QUEUE_CONNECTION=redis` in Railway environment variables

**Current Setup:**
- ✅ Procfile has worker process: `worker: php artisan queue:work --tries=3 --timeout=300`
- ✅ Queue configuration supports Redis driver
- ⚠️ **Decision Needed:** Use Horizon (dashboard + monitoring) or basic queue worker?

---

### C. Laravel Scheduler

- ❌ **Is there a separate Railway service named ops-scheduler (or similar)?**
  - **Status:** NOT CREATED
  - **Current:** Procfile defines `scheduler` process but it's not in current Procfile
  - **Action Required:** Create separate Railway service for scheduler

- ❌ **Is that service's start command set to php artisan schedule:work?**
  - **Status:** NOT CONFIGURED
  - **Action Required:** Create service with `php artisan schedule:work` command

- ❌ **Are scheduled tasks defined in app/Console/Kernel.php or routes/console.php?**
  - **Status:** NO SCHEDULED TASKS DEFINED
  - **Current:** `routes/console.php` only has example `inspire` command
  - **Action Required:** Define scheduled tasks if needed

**Current Setup:**
- ✅ Laravel 11+ supports `schedule:work` (runs scheduler continuously)
- ✅ `routes/console.php` exists for console commands
- ❌ No scheduled tasks defined yet

---

## PART 2: RECOMMENDED ACTIONS

### Option 1: Basic Setup (Recommended for MVP)
1. Add Redis/Valkey service in Railway
2. Create separate Railway service for queue worker (using `queue:work`)
3. Create separate Railway service for scheduler (using `schedule:work`)
4. Set `QUEUE_CONNECTION=redis` in Railway environment variables

### Option 2: Horizon Setup (Recommended for Production)
1. Install Laravel Horizon: `composer require laravel/horizon`
2. Publish Horizon config: `php artisan horizon:install`
3. Add Redis/Valkey service in Railway
4. Create separate Railway service for Horizon worker
5. Create separate Railway service for scheduler
6. Set `QUEUE_CONNECTION=redis` in Railway environment variables

---

## PART 3: RAILWAY SERVICE STRUCTURE

Recommended Railway services:

1. **api** (Main Laravel Application)
   - Type: Web Service
   - Start Command: `php artisan serve --host=0.0.0.0 --port=$PORT`

2. **worker** (Queue Worker)
   - Type: Worker Service
   - Start Command: `php artisan queue:work --tries=3 --timeout=300 --sleep=3`
   - OR (if using Horizon): `php artisan horizon`

3. **scheduler** (Cron Scheduler)
   - Type: Worker Service
   - Start Command: `php artisan schedule:work`

4. **postgres** (Database)
   - Type: PostgreSQL Plugin

5. **redis** (Cache/Queue)
   - Type: Redis/Valkey Plugin

---

## PART 4: ENVIRONMENT VARIABLES CHECKLIST

Required for Queue & Scheduler:

- [ ] `QUEUE_CONNECTION=redis`
- [ ] `REDIS_URL` (auto-set by Railway when Redis service added)
- [ ] `REDIS_HOST` (if not using REDIS_URL)
- [ ] `REDIS_PORT` (if not using REDIS_URL)
- [ ] `REDIS_PASSWORD` (if not using REDIS_URL)

Optional for Horizon:
- [ ] `HORIZON_PREFIX` (default: `horizon`)
- [ ] `HORIZON_BALANCE_STRATEGY` (default: `auto`)
