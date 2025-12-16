# Unified Architecture Implementation Plan

## Target Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTENDS                                 │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  taskjuggler-web  ──────┐                                  │
│  (Vue 3)                 │                                  │
│                          │                                  │
│  process-web      ──────┤                                  │
│  (Vue 3)                 │                                  │
│                          │                                  │
│  projects-web     ──────┤                                  │
│  (Vue 3)                 │                                  │
│                          │                                  │
└──────────────────────────┼─────────────────────────────────┘
                           │
                           │ All connect to:
                           ▼
┌─────────────────────────────────────────────────────────────┐
│           FIBONACCO AI PLATFORM (Unified Backend)          │
│                    Laravel 12 API                           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Features:                                                  │
│  ✅ Projects (from Fibonacco AI Platform)                  │
│  ✅ Tasks - Unified (merged from both)                     │
│  ✅ Processes (NEW - to be added)                          │
│  ✅ Inbox/Routing (from taskjuggler-api)                   │
│  ✅ Teams (from taskjuggler-api)                           │
│  ✅ Marketplace (from taskjuggler-api)                     │
│  ✅ Q&A (from Fibonacco AI Platform)                       │
│  ✅ Problems (from Fibonacco AI Platform)                   │
│  ✅ Appointments (from taskjuggler-api)                    │
│  ✅ Direct Messages (from taskjuggler-api)                  │
│                                                             │
│  Single Database:                                           │
│  - Unified authentication                                   │
│  - Shared data across all apps                              │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Implementation Phases

### PHASE 1: Add Process-AI to Fibonacco AI Platform
**Goal:** Add Process management functionality to the unified backend

**Tasks:**
1. Create Process database migrations
   - `create_processes_table.php`
   - `create_process_steps_table.php`
   - `create_process_executions_table.php`

2. Create Process models
   - `Process.php`
   - `ProcessStep.php`
   - `ProcessExecution.php`

3. Create Process controllers
   - `ProcessController.php` - CRUD operations
   - `ProcessStepController.php` - Step management
   - `ProcessExecutionController.php` - Execution tracking

4. Create Process services
   - `ProcessExecutionService.php` - Execute processes
   - `ProcessTriggerService.php` - Handle triggers

5. Add API routes
   ```php
   Route::apiResource('processes', ProcessController::class);
   Route::prefix('processes/{process}')->group(function () {
       Route::apiResource('steps', ProcessStepController::class);
       Route::post('/publish', [ProcessController::class, 'publish']);
       Route::post('/execute', [ProcessController::class, 'execute']);
       Route::get('/executions', [ProcessExecutionController::class, 'index']);
   });
   Route::get('/processes/executions', [ProcessExecutionController::class, 'all']);
   ```

6. Test with `process-web` frontend

**Estimated Time:** 1-2 weeks

---

### PHASE 2: Merge taskjuggler-api Features into Fibonacco AI Platform
**Goal:** Consolidate all features into single unified backend

**Tasks:**

#### 2.1: Merge Task Management
- **Current State:**
  - `Fibonacco AI Platform` has project-based tasks
  - `taskjuggler-api` has standalone tasks
- **Action:**
  - Keep project-based tasks as primary
  - Add support for standalone tasks (without project)
  - Merge task_actions and task_messages schemas
  - Unify Task model and controller

#### 2.2: Add Inbox/Routing Features
- Migrate `InboxItem` model and migration
- Migrate `RoutingRule` model and migration
- Migrate `InboxController` and routes
- Migrate `RoutingRuleController` and routes
- Migrate inbox processing services

#### 2.3: Add Team Features
- Migrate `Team`, `TeamMember`, `TeamInvitation` models
- Migrate team migrations
- Migrate `TeamController` and routes
- Merge with existing `ProjectMember` if needed

#### 2.4: Add Marketplace Features
- Migrate `MarketplaceListing`, `MarketplaceVendor`, `MarketplaceBid` models
- Migrate marketplace migrations
- Migrate marketplace controllers and routes

#### 2.5: Add Appointment Features
- Migrate `Appointment`, `AppointmentType`, `AvailabilitySlot` models
- Migrate appointment migrations
- Migrate appointment controllers and routes

#### 2.6: Add Direct Messages
- Migrate `DirectMessage` model and migration
- Migrate `DirectMessageController` and routes

#### 2.7: Add AI Tools
- Migrate `AiToolConfig`, `AiToolExecution` models
- Migrate AI tool migrations
- Migrate AI tool services

#### 2.8: Add Contact Lists
- Migrate `ContactList`, `ContactListMember` models
- Migrate contact list migrations
- Migrate `ContactListController` and routes

#### 2.9: Add Channels
- Migrate `AssistantChannel` model and migration
- Migrate `ChannelController` and routes

#### 2.10: Add Notifications & Transactions
- Migrate `Notification` model and migration
- Migrate `Transaction` model and migration

#### 2.11: Merge Authentication
- Ensure both use Laravel Sanctum (already do)
- Unify User model (merge differences)
- Ensure shared authentication works

#### 2.12: Update API Routes
- Consolidate all routes into single `routes/api.php`
- Organize by feature groups
- Ensure no conflicts

**Estimated Time:** 2-3 weeks

---

### PHASE 3: Update Frontends to Use Unified Backend
**Goal:** Point all frontends to the unified backend

**Tasks:**

#### 3.1: Update taskjuggler-web
- Update `.env` files to point to unified backend
- Verify API endpoints match
- Test all features
- Update API client if needed

#### 3.2: Update process-web
- Update `.env` files to point to unified backend
- Verify Process API endpoints
- Test process management features

#### 3.3: Update projects-web
- Update `.env` files to point to unified backend
- Verify API endpoints match
- Test all features

**Estimated Time:** 1 week

---

### PHASE 4: Database Migration & Consolidation
**Goal:** Merge databases and ensure data integrity

**Tasks:**
1. Create migration scripts to merge data
2. Map old schemas to new unified schema
3. Migrate data from taskjuggler-api database
4. Verify data integrity
5. Update all foreign key relationships

**Estimated Time:** 1 week

---

### PHASE 5: Testing & Cleanup
**Goal:** Ensure everything works together

**Tasks:**
1. Integration testing
2. End-to-end testing for each frontend
3. Performance testing
4. Security audit
5. Documentation update
6. Remove old taskjuggler-api code (archive, don't delete)

**Estimated Time:** 1 week

---

## Detailed Task Breakdown

### Phase 1: Process-AI Implementation

#### Step 1.1: Database Migrations

**File:** `database/migrations/2025_12_XX_create_processes_table.php`
```php
Schema::create('processes', function (Blueprint $table) {
    $table->uuid('id')->primary();
    $table->uuid('organization_id');
    $table->string('name');
    $table->string('slug')->unique();
    $table->text('description')->nullable();
    $table->enum('status', ['draft', 'active', 'archived'])->default('draft');
    $table->string('trigger_type'); // manual, task_created, task_updated, schedule
    $table->json('trigger_config')->nullable();
    $table->timestamps();
    
    $table->foreign('organization_id')->references('id')->on('organizations');
    $table->index(['organization_id', 'status']);
});
```

**File:** `database/migrations/2025_12_XX_create_process_steps_table.php`
```php
Schema::create('process_steps', function (Blueprint $table) {
    $table->uuid('id')->primary();
    $table->uuid('process_id');
    $table->string('name');
    $table->integer('order');
    $table->string('step_type'); // action, condition, delay, etc.
    $table->json('config')->nullable();
    $table->timestamps();
    
    $table->foreign('process_id')->references('id')->on('processes')->onDelete('cascade');
    $table->index(['process_id', 'order']);
});
```

**File:** `database/migrations/2025_12_XX_create_process_executions_table.php`
```php
Schema::create('process_executions', function (Blueprint $table) {
    $table->uuid('id')->primary();
    $table->uuid('process_id');
    $table->uuid('task_id')->nullable();
    $table->enum('status', ['pending', 'running', 'completed', 'failed'])->default('pending');
    $table->timestamp('started_at')->nullable();
    $table->timestamp('completed_at')->nullable();
    $table->text('error_message')->nullable();
    $table->json('execution_data')->nullable();
    $table->timestamps();
    
    $table->foreign('process_id')->references('id')->on('processes');
    $table->foreign('task_id')->references('id')->on('tasks')->nullable();
    $table->index(['process_id', 'status']);
    $table->index('task_id');
});
```

#### Step 1.2: Models

**File:** `app/Models/Process.php`
- Relationships: organization, steps, executions
- Scopes: active, draft, archived
- Methods: publish(), canExecute()

**File:** `app/Models/ProcessStep.php`
- Relationships: process
- Methods: execute()

**File:** `app/Models/ProcessExecution.php`
- Relationships: process, task
- Methods: start(), complete(), fail()

#### Step 1.3: Controllers

**File:** `app/Http/Controllers/Api/ProcessController.php`
- index() - List processes
- store() - Create process
- show() - Get process
- update() - Update process
- destroy() - Delete process
- publish() - Publish process (draft → active)

**File:** `app/Http/Controllers/Api/ProcessStepController.php`
- index() - List steps for process
- store() - Create step
- update() - Update step
- destroy() - Delete step
- reorder() - Reorder steps

**File:** `app/Http/Controllers/Api/ProcessExecutionController.php`
- index() - List executions (for process or all)
- show() - Get execution details
- execute() - Trigger process execution

#### Step 1.4: Services

**File:** `app/Services/Process/ProcessExecutionService.php`
- execute(Process $process, array $context) - Execute a process
- executeStep(ProcessStep $step, array $context) - Execute a single step
- handleTrigger(string $triggerType, array $data) - Handle process triggers

**File:** `app/Services/Process/ProcessTriggerService.php`
- registerTrigger(string $type, callable $handler) - Register trigger handler
- handleTaskCreated(Task $task) - Handle task_created trigger
- handleTaskUpdated(Task $task) - Handle task_updated trigger
- handleSchedule() - Handle scheduled triggers

---

### Phase 2: Feature Migration Checklist

#### From taskjuggler-api → Fibonacco AI Platform

- [ ] **Inbox**
  - [ ] InboxItem model
  - [ ] InboxItem migration
  - [ ] InboxController
  - [ ] Inbox processing services
  - [ ] Routes: `/api/inbox/*`

- [ ] **Routing Rules**
  - [ ] RoutingRule model
  - [ ] RoutingRule migration
  - [ ] RoutingRuleController
  - [ ] Route evaluation service
  - [ ] Routes: `/api/routing-rules/*`

- [ ] **Teams** (merge with ProjectMember?)
  - [ ] Team, TeamMember, TeamInvitation models
  - [ ] Team migrations
  - [ ] TeamController
  - [ ] Routes: `/api/teams/*`

- [ ] **Marketplace**
  - [ ] MarketplaceListing, MarketplaceVendor, MarketplaceBid models
  - [ ] Marketplace migrations
  - [ ] Marketplace controllers
  - [ ] Routes: `/api/marketplace/*`

- [ ] **Appointments**
  - [ ] Appointment, AppointmentType, AvailabilitySlot models
  - [ ] Appointment migrations
  - [ ] Appointment controllers
  - [ ] Routes: `/api/appointments/*`

- [ ] **Direct Messages**
  - [ ] DirectMessage model
  - [ ] DirectMessage migration
  - [ ] DirectMessageController
  - [ ] Routes: `/api/messages/*`

- [ ] **Contact Lists**
  - [ ] ContactList, ContactListMember models
  - [ ] Contact list migrations
  - [ ] ContactListController
  - [ ] Routes: `/api/contact-lists/*`

- [ ] **Channels**
  - [ ] AssistantChannel model
  - [ ] Channel migration
  - [ ] ChannelController
  - [ ] Routes: `/api/channels/*`

- [ ] **AI Tools**
  - [ ] AiToolConfig, AiToolExecution models
  - [ ] AI tool migrations
  - [ ] AI tool services
  - [ ] Routes: `/api/ai-tools/*` (if needed)

- [ ] **Notifications**
  - [ ] Notification model
  - [ ] Notification migration
  - [ ] Notification service

- [ ] **Transactions**
  - [ ] Transaction model
  - [ ] Transaction migration

- [ ] **Unified Tasks**
  - [ ] Merge Task models
  - [ ] Merge Task migrations
  - [ ] Unified TaskController
  - [ ] Support both project-based and standalone tasks

---

## API Route Structure (Final)

```php
// routes/api.php

// Auth (unified)
Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
    Route::get('/user', [AuthController::class, 'user'])->middleware('auth:sanctum');
});

Route::middleware('auth:sanctum')->group(function () {
    
    // Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index']);
    
    // Projects (from Fibonacco AI Platform)
    Route::apiResource('projects', ProjectController::class);
    Route::prefix('projects/{project}')->group(function () {
        Route::apiResource('tasks', TaskController::class);
        Route::apiResource('questions', QuestionController::class);
        Route::apiResource('problems', ProblemController::class);
    });
    
    // Processes (NEW)
    Route::apiResource('processes', ProcessController::class);
    Route::prefix('processes/{process}')->group(function () {
        Route::apiResource('steps', ProcessStepController::class);
        Route::post('/publish', [ProcessController::class, 'publish']);
        Route::post('/execute', [ProcessController::class, 'execute']);
        Route::get('/executions', [ProcessExecutionController::class, 'index']);
    });
    Route::get('/processes/executions', [ProcessExecutionController::class, 'all']);
    
    // Tasks (standalone - from taskjuggler-api)
    Route::get('/my/tasks', [TaskController::class, 'myTasks']);
    Route::get('/my/requests', [TaskController::class, 'myRequests']);
    
    // Inbox (from taskjuggler-api)
    Route::get('/inbox', [InboxController::class, 'index']);
    Route::post('/inbox/{inboxItem}/process', [InboxController::class, 'process']);
    
    // Routing Rules (from taskjuggler-api)
    Route::apiResource('routing-rules', RoutingRuleController::class);
    
    // Teams (from taskjuggler-api)
    Route::apiResource('teams', TeamController::class);
    
    // Marketplace (from taskjuggler-api)
    Route::prefix('marketplace')->group(function () {
        Route::apiResource('listings', Marketplace\ListingController::class);
        Route::apiResource('vendors', Marketplace\VendorController::class);
    });
    
    // Appointments (from taskjuggler-api)
    Route::apiResource('appointments', AppointmentController::class);
    Route::apiResource('appointment-types', AppointmentTypeController::class);
    
    // Direct Messages (from taskjuggler-api)
    Route::prefix('messages')->group(function () {
        Route::get('/conversations', [DirectMessageController::class, 'conversations']);
        Route::get('/with/{user}', [DirectMessageController::class, 'messages']);
        Route::post('/to/{user}', [DirectMessageController::class, 'send']);
    });
    
    // Contact Lists (from taskjuggler-api)
    Route::apiResource('contact-lists', ContactListController::class);
    
    // Channels (from taskjuggler-api)
    Route::apiResource('channels', ChannelController::class);
});

// Webhooks (public)
Route::prefix('webhooks')->group(function () {
    Route::post('/email', [WebhookController::class, 'email']);
    Route::post('/sms', [WebhookController::class, 'sms']);
    Route::post('/voice', [WebhookController::class, 'voice']);
});
```

---

## Database Schema (Final Unified)

### Core Tables
- organizations
- users
- personal_access_tokens
- permissions

### Projects & Tasks
- projects
- project_members
- tasks (supports both project-based and standalone)
- task_actions
- task_messages
- task_dependencies
- task_invitations

### Processes (NEW)
- processes
- process_steps
- process_executions

### Q&A & Problems
- questions
- answers
- question_votes
- problems

### Inbox & Routing
- inbox_items
- routing_rules

### Teams
- teams
- team_members
- team_invitations

### Marketplace
- marketplace_listings
- marketplace_vendors
- marketplace_bids

### Appointments
- appointment_types
- availability_slots
- appointments

### Communication
- direct_messages
- notifications

### Other
- contact_lists
- contact_list_members
- assistant_channels
- ai_tool_configs
- ai_tool_executions
- transactions
- sprints
- milestones

---

## Frontend Configuration

### taskjuggler-web
**File:** `.env.development`
```
VITE_API_URL=http://localhost:8000/api
```

**File:** `.env.production`
```
VITE_API_URL=https://fibonacco-api.up.railway.app/api
```

### process-web
**File:** `.env.development`
```
VITE_API_URL=http://localhost:8000/api
```

**File:** `.env.production`
```
VITE_API_URL=https://fibonacco-api.up.railway.app/api
```

### projects-web
**File:** `.env.development`
```
VITE_API_URL=http://localhost:8000/api
```

**File:** `.env.production`
```
VITE_API_URL=https://fibonacco-api.up.railway.app/api
```

---

## Timeline Estimate

| Phase | Duration | Dependencies |
|-------|----------|--------------|
| Phase 1: Process-AI | 1-2 weeks | None |
| Phase 2: Merge Features | 2-3 weeks | Phase 1 |
| Phase 3: Update Frontends | 1 week | Phase 2 |
| Phase 4: Database Migration | 1 week | Phase 2 |
| Phase 5: Testing & Cleanup | 1 week | Phase 3, 4 |
| **Total** | **6-8 weeks** | |

---

## Success Criteria

✅ All three frontends connect to unified backend
✅ All features from both backends available
✅ Process-AI fully functional
✅ Single database with unified schema
✅ Shared authentication across all apps
✅ No duplicate code
✅ All tests passing
✅ Documentation complete

---

## Next Steps

1. **Start with Phase 1** - Add Process-AI to Fibonacco AI Platform
2. **Create feature branch** - `feature/process-ai`
3. **Implement step by step** - Follow detailed task breakdown
4. **Test incrementally** - Test each component as built
5. **Document as you go** - Update API docs, README

Ready to begin Phase 1?
