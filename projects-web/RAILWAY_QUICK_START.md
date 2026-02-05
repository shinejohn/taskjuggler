# Railway Quick Start Guide

## 🚀 Quick Setup (5 minutes)

### Step 1: Initialize Project (Interactive - Run this manually)

```bash
railway init
```

**When prompted:**
- Select: "Create a new project"
- Name: `4projects` (or your choice)
- Select your workspace/team

This creates a `.railway` directory linking your project.

### Step 2: Run Automated Setup

Once the project is initialized, run:

```bash
./QUICK_RAILWAY_SETUP.sh
```

This script will:
- ✅ Add PostgreSQL database
- ✅ Add Redis service
- ✅ Set all core environment variables
- ✅ Configure cache, queue, and broadcast drivers

### Step 3: Add Services Manually (Alternative)

If the script doesn't work, run these commands:

```bash
# Add PostgreSQL
railway add --database postgres

# Add Redis
railway add --plugin redis
```

### Step 4: Set Environment Variables

Run the helper script:

```bash
./railway-set-variables.sh
```

Or set manually:

```bash
# Core variables
railway variables --set "APP_NAME=4 Projects.ai"
railway variables --set "APP_ENV=production"
railway variables --set "APP_DEBUG=false"
railway variables --set "CACHE_DRIVER=redis"
railway variables --set "SESSION_DRIVER=redis"
railway variables --set "QUEUE_CONNECTION=redis"
railway variables --set "BROADCAST_DRIVER=reverb"

# Generate and set app key
railway variables --set "APP_KEY=$(php artisan key:generate --show)"
```

### Step 5: Set Required API Keys

```bash
# OpenRouter (REQUIRED for AI features)
railway variables --set "OPENROUTER_API_KEY=your-key-here"

# Reverb keys (generate locally first)
php artisan reverb:install
railway variables --set "REVERB_APP_KEY=generated-key"
railway variables --set "REVERB_APP_SECRET=generated-secret"
```

### Step 6: Deploy

```bash
railway up
```

### Step 7: Run Migrations

```bash
railway run php artisan migrate --force
```

Or migrations run automatically on first deploy (configured in `railway.json`).

## ✅ Verification

Check your services:

```bash
# View all variables
railway variables

# Check database connection
railway run php artisan db:show

# View logs
railway logs

# Open dashboard
railway open
```

## 📋 Service Checklist

After setup, verify:

- [ ] PostgreSQL service created
- [ ] Redis service created
- [ ] Core environment variables set
- [ ] APP_KEY generated and set
- [ ] Database connection working
- [ ] Redis connection working
- [ ] Application deployed
- [ ] Migrations run successfully

## 🔗 Next Steps

1. Set APP_URL after first deploy:
   ```bash
   railway variables --set "APP_URL=https://your-app.railway.app"
   ```

2. Create Horizon worker service (for queue processing):
   - In Railway dashboard: New → Service
   - Start command: `php artisan horizon`
   - Link to same Redis service

3. Optional: Configure email, Twilio, Slack (see RAILWAY_SETUP.md)

## 📖 Full Documentation

See `RAILWAY_SETUP.md` for complete deployment guide.


