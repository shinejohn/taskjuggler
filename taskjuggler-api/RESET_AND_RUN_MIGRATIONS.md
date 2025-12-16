# Reset Database and Run Migrations

## Problem
- Variables are set correctly ✅
- Migrations show as "Ran" but tables don't exist ❌
- Database connection works inside Railway network ✅

## Solution: Reset Database Schema

Since migrations table exists but actual tables don't, we need to reset the database.

### Method 1: Reset via Railway Dashboard (Recommended)

1. **Go to Railway Dashboard → Postgres service**
2. **Click "Database" tab → "Data" tab**
3. **Click "Connect" button** (opens database shell)
4. **In the database shell, run:**
   ```sql
   DROP SCHEMA public CASCADE;
   CREATE SCHEMA public;
   GRANT ALL ON SCHEMA public TO postgres;
   GRANT ALL ON SCHEMA public TO public;
   ```

5. **Trigger a new deployment** (or wait for auto-deploy):
   - Go to `api-web` service
   - Click "Deployments" tab
   - Click "Redeploy" on the latest deployment
   - OR make a small change (like adding a comment) and push to trigger deployment

6. **Check deployment logs:**
   - Should show: "Running migrations"
   - Should show: "Migrating: 2024_01_01_000001_create_teams_table"
   - Should show: "Migrating: 2024_01_02_000001_create_tasks_table"
   - etc.

7. **Verify tables:**
   - Go back to Postgres → Database → Data
   - Should see tables: `users`, `tasks`, `teams`, `profiles`, `migrations`, etc.

### Method 2: Check Railway Logs First

Before resetting, check what happened:

1. **Go to Railway Dashboard → api-web service**
2. **Click "Deployments" tab**
3. **Click on the latest deployment**
4. **Check the logs for:**
   - Did migrations run? (Look for "Running migrations" or "Nothing to migrate")
   - Any errors? (Look for connection errors, migration errors)
   - What happened during container start?

### Method 3: Force Fresh Migrations

If you want to force migrations to run again:

1. **In Railway Dashboard → Postgres → Database → Connect**
2. **Run:**
   ```sql
   DROP TABLE IF EXISTS migrations CASCADE;
   ```
3. **Trigger redeploy** - migrations will run from scratch

## Why This Happened

Possible causes:
- Migrations ran against a different database during build
- Database was reset/cleared after migrations ran
- Migration execution failed silently
- Migrations table was created but actual migrations didn't execute

## After Reset

Once tables are created, verify:
- ✅ Tables exist in Postgres → Database → Data
- ✅ API health endpoint works: `https://api-web-production-cc91.up.railway.app/api/health`
- ✅ No database errors in logs

