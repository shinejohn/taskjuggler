# Running Migrations on Railway PostgreSQL Database

## Problem
The PostgreSQL database on Railway has no tables because migrations haven't been run against it.

## Solution

### Option 1: Run Migrations via Railway CLI (Recommended)

1. **Connect to Railway service:**
   ```bash
   railway link
   railway service
   ```

2. **Run migrations:**
   ```bash
   railway run php artisan migrate --force
   ```

### Option 2: Run Migrations via Railway Dashboard

1. Go to your Railway project dashboard
2. Click on your `taskjuggler-api` service
3. Go to the "Deployments" tab
4. Click "Redeploy" to trigger a new deployment
5. The start command should include `php artisan migrate --force` (check `nixpacks.toml` or `railway.json`)

### Option 3: Check if Migrations Run Automatically

The `nixpacks.toml` or start command should include migrations. Check:

**In `nixpacks.toml`:**
```toml
[start]
cmd = "php artisan migrate --force --no-interaction && php artisan serve --host=0.0.0.0 --port=${PORT:-8080}"
```

**Or in `railway.json`:**
```json
{
  "deploy": {
    "startCommand": "php artisan migrate --force && php artisan serve --host=0.0.0.0 --port=$PORT"
  }
}
```

### Verify Database Connection

Make sure these environment variables are set in Railway:

1. **DATABASE_URL** - Should be automatically set when PostgreSQL service is linked
2. **DB_CONNECTION=pgsql** - Should be set explicitly

Check with:
```bash
railway variables | grep DATABASE
```

### Manual Migration Check

After migrations run, verify tables exist:

```bash
railway run php artisan db:show
```

Or connect to PostgreSQL directly:
```bash
railway connect postgres
# Then in psql:
\dt
```

## Common Issues

1. **DATABASE_URL not set**: Link PostgreSQL service to your API service in Railway dashboard
2. **Migrations not running**: Ensure start command includes `php artisan migrate --force`
3. **SQLite vs PostgreSQL**: Local development uses SQLite, but Railway should use PostgreSQL via DATABASE_URL

