# Database Setup Guide for Railway

## Problem

You have 3 PostgreSQL databases in Railway, but none are connected to your services. Railway needs to link the database to your service to automatically set `DATABASE_URL`.

## Solution

### Step 1: Choose One Database

You have 3 PostgreSQL databases. Choose **one** to use for the main application:
- `Postgres` (or `Postgres-ug5f`, `Postgres-b7ZD` - check exact names in dashboard)

**Recommendation:** Use the one named `Postgres` (without suffix) as the main database.

### Step 2: Link Database to Service (Railway Dashboard)

1. Go to Railway Dashboard: https://railway.app
2. Open "AI Task Juggler" project
3. Click on the **PostgreSQL database** you want to use
4. Go to **"Variables"** or **"Connect"** tab
5. Copy the `DATABASE_URL` or connection details
6. Go to your **`taskjuggler`** service
7. Go to **"Variables"** tab
8. Add `DATABASE_URL` (Railway may auto-add this when services are in same project)
9. Set `DB_CONNECTION=pgsql`

### Step 3: Link Database via Railway Dashboard (Recommended Method)

**The easiest way:**

1. In Railway Dashboard, go to your `taskjuggler` service
2. Click **"Variables"** tab
3. Look for **"Add Reference"** or **"Connect Service"** button
4. Select your PostgreSQL database
5. Railway will automatically add `DATABASE_URL` variable

### Step 4: Set Database Connection Type

After linking, set:

```bash
railway service taskjuggler
railway variables --set "DB_CONNECTION=pgsql"
```

### Step 5: Verify Connection

```bash
railway run php artisan migrate:status
```

If it works, the database is connected!

## Alternative: Manual Setup

If Railway doesn't auto-link, you can manually set the connection:

1. Get connection details from PostgreSQL service in Railway dashboard
2. Set variables manually:

```bash
railway service taskjuggler
railway variables --set "DB_CONNECTION=pgsql"
railway variables --set "DB_HOST=<from-railway-postgres-service>"
railway variables --set "DB_PORT=5432"
railway variables --set "DB_DATABASE=<database-name>"
railway variables --set "DB_USERNAME=<username>"
railway variables --set "DB_PASSWORD=<password>"
```

Or use `DATABASE_URL` format:
```bash
railway variables --set "DATABASE_URL=postgresql://user:password@host:5432/database"
```

## What About the Other 2 Databases?

You can:
1. **Delete them** if not needed (saves costs)
2. **Keep them** for future use (testing, staging, etc.)
3. **Use one for worker/scheduler** services if needed

For now, you only need **one** database for the main application.

## Verification

After setup, verify:

```bash
# Check variables
railway variables | grep -i database

# Test connection
railway run php artisan migrate:status

# Run migrations (if not already done)
railway run php artisan migrate --force
```

## Troubleshooting

**DATABASE_URL not set:**
- Make sure database and service are in the same Railway project
- Use "Add Reference" in service variables to link them
- Check database service is running

**Connection fails:**
- Verify `DB_CONNECTION=pgsql` is set
- Check `DATABASE_URL` format is correct
- Ensure database service is online

**Multiple databases:**
- Only one database is needed for the main app
- You can delete unused databases to save costs
- Or keep them for staging/testing environments
