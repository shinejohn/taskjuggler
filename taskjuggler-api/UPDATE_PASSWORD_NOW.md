# Update Test User Password - Railway Dashboard

## Quick Steps (Takes 2 minutes)

1. **Go to Railway Dashboard**
   - Open: https://railway.app
   - Select your project
   - Click on your **PostgreSQL** service

2. **Open Query Editor**
   - Click the **"Data"** tab at the top
   - Click the **"Query"** button

3. **Run This SQL** (copy and paste):

```sql
UPDATE users 
SET 
    password = '$2y$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    updated_at = NOW()
WHERE email = 'test@taskjuggler.com'
RETURNING id, email, name;
```

4. **Click "Run"** (or press `Cmd+Enter` / `Ctrl+Enter`)

5. **Verify** - You should see:
   ```
   id | email                  | name
   ---|------------------------|----------
   ...| test@taskjuggler.com   | Test User
   ```

## Test Credentials

- **Email:** `test@taskjuggler.com`
- **Password:** `Test1234!`

## Why This Method?

The Railway CLI uses internal hostnames (`postgres.railway.internal`) that only work inside Railway's network. Running commands locally won't work. The Railway dashboard SQL editor runs inside Railway's network, so it works perfectly.

## Alternative: Use Railway Shell

If you prefer CLI, you can use Railway's web-based shell:
1. Go to your `api-web` service in Railway
2. Click "Deployments" tab
3. Click on the latest deployment
4. Click "Shell" button
5. Run: `php update-password.php`

