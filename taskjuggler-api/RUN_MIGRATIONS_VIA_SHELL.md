# Run Migrations via Railway Web Shell

## Steps

1. **Go to Railway Dashboard**
   - Navigate to: https://railway.app
   - Select your project
   - Click on **`api-web`** service

2. **Open Web Shell**
   - Click the **"Deployments"** tab
   - Click on the **latest deployment** (the one currently running)
   - Click the **"Shell"** button (or "Open Shell")

3. **Run Migrations**
   ```bash
   cd /app
   php run-migrations.php
   ```

   Or run Laravel's migrate command directly:
   ```bash
   php artisan migrate --force
   ```

4. **Verify Output**
   You should see:
   ```
   ✅ Database connected!
   ✅ Migrations completed successfully!
   ✅ current_profile_id column exists in users table
   ✅ profiles table exists
   ✅ All users have current_profile_id set
   ```

## Alternative: Trigger Redeploy

Migrations run automatically on deploy (configured in `railway.json`). To trigger a redeploy:

1. Go to Railway Dashboard → `api-web` service
2. Click "Deployments"
3. Click "Redeploy" on the latest deployment

This will rebuild and run migrations automatically.

