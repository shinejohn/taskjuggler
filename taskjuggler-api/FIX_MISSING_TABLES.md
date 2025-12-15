# Fix: Database Has No Tables

## Quick Fix Steps

Since migrations show as "Ran" but tables don't exist, we need to reset and re-run migrations.

### Method 1: Reset Database Schema (Fastest)

1. **In Railway Dashboard:**
   - Go to your **Postgres** service
   - Click the **"Database"** tab → **"Data"** tab
   - Click the **"Connect"** button (opens database shell)

2. **In the database shell, paste and run:**
   ```sql
   DROP SCHEMA public CASCADE;
   CREATE SCHEMA public;
   GRANT ALL ON SCHEMA public TO postgres;
   GRANT ALL ON SCHEMA public TO public;
   ```

3. **Trigger a new deployment** (or just wait for the next auto-deploy):
   - The start command will run `php artisan migrate --force` automatically
   - All tables will be created

### Method 2: Use Railway CLI from Your Machine

If you have Railway CLI set up and can connect:

```bash
cd taskjuggler-api
railway run --service api-web php artisan migrate:fresh --force
```

**Note:** This may fail if database connection uses internal Railway DNS.

### Method 3: Temporarily Modify Start Command

1. **In Railway Dashboard:**
   - Go to **api-web** service → **Settings** → **Deploy**
   - Temporarily change start command to:
     ```
     php artisan migrate:fresh --force && php artisan storage:link --force || true && php artisan serve --host=0.0.0.0 --port=$PORT
     ```

2. **Trigger a redeploy** (or wait for auto-deploy)

3. **After tables are created, change it back to:**
     ```
     php artisan migrate --force --no-interaction && php artisan storage:link --force || true && php artisan serve --host=0.0.0.0 --port=$PORT
     ```

## Recommended: Use Method 1

Method 1 is the safest and fastest - it resets the database schema and lets the normal migration process recreate everything.

## Verify Tables After Fix

After running the fix, verify in Railway:
- Postgres → Database → Data
- You should see: `users`, `tasks`, `teams`, `profiles`, `migrations`, etc.

