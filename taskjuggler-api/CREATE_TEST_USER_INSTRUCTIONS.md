# Create Test User - Railway PostgreSQL Dashboard

## Quick Steps

1. **Go to Railway Dashboard**
   - Navigate to: https://railway.app/project/[your-project-id]
   - Click on your **PostgreSQL** service

2. **Open Query Tab**
   - Click on the **"Data"** tab
   - Click **"Query"** button

3. **Run the SQL Script**
   - Copy the entire contents of `CREATE_TEST_USER_RAILWAY.sql`
   - Paste into the query editor
   - Click **"Run"** or press `Ctrl+Enter` (Windows) / `Cmd+Enter` (Mac)

4. **Verify User Created**
   - The script will output the user details at the end
   - You should see:
     ```
     Email: test@taskjuggler.com
     Password: Test1234!
     ```

## Alternative: Use Railway CLI with Public DATABASE_URL

If you have the public `DATABASE_URL` (not the internal one), you can run:

```bash
# Get the public DATABASE_URL from Railway dashboard
# It should look like: postgresql://user:password@host:port/railway

# Set it temporarily
export DATABASE_URL="postgresql://user:password@host:port/railway"

# Run migrations first (if needed)
cd taskjuggler-api
php artisan migrate --force

# Create user via Artisan command
php artisan user:create-test
```

## Test Credentials

- **Email:** `test@taskjuggler.com`
- **Password:** `Test1234!`

## Troubleshooting

### If you get "column current_profile_id does not exist"
The SQL script will automatically add this column if it doesn't exist.

### If you get "table profiles does not exist"
Run migrations first via Railway dashboard or CLI:
```bash
railway run --service api-web php artisan migrate --force
```

### If migrations fail
Check that your `DATABASE_URL` is correctly set in Railway environment variables.
