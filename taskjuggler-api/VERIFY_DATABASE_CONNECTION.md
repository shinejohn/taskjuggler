# Verify Database Connection

## Current Variables (from api-web service)

```
DATABASE_URL="${{Postgres.DATABASE_URL}}"
DB_CONNECTION="pgsql"
DB_DATABASE="${{Postgres.PGDATABASE}}"
DB_HOST="${{Postgres.PGHOST}}"
DB_PASSWORD="${{Postgres.PGPASSWORD}}"
DB_PORT="${{Postgres.PGPORT}}"
DB_USERNAME="${{Postgres.PGUSER}}"
REDIS_URL="redis://shortline.proxy.rlwy.net:6379"
```

## Variables Look Correct ✅

All variables are using Railway's template syntax correctly. Railway should automatically inject the actual values.

## Next Steps to Verify Connection

### 1. Check if Variables Are Resolving

Run this command to see if Railway is injecting the values:
```bash
railway run --service api-web php artisan tinker --execute="echo env('DB_HOST');"
```

### 2. Test Database Connection

```bash
railway run --service api-web php artisan migrate:status
```

If connection works, you'll see migration status. If not, you'll see connection errors.

### 3. Run Migrations

If connection works but tables don't exist:
```bash
railway run --service api-web php artisan migrate --force
```

### 4. Check Railway Logs

After running migrations, check Railway logs for:
- ✅ "Running migrations"
- ✅ "Migrating: 2024_01_01_000001_create_teams_table"
- ✅ No connection errors

## Troubleshooting

### If Connection Still Fails:

1. **Check Postgres Service Name:**
   - Make sure your Postgres service is named exactly `Postgres` (case-sensitive)
   - If it's named differently (e.g., `postgres`, `PostgreSQL`), update the template variables

2. **Verify Postgres Service is Running:**
   - Go to Railway Dashboard → Postgres service
   - Check that it's deployed and running

3. **Check Network Connection:**
   - Railway services should automatically connect via private network
   - The `postgres.railway.internal` hostname only works within Railway's network

4. **Try Using DATABASE_URL Only:**
   - Sometimes individual variables conflict
   - Try removing individual DB_* variables and use only `DATABASE_URL`

## Expected Behavior

After fixing connection:
1. Migrations will run automatically on deployment
2. Tables will be created in Postgres database
3. You'll see tables in Railway Dashboard → Postgres → Database → Data

