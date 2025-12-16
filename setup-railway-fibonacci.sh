#!/bin/bash
set -e

echo "=== Railway Setup for Fibonacci Platform ==="
echo ""
echo "This script sets up Railway for:"
echo "  - fibonacci-api (web, worker, scheduler)"
echo "  - taskjuggler frontend"
echo ""
echo "NOTE: Process and Projects frontends will be set up later when code is ready."
echo ""

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "ERROR: Railway CLI is not installed."
    echo "Install it with: brew install railway (macOS) or npm install -g @railway/cli"
    exit 1
fi

# Check if logged in
if ! railway whoami &> /dev/null; then
    echo "ERROR: Not logged in to Railway."
    echo "Run: railway login"
    exit 1
fi

echo "Logged in as: $(railway whoami | head -1)"
echo ""

# Navigate to API directory
cd taskjuggler-api

# Check if already linked to a project
if railway status &> /dev/null; then
    echo "Already linked to a Railway project."
    read -p "Do you want to use the existing project? (y/n): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Unlinking from current project..."
        railway unlink
    else
        echo "Using existing project."
        PROJECT_LINKED=true
    fi
fi

if [ "$PROJECT_LINKED" != "true" ]; then
    echo ""
    echo "Please create a new Railway project called 'fibonacci' in the Railway dashboard,"
    echo "or link to an existing project."
    echo ""
    echo "To link to existing project:"
    echo "  railway link --project <project-id>"
    echo ""
    echo "Or create new project in dashboard at: https://railway.app/new"
    echo "Then link it with: railway link"
    echo ""
    read -p "Press Enter when you've created/linked the project..."
fi

# Add PostgreSQL database
echo ""
echo "Adding PostgreSQL database..."
if railway add --database postgres; then
    echo "✓ PostgreSQL added"
    sleep 5  # Wait for provisioning
else
    echo "⚠ PostgreSQL might already exist or failed to add"
fi

# Add Redis
echo ""
echo "Adding Redis..."
if railway add --database redis; then
    echo "✓ Redis added"
    sleep 5  # Wait for provisioning
else
    echo "⚠ Redis might already exist or failed to add"
fi

# Set API environment variables
echo ""
echo "Setting API environment variables..."
railway variables set \
  APP_NAME="Fibonacci API" \
  APP_ENV=production \
  APP_DEBUG=false \
  LOG_CHANNEL=stderr \
  LOG_LEVEL=info \
  DB_CONNECTION=pgsql \
  CACHE_STORE=redis \
  SESSION_DRIVER=redis \
  QUEUE_CONNECTION=redis \
  MODULE_TASKS_ENABLED=true \
  MODULE_PROCESSES_ENABLED=false \
  MODULE_PROJECTS_ENABLED=false || echo "⚠ Some variables might already be set"

echo ""
echo "=== Railway Setup Complete for API ==="
echo ""
echo "Next steps:"
echo "1. Connect your GitHub repo in Railway dashboard"
echo "2. Set the start command to: web (for API web service)"
echo "3. Add worker service with start command: worker"
echo "4. Add scheduler service with start command: scheduler"
echo "5. Set up taskjuggler-web service (navigate to taskjuggler-web directory)"
echo ""
echo "For taskjuggler frontend:"
echo "  cd ../taskjuggler-web"
echo "  railway link --project <same-project-id>"
echo "  railway variables set VITE_API_URL=<your-api-url>"
echo ""
railway status

