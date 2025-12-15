# Connect Database to API Service in Railway

## Problem
The `api-web` service can't connect to the Postgres database because the `DATABASE_URL` environment variable is not set.

## Solution: Add DATABASE_URL Variable

### Step 1: In Railway Dashboard

1. **Go to your `api-web` service** (not the Postgres service)
2. **Click "Variables" tab**
3. **Click "New Variable" or "+" button**
4. **Add variable:**
   - **Name:** `DATABASE_URL`
   - **Value:** `${{ Postgres.DATABASE_URL }}`
   
   (Important: Use the exact format `${{ Postgres.DATABASE_URL }}` - Railway will replace this with the actual connection string)

### Step 2: Verify Connection

After adding the variable, Railway will automatically redeploy. Check the logs to ensure:
- Migrations run successfully
- No database connection errors

### Step 3: Alternative - Use Railway CLI

If you prefer CLI, you can also set it via:

```bash
railway variables --service api-web --set DATABASE_URL='${{ Postgres.DATABASE_URL }}'
```

**Note:** The CLI approach might not work with the `${{ }}` syntax. It's better to set it in the dashboard.

## Other Database Variables (Optional)

Laravel can also use individual database variables. You might also want to set:

- `DB_CONNECTION=pgsql`
- `DB_HOST` (from DATABASE_URL)
- `DB_PORT` (from DATABASE_URL)  
- `DB_DATABASE` (from DATABASE_URL)
- `DB_USERNAME` (from DATABASE_URL)
- `DB_PASSWORD` (from DATABASE_URL)

But `DATABASE_URL` alone should be sufficient if your Laravel config uses it.

## Verify After Setup

1. Check deployment logs - should show migrations running
2. Check Postgres → Database → Data - should show tables after migration
3. Check API health endpoint - should respond successfully

## Important Notes

- The `${{ Postgres.DATABASE_URL }}` syntax is Railway's template variable
- Replace `Postgres` with your actual Postgres service name if different
- Railway automatically injects the connection string when you use this format
- This creates a private network connection between services

