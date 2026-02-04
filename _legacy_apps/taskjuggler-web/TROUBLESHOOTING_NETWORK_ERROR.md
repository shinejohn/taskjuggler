# Troubleshooting Network Error on Login

## Common Causes

### 1. API URL Not Configured

**Problem:** The frontend can't find the API server.

**Solution:**
- Check that `VITE_API_URL` is set correctly
- For local development: `VITE_API_URL=http://localhost:8000/api`
- For production: `VITE_API_URL=https://your-api-domain.com/api`

**Check:**
```bash
# In taskjuggler-web directory
cat .env
# Should have: VITE_API_URL=http://localhost:8000/api
```

### 2. API Server Not Running

**Problem:** The Laravel API server isn't running.

**Solution:**
```bash
cd taskjuggler-api
php artisan serve
# Should start on http://localhost:8000
```

### 3. CORS Issues

**Problem:** Browser blocking requests due to CORS policy.

**Solution:**
Laravel 11 handles CORS automatically. If you see CORS errors:

1. Check that the API is running
2. Verify the frontend URL matches what's allowed
3. Check browser console for specific CORS error messages

### 4. Wrong API Endpoint

**Problem:** The login endpoint doesn't exist or is wrong.

**Check:**
- API route exists: `POST /api/auth/login`
- Test with curl:
```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@taskjuggler.com","password":"Test1234!"}'
```

### 5. Database Connection Issues

**Problem:** API can't connect to database.

**Solution:**
```bash
cd taskjuggler-api
php artisan migrate:status
# Check database connection
php artisan tinker
# Then: DB::connection()->getPdo();
```

## Debugging Steps

### Step 1: Check Browser Console

Open browser DevTools (F12) and check:
- Network tab: Look for failed requests
- Console tab: Look for error messages
- Check the request URL and status code

### Step 2: Verify API is Running

```bash
# Test API health endpoint
curl http://localhost:8000/api/health

# Should return: {"status":"ok","timestamp":"..."}
```

### Step 3: Test Login Endpoint Directly

```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{"email":"test@taskjuggler.com","password":"Test1234!"}'
```

### Step 4: Check Environment Variables

**Frontend (.env in taskjuggler-web):**
```bash
VITE_API_URL=http://localhost:8000/api
```

**Backend (.env in taskjuggler-api):**
```bash
APP_URL=http://localhost:8000
DB_CONNECTION=pgsql
# ... other config
```

### Step 5: Check Network Tab

1. Open DevTools → Network tab
2. Try to login
3. Look for the `/api/auth/login` request
4. Check:
   - Request URL (should be `http://localhost:8000/api/auth/login`)
   - Request Method (should be `POST`)
   - Status Code (should be 200 or 422)
   - Response (should have token and user data)

## Quick Fixes

### Fix 1: Restart Both Servers

```bash
# Terminal 1: API
cd taskjuggler-api
php artisan serve

# Terminal 2: Frontend
cd taskjuggler-web
npm run dev
```

### Fix 2: Clear Browser Cache

- Hard refresh: `Cmd+Shift+R` (Mac) or `Ctrl+Shift+R` (Windows)
- Or clear browser cache completely

### Fix 3: Check API Response Format

The API should return:
```json
{
  "success": true,
  "data": {
    "user": {...},
    "token": "..."
  },
  "message": "Logged in successfully"
}
```

### Fix 4: Verify Test User Exists

```bash
cd taskjuggler-api
php artisan tinker
# Then:
$user = \App\Models\User::where('email', 'test@taskjuggler.com')->first();
# Should return user object
```

## Still Having Issues?

1. Check the browser console for specific error messages
2. Check the API logs: `taskjuggler-api/storage/logs/laravel.log`
3. Verify both servers are running on correct ports
4. Check firewall/antivirus isn't blocking localhost connections

