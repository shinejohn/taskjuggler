# Create/Update Test User via Railway Shell

## Method: Railway Web Shell (Runs Inside Railway Network)

1. **Go to Railway Dashboard**
   - Navigate to: https://railway.app
   - Select your project
   - Click on **`api-web`** service (not PostgreSQL)

2. **Open Shell**
   - Click the **"Deployments"** tab
   - Click on the **latest deployment** (the one that's currently running)
   - Click the **"Shell"** button (or "Open Shell")

3. **Run the Script**
   ```bash
   cd /app
   php update-test-user.php
   ```

4. **Verify Output**
   You should see:
   ```
   ✅ Database connected!
   Found user: Test User (test@taskjuggler.com)
   Updating password...
   ✅ Password updated successfully!
   
   ═══════════════════════════════════════════════════════
     TEST USER CREDENTIALS
   ═══════════════════════════════════════════════════════
     Email:    test@taskjuggler.com
     Password: Test1234!
   ═══════════════════════════════════════════════════════
   ```

## Alternative: Railway SQL Editor (Easier)

If the shell method doesn't work, use the SQL editor:

1. Go to **PostgreSQL** service (not api-web)
2. Click **"Data"** → **"Query"**
3. Run this SQL:

```sql
-- Update password for test user
UPDATE users 
SET 
    password = '$2y$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    updated_at = NOW()
WHERE email = 'test@taskjuggler.com'
RETURNING id, email, name;

-- If user doesn't exist, create it:
INSERT INTO users (id, name, email, password, timezone, plan, settings, created_at, updated_at)
VALUES (
    gen_random_uuid(),
    'Test User',
    'test@taskjuggler.com',
    '$2y$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    'America/New_York',
    'free',
    '{}'::jsonb,
    NOW(),
    NOW()
)
ON CONFLICT (email) DO UPDATE SET
    password = EXCLUDED.password,
    updated_at = NOW()
RETURNING id, email, name;
```

## Test Credentials

- **Email:** `test@taskjuggler.com`
- **Password:** `Test1234!`

