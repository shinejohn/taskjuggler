# 4calls.ai Deployment Guide

## Test Credentials

**Email:** test@4calls.ai  
**Password:** password123

## Deployment Steps

1. **Database Setup**
   - Run migrations: `php artisan migrate --force`
   - Run seeders: `php artisan db:seed --class=CoordinatorTestUserSeeder`

2. **Frontend Configuration**
   - Set `VITE_API_URL` to your backend API URL
   - Build frontend: `npm run build`

3. **Backend Configuration**
   - Ensure `.env` has correct database credentials
   - Set `APP_URL` to your production URL
   - Set `APP_ENV=production`
   - Set `APP_DEBUG=false`

4. **AWS Deployment**
   - Push to GitHub (triggers CodeBuild)
   - CodeBuild will build Docker image
   - ECS will deploy the service
   - Run migrations in ECS task

## Quick Deploy Script

```bash
# 1. Commit and push to GitHub
git add .
git commit -m "Deploy 4calls.ai coordinator platform"
git push origin main

# 2. Wait for CodeBuild to complete
# 3. SSH into ECS task and run migrations
aws ecs execute-command --cluster <cluster-name> --task <task-id> --container <container-name> --command "php artisan migrate --force" --interactive

# 4. Run seeders
aws ecs execute-command --cluster <cluster-name> --task <task-id> --container <container-name> --command "php artisan db:seed --class=CoordinatorTestUserSeeder" --interactive
```

