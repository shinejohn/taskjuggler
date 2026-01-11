# Agent Quick Start Guide

**For**: Agents working on GitHub Workflows & Deployment fixes  
**Full Plan**: See `MULTI_AGENT_EXECUTION_PLAN.md`

---

## 🚀 Quick Start

### Step 1: Claim Your Tasks
Comment in `MULTI_AGENT_EXECUTION_PLAN.md` which agent role you're taking:
- 🔵 **Agent 1**: Backend Workflow Specialist
- 🟢 **Agent 2**: Frontend Workflow Specialist  
- 🟡 **Agent 3**: Infrastructure Specialist
- 🟣 **Agent 4**: Testing & Validation Specialist
- 🔴 **Agent 5**: Deployment Orchestrator (Optional)

### Step 2: Check Dependencies
Review the execution plan to see:
- ✅ Which tasks can run in parallel
- ⚠️ Which tasks have dependencies
- ❌ Which tasks must be sequential

### Step 3: Execute Your Tasks
Follow the detailed instructions in `MULTI_AGENT_EXECUTION_PLAN.md`

### Step 4: Update Progress
- Check off completed tasks in the plan
- Commit with clear messages
- Comment "✅ Task X.X Complete"

---

## 📋 Task Summary by Agent

### 🔵 Agent 1: Backend Workflow (3 tasks, ~1.5 hours)
1. Add service health checks (30 min) - **Can start now**
2. Fix migration error masking (20 min) - **After task 1**
3. Fix NPM error handling (15 min) - **Can start now**

**Files**: `.github/workflows/backend-tests.yml`, `.github/workflows/ci.yml`

---

### 🟢 Agent 2: Frontend Workflow (3 tasks, ~1.5 hours)
1. Add shared-ui artifact caching (45 min) - **Can start now**
2. Fix type checking masking (30 min) - **Can start now**
3. Fix build failure masking (20 min) - **Can start now**

**Files**: `.github/workflows/frontend-tests.yml`, `.github/workflows/build.yml`

---

### 🟡 Agent 3: Infrastructure (3 tasks, ~2 hours)
1. Update CodeBuild for GitHub (1 hour) - **Can start now**
2. Simplify buildspec (30 min) - **After task 1**
3. Deploy Pulumi changes (30 min) - **After task 2**

**Files**: `infrastructure/pulumi/**`, `taskjuggler-api/buildspec.yml`

---

### 🟣 Agent 4: Testing & Validation (3 tasks, ~2.5 hours)
1. Create local test scripts (1 hour) - **Can start now**
2. Create validation checklist (30 min) - **Can start now**
3. Run end-to-end validation (1 hour) - **After all other tasks**

**Files**: `scripts/**`, `WORKFLOW_VALIDATION_CHECKLIST.md`

---

### 🔴 Agent 5: Deployment (Optional, 1 task, ~45 min)
1. Enhance deployment workflow (45 min) - **Can start now**

**Files**: `.github/workflows/deploy.yml`

---

## ⚡ Parallel Execution Matrix

| Task | Agent 1 | Agent 2 | Agent 3 | Agent 4 | Agent 5 |
|------|---------|---------|---------|---------|---------|
| **Phase 1** (Can all run now) | 1.1, 1.3 | 2.1, 2.2, 2.3 | 3.1 | 4.1, 4.2 | 5.1 |
| **Phase 2** (After Phase 1) | 1.2 | - | 3.2, 3.3 | - | - |
| **Phase 3** (After Phase 2) | - | - | - | 4.3 | - |

---

## 🎯 Critical Path

```
Agent 1.1 (Service Health) ──┐
                              ├──> Agent 1.2 (Migrations)
Agent 1.3 (NPM) ─────────────┘

Agent 2.1 (Shared-UI) ──┐
Agent 2.2 (Type Check) ─┼──> All can run in parallel
Agent 2.3 (Build) ──────┘

Agent 3.1 (CodeBuild) ──> Agent 3.2 (Buildspec) ──> Agent 3.3 (Deploy)

Agent 4.1 (Scripts) ──┐
Agent 4.2 (Checklist) ┼──> Agent 4.3 (E2E Validation)
                      ┘
```

---

## 📝 Commit Message Template

```
fix: [Agent X] [Task Description]

- What was changed
- Why it was changed
- Testing done

Related: MULTI_AGENT_EXECUTION_PLAN.md
```

**Example**:
```
fix: [Agent 1] Add explicit service health checks to backend tests

- Added PostgreSQL and Redis wait steps
- Ensures services are ready before migrations
- Tested locally with docker-compose

Related: MULTI_AGENT_EXECUTION_PLAN.md Task 1.1
```

---

## 🔍 Quick Reference

### Check Current Workflow Status
```bash
gh workflow list
gh run list --limit 5
```

### Test Backend Locally
```bash
cd taskjuggler-api
docker-compose up -d postgres redis
# Wait for services...
composer install
php artisan migrate:fresh --force
php artisan test
```

### Test Frontend Locally
```bash
cd shared-ui && npm run build && cd ..
cd coordinator-web && npm run build
```

### Check CodeBuild Status
```bash
aws codebuild list-builds-for-project \
  --project-name taskjuggler-production-build \
  --region us-east-1
```

---

## 🆘 Need Help?

1. **Blocked by dependency?** Check the execution plan for parallel tasks
2. **Found an issue?** Document it and tag Agent 4 for validation
3. **Need coordination?** Comment in the execution plan document
4. **Unclear instructions?** Review the full plan in `MULTI_AGENT_EXECUTION_PLAN.md`

---

**Ready to start?** Pick your agent role and begin! 🚀

