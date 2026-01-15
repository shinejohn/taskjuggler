# Quick Test Commands

## 1. Commit and Push Workflow Changes

```bash
cd /Users/johnshine/Dropbox/Fibonacco/taskjuggler/Code

# Stage workflow fixes
git add .github/workflows/backend-tests.yml
git add .github/workflows/frontend-tests.yml
git add .github/workflows/build.yml
git add taskjuggler-api/buildspec.yml
git add infrastructure/pulumi/Pulumi.production.yaml

# Commit
git commit -m "fix: improve GitHub workflows and enable GitHub source in CodeBuild

- Add explicit service waits for PostgreSQL/Redis
- Remove continue-on-error from migrations (critical step)
- Add shared-ui artifact caching
- Simplify buildspec for GitHub source
- Enable GitHub source in CodeBuild via Pulumi config"

# Push to test branch
git checkout -b test/workflow-fixes
git push origin test/workflow-fixes
```

## 2. Verify GitHub Actions

Visit: https://github.com/shinejohn/taskjuggler/actions

Check for:
- ✅ Backend tests: "PostgreSQL is ready", "Redis is ready"
- ✅ Frontend tests: "Upload shared-ui artifact", "Download shared-ui artifact"
- ✅ Build: Artifact caching working

## 3. Update CodeBuild to Use GitHub Source

```bash
cd infrastructure/pulumi

# Verify config
pulumi config get github:enabled
pulumi config get github:owner
pulumi config get github:repo

# Preview changes
pulumi preview --stack production

# Apply changes
pulumi up --stack production
```

## 4. Verify CodeBuild Configuration

```bash
# Check source type (should be GITHUB)
aws codebuild batch-get-projects \
  --names taskjuggler-production-build \
  --region us-east-1 \
  --query 'projects[0].source.type'

# Check source location
aws codebuild batch-get-projects \
  --names taskjuggler-production-build \
  --region us-east-1 \
  --query 'projects[0].source.location'
```

## 5. Test CodeBuild

```bash
# Trigger manual build
aws codebuild start-build \
  --project-name taskjuggler-production-build \
  --region us-east-1

# Check build status (replace BUILD_ID)
BUILD_ID=<build-id>
aws codebuild batch-get-builds \
  --ids $BUILD_ID \
  --region us-east-1 \
  --query 'builds[0].buildStatus'
```

## 6. Test Automatic Trigger

```bash
# Make a small change and push
cd /Users/johnshine/Dropbox/Fibonacco/taskjuggler/Code
echo "# Test" >> taskjuggler-api/README.md
git add taskjuggler-api/README.md
git commit -m "test: trigger CodeBuild"
git push origin main

# Monitor CodeBuild
aws codebuild list-builds-for-project \
  --project-name taskjuggler-production-build \
  --region us-east-1 \
  --max-items 1
```



