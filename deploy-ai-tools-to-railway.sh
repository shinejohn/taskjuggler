#!/bin/bash

# Railway AI Tools Deployment Script
# This script deploys the TaskJuggler platform (AI Tools) to Railway

set -e  # Exit on error

PROJECT_ID="7e7372dd-373a-4e78-a51e-15eab332b67d"
ENVIRONMENT="production"

echo "🚀 Starting Railway AI Tools Deployment"
echo "========================================"

# Step 1: Create the Postgres - AI TOOLS database
echo ""
echo "📦 Step 1: Creating Postgres - AI TOOLS database..."
echo "Please create a new PostgreSQL database in Railway:"
echo "  1. Go to Railway dashboard: https://railway.app/project/$PROJECT_ID"
echo "  2. Click '+ New Service'"
echo "  3. Select 'Database' -> 'PostgreSQL'"
echo "  4. Name it: 'Postgres - AI TOOLS'"
echo ""
read -p "Press Enter after you've created the database..."

# Get the database connection details
echo ""
echo "Please provide the database connection details from Railway:"
read -p "Database internal hostname (e.g., postgres-aitools.railway.internal): " DB_HOST
read -p "Database password: " DB_PASSWORD

# Database connection string
DATABASE_URL="postgresql://postgres:${DB_PASSWORD}@${DB_HOST}:5432/railway"

echo ""
echo "✅ Database configuration captured"

# Step 2: Configure the backend API (taskjuggler-api)
echo ""
echo "📦 Step 2: Configuring taskjuggler-api service..."

# Generate APP_KEY
cd taskjuggler-api
if [ ! -f ".env" ]; then
    cp .env.example .env 2>/dev/null || true
fi

APP_KEY=$(php artisan key:generate --show 2>/dev/null || echo "base64:$(openssl rand -base64 32)")

# Set backend variables
railway variables --service "taskjuggler" \
  --set "APP_NAME=TaskJuggler AI Tools" \
  --set "APP_ENV=production" \
  --set "APP_DEBUG=false" \
  --set "APP_KEY=${APP_KEY}" \
  --set "APP_URL=https://taskjuggler-production.up.railway.app" \
  --set "LOG_CHANNEL=stderr" \
  --set "LOG_LEVEL=info" \
  --set "DB_CONNECTION=pgsql" \
  --set "DB_HOST=${DB_HOST}" \
  --set "DB_PORT=5432" \
  --set "DB_DATABASE=railway" \
  --set "DB_USERNAME=postgres" \
  --set "DB_PASSWORD=${DB_PASSWORD}" \
  --set "DATABASE_URL=${DATABASE_URL}" \
  --set "REDIS_HOST=Valkey.railway.internal" \
  --set "REDIS_PORT=6379" \
  --set "CACHE_STORE=redis" \
  --set "QUEUE_CONNECTION=redis" \
  --set "SESSION_DRIVER=redis"

echo "✅ Backend API configured"

# Step 3: Create railway.json for the API
echo ""
echo "📦 Step 3: Creating deployment configuration for API..."

cat > railway.json << 'EOF'
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "numReplicas": 1,
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
EOF

cat > nixpacks.toml << 'EOF'
[phases.setup]
nixPkgs = ['php83', 'php83Packages.composer', 'nodejs_20']

[phases.install]
cmds = ['composer install --no-dev --optimize-autoloader']

[phases.build]
cmds = [
  'php artisan config:cache',
  'php artisan view:cache'
]

[start]
cmd = 'php artisan migrate --force && php artisan serve --host=0.0.0.0 --port=${PORT:-8000}'
EOF

echo "✅ API deployment configuration created"

# Step 4: Deploy the API
echo ""
echo "📦 Step 4: Deploying taskjuggler-api..."
echo "Committing configuration files..."

git add railway.json nixpacks.toml
git commit -m "feat: add Railway deployment configuration for taskjuggler-api" || true
git push origin main

echo "✅ API deployment triggered"

# Step 5: Configure frontend applications
echo ""
echo "📦 Step 5: Configuring frontend applications..."

API_URL="https://taskjuggler-production.up.railway.app"

# Array of frontend apps and their Railway service names
declare -A FRONTEND_APPS=(
    ["taskjuggler-web"]="taskjuggler-web"
    ["4doctors-web"]="4healthcare"
    ["urpa-web"]="URPA"
    ["process-web"]="4process"
    ["projects-web"]="4projects"
    ["scanner-web"]="Site Health"
    ["ideacircuit-web"]="Idea Circuit"
    ["coordinator-web"]="coordinator"
    ["official-notice-web"]="official-notice"
)

cd ..

for APP_DIR in "${!FRONTEND_APPS[@]}"; do
    SERVICE_NAME="${FRONTEND_APPS[$APP_DIR]}"
    
    echo ""
    echo "Configuring $APP_DIR -> $SERVICE_NAME..."
    
    # Create railway.json for each frontend
    cat > "$APP_DIR/railway.json" << 'EOF'
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "numReplicas": 1,
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
EOF
    
    # Set environment variables for the service
    railway variables --service "$SERVICE_NAME" \
      --set "VITE_API_URL=${API_URL}" \
      --set "NODE_ENV=production" || echo "⚠️  Service $SERVICE_NAME may not exist yet"
    
    echo "✅ $APP_DIR configured"
done

echo ""
echo "📦 Step 6: Committing frontend configurations..."

git add */railway.json
git commit -m "feat: add Railway deployment configurations for frontend apps" || true
git push origin main

echo ""
echo "✅ Frontend applications configured and deployed"

echo ""
echo "========================================"
echo "🎉 Deployment Complete!"
echo "========================================"
echo ""
echo "Next steps:"
echo "1. Monitor deployments in Railway dashboard"
echo "2. Verify all services are building successfully"
echo "3. Check database migrations completed"
echo "4. Test API endpoints"
echo "5. Test frontend applications"
echo ""
echo "Useful commands:"
echo "  railway logs --service taskjuggler"
echo "  railway status"
echo "  railway variables --service <service-name>"
echo ""
