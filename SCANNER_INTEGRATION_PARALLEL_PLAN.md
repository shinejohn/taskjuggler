# Scanner Platform Integration - Parallel Work Plan
## Multi-Agent Execution Strategy

**Goal:** Complete scanner-web integration with TaskJuggler platform using parallel agents  
**Reference:** `SCANNER_PLATFORM_INTEGRATION_OVERHAUL.md`  
**Timeline:** Optimized for parallel execution

---

## AGENT ASSIGNMENTS & DEPENDENCIES

### 🔴 CRITICAL PATH (Must Complete First - Sequential)

#### **Agent 1: Foundation Layer** ⚡ PRIORITY 1
**Scope:** Core infrastructure that all other agents depend on  
**Estimated Time:** 2-3 hours  
**Blocks:** All other agents

**Tasks:**
1. ✅ Update Type Definitions (`src/types/index.ts`)
   - Add Team, Subscription, User types with platform structure
   - Add team_id to Site, Scan, Issue interfaces
   - Add task_id to Issue interface
   - Add subscription limits types

2. ✅ Rewrite Auth Store (`src/stores/auth.ts`)
   - Implement platform auth pattern
   - Add team context (currentTeam)
   - Add permission checking (hasPermission, hasTeamRole)
   - Add team switching (setCurrentTeam)
   - Update User type to include teams, permissions, subscription

3. ✅ Update API Client (`src/utils/api.ts`)
   - Add `withCredentials: true` for Laravel Sanctum
   - Add X-Team-ID header injection
   - Update base URL to platform API
   - Update error handling for 401/403

4. ✅ Update Router (`src/router/index.ts`)
   - Add permission-based route guards
   - Add team context checks
   - Update route meta with permissions
   - Redirect login to platform login

**Deliverables:**
- `src/types/index.ts` - Complete type definitions
- `src/stores/auth.ts` - Platform-compatible auth store
- `src/utils/api.ts` - Team-aware API client
- `src/router/index.ts` - Permission-aware router

**Dependencies:** None  
**Blocks:** Agents 2, 3, 4, 5, 6

---

### 🟢 PARALLEL WORK STREAMS (Can Execute Simultaneously)

#### **Agent 2: Team & Subscription Integration** ⚡ PRIORITY 2
**Scope:** Team context and subscription limits  
**Estimated Time:** 2-3 hours  
**Blocks:** Agent 7 (UI components)

**Tasks:**
1. ✅ Create Subscription Store (`src/stores/subscription.ts`)
   - Plan detection (free/pro/business/enterprise)
   - Limits computation
   - Feature flags (canUseFeature)
   - Upgrade messages

2. ✅ Create Usage Store (`src/stores/usage.ts`)
   - Track scans_this_month, ai_fixes_this_month
   - Compute remaining quotas
   - Check if actions allowed (canScan, canGenerateFix)

3. ✅ Update Sites Store (`src/stores/sites.ts`)
   - Add team context filtering
   - Add subscription limit checks (canAddSite)
   - Add team_id to createSite
   - Filter sites by current team

4. ✅ Create Team Switcher Component (`src/components/layout/TeamSwitcher.vue`)
   - Dropdown with team list
   - Active team indicator
   - Team switching handler
   - Refresh data on team switch

**Deliverables:**
- `src/stores/subscription.ts` - New file
- `src/stores/usage.ts` - New file
- `src/stores/sites.ts` - Updated with team context
- `src/components/layout/TeamSwitcher.vue` - New file

**Dependencies:** Agent 1 (auth store, types)  
**Blocks:** Agent 7 (needs subscription store for UI)

---

#### **Agent 3: Task & Notification Integration** ⚡ PRIORITY 2
**Scope:** Task creation from issues and notifications  
**Estimated Time:** 2-3 hours  
**Blocks:** Agent 7 (UI components)

**Tasks:**
1. ✅ Create Tasks Store (`src/stores/tasks.ts`)
   - createTaskFromIssue function
   - createTasksFromIssues (bulk)
   - buildTaskDescription helper
   - mapSeverityToPriority helper

2. ✅ Create Notifications Store (`src/stores/notifications.ts`)
   - notifyScanComplete function
   - notifyCriticalIssues function
   - notifyTeam function

3. ✅ Update Issues Store (`src/stores/issues.ts`)
   - Add task creation methods
   - Link issues to tasks
   - Update issue status when task created

4. ✅ Create CreateTaskModal Component (`src/components/scanner/CreateTaskModal.vue`)
   - Form for task creation from issue
   - Project/assignee selection
   - Priority selection
   - Due date picker

**Deliverables:**
- `src/stores/tasks.ts` - New file
- `src/stores/notifications.ts` - New file
- `src/stores/issues.ts` - Updated with task integration
- `src/components/scanner/CreateTaskModal.vue` - New file

**Dependencies:** Agent 1 (auth store, types, API client)  
**Blocks:** Agent 7 (needs task modal for IssueCard)

---

#### **Agent 4: Activity Logging & Scans** ⚡ PRIORITY 2
**Scope:** Activity tracking and scan updates  
**Estimated Time:** 1-2 hours  
**Blocks:** None

**Tasks:**
1. ✅ Create Activity Logger (`src/utils/activity.ts`)
   - log function
   - Convenience methods (siteCreated, scanStarted, etc.)
   - Error handling (don't break app if logging fails)

2. ✅ Update Scans Store (`src/stores/scans.ts`)
   - Add activity logging to scan lifecycle
   - Add team context
   - Add notification on scan complete
   - Update scan types with team_id

3. ✅ Update Dashboard Store (`src/stores/dashboard.ts`)
   - Add team context filtering
   - Update stats to be team-scoped
   - Add usage stats integration

**Deliverables:**
- `src/utils/activity.ts` - New file
- `src/stores/scans.ts` - Updated with activity logging
- `src/stores/dashboard.ts` - Updated with team context

**Dependencies:** Agent 1 (auth store, types, API client)  
**Blocks:** None

---

#### **Agent 5: Navigation & Layout** ⚡ PRIORITY 3
**Scope:** Cross-app navigation and platform UI  
**Estimated Time:** 2-3 hours  
**Blocks:** None

**Tasks:**
1. ✅ Create App Switcher Component (`src/components/layout/AppSwitcher.vue`)
   - Dropdown with platform apps
   - Current app indicator
   - Navigation to other apps

2. ✅ Create NotificationBell Component (`src/components/layout/NotificationBell.vue`)
   - Bell icon with badge
   - Dropdown with notifications
   - Mark as read functionality

3. ✅ Create UserMenu Component (`src/components/layout/UserMenu.vue`)
   - Avatar dropdown
   - User info display
   - Settings link
   - Logout button

4. ✅ Update AppLayout (`src/layouts/AppLayout.vue`)
   - Add platform header
   - Integrate AppSwitcher
   - Integrate TeamSwitcher
   - Integrate NotificationBell
   - Integrate UserMenu
   - Update navigation structure

5. ✅ Create UpgradePrompt Component (`src/components/common/UpgradePrompt.vue`)
   - Upgrade messaging
   - Feature explanation
   - Upgrade button (links to billing)

**Deliverables:**
- `src/components/layout/AppSwitcher.vue` - New file
- `src/components/layout/NotificationBell.vue` - New file
- `src/components/layout/UserMenu.vue` - New file
- `src/layouts/AppLayout.vue` - Updated with platform nav
- `src/components/common/UpgradePrompt.vue` - New file

**Dependencies:** Agent 1 (auth store), Agent 2 (subscription store)  
**Blocks:** None

---

#### **Agent 6: UI Component Updates** ⚡ PRIORITY 3
**Scope:** Update existing components with platform features  
**Estimated Time:** 2-3 hours  
**Blocks:** None

**Tasks:**
1. ✅ Update IssueCard (`src/components/scanner/IssueCard.vue`)
   - Add "Create Task" button
   - Integrate CreateTaskModal
   - Add subscription check for AI fix generation
   - Show upgrade prompt when needed

2. ✅ Update SiteCard (`src/components/scanner/SiteCard.vue`)
   - Add team context display
   - Add subscription limit indicators
   - Update with new Site type

3. ✅ Update AddSiteModal (`src/components/scanner/AddSiteModal.vue`)
   - Add subscription limit check
   - Show upgrade prompt if at limit
   - Add team context (auto-filled)

4. ✅ Update DashboardPage (`src/pages/DashboardPage.vue`)
   - Add team switcher
   - Add usage stats display
   - Add subscription tier display
   - Update with team-scoped data

5. ✅ Update SitesPage (`src/pages/SitesPage.vue`)
   - Add team context
   - Add subscription limit warnings
   - Update with new stores

**Deliverables:**
- `src/components/scanner/IssueCard.vue` - Updated
- `src/components/scanner/SiteCard.vue` - Updated
- `src/components/scanner/AddSiteModal.vue` - Updated
- `src/pages/DashboardPage.vue` - Updated
- `src/pages/SitesPage.vue` - Updated

**Dependencies:** Agent 1 (types, auth), Agent 2 (subscription), Agent 3 (tasks), Agent 5 (layout)  
**Blocks:** None

---

#### **Agent 7: Backend API Integration** ⚡ PRIORITY 2 (Parallel)
**Scope:** Laravel backend routes and middleware  
**Estimated Time:** 3-4 hours  
**Blocks:** None (can be done in parallel)

**Tasks:**
1. ✅ Create TeamContext Middleware (`taskjuggler-api/app/Http/Middleware/TeamContext.php`)
   - Extract X-Team-ID header
   - Verify team access
   - Set team context for request

2. ✅ Create CheckScannerLimits Middleware (`taskjuggler-api/app/Http/Middleware/CheckScannerLimits.php`)
   - Check site limits
   - Check scan limits
   - Return upgrade URLs

3. ✅ Create Scanner Controllers
   - `ScannerDashboardController.php`
   - `ScannerSiteController.php`
   - `ScannerScanController.php`
   - `ScannerIssueController.php`
   - `ScannerUsageController.php`
   - `ScannerMcpController.php`

4. ✅ Create Scanner Models
   - `Scanner/Site.php` (with team relationship)
   - `Scanner/Scan.php` (with team relationship)
   - `Scanner/Issue.php` (with team relationship)

5. ✅ Create Database Migrations
   - Add team_id to scanner_sites
   - Add team_id to scanner_scans
   - Add team_id to scanner_issues
   - Add task_id to scanner_issues

6. ✅ Create API Routes (`taskjuggler-api/routes/api.php`)
   - Scanner module routes with team middleware
   - Subscription limit middleware
   - All CRUD operations

**Deliverables:**
- `taskjuggler-api/app/Http/Middleware/TeamContext.php` - New file
- `taskjuggler-api/app/Http/Middleware/CheckScannerLimits.php` - New file
- `taskjuggler-api/app/Http/Controllers/Scanner/*.php` - New files
- `taskjuggler-api/app/Models/Scanner/*.php` - New files
- `taskjuggler-api/database/migrations/*_update_scanner_tables.php` - New files
- `taskjuggler-api/routes/api.php` - Updated with scanner routes

**Dependencies:** None (backend work)  
**Blocks:** None

---

## EXECUTION ORDER

### Phase 1: Foundation (Sequential)
```
Agent 1 → [COMPLETE FIRST]
```

### Phase 2: Parallel Development (Simultaneous)
```
Agent 1 ──┐
          ├──→ Agent 2 (Team & Subscription)
          ├──→ Agent 3 (Tasks & Notifications)
          ├──→ Agent 4 (Activity & Scans)
          └──→ Agent 7 (Backend API) [Independent]
```

### Phase 3: UI Integration (After Phase 2)
```
Agent 2 ──┐
Agent 3 ──┼──→ Agent 5 (Navigation & Layout)
Agent 4 ──┘
```

### Phase 4: Component Updates (After Phase 3)
```
Agent 5 ──┐
Agent 2 ──┼──→ Agent 6 (UI Component Updates)
Agent 3 ──┘
```

---

## FILE CONFLICT RESOLUTION

### Low Conflict Risk (Safe for Parallel)
- New files (stores, components, utils)
- Backend files (separate directory)
- Type definitions (additive changes)

### Medium Conflict Risk (Coordinate)
- `src/stores/sites.ts` - Agent 2 updates
- `src/stores/issues.ts` - Agent 3 updates
- `src/stores/scans.ts` - Agent 4 updates
- `src/layouts/AppLayout.vue` - Agent 5 updates

### High Conflict Risk (Sequential)
- `src/stores/auth.ts` - Agent 1 only
- `src/utils/api.ts` - Agent 1 only
- `src/router/index.ts` - Agent 1 only
- `src/types/index.ts` - Agent 1 only

---

## AGENT INSTRUCTIONS TEMPLATE

Each agent should:

1. **Read Dependencies First**
   - Review Agent 1 deliverables before starting
   - Understand type definitions
   - Understand auth store API

2. **Create Feature Branch**
   ```bash
   git checkout -b agent-X-scanner-integration-[feature-name]
   ```

3. **Follow Code Patterns**
   - Use existing code style
   - Follow Vue 3 Composition API patterns
   - Use TypeScript strictly
   - Reference `PLATFORM_INTEGRATION_GUIDE.md`

4. **Test Incrementally**
   - Test each function/component as you create it
   - Verify API calls work
   - Check TypeScript compilation

5. **Document Changes**
   - Add comments for complex logic
   - Update type definitions if needed
   - Note any breaking changes

6. **Commit Frequently**
   ```bash
   git add .
   git commit -m "Agent X: [feature] - [description]"
   ```

---

## MERGE STRATEGY

### Step 1: Merge Agent 1 (Foundation)
```bash
git checkout main
git merge agent-1-foundation-layer
# Verify build passes
```

### Step 2: Merge Parallel Agents (In Order)
```bash
git merge agent-2-team-subscription
git merge agent-3-tasks-notifications
git merge agent-4-activity-scans
git merge agent-7-backend-api
```

### Step 3: Merge UI Agents
```bash
git merge agent-5-navigation-layout
git merge agent-6-ui-component-updates
```

### Step 4: Resolve Conflicts
- Most conflicts will be in shared files (sites.ts, issues.ts)
- Resolve by combining functionality
- Test after each merge

---

## TESTING CHECKLIST (After All Merges)

### Authentication
- [ ] Login redirects to platform login
- [ ] Token stored and sent with requests
- [ ] X-Team-ID header sent with all requests
- [ ] 401 redirects to login
- [ ] 403 shows upgrade prompt

### Team Context
- [ ] Sites filtered by current team
- [ ] Team switcher updates site list
- [ ] New sites associated with current team

### Subscription Limits
- [ ] Site creation blocked at limit
- [ ] Scan creation blocked at monthly limit
- [ ] AI fix generation respects limits
- [ ] Upgrade prompts shown appropriately

### Task Integration
- [ ] Can create task from issue
- [ ] Task contains issue details
- [ ] Task links back to issue
- [ ] Bulk task creation works

### Notifications
- [ ] Scan complete notification sent
- [ ] Critical issues notification sent
- [ ] Notifications appear in bell

### Activity Logging
- [ ] Site creation logged
- [ ] Scan start/complete logged
- [ ] Issue status changes logged

### Navigation
- [ ] App switcher shows all apps
- [ ] Team switcher works
- [ ] Can navigate to/from other apps

---

## ESTIMATED TIMELINE

**Sequential Approach:** ~15-20 hours  
**Parallel Approach:** ~6-8 hours (with 4-5 agents)

**Breakdown:**
- Agent 1: 2-3 hours (blocks others)
- Agents 2-4, 7: 2-4 hours each (parallel)
- Agent 5: 2-3 hours (after 2-4)
- Agent 6: 2-3 hours (after 5)
- Testing & Merge: 1-2 hours

**Total:** ~6-8 hours with proper parallelization

---

## SUCCESS CRITERIA

✅ All 10 phases from overhaul document completed  
✅ No TypeScript errors  
✅ All components render correctly  
✅ API integration works end-to-end  
✅ Team context works across all features  
✅ Subscription limits enforced  
✅ Task creation from issues works  
✅ Notifications sent appropriately  
✅ Activity logging functional  
✅ Cross-app navigation works  

---

## NOTES FOR AGENTS

1. **Always check Agent 1 deliverables first** - Types and auth are foundation
2. **Use existing patterns** - Look at taskjuggler-web for reference
3. **Test as you go** - Don't wait until the end
4. **Communicate conflicts** - If you need to modify a file another agent is working on
5. **Follow the spec** - Reference SCANNER_PLATFORM_INTEGRATION_OVERHAUL.md for details
6. **Ask questions** - If something is unclear, clarify before implementing

---

**END OF PLAN**

