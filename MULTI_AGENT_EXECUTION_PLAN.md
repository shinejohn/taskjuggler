# Multi-Agent Execution Plan: GitHub Workflows & Deployment Fixes

**Date**: January 2025  
**Status**: 🟢 Ready for Execution  
**Strategy Document**: `GITHUB_WORKFLOWS_DEPLOYMENT_DIAGNOSIS_STRATEGY.md`

---

## 🎯 Overview

This plan breaks down the GitHub Workflows & Deployment fixes into parallelizable tasks for multiple agents. Each agent can work independently on their assigned tasks, with coordination points for dependencies.

---

## 👥 Agent Roles & Responsibilities

### Agent 1: Backend Workflow Specialist
**Focus**: Backend tests workflow fixes  
**Files**: `.github/workflows/backend-tests.yml`, `.github/workflows/ci.yml`

### Agent 2: Frontend Workflow Specialist  
**Focus**: Frontend tests and build workflow fixes  
**Files**: `.github/workflows/frontend-tests.yml`, `.github/workflows/build.yml`

### Agent 3: Infrastructure Specialist
**Focus**: CodeBuild, Pulumi, and deployment infrastructure  
**Files**: `infrastructure/pulumi/**`, `taskjuggler-api/buildspec.yml`

### Agent 4: Testing & Validation Specialist
**Focus**: Local testing, validation, and documentation  
**Files**: Test scripts, validation checklists

### Agent 5: Deployment Orchestrator (Optional)
**Focus**: End-to-end deployment workflow, coordination  
**Files**: `.github/workflows/deploy.yml` (already created)

---

## 📋 Task Breakdown by Agent

### 🔵 AGENT 1: Backend Workflow Specialist

#### Task 1.1: Fix Service Health Checks
**Priority**: P0 - Critical  
**Estimated Time**: 30 minutes  
**Dependencies**: None  
**Can Work In Parallel**: ✅ Yes

**Instructions**:
1. Open `.github/workflows/backend-tests.yml`
2. After the service setup steps (around line 42), add explicit wait steps:

```yaml
- name: Wait for PostgreSQL
  run: |
    until pg_isready -h localhost -p 5432 -U postgres; do
      echo "Waiting for PostgreSQL..."
      sleep 2
    done
    echo "PostgreSQL is ready"

- name: Wait for Redis
  run: |
    until redis-cli -h localhost -p 6379 ping; do
      echo "Waiting for Redis..."
      sleep 2
    done
    echo "Redis is ready"
```

3. Place these steps AFTER service containers start but BEFORE migrations
4. Test locally if possible
5. Commit with message: `fix: Add explicit service health checks to backend tests`

**Success Criteria**:
- ✅ Wait steps added before migrations
- ✅ Proper error handling if services don't start
- ✅ Clear logging messages

---

#### Task 1.2: Remove Masked Migration Failures
**Priority**: P0 - Critical  
**Estimated Time**: 20 minutes  
**Dependencies**: Task 1.1 (should be done first)  
**Can Work In Parallel**: ⚠️ After Task 1.1

**Instructions**:
1. Open `.github/workflows/backend-tests.yml`
2. Find the migration step (around line 94)
3. Remove `continue-on-error: true` if present
4. Add proper error handling:

```yaml
- name: Run database migrations
  working-directory: ./taskjuggler-api
  env:
    DB_CONNECTION: pgsql
    DB_HOST: localhost
    DB_PORT: 5432
    DB_DATABASE: taskjuggler_test
    DB_USERNAME: postgres
    DB_PASSWORD: postgres
    REDIS_HOST: localhost
    REDIS_PORT: 6379
  run: |
    php artisan migrate:fresh --force --seed || {
      echo "Migration failed!"
      php artisan migrate:status || true
      exit 1
    }
```

5. Also update `.github/workflows/ci.yml` if it has the same issue
6. Commit with message: `fix: Remove continue-on-error from migrations, add proper error handling`

**Success Criteria**:
- ✅ No `continue-on-error: true` on migration step
- ✅ Proper error messages on failure
- ✅ Migration status shown on failure

---

#### Task 1.3: Fix NPM Step Error Masking
**Priority**: P1 - Important  
**Estimated Time**: 15 minutes  
**Dependencies**: None  
**Can Work In Parallel**: ✅ Yes

**Instructions**:
1. Open `.github/workflows/backend-tests.yml`
2. Find NPM install step (around line 80)
3. Review if `continue-on-error: true` is appropriate
4. If NPM is critical, remove it and add error handling
5. If NPM is optional, keep `continue-on-error` but add clear logging:

```yaml
- name: Install NPM dependencies
  working-directory: ./taskjuggler-api
  run: |
    npm ci || {
      echo "⚠️ npm ci failed, trying npm install..."
      npm install || {
        echo "❌ NPM installation failed"
        echo "This may affect frontend asset compilation"
        exit 1  # Change to exit 0 if NPM is truly optional
      }
    }
  continue-on-error: false  # Or true if truly optional
```

6. Commit with message: `fix: Improve NPM error handling in backend workflow`

**Success Criteria**:
- ✅ Clear error messages if NPM fails
- ✅ Appropriate failure behavior (fail vs continue)

---

### 🟢 AGENT 2: Frontend Workflow Specialist

#### Task 2.1: Add Shared-UI Artifact Caching
**Priority**: P0 - Critical  
**Estimated Time**: 45 minutes  
**Dependencies**: None  
**Can Work In Parallel**: ✅ Yes

**Instructions**:
1. Open `.github/workflows/frontend-tests.yml`
2. Find the shared-ui build step (usually first job)
3. Add artifact upload after build:

```yaml
- name: Build shared-ui
  working-directory: ./shared-ui
  run: |
    if [ -f package-lock.json ]; then
      npm ci
    else
      npm install
    fi
    npm run build

- name: Upload shared-ui artifact
  uses: actions/upload-artifact@v4
  with:
    name: shared-ui-build
    path: shared-ui/dist
    retention-days: 1
    if-no-files-found: error
```

4. In each frontend project job, add artifact download BEFORE build:

```yaml
- name: Download shared-ui artifact
  uses: actions/download-artifact@v4
  with:
    name: shared-ui-build
    path: shared-ui/dist

- name: Install dependencies
  working-directory: ./${{ matrix.project }}
  run: npm ci || npm install
```

5. Remove any redundant shared-ui build steps from individual jobs
6. Test locally if possible
7. Commit with message: `fix: Add shared-ui artifact caching to frontend workflow`

**Success Criteria**:
- ✅ Shared-ui built once and uploaded as artifact
- ✅ All frontend jobs download artifact
- ✅ No redundant shared-ui builds
- ✅ Artifact retention set appropriately

---

#### Task 2.2: Fix Type Checking Error Masking
**Priority**: P1 - Important  
**Estimated Time**: 30 minutes  
**Dependencies**: None  
**Can Work In Parallel**: ✅ Yes

**Instructions**:
1. Open `.github/workflows/frontend-tests.yml`
2. Find type checking steps (usually `npm run type-check`)
3. Review if `continue-on-error: true` is appropriate
4. Make type checking blocking OR add clear failure reporting:

```yaml
- name: Type check
  working-directory: ./${{ matrix.project }}
  run: |
    npm run type-check || {
      echo "❌ Type checking failed!"
      echo "Run 'npm run type-check' locally to see errors"
      npx vue-tsc --noEmit || {
        echo "❌ vue-tsc also failed"
        exit 1  # Change to exit 0 if type checking is non-blocking
      }
    }
  # Remove continue-on-error or set to false if blocking
```

5. Apply same fix to `.github/workflows/build.yml`
6. Commit with message: `fix: Improve type checking error reporting in frontend workflows`

**Success Criteria**:
- ✅ Type errors are clearly reported
- ✅ Appropriate blocking behavior
- ✅ Helpful error messages

---

#### Task 2.3: Fix Build Failure Masking
**Priority**: P1 - Important  
**Estimated Time**: 20 minutes  
**Dependencies**: None  
**Can Work In Parallel**: ✅ Yes

**Instructions**:
1. Open `.github/workflows/frontend-tests.yml`
2. Find build steps with `|| echo` fallbacks
3. Remove fallbacks and add proper error handling:

```yaml
- name: Build project
  working-directory: ./${{ matrix.project }}
  run: |
    npm run build || {
      echo "❌ Build failed for ${{ matrix.project }}"
      echo "Check build logs above for errors"
      exit 1
    }
```

4. Apply same fix to `.github/workflows/build.yml`
5. Commit with message: `fix: Remove build failure masking in frontend workflows`

**Success Criteria**:
- ✅ Build failures properly reported
- ✅ No silent failures
- ✅ Clear error messages

---

### 🟡 AGENT 3: Infrastructure Specialist

#### Task 3.1: Update CodeBuild for GitHub Source
**Priority**: P0 - Critical  
**Estimated Time**: 1 hour  
**Dependencies**: None  
**Can Work In Parallel**: ✅ Yes

**Instructions**:
1. Open `infrastructure/pulumi/infrastructure/codebuild.py`
2. Review CodeBuild project configuration
3. Ensure GitHub source is configured:

```python
# In codebuild.py, ensure source is GitHub:
source = aws.codebuild.ProjectSourceArgs(
    type="GITHUB",
    location=f"https://github.com/{github_owner}/{github_repo}.git",
    git_clone_depth=1,
    buildspec=buildspec_path,
    git_submodules_config=aws.codebuild.ProjectSourceGitSubmodulesConfigArgs(
        fetch_submodules=False,
    ),
)

# Add webhook configuration:
webhook = aws.codebuild.ProjectWebhookArgs(
    filter_groups=[
        [
            aws.codebuild.ProjectWebhookFilterGroupArgs(
                filters=[
                    aws.codebuild.ProjectWebhookFilterGroupFilterArgs(
                        type="EVENT",
                        pattern="PUSH",
                    ),
                    aws.codebuild.ProjectWebhookFilterGroupFilterArgs(
                        type="HEAD_REF",
                        pattern="^(main|master|develop)$",
                    ),
                ],
            ),
        ],
    ],
    payload_url=f"https://api.github.com/repos/{github_owner}/{github_repo}/hooks/{webhook_id}/codebuild",
    secret=webhook_secret,
)
```

4. Update `infrastructure/pulumi/Pulumi.production.yaml`:

```yaml
config:
  github:
    enabled: true
    owner: shinejohn
    repo: taskjuggler
    branch: main
    buildspec: taskjuggler-api/buildspec.yml
```

5. Test configuration:
```bash
cd infrastructure/pulumi
pulumi preview
```

6. Commit with message: `fix: Configure CodeBuild to use GitHub source instead of S3`

**Success Criteria**:
- ✅ CodeBuild source type is GITHUB
- ✅ Webhook configured for automatic builds
- ✅ Correct branch filters
- ✅ Pulumi preview shows expected changes

---

#### Task 3.2: Simplify Buildspec for GitHub Source
**Priority**: P0 - Critical  
**Estimated Time**: 30 minutes  
**Dependencies**: Task 3.1 (should verify GitHub source first)  
**Can Work In Parallel**: ⚠️ After Task 3.1

**Instructions**:
1. Open `taskjuggler-api/buildspec.yml`
2. Remove S3 download steps (if present)
3. Simplify for GitHub source:

```yaml
version: 0.2
phases:
  pre_build:
    commands:
      - echo Logging in to Amazon ECR...
      - aws ecr get-login-password --region $AWS_DEFAULT_REGION | docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.$AWS_DEFAULT_REGION.amazonaws.com
      - REPOSITORY_URI=$AWS_ACCOUNT_ID.dkr.ecr.$AWS_DEFAULT_REGION.amazonaws.com/$IMAGE_REPO_NAME
      - COMMIT_HASH=$(echo $CODEBUILD_RESOLVED_SOURCE_VERSION | cut -c 1-7)
      - IMAGE_TAG=${COMMIT_HASH:=latest}
      - echo "Building from commit: $COMMIT_HASH"
      - cd taskjuggler-api
      - pwd
      - ls -la
  build:
    commands:
      - echo "Build started"
      - echo Building the Docker image...
      - docker build -t $IMAGE_REPO_NAME:$IMAGE_TAG .
      - docker tag $IMAGE_REPO_NAME:$IMAGE_TAG $REPOSITORY_URI:$IMAGE_TAG
      - docker tag $IMAGE_REPO_NAME:$IMAGE_TAG $REPOSITORY_URI:latest
  post_build:
    commands:
      - echo "Build completed"
      - echo Pushing the Docker images...
      - docker push $REPOSITORY_URI:$IMAGE_TAG
      - docker push $REPOSITORY_URI:latest
      - echo Image URI: $REPOSITORY_URI:latest
```

4. Remove any S3-related commands
5. Test locally if possible (or wait for CodeBuild test)
6. Commit with message: `fix: Simplify buildspec for GitHub source, remove S3 dependencies`

**Success Criteria**:
- ✅ No S3 download commands
- ✅ Simplified directory navigation
- ✅ Works with GitHub source checkout
- ✅ Proper image tagging

---

#### Task 3.3: Deploy Pulumi Changes
**Priority**: P0 - Critical  
**Estimated Time**: 30 minutes  
**Dependencies**: Tasks 3.1, 3.2  
**Can Work In Parallel**: ❌ Sequential

**Instructions**:
1. Ensure Tasks 3.1 and 3.2 are complete
2. Review Pulumi preview:
```bash
cd infrastructure/pulumi
pulumi preview
```

3. Deploy changes:
```bash
pulumi up --yes
```

4. Verify CodeBuild project:
```bash
aws codebuild batch-get-projects \
  --names taskjuggler-production-build \
  --region us-east-1 \
  --query 'projects[0].source.type'
```
Should return: `GITHUB`

5. Test webhook by pushing a commit
6. Document deployment in commit message

**Success Criteria**:
- ✅ Pulumi deployment successful
- ✅ CodeBuild source is GITHUB
- ✅ Webhook configured
- ✅ Test build triggers on push

---

### 🟣 AGENT 4: Testing & Validation Specialist

#### Task 4.1: Create Local Testing Scripts
**Priority**: P1 - Important  
**Estimated Time**: 1 hour  
**Dependencies**: None  
**Can Work In Parallel**: ✅ Yes

**Instructions**:
1. Create `scripts/test-backend-workflow.sh`:

```bash
#!/bin/bash
set -e

echo "Testing Backend Workflow Steps Locally..."

cd taskjuggler-api

# Start services
docker-compose up -d postgres redis || echo "Services may already be running"

# Wait for services
echo "Waiting for PostgreSQL..."
until pg_isready -h localhost -p 5432 -U postgres; do
  sleep 2
done
echo "PostgreSQL ready"

echo "Waiting for Redis..."
until redis-cli -h localhost -p 6379 ping; do
  sleep 2
done
echo "Redis ready"

# Install dependencies
composer install --prefer-dist --no-interaction
cp .env.example .env || true
php artisan key:generate --force
npm ci || npm install

# Run migrations
php artisan migrate:fresh --force --seed

# Run tests
composer test || php artisan test

# Run Pint
./vendor/bin/pint --test || echo "Pint check complete"

echo "✅ Backend workflow test complete"
```

2. Create `scripts/test-frontend-workflow.sh`:

```bash
#!/bin/bash
set -e

echo "Testing Frontend Workflow Steps Locally..."

# Build shared-ui first
cd shared-ui
npm ci || npm install
npm run build
cd ..

# Test each frontend project
for project in coordinator-web taskjuggler-web scanner-web urpa-web projects-web process-web; do
  echo "Testing $project..."
  cd $project
  npm ci || npm install
  npm run type-check || npx vue-tsc --noEmit || echo "Type check skipped"
  npm run build || {
    echo "❌ Build failed for $project"
    exit 1
  }
  cd ..
done

echo "✅ Frontend workflow test complete"
```

3. Make scripts executable:
```bash
chmod +x scripts/test-*.sh
```

4. Commit with message: `feat: Add local testing scripts for workflow validation`

**Success Criteria**:
- ✅ Scripts test all workflow steps
- ✅ Scripts are executable
- ✅ Scripts provide clear output
- ✅ Scripts can be run independently

---

#### Task 4.2: Create Validation Checklist
**Priority**: P1 - Important  
**Estimated Time**: 30 minutes  
**Dependencies**: None  
**Can Work In Parallel**: ✅ Yes

**Instructions**:
1. Create `WORKFLOW_VALIDATION_CHECKLIST.md`:

```markdown
# Workflow Validation Checklist

## Backend Tests Workflow
- [ ] Services start successfully
- [ ] Health checks wait properly
- [ ] Migrations run without errors
- [ ] Tests execute successfully
- [ ] Errors are properly reported
- [ ] No masked failures

## Frontend Tests Workflow
- [ ] Shared-ui builds once
- [ ] Artifact uploads successfully
- [ ] Frontend jobs download artifact
- [ ] No redundant shared-ui builds
- [ ] Type checking reports errors clearly
- [ ] Builds succeed or fail clearly

## CodeBuild
- [ ] Source is GitHub (not S3)
- [ ] Webhook configured
- [ ] Builds trigger on push
- [ ] Docker images build successfully
- [ ] Images push to ECR
- [ ] Build logs are clear

## End-to-End
- [ ] Push triggers GitHub Actions
- [ ] GitHub Actions pass
- [ ] CodeBuild triggers automatically
- [ ] Docker image builds
- [ ] Image appears in ECR
```

2. Commit with message: `docs: Add workflow validation checklist`

**Success Criteria**:
- ✅ Checklist covers all workflows
- ✅ Clear success criteria
- ✅ Easy to follow

---

#### Task 4.3: Run End-to-End Validation
**Priority**: P0 - Critical  
**Estimated Time**: 1 hour  
**Dependencies**: All other tasks  
**Can Work In Parallel**: ❌ Sequential (after all fixes)

**Instructions**:
1. Wait for all agents to complete their tasks
2. Run local test scripts:
```bash
./scripts/test-backend-workflow.sh
./scripts/test-frontend-workflow.sh
```

3. Push changes to test branch
4. Monitor GitHub Actions:
   - Check backend-tests workflow
   - Check frontend-tests workflow
   - Check build workflow

5. Verify CodeBuild triggers automatically
6. Check ECR for new image
7. Document results

**Success Criteria**:
- ✅ All local tests pass
- ✅ All GitHub Actions workflows pass
- ✅ CodeBuild triggers automatically
- ✅ Docker image in ECR
- ✅ No masked failures

---

### 🔴 AGENT 5: Deployment Orchestrator (Optional)

#### Task 5.1: Enhance Deployment Workflow
**Priority**: P2 - Nice to Have  
**Estimated Time**: 45 minutes  
**Dependencies**: None  
**Can Work In Parallel**: ✅ Yes

**Instructions**:
1. Review `.github/workflows/deploy.yml` (already created)
2. Add deployment notifications (optional)
3. Add rollback capability (optional)
4. Add health check verification
5. Commit improvements

**Success Criteria**:
- ✅ Deployment workflow works
- ✅ Proper error handling
- ✅ Clear status reporting

---

## 🔄 Coordination Points

### Checkpoint 1: After Critical Fixes (Day 1)
**When**: After Tasks 1.1, 1.2, 2.1, 3.1, 3.2 complete  
**Action**: All agents push changes, run local tests  
**Coordination**: Verify no conflicts, merge if ready

### Checkpoint 2: After Infrastructure Deploy (Day 1-2)
**When**: After Task 3.3 completes  
**Action**: Agent 4 validates CodeBuild configuration  
**Coordination**: Verify CodeBuild source is GitHub

### Checkpoint 3: Final Validation (Day 2)
**When**: After all tasks complete  
**Action**: Agent 4 runs end-to-end validation  
**Coordination**: All agents review results, fix any issues

---

## 📊 Progress Tracking

### Agent 1: Backend Workflow
- [ ] Task 1.1: Service Health Checks
- [ ] Task 1.2: Migration Error Handling
- [ ] Task 1.3: NPM Error Handling

### Agent 2: Frontend Workflow
- [ ] Task 2.1: Shared-UI Artifact Caching
- [ ] Task 2.2: Type Checking Fixes
- [ ] Task 2.3: Build Failure Fixes

### Agent 3: Infrastructure
- [ ] Task 3.1: CodeBuild GitHub Source
- [ ] Task 3.2: Buildspec Simplification
- [ ] Task 3.3: Pulumi Deployment

### Agent 4: Testing & Validation
- [ ] Task 4.1: Local Testing Scripts
- [ ] Task 4.2: Validation Checklist
- [ ] Task 4.3: End-to-End Validation

### Agent 5: Deployment (Optional)
- [ ] Task 5.1: Enhance Deployment Workflow

---

## 🚀 Execution Order

### Phase 1: Parallel Critical Fixes (Can all run simultaneously)
1. **Agent 1**: Tasks 1.1, 1.3 (Task 1.2 after 1.1)
2. **Agent 2**: Tasks 2.1, 2.2, 2.3
3. **Agent 3**: Task 3.1
4. **Agent 4**: Tasks 4.1, 4.2

### Phase 2: Sequential Infrastructure (After Phase 1)
1. **Agent 3**: Task 3.2 (after 3.1)
2. **Agent 3**: Task 3.3 (after 3.2)

### Phase 3: Validation (After Phase 2)
1. **Agent 4**: Task 4.3 (after all fixes)
2. **Agent 5**: Task 5.1 (optional, can run anytime)

---

## 📝 Communication Protocol

### For Each Agent:
1. **Before Starting**: Comment on this document which tasks you're taking
2. **During Work**: Update progress checkboxes
3. **After Completion**: 
   - Commit with clear message
   - Push to branch
   - Comment "✅ Task X.X Complete"
   - Tag other agents if dependencies

### Conflict Resolution:
- If multiple agents edit same file: Coordinate via comments
- If blocking issue found: Tag Agent 4 for validation
- If infrastructure change needed: Tag Agent 3

---

## ✅ Success Criteria

### Must Have (P0):
- ✅ All workflows run successfully
- ✅ No masked failures
- ✅ CodeBuild uses GitHub source
- ✅ Services start reliably
- ✅ Tests execute correctly

### Should Have (P1):
- ✅ Shared-ui artifact caching
- ✅ Clear error messages
- ✅ Local testing scripts
- ✅ Validation checklist

### Nice to Have (P2):
- ✅ Deployment notifications
- ✅ Test coverage reporting
- ✅ Security scanning

---

## 🆘 Troubleshooting

### If Agent Conflicts:
1. Check git status
2. Pull latest changes
3. Resolve conflicts
4. Test locally
5. Push resolution

### If Task Blocks:
1. Document the blocker
2. Tag relevant agent
3. Move to next parallel task if possible
4. Coordinate resolution

### If Validation Fails:
1. Agent 4 documents failure
2. Tag responsible agent
3. Fix and re-test
4. Update checklist

---

**Status**: 🟢 Ready for Multi-Agent Execution  
**Last Updated**: January 2025  
**Next Review**: After Phase 1 completion

