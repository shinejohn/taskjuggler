# Database Tables Missing - Quick Fix Guide

## Issue
Railway database shows "You have no tables" but migrations report as "Ran".

## Quick Fix (Recommended)

Run this command from your local machine:

```bash
cd taskjuggler-api
railway run --service api-web php artisan migrate:fresh --force
```

This will:
1. Drop all existing tables (including the `migrations` table)
2. Re-run ALL migrations from scratch
3. Create all tables properly

## Alternative: Manual Database Reset

If the above doesn't work, reset the database schema:

1. **In Railway Dashboard:**
   - Go to your Postgres service
   - Click "Database" tab → "Data" tab
   - Click "Connect" button (opens database shell)
   
2. **In the database shell, run:**
   ```sql
   DROP SCHEMA public CASCADE;
   CREATE SCHEMA public;
   GRANT ALL ON SCHEMA public TO postgres;
   GRANT ALL ON SCHEMA public TO public;
   ```

3. **Then trigger a new deployment:**
   - The migrations will run automatically on container start

## Verify After Fix

After running migrations, verify tables exist:

1. **Via Railway Dashboard:**
   - Postgres → Database → Data
   - You should see tables: `users`, `tasks`, `teams`, `profiles`, etc.

2. **Via CLI:**
   ```bash
   railway run --service api-web php artisan db:show
   ```

## Why This Happened

This typically occurs when:
- Migrations ran against a different database during build
- Database was reset/cleared after migrations ran
- Migration execution failed silently

The `migrate:fresh` command ensures a clean state and proper table creation.

