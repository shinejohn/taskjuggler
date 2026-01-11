#!/bin/bash
set -e

echo "🚀 Starting Task Juggler API..."

# Wait for database to be ready
echo "⏳ Waiting for database connection..."
MAX_RETRIES=30
RETRY_COUNT=0
until php artisan db:show 2>&1; do
    RETRY_COUNT=$((RETRY_COUNT + 1))
    if [ $RETRY_COUNT -ge $MAX_RETRIES ]; then
        echo "❌ Database connection failed after $MAX_RETRIES attempts"
        echo "Checking database configuration..."
        echo "DB_HOST: ${DB_HOST:-not set}"
        echo "DB_PORT: ${DB_PORT:-not set}"
        echo "DB_DATABASE: ${DB_DATABASE:-not set}"
        echo "DB_USERNAME: ${DB_USERNAME:-not set}"
        echo "DB_CONNECTION: ${DB_CONNECTION:-not set}"
        echo "Attempting direct connection test..."
        php -r "try { \$pdo = new PDO('pgsql:host='.getenv('DB_HOST').';port='.getenv('DB_PORT').';dbname='.getenv('DB_DATABASE'), getenv('DB_USERNAME'), getenv('DB_PASSWORD')); echo 'Direct PDO connection: SUCCESS\n'; } catch (Exception \$e) { echo 'Direct PDO connection: FAILED - '.\$e->getMessage().'\n'; }"
        exit 1
    fi
    echo "Database not ready, waiting... (attempt $RETRY_COUNT/$MAX_RETRIES)"
    sleep 2
done

echo "✅ Database connection established"

# Run migrations
echo "📦 Running database migrations..."
php artisan migrate --force || echo "Migrations completed with warnings"

# Run seeders (only if APP_SEED_DB is true)
if [ "${APP_SEED_DB:-false}" = "true" ]; then
    echo "🌱 Running database seeders..."
    php artisan db:seed --class=CoordinatorTestUserSeeder --force || echo "Seeders completed with warnings"
fi

# Clear and cache config
echo "⚙️ Optimizing application..."
php artisan config:cache || true
php artisan route:cache || true
php artisan view:cache || true

# Start supervisor (which runs nginx and php-fpm)
echo "🎯 Starting services..."
exec /usr/bin/supervisord -c /etc/supervisor/conf.d/supervisord.conf

