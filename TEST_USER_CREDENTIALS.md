# Test User Credentials

## Login Credentials

**Email:** `test@taskjuggler.com`  
**Password:** `Test1234!`

## Create Test User

If the user doesn't exist, create it using one of these methods:

### Method 1: Railway CLI (Easiest)

```bash
cd taskjuggler-api
railway run --service api-web php artisan user:create-test
```

### Method 2: Railway Dashboard

1. Go to Railway Dashboard
2. Click on `api-web` service
3. Go to **Shell** or **Terminal** tab
4. Run: `php artisan user:create-test`

### Method 3: Direct SQL

1. Go to Railway Dashboard
2. Click on your PostgreSQL database service
3. Go to **Data** or **Query** tab
4. Run this SQL:

```sql
INSERT INTO users (id, name, email, password, created_at, updated_at)
VALUES (
    gen_random_uuid(),
    'Test User',
    'test@taskjuggler.com',
    '$2y$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    NOW(),
    NOW()
)
ON CONFLICT (email) DO UPDATE SET
    password = '$2y$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    updated_at = NOW();
```

## Verify User Exists

Check if user exists:

```sql
SELECT id, name, email FROM users WHERE email = 'test@taskjuggler.com';
```

## If Login Still Fails

1. **Verify user exists** (see above)
2. **Check password hash** - Make sure password is correctly hashed
3. **Try resetting password:**
   ```bash
   railway run --service api-web php artisan user:create-test
   ```
   This will create or update the user with the correct password.

## Notes

- Password hash: `$2y$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi` = `Test1234!`
- The user will automatically get a default profile created
- If user exists, running the command updates the password

