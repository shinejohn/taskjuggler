# URPA Module Code Assessment - 4 Calls

## Overview
URPA (Unified Relationship & Personal Assistant) is a module within TaskJuggler that provides unified activity management, AI assistance, voice integration, and integrations with external systems including TaskJuggler itself.

---

## Call 1: URPA Architecture & Module Structure

### Module Organization
```
app/Modules/Urpa/
├── Controllers/        # API controllers
├── Models/            # Eloquent models
├── Services/          # Business logic services
├── Jobs/              # Queue jobs
├── Events/            # Application events
├── Migrations/        # Database migrations
└── Routes/
    └── api.php        # Module routes
```

### Core Models
- **UrpaUserProfile** - User subscription and preferences
- **UrpaActivity** - Unified activity feed (emails, texts, tasks, calendar, etc.)
- **UrpaContact** - Contact management
- **UrpaIntegration** - External system integrations
- **UrpaAiSession** - AI conversation sessions
- **UrpaAiTask** - AI-generated tasks
- **UrpaArtifact** - AI-generated artifacts
- **UrpaPhoneCall** - Phone call records
- **UrpaVoiceResponse** - Pre-recorded voice responses
- **UrpaTaskjugglerLink** - TaskJuggler integration link
- **UrpaFibonacciLink** - Fibonacci CRM/Publishing integration

### Key Features
1. **Unified Activity Feed** - Aggregates activities from multiple sources
2. **AI Assistant** - Conversational AI with sessions and artifacts
3. **Voice Integration** - Vapi phone assistant with pre-recorded responses
4. **Contact Management** - Centralized contact database
5. **External Integrations** - TaskJuggler, Fibonacci CRM/Publishing
6. **Sync Services** - Bidirectional sync with external systems

### User Scoping
- **User-based** (not team-based like other modules)
- All resources scoped to `user_id`
- No `team_id` or `profile_id` fields
- Direct user ownership model

### Controller Pattern
```php
class ActivityController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        $query = UrpaActivity::where('user_id', $user->id);
        
        // Apply filters, search, pagination
        return response()->json($query->paginate());
    }
}
```

---

## Call 2: URPA Database Migrations

### Migration Files
```
2025_01_07_000001_create_urpa_user_profiles_table.php
2025_01_07_000002_create_urpa_activities_table.php
2025_01_07_000003_create_urpa_integrations_table.php
2025_01_07_000004_create_urpa_artifacts_table.php
2025_01_07_000005_create_urpa_phone_calls_table.php
2025_01_07_000006_create_urpa_ai_sessions_table.php
```

### Key Patterns

**User Profiles:**
```php
$table->uuid('user_id')->unique();
$table->string('subscription_tier', 20)->default('starter');
$table->integer('ai_requests_limit')->default(1000);
$table->integer('ai_requests_used')->default(0);
```

**Activities:**
```php
$table->uuid('user_id');
$table->string('activity_type', 20); // email, text, task, calendar, etc.
$table->string('source', 50)->nullable(); // gmail, outlook, slack, etc.
$table->string('title', 500);
$table->json('raw_content')->nullable();
$table->string('external_id', 255)->nullable();
$table->timestamp('activity_timestamp');
```

**Integrations:**
```php
$table->uuid('user_id');
$table->string('provider', 50); // taskjuggler, fibonacci_crm, etc.
$table->json('credentials')->nullable();
$table->boolean('is_active')->default(true);
$table->timestamp('last_synced_at')->nullable();
```

### Indexes
- `user_id` on all tables
- `activity_timestamp` on activities
- `external_id` for sync tracking
- Composite indexes for common queries

---

## Call 3: URPA API Structure

### Route Prefix
All URPA routes are prefixed with `/api/urpa/`

### Main Endpoints

**Activities:**
```
GET    /api/urpa/activities              # List activities
POST   /api/urpa/activities               # Create activity
POST   /api/urpa/activities/sync          # Sync from integrations
GET    /api/urpa/activities/{id}          # Get activity
PUT    /api/urpa/activities/{id}          # Update activity
PATCH  /api/urpa/activities/{id}/read     # Mark as read
PATCH  /api/urpa/activities/{id}/star     # Toggle star
DELETE /api/urpa/activities/{id}          # Delete activity
```

**Contacts:**
```
GET    /api/urpa/contacts                 # List contacts
POST   /api/urpa/contacts                 # Create contact
POST   /api/urpa/contacts/import           # Import contacts
GET    /api/urpa/contacts/{id}            # Get contact
PUT    /api/urpa/contacts/{id}            # Update contact
DELETE /api/urpa/contacts/{id}           # Delete contact
```

**AI:**
```
GET    /api/urpa/ai/sessions              # List AI sessions
POST   /api/urpa/ai/sessions               # Create session
GET    /api/urpa/ai/sessions/{id}/messages # Get messages
POST   /api/urpa/ai/sessions/{id}/messages # Send message
PATCH  /api/urpa/ai/sessions/{id}/complete # Complete session
GET    /api/urpa/ai/artifacts             # List artifacts
POST   /api/urpa/ai/artifacts             # Generate artifact
GET    /api/urpa/ai/tasks                 # List AI tasks
```

**Voice:**
```
GET    /api/urpa/voice/prerecorded        # Get prerecorded responses
POST   /api/urpa/voice/find-response      # Find matching response
POST   /api/urpa/voice/prerecorded/bulk   # Bulk create responses
POST   /api/urpa/voice/vapi/webhook       # Vapi webhook (no auth)
POST   /api/urpa/voice/vapi/call          # Start call
POST   /api/urpa/voice/vapi/call/{id}/end # End call
GET    /api/urpa/voice/vapi/call/{id}     # Get call status
```

**Integrations:**
```
GET    /api/urpa/integrations              # List integrations
POST   /api/urpa/integrations              # Create integration
GET    /api/urpa/integrations/{id}        # Get integration
PUT    /api/urpa/integrations/{id}        # Update integration
DELETE /api/urpa/integrations/{id}        # Delete integration
POST   /api/urpa/integrations/{id}/sync   # Sync integration
GET    /api/urpa/integrations/{id}/sync-status # Get sync status
GET    /api/urpa/integrations/oauth/{provider}/redirect # OAuth redirect
GET    /api/urpa/integrations/oauth/{provider}/callback # OAuth callback
```

**TaskJuggler Integration:**
```
GET    /api/urpa/integrations/taskjuggler/status  # Get link status
POST   /api/urpa/integrations/taskjuggler/link    # Link account
POST   /api/urpa/integrations/taskjuggler/sync    # Sync tasks
GET    /api/urpa/integrations/taskjuggler/tasks   # Get tasks
POST   /api/urpa/integrations/taskjuggler/tasks   # Create task
```

### Query Parameters
- `search` - Search activities/contacts
- `type` - Filter by activity type
- `status` - Filter by status
- `source` - Filter by source
- `unread` - Filter unread items
- `starred` - Filter starred items
- `date_from` / `date_to` - Date range
- `per_page` - Pagination

### Response Format
```json
{
  "data": [ /* array of resources */ ],
  "total": 100,
  "page": 1,
  "per_page": 50
}
```

---

## Call 4: TaskJuggler Integration

### Integration Model
**UrpaTaskjugglerLink** - Links URPA user to TaskJuggler user

**Fields:**
- `urpa_user_id` - URPA user
- `taskjuggler_user_id` - TaskJuggler user
- `sync_tasks` - Enable task syncing
- `sync_projects` - Enable project syncing
- `auto_create_tasks` - Auto-create tasks from URPA activities
- `urpa_originated` - Link created from URPA side
- `tj_originated` - Link created from TaskJuggler side

### Sync Service
**TaskJugglerSyncService** - Handles bidirectional sync

**Key Methods:**
- `syncAITasks()` - Sync URPA AI tasks → TaskJuggler
- `syncFromTaskJuggler()` - Sync TaskJuggler tasks → URPA activities
- `createTaskInTaskJuggler()` - Create task in TaskJuggler
- `fetchTasks()` - Fetch tasks from TaskJuggler

### Sync Flow

**URPA → TaskJuggler:**
1. URPA AI task created (`UrpaAiTask`)
2. If `auto_create_tasks` enabled, create TaskJuggler task
3. Store `taskjuggler_task_id` in `UrpaAiTask`
4. Mark as `synced_to_taskjuggler`

**TaskJuggler → URPA:**
1. Fetch tasks from TaskJuggler API
2. Create `UrpaActivity` with `source: 'taskjuggler'`
3. Store TaskJuggler task ID in `external_id`
4. Store full task data in `raw_content` JSON

### API Integration Pattern

**Creating Task in TaskJuggler:**
```php
$response = Http::withHeaders([
    'Authorization' => 'Bearer ' . $token,
    'Content-Type' => 'application/json',
])->post($taskjugglerApiUrl . '/tasks', [
    'title' => $task->title,
    'description' => $task->description,
    'status' => 'pending',
    'priority' => 'normal',
    'source_type' => 'urpa',
    'source_channel' => 'urpa_ai',
    'source_channel_ref' => $task->id,
]);
```

**Fetching Tasks from TaskJuggler:**
```php
$response = Http::withHeaders([
    'Authorization' => 'Bearer ' . $token,
])->get($taskjugglerApiUrl . '/tasks', [
    'status' => 'pending',
    'per_page' => 100,
]);
```

### Status Mapping
```php
TaskJuggler Status → URPA Activity Status
'completed', 'done' → 'completed'
'urgent', 'high' → 'urgent'
'archived' → 'archived'
default → 'pending'
```

### Configuration
```php
// config/services.php
'taskjuggler' => [
    'api_url' => env('TASKJUGGLER_API_URL', 'http://localhost:8000/api'),
],
```

### Authentication
- Uses Bearer token authentication
- Token stored per user (TODO: implement token storage/OAuth)
- Same user account can be linked (same `user_id`)

---

## TaskJuggler Integration Component Usage

### Linking Accounts
```php
POST /api/urpa/integrations/taskjuggler/link
{
    "taskjuggler_user_id": "uuid",
    "sync_tasks": true,
    "sync_projects": true,
    "auto_create_tasks": true
}
```

### Syncing Tasks
```php
POST /api/urpa/integrations/taskjuggler/sync
// Syncs URPA AI tasks to TaskJuggler
```

### Fetching Tasks
```php
GET /api/urpa/integrations/taskjuggler/tasks
// Returns URPA activities created from TaskJuggler tasks
```

### Creating Task from URPA
```php
POST /api/urpa/integrations/taskjuggler/tasks
{
    "title": "Task title",
    "description": "Task description",
    "priority": "high",
    "due_date": "2024-01-01",
    "source_type": "urpa_activity",
    "source_id": "activity-uuid"
}
```

---

## Key Services

### ActivitySyncService
- Syncs activities from external integrations
- Handles different source types
- Creates URPA activities from external data

### AiService
- Manages AI conversations
- Handles function calling
- Generates artifacts

### TaskJugglerSyncService
- Bidirectional sync with TaskJuggler
- Creates tasks in TaskJuggler
- Fetches tasks from TaskJuggler
- Maps statuses between systems

### VapiService
- Manages Vapi phone calls
- Handles webhooks
- Manages call status

### VoiceResponseService
- Pre-generates voice responses
- Matches responses to queries
- Logs usage

### IntegrationDataService
- Fetches data from integrations
- Handles OAuth flows
- Manages integration credentials

---

## Adding Features to URPA

### Adding New Activity Type

1. **Update Migration** (if needed):
```php
// Add new activity_type value
$table->string('activity_type', 20); // Add new type
```

2. **Update Model**:
```php
// UrpaActivity.php
const TYPE_NEW_TYPE = 'new_type';
```

3. **Update Controller Validation**:
```php
'activity_type' => 'required|string|in:email,text,task,calendar,social,voicemail,new_type',
```

4. **Add Sync Logic** (if from integration):
```php
// ActivitySyncService.php
public function syncNewType($data) {
    UrpaActivity::create([
        'activity_type' => 'new_type',
        'source' => 'new_source',
        // ...
    ]);
}
```

### Adding New Integration

1. **Create Link Model** (if needed):
```php
// UrpaNewIntegrationLink.php
class UrpaNewIntegrationLink extends Model
{
    protected $fillable = ['urpa_user_id', 'integration_user_id', 'sync_enabled'];
}
```

2. **Create Sync Service**:
```php
// NewIntegrationSyncService.php
class NewIntegrationSyncService
{
    public function syncToUrpa($userId) { }
    public function syncFromUrpa($userId) { }
}
```

3. **Create Controller**:
```php
// NewIntegrationController.php
class NewIntegrationController extends Controller
{
    public function link(Request $request) { }
    public function sync(Request $request) { }
}
```

4. **Add Routes**:
```php
// Routes/api.php
Route::prefix('integrations/new-integration')->group(function () {
    Route::get('/status', [NewIntegrationController::class, 'status']);
    Route::post('/link', [NewIntegrationController::class, 'link']);
    Route::post('/sync', [NewIntegrationController::class, 'sync']);
});
```

### Extending TaskJuggler Integration

**Add Project Sync:**
```php
// TaskJugglerSyncService.php
public function syncProjects(string $userId): array
{
    // Fetch projects from TaskJuggler
    // Create URPA activities or artifacts
    // Store project data
}
```

**Add Bidirectional Task Updates:**
```php
// When TaskJuggler task updated, update URPA activity
public function updateActivityFromTask($taskjugglerTaskId, $updates)
{
    $activity = UrpaActivity::where('external_id', $taskjugglerTaskId)
        ->where('source', 'taskjuggler')
        ->first();
    
    $activity->update($updates);
}
```

**Add Webhook Support:**
```php
// TaskJugglerController.php
public function webhook(Request $request)
{
    // Receive webhook from TaskJuggler
    // Update URPA activities in real-time
    // Handle task created/updated/deleted events
}
```

---

## Quick Reference

### Models
- `UrpaActivity` - Unified activity feed
- `UrpaContact` - Contact management
- `UrpaIntegration` - External integrations
- `UrpaAiSession` - AI conversations
- `UrpaAiTask` - AI-generated tasks
- `UrpaTaskjugglerLink` - TaskJuggler link

### Services
- `TaskJugglerSyncService` - TaskJuggler sync
- `ActivitySyncService` - Activity syncing
- `AiService` - AI operations
- `VapiService` - Voice calls

### Key Endpoints
- `/api/urpa/activities` - Activity feed
- `/api/urpa/integrations/taskjuggler/*` - TaskJuggler integration
- `/api/urpa/ai/*` - AI features
- `/api/urpa/voice/*` - Voice features

### Patterns
- User-scoped (not team-scoped)
- External ID tracking for sync
- JSON `raw_content` for original data
- Activity timestamp for chronological ordering
- Source tracking for integration identification

---

**This document provides the foundation for understanding and extending the URPA module and TaskJuggler integration.**

