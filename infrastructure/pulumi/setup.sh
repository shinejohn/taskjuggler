#!/bin/bash
# Setup script for AWS infrastructure deployment

set -e

echo "🚀 Task Juggler AWS Infrastructure Setup"
echo "========================================"
echo ""

# Check prerequisites
echo "📋 Checking prerequisites..."

if ! command -v pulumi &> /dev/null; then
    echo "❌ Pulumi not found. Installing..."
    curl -fsSL https://get.pulumi.com | sh
    export PATH="$HOME/.pulumi/bin:$PATH"
fi

if ! command -v aws &> /dev/null; then
    echo "❌ AWS CLI not found. Please install: https://aws.amazon.com/cli/"
    exit 1
fi

if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 not found. Please install Python 3.8+"
    exit 1
fi

echo "✅ Prerequisites check passed"
echo ""

# Install Python dependencies
echo "📦 Installing Python dependencies..."
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
echo "✅ Dependencies installed"
echo ""

# Configure AWS credentials
echo "🔐 Configuring AWS credentials..."
if [ -z "$AWS_ACCESS_KEY_ID" ]; then
    echo "Please set AWS_ACCESS_KEY_ID environment variable"
    exit 1
fi

if [ -z "$AWS_SECRET_ACCESS_KEY" ]; then
    echo "Please set AWS_SECRET_ACCESS_KEY environment variable"
    exit 1
fi

export AWS_DEFAULT_REGION=${AWS_DEFAULT_REGION:-us-east-1}
echo "✅ AWS credentials configured"
echo ""

# Initialize Pulumi stack
echo "🏗️  Initializing Pulumi stack..."
read -p "Enter stack name (default: production): " stack_name
stack_name=${stack_name:-production}

if ! pulumi stack ls | grep -q "$stack_name"; then
    pulumi stack init "$stack_name"
fi

pulumi stack select "$stack_name"
echo "✅ Stack initialized: $stack_name"
echo ""

# Set basic configuration
echo "⚙️  Setting basic configuration..."
pulumi config set aws:region "$AWS_DEFAULT_REGION"
pulumi config set project_name taskjuggler
pulumi config set environment "$stack_name"
echo "✅ Configuration set"
echo ""

# Prompt for secrets
echo "🔒 Setting up secrets..."
echo "You'll need to set the following secrets:"
echo "  - db_password (database password)"
echo "  - redis_auth_token (Redis auth token)"
echo "  - app_key (Laravel app key)"
echo "  - twilio_account_sid, twilio_auth_token"
echo "  - openrouter_api_key"
echo "  - stripe_key, stripe_secret, stripe_webhook_secret"
echo ""
echo "Run these commands to set secrets:"
echo "  pulumi config set --secret db_password <password>"
echo "  pulumi config set --secret redis_auth_token <token>"
echo "  # ... etc"
echo ""

# Preview
echo "👀 Previewing infrastructure..."
read -p "Run 'pulumi preview' now? (y/n): " preview
if [ "$preview" = "y" ]; then
    pulumi preview
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Set all required secrets (see above)"
echo "2. Run 'pulumi preview' to review changes"
echo "3. Run 'pulumi up' to deploy infrastructure"
echo "4. Follow AWS_MIGRATION_GUIDE.md for application migration"
