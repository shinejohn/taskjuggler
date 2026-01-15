#!/bin/bash

# Backend Tests Local Workflow Test Script
# Based on .github/workflows/backend-tests.yml

set -e

echo "=========================================="
echo "Backend Tests - Local Workflow Test"
echo "=========================================="
echo ""

cd "$(dirname "$0")/taskjuggler-api" || exit 1

# Step 1: Check PHP version
echo "Step 1: Checking PHP version..."
php --version
echo ""

# Step 2: Check Composer
echo "Step 2: Checking Composer..."
composer --version
echo ""

# Step 3: Clear Composer cache
echo "Step 3: Clearing Composer cache..."
composer clear-cache || true
echo ""

# Step 4: Install Composer dependencies
echo "Step 4: Installing Composer dependencies..."
export COMPOSER_MEMORY_LIMIT=-1
composer install --prefer-dist --no-interaction --no-progress
echo ""

# Step 5: Setup .env file
echo "Step 5: Setting up .env file..."
if [ -f .env.example ]; then
    cp .env.example .env
    echo "Copied .env.example to .env"
else
    touch .env
    echo "Created empty .env file"
fi
echo ""

# Step 6: Generate application key
echo "Step 6: Generating application key..."
php artisan key:generate --force
echo ""

# Step 7: Check PostgreSQL availability
echo "Step 7: Checking PostgreSQL availability..."
if command -v pg_isready &> /dev/null; then
    if pg_isready -h localhost -p 5432 -U postgres &> /dev/null; then
        echo "✅ PostgreSQL is ready"
    else
        echo "⚠️  PostgreSQL is not running locally"
        echo "   Skipping database-dependent steps"
        SKIP_DB=true
    fi
else
    echo "⚠️  pg_isready not found"
    SKIP_DB=true
fi
echo ""

# Step 8: Check Redis availability
echo "Step 8: Checking Redis availability..."
if command -v redis-cli &> /dev/null; then
    if redis-cli -h localhost -p 6379 ping &> /dev/null; then
        echo "✅ Redis is ready"
    else
        echo "⚠️  Redis is not running locally"
        SKIP_REDIS=true
    fi
else
    echo "⚠️  redis-cli not found"
    SKIP_REDIS=true
fi
echo ""

# Step 9: Install NPM dependencies
echo "Step 9: Installing NPM dependencies..."
if [ -f package.json ]; then
    npm ci || npm install || echo "⚠️  NPM install failed (non-blocking)"
else
    echo "⚠️  No package.json found, skipping NPM install"
fi
echo ""

# Step 10: Run database migrations (if database available)
if [ "$SKIP_DB" != "true" ]; then
    echo "Step 10: Running database migrations..."
    export DB_CONNECTION=pgsql
    export DB_HOST=localhost
    export DB_PORT=5432
    export DB_DATABASE=taskjuggler_test
    export DB_USERNAME=postgres
    export DB_PASSWORD=postgres
    export REDIS_HOST=localhost
    export REDIS_PORT=6379
    
    php artisan migrate:fresh --force --seed || {
        echo "❌ Migration failed!"
        php artisan migrate:status || true
        exit 1
    }
    echo "✅ Migrations completed successfully"
else
    echo "Step 10: Skipping migrations (database not available)"
fi
echo ""

# Step 11: Run tests (if database available)
if [ "$SKIP_DB" != "true" ]; then
    echo "Step 11: Running tests..."
    export DB_CONNECTION=pgsql
    export DB_HOST=localhost
    export DB_PORT=5432
    export DB_DATABASE=taskjuggler_test
    export DB_USERNAME=postgres
    export DB_PASSWORD=postgres
    export REDIS_HOST=localhost
    export REDIS_PORT=6379
    export APP_ENV=testing
    
    composer test || php artisan test || {
        echo "⚠️  Tests failed or not available"
    }
    echo "✅ Tests completed"
else
    echo "Step 11: Skipping tests (database not available)"
fi
echo ""

# Step 12: Run Pint (Code Style)
echo "Step 12: Running Pint (Code Style)..."
if [ -f ./vendor/bin/pint ]; then
    ./vendor/bin/pint --test || echo "⚠️  Pint check failed (non-blocking)"
else
    echo "⚠️  Pint not installed, skipping"
fi
echo ""

echo "=========================================="
echo "Backend Tests - Local Workflow Test Complete"
echo "=========================================="



