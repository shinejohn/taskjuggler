# Task Juggler Web - Deployment Guide

## ⚠️ CRITICAL: Environment Variables MUST Be Set!

**The frontend will NOT work without `VITE_API_URL` set in Railway!**

See [REQUIRED_ENV_VARS.md](./REQUIRED_ENV_VARS.md) for details.

## Railway Deployment

### Required Environment Variables

**MUST SET IN RAILWAY BEFORE DEPLOYMENT:**

```bash
VITE_API_URL=https://api-web-production-cc91.up.railway.app/api
```

**Optional (for real-time features):**
```bash
VITE_PUSHER_APP_KEY=your-pusher-key
VITE_PUSHER_APP_CLUSTER=mt1
```

### Quick Setup Script

```bash
# Run the setup script
cd taskjuggler-web
./setup-railway-env.sh
```

### Manual Setup

1. Go to Railway Dashboard → `taskjuggler-web` service
2. Go to **Variables** tab
3. Add `VITE_API_URL` = `https://api-web-production-cc91.up.railway.app/api`
4. Save (Railway will auto-redeploy)

### Build Configuration

Railway uses `nixpacks.toml` for build configuration. The build process:
1. Installs Node.js dependencies
2. Builds the Vue.js app with `npm run build`
3. Serves static files from `dist/` directory

### Health Check

Railway monitors: `/` (healthcheckPath)

## Vercel/Netlify Deployment

### Environment Variables

```bash
VITE_API_URL=https://your-api.railway.app/api
VITE_PUSHER_APP_KEY=your-pusher-key
VITE_PUSHER_APP_CLUSTER=mt1
```

### Build Command
```bash
npm run build
```

### Output Directory
```
dist
```

## Local Development

1. Install dependencies: `npm install`
2. Create `.env` file:
   ```bash
   VITE_API_URL=http://localhost:8000/api
   ```
3. Run dev server: `npm run dev`

## Troubleshooting

### Frontend can't connect to API

1. **Check `VITE_API_URL` is set in Railway**
   ```bash
   railway variables --service taskjuggler-web
   ```

2. **Verify API is accessible**
   ```bash
   curl https://api-web-production-cc91.up.railway.app/api/health
   ```

3. **Check browser console**
   - Open DevTools (F12)
   - Look for network errors
   - Verify API calls go to correct URL

4. **Redeploy after setting variables**
   - Railway auto-redeploys, but you can manually trigger
   - Go to Deployments → Redeploy

See [REQUIRED_ENV_VARS.md](./REQUIRED_ENV_VARS.md) for complete setup instructions.
