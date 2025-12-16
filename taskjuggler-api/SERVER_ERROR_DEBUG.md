# Server Error Debug Guide

## Current Issue
Login endpoint returns: `{"message": "Server Error"}`

## What Was Fixed
1. Added error handling to `login()` method in `AuthController`
2. Added try-catch to handle missing `profiles` table gracefully
3. Fixed Schema namespace usage

## Next Steps to Debug

### 1. Check Railway Logs
Go to Railway Dashboard → `api-web` service → **"Deployments"** → Latest deployment → **"Logs"**

Look for:
- PHP errors
- Database connection errors
- Missing table errors
- Stack traces

### 2. Test Health Endpoint
```bash
curl https://api-web-production-cc91.up.railway.app/api/health
```
Should return: `{"status":"ok","timestamp":"..."}`

### 3. Test Login with Verbose Output
```bash
curl -v -X POST https://api-web-production-cc91.up.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{"email":"test@taskjuggler.com","password":"Test1234!"}'
```

### 4. Check Database Tables
Run this SQL in Railway PostgreSQL dashboard:
```sql
-- Check if users table exists
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' AND table_name = 'users';

-- Check if profiles table exists
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' AND table_name = 'profiles';

-- Check test user
SELECT id, email, name FROM users WHERE email = 'test@taskjuggler.com';
```

### 5. Common Causes
- **Missing migrations**: Run `php artisan migrate --force` via Railway shell
- **Missing profiles table**: The code now handles this gracefully
- **Database connection issue**: Check `DATABASE_URL` in Railway variables
- **PHP error**: Check Railway logs for stack traces

### 6. Quick Fix: Run Migrations
Via Railway Shell:
1. Go to `api-web` service → Deployments → Latest → Shell
2. Run: `php artisan migrate --force`

### 7. Check Laravel Logs
Via Railway Shell:
```bash
tail -50 storage/logs/laravel.log
```

## Files Changed
- `app/Modules/Core/Controllers/AuthController.php` - Added error handling

## Deployment Status
- Code committed to `tasks-done-1e99a` branch
- Railway should auto-deploy if watching this branch
- If not, merge to `main` branch or configure Railway to watch `tasks-done-1e99a`

