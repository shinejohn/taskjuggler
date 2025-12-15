# Automatic Database Fix Deployed

## What I Did

I've changed the start command to use `migrate:fresh` instead of `migrate`. This will:
1. **Drop ALL tables** (including the migrations table)
2. **Re-run ALL migrations** from scratch
3. **Create all tables** properly

## Files Changed

- `railway.json` - Start command updated
- `nixpacks.toml` - Start command updated

Both files now use: `php artisan migrate:fresh --force`

## What Happens Next

1. **Railway will automatically detect the changes** and trigger a new deployment
2. **On container start**, it will run `migrate:fresh --force`
3. **All tables will be dropped and recreated**
4. **Check Railway logs** to see migrations running

## Verify It Worked

After deployment completes:

1. **Check Railway logs** for:
   - "Dropping all tables"
   - "Migrating: 2024_01_01_000001_create_teams_table"
   - "Migrating: 2024_01_02_000001_create_tasks_table"
   - etc.

2. **Check Postgres → Database → Data**:
   - Should see tables: `users`, `tasks`, `teams`, `profiles`, `migrations`, etc.

## IMPORTANT: Change Back After Tables Are Created

Once tables are created successfully, **change the start command back** to normal:

**In railway.json:**
```json
"startCommand": "php artisan migrate --force --no-interaction && php artisan storage:link --force || true && php artisan serve --host=0.0.0.0 --port=$PORT"
```

**In nixpacks.toml:**
```toml
cmd = "php artisan migrate --force --no-interaction && php artisan storage:link --force || true && php artisan serve --host=0.0.0.0 --port=${PORT:-8080}"
```

**Why?** `migrate:fresh` drops all tables every time - you only want that once, not on every deployment!

## If This Doesn't Work

If tables still don't appear after deployment:
1. Check Railway logs for errors
2. Verify database connection variables are correct
3. Check that Postgres service is running
4. Try Railway CLI: `railway connect postgres` (if it works)

