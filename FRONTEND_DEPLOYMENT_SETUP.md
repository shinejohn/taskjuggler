# Frontend Deployment Setup

## Why Only API Was Deploying

**The Problem:**
- CodePipeline was only configured to build and deploy the **API** (`taskjuggler-api`)
- Frontend projects were **not included** in the pipeline:
  - `coordinator-web`
  - `taskjuggler-web`
  - `scanner-web`
  - `urpa-web`
  - `projects-web`
  - `process-web`

## Solution: Full Stack Deployment

I've added infrastructure to deploy **ALL** frontend projects:

### 1. Created Buildspec Files
Each frontend now has a `buildspec.yml`:
- `coordinator-web/buildspec.yml`
- `taskjuggler-web/buildspec.yml`
- `scanner-web/buildspec.yml`
- `urpa-web/buildspec.yml`
- `projects-web/buildspec.yml`
- `process-web/buildspec.yml`

Each buildspec:
1. Installs Node.js dependencies (`npm ci`)
2. Builds the frontend (`npm run build`)
3. Deploys to S3 (`aws s3 sync dist/ s3://$S3_BUCKET`)

### 2. Created Frontend Infrastructure Modules

**`infrastructure/pulumi/infrastructure/frontend_deployment.py`**
- Creates S3 buckets for each frontend
- Creates CloudFront distributions for CDN
- Configures SPA routing (404 → index.html)

**`infrastructure/pulumi/infrastructure/frontend_build.py`**
- Creates CodeBuild projects for each frontend
- Configures IAM roles and permissions
- Sets up CloudWatch logging

### 3. Updated CodePipeline

**`infrastructure/pulumi/infrastructure/codepipeline.py`**
- **Build Stage**: Parallel builds for API + all 6 frontends
- **Deploy Stage**: 
  - API → ECS deployment
  - Frontends → CloudFront invalidation

### 4. Updated Main Infrastructure

**`infrastructure/pulumi/__main__.py`**
- Creates frontend deployment infrastructure
- Creates frontend build projects
- Passes frontend configs to CodePipeline

## Deployment Flow

```
GitHub Push (main branch)
    ↓
CodePipeline Source Stage
    ↓
Build Stage (Parallel):
    ├─ Build API (Docker → ECR)
    ├─ Build coordinator-web (npm build → S3)
    ├─ Build taskjuggler-web (npm build → S3)
    ├─ Build scanner-web (npm build → S3)
    ├─ Build urpa-web (npm build → S3)
    ├─ Build projects-web (npm build → S3)
    └─ Build process-web (npm build → S3)
    ↓
Deploy Stage (Parallel):
    ├─ Deploy API (ECS service update)
    ├─ Invalidate coordinator-web (CloudFront)
    ├─ Invalidate taskjuggler-web (CloudFront)
    ├─ Invalidate scanner-web (CloudFront)
    ├─ Invalidate urpa-web (CloudFront)
    ├─ Invalidate projects-web (CloudFront)
    └─ Invalidate process-web (CloudFront)
```

## Next Steps

### 1. Deploy Infrastructure

```bash
cd infrastructure/pulumi
source venv/bin/activate
export PULUMI_ACCESS_TOKEN="<your-pulumi-access-token>"
pulumi up
```

This will create:
- 6 S3 buckets (one per frontend)
- 6 CloudFront distributions
- 6 CodeBuild projects
- Updated CodePipeline with frontend builds

### 2. Test Deployment

Make a commit to `main` branch:
```bash
git add .
git commit -m "Add frontend deployment infrastructure"
git push origin main
```

Watch CodePipeline execute:
- All builds run in parallel
- All deployments happen automatically

### 3. Access Frontends

After deployment, get frontend URLs:
```bash
pulumi stack output coordinator_web_url
pulumi stack output taskjuggler_web_url
pulumi stack output scanner_web_url
# etc.
```

## Frontend URLs Format

Each frontend will be available at:
- `https://<cloudfront-distribution-id>.cloudfront.net`

Example:
- Coordinator: `https://d1234567890abc.cloudfront.net`
- TaskJuggler: `https://d0987654321xyz.cloudfront.net`
- etc.

## Benefits

✅ **Full Stack Deployment**: API + all 6 frontends deploy together
✅ **Parallel Builds**: All builds run simultaneously (faster)
✅ **CDN Distribution**: CloudFront for fast global access
✅ **SPA Routing**: Proper handling of Vue Router routes
✅ **Automatic Invalidation**: CloudFront cache cleared on deploy

## Troubleshooting

### Frontend Build Fails
- Check buildspec.yml path matches frontend directory name
- Verify `npm run build` works locally
- Check CodeBuild logs in CloudWatch

### S3 Deployment Fails
- Verify CodeBuild role has S3 permissions
- Check bucket name matches environment variable

### CloudFront Not Updating
- Verify invalidation action in CodePipeline
- Check CloudFront distribution ID matches

