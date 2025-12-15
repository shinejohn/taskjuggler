# Fix: Database Has No Tables

## Problem
Migrations show as "Ran" but tables don't exist in the Railway database.

## Solution: Force Re-run Migrations

Since the migrations table exists but tables don't, we need to reset and re-run migrations.

### Option 1: Drop and Recreate (Recommended for Development)

**In Railway Dashboard:**
1. Go to your Postgres service
2. Click "Connect" to open the database shell
3. Run: `DROP SCHEMA public CASCADE; CREATE SCHEMA public;`
4. This will delete all tables including the migrations table

**Then trigger a new deployment** - migrations will run automatically on container start.

### Option 2: Run Migrations Manually via Railway CLI

From your local machine:
```bash
cd taskjuggler-api
railway run --service api-web php artisan migrate:fresh --force
```

This will:
- Drop all tables
- Re-run all migrations from scratch

### Option 3: Check and Fix via Railway Shell

1. Open Railway shell:
```bash
railway shell --service api-web
```

2. Inside the shell, check what tables exist:
```bash
php artisan tinker
```
Then in tinker:
```php
DB::select("SELECT tablename FROM pg_tables WHERE schemaname = 'public'");
```

3. If only `migrations` table exists, drop it and re-run:
```php
DB::statement('DROP TABLE IF EXISTS migrations CASCADE');
exit
```

4. Run migrations:
```bash
php artisan migrate --force
```

## Verify Tables Exist

After running migrations, verify in Railway Dashboard:
1. Go to Postgres → Database → Data tab
2. You should see tables like: `users`, `tasks`, `teams`, `profiles`, etc.

## Recommended Approach

For production, use **Option 2** (`migrate:fresh`) if this is a fresh setup, or **Option 3** to investigate first.

