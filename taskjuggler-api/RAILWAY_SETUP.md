# Railway Setup Guide for AI Task Juggler

## Step 1: Login to Railway CLI
```bash
railway login
```
This will open your browser for authentication.

## Step 2: Link to Your Project
```bash
cd taskjuggler-api
railway link
```
Select "AI Task Juggler" from the list (under Fibonacco Sales).

## Step 3: Verify Connection
```bash
railway status
```

## Step 4: Add Required Services

### PostgreSQL Database
```bash
railway add postgresql
```

### Redis
```bash
railway add redis
```

## Step 5: Set Environment Variables

### App Configuration
```bash
railway variables set APP_NAME="Task Juggler"
railway variables set APP_ENV=production
railway variables set APP_DEBUG=false
railway variables set APP_URL=$(railway domain)
```

### Generate App Key
```bash
railway run php artisan key:generate --show
```
Copy the output and set it:
```bash
railway variables set APP_KEY="base64:..."
```

### Database (Auto-configured if using Railway PostgreSQL)
Railway automatically sets these when you add PostgreSQL:
- `DATABASE_URL` (Railway will parse this)
- Or manually set: `DB_CONNECTION`, `DB_HOST`, `DB_PORT`, `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD`

### Redis (Auto-configured if using Railway Redis)
Railway automatically sets `REDIS_URL` when you add Redis.

### Queue
```bash
railway variables set QUEUE_CONNECTION=redis
```

### External Services (Set these manually)
```bash
# Twilio
railway variables set TWILIO_ACCOUNT_SID=your-sid
railway variables set TWILIO_AUTH_TOKEN=your-token
railway variables set TWILIO_VERIFY_SIGNATURE=true

# SendGrid
railway variables set SENDGRID_API_KEY=your-key
railway variables set SENDGRID_INBOUND_DOMAIN=assistant.taskjuggler.com
railway variables set SENDGRID_WEBHOOK_SECRET=your-secret

# OpenRouter
railway variables set OPENROUTER_API_KEY=your-key
railway variables set OPENROUTER_BASE_URL=https://openrouter.ai/api/v1
railway variables set OPENROUTER_DEFAULT_MODEL=openai/gpt-4o
railway variables set OPENROUTER_EXTRACTION_MODEL=openai/gpt-4o

# Stripe
railway variables set STRIPE_KEY=your-key
railway variables set STRIPE_SECRET=your-secret
railway variables set STRIPE_WEBHOOK_SECRET=your-webhook-secret

# Pusher
railway variables set PUSHER_APP_ID=your-id
railway variables set PUSHER_APP_KEY=your-key
railway variables set PUSHER_APP_SECRET=your-secret
railway variables set PUSHER_APP_CLUSTER=mt1

# Broadcasting
railway variables set BROADCAST_DRIVER=pusher
```

## Step 6: Run Migrations
```bash
railway run php artisan migrate --force
```

## Step 7: Deploy
```bash
railway up
```

Or push to your connected GitHub repository - Railway will auto-deploy.

## Step 8: Check Status
```bash
railway status
railway logs
```

## Step 9: Get Your Domain
```bash
railway domain
```

Use this URL for:
- Webhook endpoints (Twilio, SendGrid, Stripe)
- Frontend API configuration
- Mobile app API configuration

## Useful Commands

### View all variables
```bash
railway variables
```

### View logs
```bash
railway logs
railway logs --tail
```

### Run commands in Railway environment
```bash
railway run php artisan migrate
railway run php artisan queue:work
railway run php artisan tinker
```

### Check service status
```bash
railway status
```
