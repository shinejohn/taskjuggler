# 🚀 4calls.ai Final Deployment Instructions

## ✅ What Has Been Done

1. ✅ **4calls.ai coordinator web code** integrated into `coordinator-web/`
2. ✅ **Backend API** integrated into `taskjuggler-api/`
3. ✅ **Test user seeder** created (`CoordinatorTestUserSeeder`)
4. ✅ **Docker entrypoint** script created for automatic migrations
5. ✅ **All code pushed to GitHub** (commit: latest)

## 🔐 Test Credentials

**Email:** `test@4calls.ai`  
**Password:** `password123`

This user includes:
- User account
- Test Organization ("Test Organization")
- Test Coordinator ("Sally")
- Role and Persona templates

## 📋 Deployment Steps

### Step 1: Wait for AWS CodeBuild

The push to GitHub should have triggered CodeBuild. Check status:
```bash
aws codebuild list-builds-for-project --project-name taskjuggler-production-build --max-items 1
```

### Step 2: Update ECS Task Definition (First Time Only)

For the first deployment, you need to enable database seeding:

**Option A: Via AWS Console**
1. Go to ECS → Task Definitions → `taskjuggler-production-api`
2. Create new revision
3. Add environment variable: `APP_SEED_DB` = `true`
4. Update service to use new revision

**Option B: Via AWS CLI**
```bash
# Get current task definition
aws ecs describe-task-definition --task-definition taskjuggler-production-api --query 'taskDefinition' > task-def.json

# Edit task-def.json to add APP_SEED_DB: true in containerDefinitions[0].environment
# Then register new revision
aws ecs register-task-definition --cli-input-json file://task-def.json

# Update service
aws ecs update-service \
  --cluster taskjuggler-production-cluster \
  --service taskjuggler-production-api \
  --task-definition taskjuggler-production-api
```

### Step 3: Verify Migrations Ran

Check CloudWatch logs:
```bash
aws logs tail /ecs/taskjuggler-production --follow
```

Look for:
- "✅ Database connection established"
- "📦 Running database migrations..."
- "🌱 Running database seeders..." (if APP_SEED_DB=true)

### Step 4: Run Migrations Manually (If Needed)

If migrations didn't run automatically:

```bash
# Find running task
TASK_ARN=$(aws ecs list-tasks --cluster taskjuggler-production-cluster --service-name taskjuggler-production-api --query 'taskArns[0]' --output text)
TASK_ID=$(echo $TASK_ARN | awk -F/ '{print $NF}')

# Run migrations
aws ecs execute-command \
  --cluster taskjuggler-production-cluster \
  --task $TASK_ID \
  --container api \
  --command "php artisan migrate --force" \
  --interactive

# Run seeders
aws ecs execute-command \
  --cluster taskjuggler-production-cluster \
  --task $TASK_ID \
  --container api \
  --command "php artisan db:seed --class=CoordinatorTestUserSeeder --force" \
  --interactive
```

Or use the provided script:
```bash
./run-migrations-on-aws.sh
```

### Step 5: Configure Frontend

Update the frontend environment variable:

**If using S3/CloudFront:**
1. Set `VITE_API_URL` to your API URL (e.g., `https://api.yourdomain.com/api`)
2. Rebuild: `cd coordinator-web && npm run build`
3. Deploy to S3/CloudFront

**If using separate hosting:**
- Set `VITE_API_URL` environment variable
- Rebuild and deploy

### Step 6: Test Login

1. Navigate to your frontend URL
2. Click "Login"
3. Enter credentials:
   - Email: `test@4calls.ai`
   - Password: `password123`
4. Verify you can access the dashboard

## 🔧 Environment Variables Needed

### Backend (ECS Task Definition)
```env
APP_ENV=production
APP_DEBUG=false
APP_URL=https://api.yourdomain.com
DB_CONNECTION=pgsql
DB_HOST=<rds-endpoint>
DB_DATABASE=taskjuggler
DB_USERNAME=<from-secrets>
DB_PASSWORD=<from-secrets>
REDIS_HOST=<elasticache-endpoint>
APP_SEED_DB=true  # Set to false after first deployment
```

### Frontend (Build Time)
```env
VITE_API_URL=https://api.yourdomain.com/api
```

## 📍 API Endpoints

All coordinator endpoints are under `/api/coordinator/`:
- Auth: `/api/auth/login`, `/api/auth/register`
- Organizations: `/api/coordinator/organizations`
- Dashboard: `/api/coordinator/organizations/{id}/dashboard/metrics`
- Contacts: `/api/coordinator/organizations/{id}/contacts`
- Calls: `/api/coordinator/organizations/{id}/calls`
- Appointments: `/api/coordinator/organizations/{id}/appointments`
- Campaigns: `/api/coordinator/organizations/{id}/campaigns`
- Billing: `/api/coordinator/organizations/{id}/billing`

## 🐛 Troubleshooting

### Database Connection Issues
- Check RDS security group allows ECS tasks
- Verify database credentials in Secrets Manager
- Check CloudWatch logs for connection errors

### Migrations Not Running
- Verify `docker-entrypoint.sh` has execute permissions in Dockerfile
- Check CloudWatch logs for entrypoint script output
- Manually run migrations using `run-migrations-on-aws.sh`

### Frontend Can't Connect
- Verify `VITE_API_URL` is set correctly
- Check CORS configuration in Laravel (`config/cors.php`)
- Verify API endpoint is accessible from browser

### Test User Not Created
- Check if `APP_SEED_DB=true` is set
- Verify seeder ran (check CloudWatch logs)
- Manually run: `php artisan db:seed --class=CoordinatorTestUserSeeder --force`

## ✅ Verification Checklist

- [ ] CodeBuild completed successfully
- [ ] Docker image pushed to ECR
- [ ] ECS service is running (2/2 tasks healthy)
- [ ] Migrations ran (check CloudWatch logs)
- [ ] Test user created (check database or try login)
- [ ] API health check passes: `curl https://api.yourdomain.com/api/health`
- [ ] Frontend deployed and accessible
- [ ] Frontend can connect to API
- [ ] Login works with test credentials
- [ ] Dashboard loads with data

## 📞 Next Steps After Deployment

1. **Set APP_SEED_DB=false** after first deployment (to prevent re-seeding)
2. **Configure DNS** to point to your ALB
3. **Set up SSL** certificate (if not already done)
4. **Update frontend** `VITE_API_URL` to production URL
5. **Deploy frontend** to your hosting (S3/CloudFront or other)

---

**Status:** Ready for AWS Deployment  
**GitHub:** Pushed to `main` branch  
**Test User:** `test@4calls.ai` / `password123`

