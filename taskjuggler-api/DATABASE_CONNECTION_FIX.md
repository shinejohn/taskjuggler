# Fix Database Connection

## Current Issue
`DATABASE_URL` is set to incomplete value `postgresql://` instead of Railway's template variable.

## Solution: Set DATABASE_URL Using Railway Template

### In Railway Dashboard (Recommended):

1. **Go to `api-web` service** (NOT the Postgres service)
2. **Click "Variables" tab**
3. **Find `DATABASE_URL` variable** (or create new if needed)
4. **Set value to:** `${{ Postgres.DATABASE_URL }}`
   
   **Important:** Use exact syntax `${{ Postgres.DATABASE_URL }}` - Railway will automatically replace this with the full connection string

5. **Save** - Railway will automatically redeploy

### Alternative: Remove DATABASE_URL (Use Individual Variables)

Since you already have individual DB variables set correctly:
- `DB_HOST=postgres.railway.internal`
- `DB_DATABASE=railway`
- `DB_USERNAME=postgres`
- `DB_PASSWORD=...`
- `DB_PORT=5432`

You could also just **delete** the `DATABASE_URL` variable and Laravel will use the individual variables.

Laravel config (`config/database.php` line 88) checks:
```php
'url' => env('DATABASE_URL') ?: env('DB_URL'),
```

So if `DATABASE_URL` is not set or empty, it will use individual variables.

## After Fix

1. Railway will redeploy automatically
2. Check deployment logs - should show migrations running
3. Check Postgres → Database → Data - should show tables

## Verify Connection

After deployment, check logs for:
- ✅ "Running migrations" (not "Nothing to migrate")
- ✅ No database connection errors
- ✅ Tables created successfully

