# 4 Projects.ai - Setup Instructions

## Prerequisites

1. **PostgreSQL** - Database server
2. **Redis** - Cache and queue driver
3. **PHP 8.2+** with required extensions
4. **Node.js 18+** and npm
5. **Composer** - PHP dependency manager

## Step 1: Database Setup

### Create PostgreSQL Database

```bash
# Connect to PostgreSQL
psql postgres

# Create database
CREATE DATABASE 4projects;

# Create user (if needed)
CREATE USER postgres WITH PASSWORD 'your-password';
GRANT ALL PRIVILEGES ON DATABASE 4projects TO postgres;

# Exit psql
\q
```

### Update .env Database Credentials

```env
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=4projects
DB_USERNAME=postgres
DB_PASSWORD=your-password
```

## Step 2: Redis Setup

### Install Redis

**macOS:**
```bash
brew install redis
brew services start redis
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt-get install redis-server
sudo systemctl start redis
```

### Verify Redis is Running
```bash
redis-cli ping
# Should return: PONG
```

### Update .env Redis Settings

If using `phpredis` extension (faster):
```bash
# Install PHP Redis extension
pecl install redis
```

Or use `predis` (PHP client, no extension needed):
```env
REDIS_CLIENT=predis
```

## Step 3: Run Migrations

```bash
# Make sure PostgreSQL is running and database exists
php artisan migrate
```

## Step 4: Generate Application Key (if not already done)

```bash
php artisan key:generate
```

## Step 5: Configure Environment Variables

Update these values in `.env`:

### OpenRouter AI
```env
OPENROUTER_API_KEY=your-actual-api-key
OPENROUTER_BASE_URL=https://openrouter.ai/api/v1
OPENROUTER_DEFAULT_MODEL=anthropic/claude-3.5-sonnet
```

### Reverb (WebSockets)
```env
REVERB_APP_ID=4projects
REVERB_APP_KEY=generate-using-artisan-reverb:install
REVERB_APP_SECRET=generate-using-artisan-reverb:install
REVERB_HOST=localhost
REVERB_PORT=8080
REVERB_SCHEME=http
```

Generate Reverb keys:
```bash
php artisan reverb:install
# Follow prompts or manually generate keys
```

### Twilio (Optional - for SMS/Voice)
```env
TWILIO_SID=your-twilio-sid
TWILIO_TOKEN=your-twilio-token
TWILIO_PHONE=+15551234567
```

### Slack (Optional - for Slack integration)
```env
SLACK_BOT_TOKEN=xoxb-your-slack-bot-token
SLACK_SIGNING_SECRET=your-signing-secret
```

### Mail Configuration
```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.example.com
MAIL_PORT=587
MAIL_USERNAME=your-email@example.com
MAIL_PASSWORD=your-password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS="tasks@4projects.ai"
```

## Step 6: Build Frontend Assets

```bash
npm install
npm run build
# Or for development:
npm run dev
```

## Step 7: Start Development Servers

You'll need multiple terminals:

**Terminal 1 - Laravel:**
```bash
php artisan serve
```

**Terminal 2 - Vite (Frontend):**
```bash
npm run dev
```

**Terminal 3 - Horizon (Queue Monitor):**
```bash
php artisan horizon
```

**Terminal 4 - Reverb (WebSockets):**
```bash
php artisan reverb:start
```

## Step 8: Access the Application

- **Web App**: http://localhost:8000
- **API**: http://localhost:8000/api
- **Horizon Dashboard**: http://localhost:8000/horizon
- **Health Check**: http://localhost:8000/api/health

## Step 9: Create First User

Use the registration endpoint or create via tinker:

```bash
php artisan tinker
```

```php
$org = App\Models\Organization::create([
    'name' => 'My Organization',
    'slug' => 'my-org',
    'plan' => 'free'
]);

$user = App\Models\User::create([
    'organization_id' => $org->id,
    'name' => 'Admin User',
    'email' => 'admin@example.com',
    'password' => Hash::make('password')
]);
```

## Troubleshooting

### Database Connection Issues
- Ensure PostgreSQL is running: `pg_isready`
- Check database credentials in `.env`
- Verify database exists: `psql -l | grep 4projects`

### Redis Connection Issues
- Ensure Redis is running: `redis-cli ping`
- Check Redis configuration in `.env`
- If using `phpredis`, ensure extension is installed

### Migration Issues
- Make sure database is created
- Check user has proper permissions
- Review migration files for syntax errors

### Frontend Build Issues
- Run `npm install` to ensure dependencies are installed
- Check Node.js version: `node --version` (should be 18+)
- Clear cache: `npm cache clean --force`

## Next Steps

1. Configure your OpenRouter API key for AI features
2. Set up email service for notifications
3. Configure Twilio if using SMS/Voice channels
4. Set up Slack integration if needed
5. Customize organization settings
6. Add team members to projects


