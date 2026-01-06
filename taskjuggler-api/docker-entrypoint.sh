#!/bin/bash
set -e

echo "🚀 Starting Task Juggler API..."

# Wait for database to be ready
echo "⏳ Waiting for database connection..."
until php artisan db:show &> /dev/null; do
    echo "Database not ready, waiting..."
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

