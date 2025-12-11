# Deploy Valkey Service via Railway Template

## Quick Deploy Link

**Deploy Valkey directly:** https://railway.com/deploy/pQYeJx

## Steps to Deploy Valkey

### Option 1: Via Railway Dashboard (Recommended)

1. **Click the deploy link:** https://railway.com/deploy/pQYeJx
2. Railway will:
   - Create a new Valkey service in your project
   - Set up the container with `valkey/valkey:latest`
   - Configure it automatically
3. **Link to your main service:**
   - Go to your `taskjuggler` service
   - Variables tab → Add Reference → Select the Valkey service
   - Railway will set `VALKEY_URL` or `REDIS_URL` automatically

### Option 2: Via Railway CLI

The CLI template deployment may require interactive confirmation. Try:

```bash
railway deploy --template pQYeJx
```

Or visit the dashboard link above for a one-click deploy.

## After Deployment

1. **Verify Valkey service is created:**
   - Check your Railway project dashboard
   - You should see a new service (likely named "Valkey" or "pQYeJx")

2. **Link to main service:**
   - Go to `taskjuggler` service → Variables
   - Add Reference → Select Valkey service
   - Railway will automatically set connection variables

3. **Update REDIS_HOST (if needed):**
   - If Railway sets `VALKEY_URL`, use that
   - Or set `REDIS_HOST=valkey.railway.internal` (if that's the service name)
   - Or use the `REDIS_URL` that Railway provides

## Valkey vs Redis

- **Valkey** = Open-source fork of Redis (Redis-compatible)
- **Redis** = Original Redis
- Both work identically - your app can use either
- Valkey is fully compatible with Redis clients and commands

## Connection

After linking, your app will connect to Valkey using:
- `REDIS_URL` (if Railway provides it)
- Or `REDIS_HOST=valkey.railway.internal` (if that's the service hostname)

## Reference

- [Railway Valkey Template](https://railway.com/deploy/pQYeJx)
- [Valkey Migration Guide](https://valkey.io/topics/migration/)
