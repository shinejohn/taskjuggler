#!/bin/bash

# =============================================================================
# RAILWAY SETUP SCRIPT - Laravel + Vue Stack
# =============================================================================
# This script sets up everything you need for Railway deployment.
# Run from your project root directory.
# 
# Usage: ./railway-setup.sh
# =============================================================================

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color
BOLD='\033[1m'

# Print functions
print_header() {
    echo ""
    echo -e "${BLUE}${BOLD}═══════════════════════════════════════════════════════════════${NC}"
    echo -e "${BLUE}${BOLD}  $1${NC}"
    echo -e "${BLUE}${BOLD}═══════════════════════════════════════════════════════════════${NC}"
    echo ""
}

print_step() {
    echo -e "${CYAN}▶ $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "   ${BOLD}$1${NC}"
}

# =============================================================================
# PREFLIGHT CHECKS
# =============================================================================

print_header "🚂 Railway Deployment Setup"

print_step "Checking prerequisites..."

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    print_error "Railway CLI not found"
    echo ""
    echo "Install with:"
    echo "  npm install -g @railway/cli"
    echo ""
    echo "Then run: railway login"
    exit 1
fi
print_success "Railway CLI installed"

# Check if logged in
if ! railway whoami &>/dev/null; then
    print_warning "Not logged in to Railway"
    echo ""
    railway login
fi
RAILWAY_USER=$(railway whoami 2>/dev/null || echo "unknown")
print_success "Logged in as: $RAILWAY_USER"

# Check if we're in a Laravel project
if [ ! -f "artisan" ] || [ ! -f "composer.json" ]; then
    print_error "Not in a Laravel project directory"
    echo "Please run this script from your Laravel project root."
    exit 1
fi
print_success "Laravel project detected"

# Check if PHP is available (for key generation)
if command -v php &> /dev/null; then
    PHP_VERSION=$(php -v | head -n 1)
    print_success "PHP available: $PHP_VERSION"
    HAS_PHP=true
else
    print_warning "PHP not found locally (key generation will need to be done manually)"
    HAS_PHP=false
fi

echo ""

# =============================================================================
# PROJECT SETUP
# =============================================================================

print_header "📦 Project Configuration"

# Check if already linked to Railway
if railway status &>/dev/null 2>&1; then
    print_success "Project already linked to Railway"
    railway status
else
    print_step "Project not linked. Setting up..."
    echo ""
    echo "Would you like to:"
    echo "  1) Create a NEW Railway project"
    echo "  2) Link to an EXISTING Railway project"
    echo "  3) Exit and do this manually"
    echo ""
    read -p "Choose (1/2/3): " CHOICE
    
    case $CHOICE in
        1)
            print_step "Creating new Railway project..."
            railway init
            ;;
        2)
            print_step "Linking to existing project..."
            railway link
            ;;
        *)
            print_info "Run 'railway init' or 'railway link' manually, then run this script again."
            exit 0
            ;;
    esac
fi

echo ""

# =============================================================================
# DATABASE SERVICES
# =============================================================================

print_header "🗄️ Database Services"

print_step "Checking for PostgreSQL..."
if railway variables 2>&1 | grep -q "DATABASE_URL"; then
    print_success "PostgreSQL already configured"
else
    print_step "Adding PostgreSQL service..."
    railway add --database postgres 2>/dev/null || print_warning "Could not auto-add PostgreSQL. Add manually in dashboard."
fi

print_step "Checking for Redis/Valkey..."
if railway variables 2>&1 | grep -q "REDIS_URL"; then
    print_success "Redis already configured"
else
    print_step "Adding Redis service..."
    railway add --database redis 2>/dev/null || print_warning "Could not auto-add Redis. Add manually in dashboard."
fi

echo ""

# =============================================================================
# ENVIRONMENT VARIABLES
# =============================================================================

print_header "🔐 Environment Variables"

# APP_KEY
print_step "Checking APP_KEY..."
if railway variables 2>&1 | grep -q "APP_KEY=base64:"; then
    print_success "APP_KEY already set"
else
    if [ "$HAS_PHP" = true ]; then
        print_step "Generating APP_KEY..."
        APP_KEY=$(php artisan key:generate --show 2>/dev/null)
        if [ -n "$APP_KEY" ]; then
            railway variables --set "APP_KEY=$APP_KEY" 2>/dev/null
            print_success "APP_KEY generated and set"
        else
            print_warning "Could not generate APP_KEY. Set manually."
        fi
    else
        print_warning "Set APP_KEY manually: railway variables --set 'APP_KEY=base64:...'"
    fi
fi

# Core application variables
print_step "Setting core application variables..."

railway variables --set "APP_ENV=production" 2>/dev/null || true
railway variables --set "APP_DEBUG=false" 2>/dev/null || true
railway variables --set "LOG_CHANNEL=stderr" 2>/dev/null || true
railway variables --set "LOG_LEVEL=info" 2>/dev/null || true

print_success "Core variables set"

# Cache/Queue/Session
print_step "Setting cache and queue configuration..."

railway variables --set "CACHE_STORE=redis" 2>/dev/null || true
railway variables --set "SESSION_DRIVER=redis" 2>/dev/null || true
railway variables --set "QUEUE_CONNECTION=redis" 2>/dev/null || true

print_success "Cache/Queue/Session configured for Redis"

echo ""

# =============================================================================
# FILE VERIFICATION
# =============================================================================

print_header "📄 Configuration Files"

# Check nixpacks.toml
if [ -f "nixpacks.toml" ]; then
    print_success "nixpacks.toml exists"
else
    print_warning "nixpacks.toml not found - deployment may fail"
    print_info "Copy the provided nixpacks.toml to your project root"
fi

# Check Procfile
if [ -f "Procfile" ]; then
    print_success "Procfile exists"
else
    print_warning "Procfile not found"
    print_info "Copy the provided Procfile to your project root"
fi

# Check railway.json
if [ -f "railway.json" ]; then
    print_success "railway.json exists"
else
    print_warning "railway.json not found (optional but recommended)"
fi

# Check database config has URL parsing
if grep -q "DATABASE_URL" config/database.php 2>/dev/null; then
    print_success "config/database.php handles DATABASE_URL"
else
    print_warning "config/database.php may not parse DATABASE_URL correctly"
    print_info "Update config/database.php with the provided version"
fi

echo ""

# =============================================================================
# STATUS SUMMARY
# =============================================================================

print_header "📋 Current Configuration"

echo "Variables set:"
railway variables 2>&1 | grep -E "^[A-Z_]+=" | head -20 || echo "  (none visible)"

echo ""

# =============================================================================
# NEXT STEPS
# =============================================================================

print_header "🚀 Next Steps"

echo -e "${BOLD}1. Required: Set your API keys${NC}"
echo "   railway variables --set 'OPENROUTER_API_KEY=your-key'"
echo ""

echo -e "${BOLD}2. Deploy your application${NC}"
echo "   railway up"
echo ""

echo -e "${BOLD}3. After first deploy, set APP_URL${NC}"
echo "   railway variables --set 'APP_URL=https://your-app.up.railway.app'"
echo ""

echo -e "${BOLD}4. Add worker services (recommended)${NC}"
echo "   Go to Railway Dashboard → New Service → GitHub Repo"
echo "   - Horizon: Set start command to 'php artisan horizon'"
echo "   - Scheduler: Set start command to 'php artisan schedule:work'"
echo ""

echo -e "${BOLD}5. Optional: Add more services${NC}"
echo "   - Twilio: railway variables --set 'TWILIO_SID=xxx' 'TWILIO_AUTH_TOKEN=xxx'"
echo "   - Slack: railway variables --set 'SLACK_BOT_TOKEN=xxx'"
echo "   - Stripe: railway variables --set 'STRIPE_KEY=xxx' 'STRIPE_SECRET=xxx'"
echo ""

print_header "✅ Setup Complete"

echo "Run 'railway up' to deploy!"
echo ""
echo "Useful commands:"
echo "  railway logs        # View logs"
echo "  railway logs -f     # Follow logs"
echo "  railway shell       # SSH into container"
echo "  railway run php artisan migrate  # Run migrations"
echo ""
