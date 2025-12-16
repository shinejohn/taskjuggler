# Run Migrations NOW - Use Railway Web Shell

## Don't use CLI - Use Web Shell Instead

1. **Go to Railway Dashboard**
   - https://railway.app
   - Click on **`api-web`** service (NOT PostgreSQL)

2. **Open Web Shell**
   - Click **"Deployments"** tab
   - Click on the **latest deployment** (the one that's running)
   - Click **"Shell"** button

3. **Run This Command**
   ```bash
   php artisan migrate --force
   ```

4. **Done!** Migrations will run inside Railway's network where database is accessible.

## Alternative: Run SQL Directly

If shell doesn't work, run SQL directly:

1. Go to **PostgreSQL** service → **Data** → **Query**
2. Copy/paste `FIX_ALL_MISSING_TABLES.sql`
3. Click **Run**

This creates:
- `personal_access_tokens` table (fixes login)
- `current_profile_id` column (fixes profiles)

