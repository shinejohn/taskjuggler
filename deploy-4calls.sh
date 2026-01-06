#!/bin/bash

# Deploy 4calls.ai Coordinator Platform to AWS
set -e

echo "🚀 Starting 4calls.ai deployment..."

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Step 1: Update database seeder
echo -e "${BLUE}📝 Updating database seeder...${NC}"
cd taskjuggler-api
php artisan db:seed --class=CoordinatorTestUserSeeder --force || echo "Seeder already run or database not available locally"

# Step 2: Commit changes
echo -e "${BLUE}📦 Committing changes...${NC}"
cd ..
git add .
git commit -m "Deploy 4calls.ai coordinator platform with test user" || echo "No changes to commit"

# Step 3: Push to GitHub
echo -e "${BLUE}📤 Pushing to GitHub...${NC}"
git push origin main || git push origin master || echo "Push failed or already up to date"

echo -e "${GREEN}✅ Deployment initiated!${NC}"
echo -e "${YELLOW}⏳ Waiting for AWS CodeBuild to complete...${NC}"
echo ""
echo "Test credentials:"
echo "  Email: test@4calls.ai"
echo "  Password: password123"
echo ""
echo "After deployment completes, run migrations in ECS:"
echo "  aws ecs execute-command --cluster <cluster> --task <task> --container <container> --command 'php artisan migrate --force' --interactive"
echo "  aws ecs execute-command --cluster <cluster> --task <task> --container <container> --command 'php artisan db:seed --class=CoordinatorTestUserSeeder' --interactive"

