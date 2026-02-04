#!/bin/bash

# Railway AI Tools - Database Migration Script
# Runs Laravel migrations on the Postgres - AI TOOLs database

set -e

echo "🗄️  Railway AI Tools - Database Migration"
echo "=========================================="
echo ""

# Database connection details from Postgres - AI TOOLs service
DB_HOST="postgres-ea870ea6.railway.internal"
DB_PORT="5432"
DB_DATABASE="railway"
DB_USERNAME="postgres"
DB_PASSWORD="FzULulOrNbBNaiUkYutiRcTQMSqPlhhR"

# For external connection (from local machine)
DB_PUBLIC_HOST="tramway.proxy.rlwy.net"
DB_PUBLIC_PORT="21938"

echo "Database Configuration:"
echo "  Host (internal): $DB_HOST"
echo "  Database: $DB_DATABASE"
echo "  User: $DB_USERNAME"
echo ""

# Change to API directory
cd /Users/johnshine/Dropbox/Fibonacco/taskjuggler/Code/taskjuggler-api

# Check if we should use Railway CLI or local connection
read -p "Run migrations via Railway CLI (r) or local connection (l)? [r/l]: " method

if [ "$method" = "r" ] || [ "$method" = "R" ]; then
    echo ""
    echo "📡 Running migrations via Railway CLI..."
    echo "========================================"
    
    # Ensure we're linked to the right service
    railway link --project 7e7372dd-373a-4e78-a51e-15eab332b67d --service taskjuggler 2>/dev/null || true
    
    # Run migrations on Railway
    echo ""
    echo "Running: php artisan migrate --force"
    railway run "php artisan migrate --force"
    
    echo ""
    echo "✅ Migrations completed via Railway!"
    echo ""
    echo "Checking migration status..."
    railway run "php artisan migrate:status"
    
else
    echo ""
    echo "🔌 Running migrations via local connection..."
    echo "=============================================="
    
    # Create temporary .env for migration
    cat > .env.migration << EOF
APP_NAME="TaskJuggler AI Tools"
APP_ENV=production
APP_KEY=base64:P7yNIm0uxf5MAXjI7Byp0jQhiKmy4AjvdSZSbY68hQo=
APP_DEBUG=false

DB_CONNECTION=pgsql
DB_HOST=$DB_PUBLIC_HOST
DB_PORT=$DB_PUBLIC_PORT
DB_DATABASE=$DB_DATABASE
DB_USERNAME=$DB_USERNAME
DB_PASSWORD=$DB_PASSWORD

CACHE_DRIVER=array
QUEUE_CONNECTION=sync
SESSION_DRIVER=array
EOF
    
    echo ""
    echo "Running: php artisan migrate --force --env=migration"
    php artisan migrate --force --env=migration
    
    echo ""
    echo "✅ Migrations completed!"
    echo ""
    echo "Checking migration status..."
    php artisan migrate:status --env=migration
    
    # Cleanup
    rm .env.migration
fi

echo ""
echo "=========================================="
echo "🎉 Database Migration Complete!"
echo "=========================================="
echo ""
echo "Database: Postgres - AI TOOLs"
echo "  Internal: $DB_HOST:$DB_PORT"
echo "  External: $DB_PUBLIC_HOST:$DB_PUBLIC_PORT"
echo "  Database: $DB_DATABASE"
echo ""
echo "To check migration status anytime:"
echo "  railway run 'php artisan migrate:status'"
echo ""
echo "To rollback migrations:"
echo "  railway run 'php artisan migrate:rollback'"
echo ""
echo "To run fresh migrations (WARNING: destroys data):"
echo "  railway run 'php artisan migrate:fresh --force'"
echo ""
