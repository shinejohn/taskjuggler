# Fix Database Without Shell Access

## Problem
Can't connect to database shell via Railway Dashboard. Need alternative method.

## Solution 1: Temporarily Change Start Command (Easiest)

### Step 1: Modify Start Command in Railway Dashboard

1. **Go to Railway Dashboard → api-web service**
2. **Click "Settings" tab → "Deploy" section**
3. **Find "Start Command"**
4. **Temporarily change it to:**
   ```
   php artisan migrate:fresh --force && php artisan storage:link --force || true && php artisan serve --host=0.0.0.0 --port=$PORT
   ```

5. **Save** - Railway will automatically redeploy

6. **Wait for deployment to complete** (check logs)

7. **Change Start Command back to:**
   ```
   php artisan migrate --force --no-interaction && php artisan storage:link --force || true && php artisan serve --host=0.0.0.0 --port=$PORT
   ```

### What This Does
- `migrate:fresh` drops ALL tables (including migrations table) and re-runs all migrations
- This will create all tables from scratch
- After it works, change back to normal `migrate` command

## Solution 2: Use Railway CLI to Connect

Try connecting via CLI:

```bash
railway connect postgres
```

If that works, you can run SQL commands directly.

## Solution 3: Create a One-Time Migration Script

Create a script that resets the database:

1. **Create file:** `taskjuggler-api/database/reset.php`
2. **Add this content:**
   ```php
   <?php
   require __DIR__.'/../vendor/autoload.php';
   $app = require_once __DIR__.'/../bootstrap/app.php';
   $app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();
   
   // Drop migrations table
   DB::statement('DROP TABLE IF EXISTS migrations CASCADE');
   
   echo "Migrations table dropped. Run: php artisan migrate --force\n";
   ```

3. **Run via Railway:**
   ```bash
   railway run --service api-web php database/reset.php
   railway run --service api-web php artisan migrate --force
   ```

## Recommended: Use Solution 1

Solution 1 is the easiest - just temporarily change the start command to use `migrate:fresh`, let it deploy, then change it back.

