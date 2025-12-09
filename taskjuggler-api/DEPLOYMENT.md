# Task Juggler - Deployment Guide

## Railway Deployment

### Prerequisites
- Railway account
- PostgreSQL database
- Redis instance
- Twilio account
- SendGrid account
- OpenRouter API key
- Stripe account
- Pusher account

### Environment Variables

Set the following environment variables in Railway:

```bash
# App
APP_NAME="Task Juggler"
APP_ENV=production
APP_KEY=base64:... # Generate with: php artisan key:generate
APP_DEBUG=false
APP_URL=https://your-app.railway.app

# Database
DB_CONNECTION=pgsql
DB_HOST=your-postgres-host
DB_PORT=5432
DB_DATABASE=taskjuggler
DB_USERNAME=your-username
DB_PASSWORD=your-password

# Redis
REDIS_HOST=your-redis-host
REDIS_PASSWORD=your-redis-password
REDIS_PORT=6379

# Queue
QUEUE_CONNECTION=redis

# Twilio
TWILIO_ACCOUNT_SID=your-sid
TWILIO_AUTH_TOKEN=your-token
TWILIO_VERIFY_SIGNATURE=true

# SendGrid
SENDGRID_API_KEY=your-key
SENDGRID_INBOUND_DOMAIN=assistant.taskjuggler.com
SENDGRID_WEBHOOK_SECRET=your-secret

# OpenRouter
OPENROUTER_API_KEY=your-key
OPENROUTER_BASE_URL=https://openrouter.ai/api/v1
OPENROUTER_DEFAULT_MODEL=openai/gpt-4o
OPENROUTER_EXTRACTION_MODEL=openai/gpt-4o

# Stripe
STRIPE_KEY=your-key
STRIPE_SECRET=your-secret
STRIPE_WEBHOOK_SECRET=your-webhook-secret

# Pusher
PUSHER_APP_ID=your-id
PUSHER_APP_KEY=your-key
PUSHER_APP_SECRET=your-secret
PUSHER_APP_CLUSTER=mt1

# Broadcasting
BROADCAST_DRIVER=pusher
```

### Deployment Steps

1. Connect your GitHub repository to Railway
2. Create a new PostgreSQL service
3. Create a new Redis service
4. Set all environment variables
5. Deploy the application
6. Run migrations: `php artisan migrate --force`
7. Start queue worker: `php artisan queue:work`

### Queue Workers

Railway will automatically start the queue worker using the Procfile.

### Database Migrations

Migrations run automatically on deployment. To run manually:
```bash
php artisan migrate --force
```

### Webhooks

Configure webhooks in external services:
- Twilio: `https://your-app.railway.app/api/webhooks/twilio/*`
- SendGrid: `https://your-app.railway.app/api/webhooks/sendgrid/inbound`
- Stripe: `https://your-app.railway.app/api/webhooks/stripe`
