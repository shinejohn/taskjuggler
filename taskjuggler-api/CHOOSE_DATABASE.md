# Choosing the Correct Database

## Your 3 PostgreSQL Databases

You have 3 PostgreSQL databases in Railway:
1. **`Postgres`** (no suffix) - Recommended
2. **`Postgres-ug5f`** (with suffix)
3. **`Postgres-b7ZD`** (with suffix)

## Which One to Use?

**Recommendation: Use `Postgres` (the one without suffix)**

This is typically the first/main database created. The ones with suffixes are usually created when you add databases multiple times.

## Why No Tables?

The databases are **empty** because:
1. ✅ Databases are created and online
2. ❌ **Not linked to your `taskjuggler` service** (so `DATABASE_URL` isn't set)
3. ❌ **Migrations haven't run** (can't run without connection)

## Solution: Link Database and Run Migrations

### Step 1: Link Database in Railway Dashboard

1. Go to Railway Dashboard: https://railway.app
2. Open "AI Task Juggler" project
3. Click on **`taskjuggler`** service
4. Go to **"Variables"** tab
5. Click **"Add Reference"** or **"Connect Service"**
6. Select **`Postgres`** (the one without suffix)
7. Railway will automatically add `DATABASE_URL`

### Step 2: Verify Connection

After linking, verify:

```bash
railway service taskjuggler
railway variables | grep DATABASE_URL
```

You should see `DATABASE_URL` with connection string.

### Step 3: Run Migrations

Once linked, create all tables:

```bash
railway run php artisan migrate --force
```

This will create all 15+ tables in your database.

### Step 4: Verify Tables Created

Check that tables exist:

```bash
railway run php artisan tinker
>>> \DB::select("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'");
```

Or check migration status:

```bash
railway run php artisan migrate:status
```

## What About the Other 2 Databases?

**Option 1: Delete Them (Recommended)**
- Saves costs
- You only need one database for the main app
- Can always create new ones later

**Option 2: Keep for Testing**
- Use one for production
- Use others for staging/testing
- More complex setup

**Recommendation:** Delete `Postgres-ug5f` and `Postgres-b7ZD`, keep only `Postgres`.

## Quick Setup Script

After linking in dashboard, run:

```bash
cd taskjuggler-api
./setup-database.sh
```

This will:
- Check if DATABASE_URL is set
- Set DB_CONNECTION=pgsql
- Test connection
- Show migration status

## Troubleshooting

**Still no DATABASE_URL after linking:**
- Make sure database and service are in same project
- Try unlinking and re-linking
- Check database service is online

**Migrations fail:**
- Verify DATABASE_URL is set correctly
- Check database service is running
- Ensure DB_CONNECTION=pgsql is set

**Tables still not showing:**
- Migrations may not have run
- Check migration status: `railway run php artisan migrate:status`
- Run migrations: `railway run php artisan migrate --force`
