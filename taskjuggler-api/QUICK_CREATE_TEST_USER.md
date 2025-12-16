# Quick Guide: Create Test User

## Method 1: Railway PostgreSQL Dashboard (RECOMMENDED)

**This is the easiest and most reliable method.**

1. **Open Railway Dashboard**
   - Go to: https://railway.app
   - Select your project
   - Click on the **PostgreSQL** service

2. **Open Query Editor**
   - Click the **"Data"** tab
   - Click **"Query"** button

3. **Copy & Paste SQL**
   - Open `CREATE_TEST_USER_RAILWAY.sql` file
   - Copy **ALL** the SQL code
   - Paste into Railway query editor
   - Click **"Run"** (or press `Cmd+Enter` / `Ctrl+Enter`)

4. **Verify**
   - You should see output showing the user was created
   - Credentials:
     - **Email:** `test@taskjuggler.com`
     - **Password:** `Test1234!`

## Method 2: Railway CLI (If you have public DATABASE_URL)

If Railway provides a public `DATABASE_URL` (not `postgres.railway.internal`):

```bash
# Get public DATABASE_URL from Railway dashboard
# PostgreSQL service -> Variables -> Copy DATABASE_URL (public one)

# Set it temporarily
export DATABASE_URL="postgresql://postgres:password@public-hostname:5432/railway"

# Run the command
cd taskjuggler-api
php artisan user:create-test
```

## Method 3: Direct API Registration

Try registering via the API endpoint:

```bash
curl -X POST https://api-web-production-cc91.up.railway.app/api/auth/register \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@taskjuggler.com",
    "password": "Test1234!",
    "password_confirmation": "Test1234!"
  }'
```

**Note:** This will fail if `current_profile_id` column doesn't exist. Run migrations first or use Method 1.

## Troubleshooting

### "Column current_profile_id does not exist"
- **Solution:** The SQL script (`CREATE_TEST_USER_RAILWAY.sql`) automatically adds this column
- Or run migrations: `railway run --service api-web php artisan migrate --force`

### "Table profiles does not exist"
- **Solution:** Run migrations first
- In Railway dashboard: PostgreSQL service -> Query tab -> Run migrations manually
- Or via CLI: `railway run --service api-web php artisan migrate --force`

### "Could not translate host name"
- **Solution:** Use Method 1 (Railway Dashboard) instead of CLI
- The CLI uses internal hostnames that don't work from your local machine

