# 04 - Cursor API & Frontend Guide

Complete API controllers, resources, routes, and Vue components for 4 Projects.ai.

---

## API Routes

### routes/api.php
```php
<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\ProjectController;
use App\Http\Controllers\Api\TaskController;
use App\Http\Controllers\Api\QuestionController;
use App\Http\Controllers\Api\ProblemController;
use App\Http\Controllers\Api\TeamController;
use App\Http\Controllers\Api\TEFController;
use App\Http\Controllers\Api\WebhookController;
use Illuminate\Support\Facades\Route;

// Health check
Route::get('/health', fn() => response()->json(['status' => 'ok']));

// Auth routes
Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
    Route::get('/user', [AuthController::class, 'user'])->middleware('auth:sanctum');
});

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    // Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index']);
    Route::get('/dashboard/activity', [DashboardController::class, 'activity']);
    
    // My Tasks (cross-project)
    Route::get('/my/tasks', [TaskController::class, 'myTasks']);
    Route::get('/my/requests', [TaskController::class, 'myRequests']);

    // Projects
    Route::apiResource('projects', ProjectController::class);
    Route::get('/projects/{project}/stats', [ProjectController::class, 'stats']);
    
    // Project Members
    Route::get('/projects/{project}/members', [TeamController::class, 'index']);
    Route::post('/projects/{project}/members', [TeamController::class, 'store']);
    Route::put('/projects/{project}/members/{member}', [TeamController::class, 'update']);
    Route::delete('/projects/{project}/members/{member}', [TeamController::class, 'destroy']);

    // Tasks (nested under projects)
    Route::prefix('projects/{project}')->group(function () {
        Route::apiResource('tasks', TaskController::class);
        
        // Task state transitions
        Route::post('/tasks/{task}/accept', [TaskController::class, 'accept']);
        Route::post('/tasks/{task}/decline', [TaskController::class, 'decline']);
        Route::post('/tasks/{task}/start', [TaskController::class, 'start']);
        Route::post('/tasks/{task}/complete', [TaskController::class, 'complete']);
        Route::post('/tasks/{task}/cancel', [TaskController::class, 'cancel']);
        
        // Task messages
        Route::get('/tasks/{task}/messages', [TaskController::class, 'messages']);
        Route::post('/tasks/{task}/messages', [TaskController::class, 'addMessage']);
        
        // Task TEF export
        Route::get('/tasks/{task}/tef', [TEFController::class, 'exportTask']);
    });
    
    // Questions
    Route::prefix('projects/{project}')->group(function () {
        Route::apiResource('questions', QuestionController::class);
        Route::post('/questions/{question}/vote', [QuestionController::class, 'vote']);
        Route::post('/questions/{question}/convert', [QuestionController::class, 'convertToTask']);
        
        // Answers
        Route::post('/questions/{question}/answers', [QuestionController::class, 'addAnswer']);
        Route::post('/questions/{question}/answers/{answer}/accept', [QuestionController::class, 'acceptAnswer']);
        Route::post('/answers/{answer}/vote', [QuestionController::class, 'voteAnswer']);
    });
    
    // Problems
    Route::prefix('projects/{project}')->group(function () {
        Route::apiResource('problems', ProblemController::class);
        Route::post('/problems/{problem}/resolve', [ProblemController::class, 'resolve']);
    });
    
    // TEF Import/Export
    Route::get('/projects/{project}/tef', [TEFController::class, 'exportProject']);
    Route::post('/projects/{project}/tef/import', [TEFController::class, 'importTasks']);
});

// Webhooks (no auth - signature verification instead)
Route::prefix('webhooks')->group(function () {
    Route::post('/email', [WebhookController::class, 'email']);
    Route::post('/sms', [WebhookController::class, 'sms']);
    Route::post('/voice', [WebhookController::class, 'voice']);
    Route::post('/slack', [WebhookController::class, 'slack']);
});
```

---

## API Controllers

### AuthController
```php
<?php
// app/Http/Controllers/Api/AuthController.php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Models\Organization;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function register(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'confirmed', Password::defaults()],
            'organization_name' => ['required', 'string', 'max:255'],
        ]);

        // Create organization
        $organization = Organization::create([
            'name' => $validated['organization_name'],
            'slug' => \Str::slug($validated['organization_name']),
            'plan' => 'free',
        ]);

        // Create user
        $user = User::create([
            'organization_id' => $organization->id,
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
        ]);

        $token = $user->createToken('auth-token')->plainTextToken;

        return response()->json([
            'user' => new UserResource($user),
            'token' => $token,
        ], 201);
    }

    public function login(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        if (!Auth::attempt($validated)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        $user = User::where('email', $validated['email'])->first();
        $user->updateLastActive();
        
        $token = $user->createToken('auth-token')->plainTextToken;

        return response()->json([
            'user' => new UserResource($user->load('organization')),
            'token' => $token,
        ]);
    }

    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Logged out successfully']);
    }

    public function user(Request $request): JsonResponse
    {
        $user = $request->user();
        $user->updateLastActive();

        return response()->json([
            'user' => new UserResource($user->load('organization')),
        ]);
    }
}
```

### ProjectController
```php
<?php
// app/Http/Controllers/Api/ProjectController.php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\CreateProjectRequest;
use App\Http\Requests\UpdateProjectRequest;
use App\Http\Resources\ProjectResource;
use App\Http\Resources\ProjectCollection;
use App\Models\Project;
use App\Services\AI\PredictiveAnalytics;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProjectController extends Controller
{
    public function __construct(
        protected PredictiveAnalytics $analytics
    ) {}

    public function index(Request $request): ProjectCollection
    {
        $query = Project::where('organization_id', $request->user()->organization_id)
            ->forUser($request->user())
            ->with(['owner', 'members'])
            ->withCount('tasks');

        // Filters
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        // Search
        if ($request->has('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'ilike', "%{$request->search}%")
                  ->orWhere('code', 'ilike', "%{$request->search}%");
            });
        }

        // Sort
        $sortField = $request->get('sort', 'updated_at');
        $sortDir = $request->get('direction', 'desc');
        $query->orderBy($sortField, $sortDir);

        $projects = $query->paginate($request->get('per_page', 20));

        return new ProjectCollection($projects);
    }

    public function store(CreateProjectRequest $request): JsonResponse
    {
        $project = Project::create([
            'organization_id' => $request->user()->organization_id,
            'owner_id' => $request->user()->id,
            ...$request->validated(),
        ]);

        // Add creator as owner member
        $project->members()->attach($request->user()->id, ['role' => 'owner']);

        return response()->json([
            'data' => new ProjectResource($project->load(['owner', 'members'])),
        ], 201);
    }

    public function show(Project $project): JsonResponse
    {
        $this->authorize('view', $project);

        return response()->json([
            'data' => new ProjectResource($project->load(['owner', 'members'])),
        ]);
    }

    public function update(UpdateProjectRequest $request, Project $project): JsonResponse
    {
        $this->authorize('update', $project);

        $project->update($request->validated());

        return response()->json([
            'data' => new ProjectResource($project->fresh(['owner', 'members'])),
        ]);
    }

    public function destroy(Project $project): JsonResponse
    {
        $this->authorize('delete', $project);

        $project->delete();

        return response()->json(null, 204);
    }

    public function stats(Project $project): JsonResponse
    {
        $this->authorize('view', $project);

        $taskStats = $project->getTaskStats();
        $healthScore = $this->analytics->calculateProjectHealth($project);
        $prediction = $this->analytics->predictCompletion($project);
        $bottlenecks = $this->analytics->identifyBottlenecks($project);

        return response()->json([
            'tasks' => $taskStats,
            'health_score' => $healthScore,
            'prediction' => $prediction,
            'bottlenecks' => $bottlenecks,
        ]);
    }
}
```

### TaskController
```php
<?php
// app/Http/Controllers/Api/TaskController.php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\CreateTaskRequest;
use App\Http\Requests\UpdateTaskRequest;
use App\Http\Resources\TaskResource;
use App\Http\Resources\TaskCollection;
use App\Models\Project;
use App\Models\Task;
use App\Enums\TaskChannel;
use App\Services\TaskJuggler\TaskJugglerService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    public function __construct(
        protected TaskJugglerService $taskJuggler
    ) {}

    public function index(Request $request, Project $project): TaskCollection
    {
        $this->authorize('view', $project);

        $query = $project->tasks()
            ->with(['requestor', 'owner', 'project']);

        // Filters
        if ($request->has('state')) {
            $query->where('state', $request->state);
        }
        if ($request->has('priority')) {
            $query->where('priority', $request->priority);
        }
        if ($request->has('owner_id')) {
            $query->where('owner_id', $request->owner_id);
        }
        if ($request->has('channel')) {
            $query->where('source_channel', $request->channel);
        }
        if ($request->boolean('overdue')) {
            $query->overdue();
        }

        // Search
        if ($request->has('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('title', 'ilike', "%{$request->search}%")
                  ->orWhere('description', 'ilike', "%{$request->search}%");
            });
        }

        // Sort
        $sortField = $request->get('sort', 'created_at');
        $sortDir = $request->get('direction', 'desc');
        $query->orderBy($sortField, $sortDir);

        $tasks = $query->paginate($request->get('per_page', 50));

        return new TaskCollection($tasks);
    }

    public function store(CreateTaskRequest $request, Project $project): JsonResponse
    {
        $this->authorize('update', $project);

        $task = $this->taskJuggler->createTask(
            array_merge($request->validated(), [
                'organization_id' => $project->organization_id,
                'project_id' => $project->id,
            ]),
            TaskChannel::WEB,
            $request->user()
        );

        return response()->json([
            'data' => new TaskResource($task),
        ], 201);
    }

    public function show(Project $project, Task $task): JsonResponse
    {
        $this->authorize('view', $project);

        $task->load(['requestor', 'owner', 'project', 'actions.user', 'messages.user']);

        return response()->json([
            'data' => new TaskResource($task),
        ]);
    }

    public function update(UpdateTaskRequest $request, Project $project, Task $task): JsonResponse
    {
        $this->authorize('update', $project);

        $task = $this->taskJuggler->updateTask($task, $request->validated(), $request->user());

        return response()->json([
            'data' => new TaskResource($task),
        ]);
    }

    public function destroy(Project $project, Task $task): JsonResponse
    {
        $this->authorize('delete', $project);

        $task->delete();

        return response()->json(null, 204);
    }

    // State Transitions

    public function accept(Request $request, Project $project, Task $task): JsonResponse
    {
        $this->authorize('view', $project);

        $task = $this->taskJuggler->acceptTask($task, $request->user());

        return response()->json([
            'data' => new TaskResource($task),
        ]);
    }

    public function decline(Request $request, Project $project, Task $task): JsonResponse
    {
        $this->authorize('view', $project);

        $validated = $request->validate([
            'reason' => ['required', 'string', 'max:500'],
        ]);

        $task = $this->taskJuggler->declineTask($task, $request->user(), $validated['reason']);

        return response()->json([
            'data' => new TaskResource($task),
        ]);
    }

    public function start(Request $request, Project $project, Task $task): JsonResponse
    {
        $this->authorize('view', $project);

        $task = $this->taskJuggler->startTask($task, $request->user());

        return response()->json([
            'data' => new TaskResource($task),
        ]);
    }

    public function complete(Request $request, Project $project, Task $task): JsonResponse
    {
        $this->authorize('view', $project);

        $validated = $request->validate([
            'notes' => ['nullable', 'string'],
        ]);

        $task = $this->taskJuggler->completeTask($task, $request->user(), $validated['notes'] ?? null);

        return response()->json([
            'data' => new TaskResource($task),
        ]);
    }

    public function cancel(Request $request, Project $project, Task $task): JsonResponse
    {
        $this->authorize('update', $project);

        $validated = $request->validate([
            'reason' => ['nullable', 'string', 'max:500'],
        ]);

        $task = $this->taskJuggler->cancelTask($task, $request->user(), $validated['reason'] ?? null);

        return response()->json([
            'data' => new TaskResource($task),
        ]);
    }

    // Messages

    public function messages(Project $project, Task $task): JsonResponse
    {
        $this->authorize('view', $project);

        return response()->json([
            'data' => $task->messages()->with('user')->orderBy('created_at')->get(),
        ]);
    }

    public function addMessage(Request $request, Project $project, Task $task): JsonResponse
    {
        $this->authorize('view', $project);

        $validated = $request->validate([
            'content' => ['required', 'string', 'max:5000'],
        ]);

        $this->taskJuggler->addMessage($task, $request->user(), $validated['content']);

        return response()->json([
            'data' => $task->fresh('messages.user')->messages,
        ]);
    }

    // Cross-project task lists

    public function myTasks(Request $request): TaskCollection
    {
        $tasks = Task::ownedBy($request->user())
            ->whereIn('state', ['pending', 'accepted', 'in_progress', 'overdue'])
            ->with(['requestor', 'project'])
            ->orderByRaw("CASE state 
                WHEN 'overdue' THEN 1 
                WHEN 'in_progress' THEN 2 
                WHEN 'accepted' THEN 3 
                WHEN 'pending' THEN 4 
                ELSE 5 END")
            ->orderBy('due_date')
            ->paginate(50);

        return new TaskCollection($tasks);
    }

    public function myRequests(Request $request): TaskCollection
    {
        $tasks = Task::requestedBy($request->user())
            ->whereNotIn('state', ['completed', 'cancelled'])
            ->with(['owner', 'project'])
            ->orderByDesc('created_at')
            ->paginate(50);

        return new TaskCollection($tasks);
    }
}
```

### WebhookController
```php
<?php
// app/Http/Controllers/Api/WebhookController.php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Jobs\ProcessIncomingEmail;
use App\Jobs\ProcessIncomingSMS;
use App\Jobs\ProcessVoiceTranscription;
use App\Jobs\ProcessSlackEvent;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class WebhookController extends Controller
{
    /**
     * Handle incoming email (from email service like SendGrid/Mailgun)
     */
    public function email(Request $request): JsonResponse
    {
        // Verify webhook signature (implementation depends on service)
        // $this->verifyEmailSignature($request);

        $emailData = [
            'from' => $request->input('from'),
            'subject' => $request->input('subject'),
            'body' => $request->input('text') ?? $request->input('html'),
            'cc' => $this->parseAddresses($request->input('cc', '')),
            'attachments' => $request->input('attachments', []),
        ];

        ProcessIncomingEmail::dispatch($emailData);

        return response()->json(['status' => 'queued']);
    }

    /**
     * Handle incoming SMS (from Twilio)
     */
    public function sms(Request $request): JsonResponse
    {
        // Verify Twilio signature
        if (!$this->verifyTwilioSignature($request)) {
            return response()->json(['error' => 'Invalid signature'], 403);
        }

        $smsData = [
            'from' => $request->input('From'),
            'body' => $request->input('Body'),
            'message_sid' => $request->input('MessageSid'),
        ];

        ProcessIncomingSMS::dispatch($smsData);

        // Return TwiML response
        return response()->json(['status' => 'queued']);
    }

    /**
     * Handle voice transcription (from Twilio)
     */
    public function voice(Request $request): JsonResponse
    {
        // Verify Twilio signature
        if (!$this->verifyTwilioSignature($request)) {
            return response()->json(['error' => 'Invalid signature'], 403);
        }

        $voiceData = [
            'from' => $request->input('From'),
            'transcription' => $request->input('TranscriptionText'),
            'recording_url' => $request->input('RecordingUrl'),
            'call_sid' => $request->input('CallSid'),
        ];

        ProcessVoiceTranscription::dispatch($voiceData);

        return response()->json(['status' => 'queued']);
    }

    /**
     * Handle Slack events
     */
    public function slack(Request $request): JsonResponse
    {
        // Handle URL verification challenge
        if ($request->input('type') === 'url_verification') {
            return response()->json(['challenge' => $request->input('challenge')]);
        }

        // Verify Slack signature
        if (!$this->verifySlackSignature($request)) {
            return response()->json(['error' => 'Invalid signature'], 403);
        }

        $event = $request->input('event', []);

        ProcessSlackEvent::dispatch($event);

        return response()->json(['status' => 'queued']);
    }

    // Helper methods

    protected function parseAddresses(string $addresses): array
    {
        if (empty($addresses)) return [];
        
        preg_match_all('/[\w.+-]+@[\w.-]+\.[a-zA-Z]{2,}/', $addresses, $matches);
        return $matches[0] ?? [];
    }

    protected function verifyTwilioSignature(Request $request): bool
    {
        $signature = $request->header('X-Twilio-Signature');
        $url = $request->fullUrl();
        $params = $request->all();

        $validator = new \Twilio\Security\RequestValidator(config('services.twilio.token'));
        return $validator->validate($signature, $url, $params);
    }

    protected function verifySlackSignature(Request $request): bool
    {
        $signature = $request->header('X-Slack-Signature');
        $timestamp = $request->header('X-Slack-Request-Timestamp');
        $body = $request->getContent();

        // Check timestamp to prevent replay attacks
        if (abs(time() - intval($timestamp)) > 60 * 5) {
            return false;
        }

        $sigBasestring = "v0:{$timestamp}:{$body}";
        $mySignature = 'v0=' . hash_hmac('sha256', $sigBasestring, config('services.slack.signing_secret'));

        return hash_equals($mySignature, $signature);
    }
}
```

---

## Form Requests

### CreateTaskRequest
```php
<?php
// app/Http/Requests/CreateTaskRequest.php

namespace App\Http\Requests;

use App\Enums\TaskPriority;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CreateTaskRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:10000'],
            'owner_id' => ['nullable', 'uuid', 'exists:users,id'],
            'parent_id' => ['nullable', 'uuid', 'exists:tasks,id'],
            'priority' => ['sometimes', Rule::enum(TaskPriority::class)],
            'due_date' => ['nullable', 'date', 'after_or_equal:today'],
            'estimated_hours' => ['nullable', 'integer', 'min:1', 'max:1000'],
            'tags' => ['nullable', 'array', 'max:10'],
            'tags.*' => ['string', 'max:50'],
        ];
    }
}
```

### CreateProjectRequest
```php
<?php
// app/Http/Requests/CreateProjectRequest.php

namespace App\Http\Requests;

use App\Enums\ProjectMethodology;
use App\Enums\ProjectStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CreateProjectRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'code' => ['nullable', 'string', 'max:10', 'alpha_dash'],
            'description' => ['nullable', 'string', 'max:5000'],
            'methodology' => ['sometimes', Rule::enum(ProjectMethodology::class)],
            'status' => ['sometimes', Rule::enum(ProjectStatus::class)],
            'priority' => ['sometimes', 'string', 'in:low,medium,high,critical'],
            'start_date' => ['nullable', 'date'],
            'target_end_date' => ['nullable', 'date', 'after_or_equal:start_date'],
            'budget' => ['nullable', 'numeric', 'min:0'],
            'tags' => ['nullable', 'array'],
        ];
    }
}
```

---

## API Resources

### TaskResource
```php
<?php
// app/Http/Resources/TaskResource.php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TaskResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'project_id' => $this->project_id,
            'title' => $this->title,
            'description' => $this->description,
            'state' => $this->state->value,
            'state_label' => $this->state->label(),
            'state_color' => $this->state->color(),
            'source_channel' => $this->source_channel->value,
            'channel_label' => $this->source_channel->label(),
            'channel_icon' => $this->source_channel->icon(),
            'priority' => $this->priority->value,
            'priority_label' => $this->priority->label(),
            'priority_color' => $this->priority->color(),
            'due_date' => $this->due_date?->toIso8601String(),
            'due_date_formatted' => $this->due_date?->format('M j, Y'),
            'is_overdue' => $this->is_overdue,
            'started_at' => $this->started_at?->toIso8601String(),
            'completed_at' => $this->completed_at?->toIso8601String(),
            'estimated_hours' => $this->estimated_hours,
            'actual_hours' => $this->actual_hours,
            'overdue_risk_score' => $this->overdue_risk_score,
            'tags' => $this->tags,
            'ai_suggestions' => $this->ai_suggestions,
            'requestor' => $this->whenLoaded('requestor', fn() => new UserResource($this->requestor)),
            'owner' => $this->whenLoaded('owner', fn() => $this->owner ? new UserResource($this->owner) : null),
            'project' => $this->whenLoaded('project', fn() => [
                'id' => $this->project->id,
                'name' => $this->project->name,
                'code' => $this->project->code,
            ]),
            'actions' => $this->whenLoaded('actions', fn() => $this->actions->map(fn($a) => [
                'id' => $a->id,
                'type' => $a->action_type,
                'from_state' => $a->from_state,
                'to_state' => $a->to_state,
                'comment' => $a->comment,
                'user' => $a->user ? [
                    'id' => $a->user->id,
                    'name' => $a->user->name,
                ] : null,
                'created_at' => $a->created_at->toIso8601String(),
            ])),
            'messages' => $this->whenLoaded('messages', fn() => $this->messages->map(fn($m) => [
                'id' => $m->id,
                'content' => $m->content,
                'channel' => $m->channel,
                'user' => [
                    'id' => $m->user->id,
                    'name' => $m->user->name,
                    'avatar' => $m->user->avatar,
                ],
                'created_at' => $m->created_at->toIso8601String(),
            ])),
            'created_at' => $this->created_at->toIso8601String(),
            'updated_at' => $this->updated_at->toIso8601String(),
        ];
    }
}
```

### ProjectResource
```php
<?php
// app/Http/Resources/ProjectResource.php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProjectResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'code' => $this->code,
            'description' => $this->description,
            'methodology' => $this->methodology->value,
            'methodology_label' => $this->methodology->label(),
            'status' => $this->status->value,
            'status_label' => $this->status->label(),
            'status_color' => $this->status->color(),
            'priority' => $this->priority,
            'start_date' => $this->start_date?->format('Y-m-d'),
            'target_end_date' => $this->target_end_date?->format('Y-m-d'),
            'budget' => $this->budget,
            'budget_spent' => $this->budget_spent,
            'health_score' => $this->health_score,
            'tags' => $this->tags,
            'owner' => $this->whenLoaded('owner', fn() => new UserResource($this->owner)),
            'members' => $this->whenLoaded('members', fn() => $this->members->map(fn($m) => [
                'id' => $m->id,
                'name' => $m->name,
                'email' => $m->email,
                'avatar' => $m->avatar,
                'role' => $m->pivot->role,
                'allocation' => $m->pivot->allocation_percentage,
            ])),
            'tasks_count' => $this->whenCounted('tasks'),
            'created_at' => $this->created_at->toIso8601String(),
            'updated_at' => $this->updated_at->toIso8601String(),
        ];
    }
}
```

### UserResource
```php
<?php
// app/Http/Resources/UserResource.php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'avatar' => $this->avatar,
            'timezone' => $this->timezone,
            'skills' => $this->skills,
            'capacity_hours_per_week' => $this->capacity_hours_per_week,
            'organization' => $this->whenLoaded('organization', fn() => [
                'id' => $this->organization->id,
                'name' => $this->organization->name,
                'plan' => $this->organization->plan->value,
            ]),
            'last_active_at' => $this->last_active_at?->toIso8601String(),
        ];
    }
}
```

---

## Vue Router

### resources/js/router/index.js
```javascript
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

// Layouts
import AppLayout from '@/layouts/AppLayout.vue'
import AuthLayout from '@/layouts/AuthLayout.vue'

// Views
import Dashboard from '@/views/Dashboard.vue'
import MyTasks from '@/views/MyTasks.vue'
import MyRequests from '@/views/MyRequests.vue'

// Auth Views
import Login from '@/views/auth/Login.vue'
import Register from '@/views/auth/Register.vue'

// Project Views
import ProjectList from '@/views/projects/ProjectList.vue'
import ProjectLayout from '@/views/projects/ProjectLayout.vue'
import ProjectOverview from '@/views/projects/ProjectOverview.vue'
import ProjectTasks from '@/views/projects/tasks/TaskList.vue'
import ProjectKanban from '@/views/projects/KanbanBoard.vue'
import ProjectGantt from '@/views/projects/GanttChart.vue'
import ProjectQuestions from '@/views/projects/questions/QuestionList.vue'
import ProjectProblems from '@/views/projects/problems/ProblemList.vue'
import ProjectSettings from '@/views/projects/ProjectSettings.vue'

// Task Views
import TaskDetail from '@/views/projects/tasks/TaskDetail.vue'

const routes = [
    // Auth routes
    {
        path: '/auth',
        component: AuthLayout,
        meta: { guest: true },
        children: [
            { path: 'login', name: 'login', component: Login },
            { path: 'register', name: 'register', component: Register },
        ],
    },

    // App routes
    {
        path: '/',
        component: AppLayout,
        meta: { requiresAuth: true },
        children: [
            { path: '', redirect: '/dashboard' },
            { path: 'dashboard', name: 'dashboard', component: Dashboard },
            { path: 'my-tasks', name: 'my-tasks', component: MyTasks },
            { path: 'my-requests', name: 'my-requests', component: MyRequests },
            
            // Projects
            { path: 'projects', name: 'projects', component: ProjectList },
            
            // Single Project
            {
                path: 'projects/:projectId',
                component: ProjectLayout,
                children: [
                    { path: '', name: 'project-overview', component: ProjectOverview },
                    { path: 'tasks', name: 'project-tasks', component: ProjectTasks },
                    { path: 'tasks/:taskId', name: 'task-detail', component: TaskDetail },
                    { path: 'board', name: 'project-board', component: ProjectKanban },
                    { path: 'gantt', name: 'project-gantt', component: ProjectGantt },
                    { path: 'questions', name: 'project-questions', component: ProjectQuestions },
                    { path: 'problems', name: 'project-problems', component: ProjectProblems },
                    { path: 'settings', name: 'project-settings', component: ProjectSettings },
                ],
            },
        ],
    },

    // Catch all
    { path: '/:pathMatch(.*)*', redirect: '/dashboard' },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

// Navigation guards
router.beforeEach(async (to, from, next) => {
    const auth = useAuthStore()

    // Check if route requires auth
    if (to.meta.requiresAuth && !auth.isAuthenticated) {
        return next({ name: 'login', query: { redirect: to.fullPath } })
    }

    // Check if route is for guests only
    if (to.meta.guest && auth.isAuthenticated) {
        return next({ name: 'dashboard' })
    }

    next()
})

export default router
```

---

## Vue Components

### TaskCard.vue
```vue
<!-- resources/js/components/tasks/TaskCard.vue -->

<template>
  <div 
    class="card p-4 hover:shadow-md transition-shadow cursor-pointer"
    @click="$emit('click', task)"
  >
    <!-- Header -->
    <div class="flex items-start justify-between gap-2">
      <h3 class="font-medium text-gray-900 line-clamp-2">
        {{ task.title }}
      </h3>
      <TaskChannelIcon :channel="task.source_channel" class="flex-shrink-0" />
    </div>

    <!-- Meta row -->
    <div class="mt-2 flex items-center gap-2 flex-wrap">
      <TaskStateBadge :state="task.state" />
      <TaskPriorityBadge :priority="task.priority" />
    </div>

    <!-- Footer -->
    <div class="mt-3 flex items-center justify-between text-sm">
      <!-- Owner -->
      <div class="flex items-center gap-2">
        <UserAvatar 
          v-if="task.owner" 
          :user="task.owner" 
          size="sm" 
        />
        <span v-if="task.owner" class="text-gray-600">
          {{ task.owner.name }}
        </span>
        <span v-else class="text-gray-400 italic">Unassigned</span>
      </div>

      <!-- Due date -->
      <div 
        v-if="task.due_date" 
        class="flex items-center gap-1"
        :class="task.is_overdue ? 'text-red-600' : 'text-gray-500'"
      >
        <CalendarIcon class="w-4 h-4" />
        <span>{{ task.due_date_formatted }}</span>
      </div>
    </div>

    <!-- AI Suggestion -->
    <div 
      v-if="task.ai_suggestions?.suggested_owner"
      class="mt-3 p-2 bg-blue-50 rounded text-sm text-blue-700"
    >
      <SparklesIcon class="w-4 h-4 inline mr-1" />
      AI suggests: {{ task.ai_suggestions.suggested_owner.user_name }}
    </div>
  </div>
</template>

<script setup>
import { CalendarIcon, SparklesIcon } from '@heroicons/vue/24/outline'
import TaskStateBadge from './TaskStateBadge.vue'
import TaskPriorityBadge from './TaskPriorityBadge.vue'
import TaskChannelIcon from './TaskChannelIcon.vue'
import UserAvatar from '@/components/common/UserAvatar.vue'

defineProps({
  task: {
    type: Object,
    required: true,
  },
})

defineEmits(['click'])
</script>
```

### TaskStateBadge.vue
```vue
<!-- resources/js/components/tasks/TaskStateBadge.vue -->

<template>
  <span 
    class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
    :class="stateClasses"
  >
    {{ label }}
  </span>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  state: {
    type: String,
    required: true,
  },
})

const stateConfig = {
  pending: { label: 'Pending', classes: 'bg-gray-100 text-gray-700' },
  accepted: { label: 'Accepted', classes: 'bg-blue-100 text-blue-700' },
  declined: { label: 'Declined', classes: 'bg-red-100 text-red-700' },
  in_progress: { label: 'In Progress', classes: 'bg-yellow-100 text-yellow-700' },
  completed: { label: 'Completed', classes: 'bg-green-100 text-green-700' },
  cancelled: { label: 'Cancelled', classes: 'bg-gray-100 text-gray-500' },
  overdue: { label: 'Overdue', classes: 'bg-red-100 text-red-700' },
}

const label = computed(() => stateConfig[props.state]?.label || props.state)
const stateClasses = computed(() => stateConfig[props.state]?.classes || 'bg-gray-100 text-gray-700')
</script>
```

### KanbanBoard.vue
```vue
<!-- resources/js/components/kanban/KanbanBoard.vue -->

<template>
  <div class="flex gap-4 overflow-x-auto pb-4 min-h-[600px]">
    <KanbanColumn
      v-for="column in columns"
      :key="column.state"
      :title="column.title"
      :state="column.state"
      :tasks="tasksByState[column.state] || []"
      :color="column.color"
      @task-click="$emit('task-click', $event)"
      @drop="handleDrop"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import KanbanColumn from './KanbanColumn.vue'
import { useTasksStore } from '@/stores/tasks'

const props = defineProps({
  tasks: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['task-click', 'task-move'])
const tasksStore = useTasksStore()

const columns = [
  { state: 'pending', title: 'Pending', color: 'gray' },
  { state: 'accepted', title: 'Accepted', color: 'blue' },
  { state: 'in_progress', title: 'In Progress', color: 'yellow' },
  { state: 'completed', title: 'Completed', color: 'green' },
]

const tasksByState = computed(() => {
  const grouped = {}
  for (const task of props.tasks) {
    const state = task.state
    if (!grouped[state]) {
      grouped[state] = []
    }
    grouped[state].push(task)
  }
  return grouped
})

async function handleDrop({ taskId, toState }) {
  // Determine the action based on state transition
  const actionMap = {
    accepted: 'accept',
    in_progress: 'start',
    completed: 'complete',
  }

  const action = actionMap[toState]
  if (action) {
    emit('task-move', { taskId, action })
  }
}
</script>
```

### KanbanColumn.vue
```vue
<!-- resources/js/components/kanban/KanbanColumn.vue -->

<template>
  <div 
    class="flex-shrink-0 w-80 bg-gray-50 rounded-lg p-3"
    @dragover.prevent
    @drop="handleDrop"
  >
    <!-- Header -->
    <div class="flex items-center justify-between mb-3">
      <h3 class="font-medium text-gray-900">
        {{ title }}
        <span class="ml-2 text-gray-400 text-sm">{{ tasks.length }}</span>
      </h3>
      <div 
        class="w-3 h-3 rounded-full"
        :class="colorClass"
      />
    </div>

    <!-- Tasks -->
    <div class="space-y-2 min-h-[200px]">
      <div
        v-for="task in tasks"
        :key="task.id"
        draggable="true"
        @dragstart="handleDragStart($event, task)"
        @click="$emit('task-click', task)"
      >
        <TaskCard :task="task" />
      </div>

      <!-- Empty state -->
      <div 
        v-if="tasks.length === 0"
        class="text-center py-8 text-gray-400"
      >
        No tasks
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import TaskCard from '@/components/tasks/TaskCard.vue'

const props = defineProps({
  title: String,
  state: String,
  tasks: Array,
  color: String,
})

const emit = defineEmits(['task-click', 'drop'])

const colorClass = computed(() => ({
  gray: 'bg-gray-400',
  blue: 'bg-blue-500',
  yellow: 'bg-yellow-500',
  green: 'bg-green-500',
  red: 'bg-red-500',
}[props.color] || 'bg-gray-400'))

function handleDragStart(event, task) {
  event.dataTransfer.setData('taskId', task.id)
  event.dataTransfer.setData('fromState', task.state)
}

function handleDrop(event) {
  const taskId = event.dataTransfer.getData('taskId')
  const fromState = event.dataTransfer.getData('fromState')
  
  if (fromState !== props.state) {
    emit('drop', { taskId, fromState, toState: props.state })
  }
}
</script>
```

### CreateTaskModal.vue
```vue
<!-- resources/js/components/tasks/CreateTaskModal.vue -->

<template>
  <TransitionRoot appear :show="isOpen" as="template">
    <Dialog as="div" @close="$emit('close')" class="relative z-50">
      <TransitionChild
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black/25" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4">
          <TransitionChild
            enter="duration-300 ease-out"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <DialogPanel class="w-full max-w-lg transform overflow-hidden rounded-xl bg-white p-6 shadow-xl transition-all">
              <DialogTitle class="text-lg font-semibold text-gray-900 mb-4">
                Create New Task
              </DialogTitle>

              <form @submit.prevent="handleSubmit">
                <!-- Title -->
                <div class="mb-4">
                  <label class="label">Title</label>
                  <input
                    v-model="form.title"
                    type="text"
                    class="input"
                    placeholder="What needs to be done?"
                    required
                    autofocus
                  />
                </div>

                <!-- Description -->
                <div class="mb-4">
                  <label class="label">Description</label>
                  <textarea
                    v-model="form.description"
                    class="input"
                    rows="3"
                    placeholder="Add more details..."
                  />
                </div>

                <!-- Owner -->
                <div class="mb-4">
                  <label class="label">Assign to</label>
                  <select v-model="form.owner_id" class="input">
                    <option :value="null">Unassigned (AI will suggest)</option>
                    <option 
                      v-for="member in members" 
                      :key="member.id" 
                      :value="member.id"
                    >
                      {{ member.name }}
                    </option>
                  </select>
                </div>

                <div class="grid grid-cols-2 gap-4 mb-4">
                  <!-- Priority -->
                  <div>
                    <label class="label">Priority</label>
                    <select v-model="form.priority" class="input">
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="critical">Critical</option>
                    </select>
                  </div>

                  <!-- Due Date -->
                  <div>
                    <label class="label">Due Date</label>
                    <input
                      v-model="form.due_date"
                      type="date"
                      class="input"
                      :min="today"
                    />
                  </div>
                </div>

                <!-- Actions -->
                <div class="flex justify-end gap-3 mt-6">
                  <button 
                    type="button" 
                    class="btn btn-secondary"
                    @click="$emit('close')"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    class="btn btn-primary"
                    :disabled="loading"
                  >
                    <LoadingSpinner v-if="loading" class="w-4 h-4 mr-2" />
                    Create Task
                  </button>
                </div>
              </form>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup>
import { ref, computed } from 'vue'
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionRoot,
  TransitionChild,
} from '@headlessui/vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'

const props = defineProps({
  isOpen: Boolean,
  members: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['close', 'submit'])

const loading = ref(false)

const form = ref({
  title: '',
  description: '',
  owner_id: null,
  priority: 'medium',
  due_date: null,
})

const today = computed(() => new Date().toISOString().split('T')[0])

async function handleSubmit() {
  loading.value = true
  
  try {
    emit('submit', { ...form.value })
    
    // Reset form
    form.value = {
      title: '',
      description: '',
      owner_id: null,
      priority: 'medium',
      due_date: null,
    }
  } finally {
    loading.value = false
  }
}
</script>
```

---

## API Service

### resources/js/services/api.js
```javascript
import axios from 'axios'
import { useAuthStore } from '@/stores/auth'
import router from '@/router'

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
})

// Request interceptor - add auth token
api.interceptors.request.use(
  (config) => {
    const auth = useAuthStore()
    if (auth.token) {
      config.headers.Authorization = `Bearer ${auth.token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor - handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const auth = useAuthStore()
      auth.logout()
      router.push({ name: 'login' })
    }
    return Promise.reject(error)
  }
)

export default api

// Typed API helpers
export const authApi = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  logout: () => api.post('/auth/logout'),
  user: () => api.get('/auth/user'),
}

export const projectsApi = {
  list: (params) => api.get('/projects', { params }),
  get: (id) => api.get(`/projects/${id}`),
  create: (data) => api.post('/projects', data),
  update: (id, data) => api.put(`/projects/${id}`, data),
  delete: (id) => api.delete(`/projects/${id}`),
  stats: (id) => api.get(`/projects/${id}/stats`),
}

export const tasksApi = {
  list: (projectId, params) => api.get(`/projects/${projectId}/tasks`, { params }),
  get: (projectId, taskId) => api.get(`/projects/${projectId}/tasks/${taskId}`),
  create: (projectId, data) => api.post(`/projects/${projectId}/tasks`, data),
  update: (projectId, taskId, data) => api.put(`/projects/${projectId}/tasks/${taskId}`, data),
  delete: (projectId, taskId) => api.delete(`/projects/${projectId}/tasks/${taskId}`),
  
  // State transitions
  accept: (projectId, taskId) => api.post(`/projects/${projectId}/tasks/${taskId}/accept`),
  decline: (projectId, taskId, reason) => api.post(`/projects/${projectId}/tasks/${taskId}/decline`, { reason }),
  start: (projectId, taskId) => api.post(`/projects/${projectId}/tasks/${taskId}/start`),
  complete: (projectId, taskId, notes) => api.post(`/projects/${projectId}/tasks/${taskId}/complete`, { notes }),
  cancel: (projectId, taskId, reason) => api.post(`/projects/${projectId}/tasks/${taskId}/cancel`, { reason }),
  
  // Messages
  messages: (projectId, taskId) => api.get(`/projects/${projectId}/tasks/${taskId}/messages`),
  addMessage: (projectId, taskId, content) => api.post(`/projects/${projectId}/tasks/${taskId}/messages`, { content }),
  
  // Cross-project
  myTasks: () => api.get('/my/tasks'),
  myRequests: () => api.get('/my/requests'),
}

export const questionsApi = {
  list: (projectId, params) => api.get(`/projects/${projectId}/questions`, { params }),
  get: (projectId, questionId) => api.get(`/projects/${projectId}/questions/${questionId}`),
  create: (projectId, data) => api.post(`/projects/${projectId}/questions`, data),
  vote: (projectId, questionId, value) => api.post(`/projects/${projectId}/questions/${questionId}/vote`, { value }),
  convert: (projectId, questionId) => api.post(`/projects/${projectId}/questions/${questionId}/convert`),
  addAnswer: (projectId, questionId, body) => api.post(`/projects/${projectId}/questions/${questionId}/answers`, { body }),
  acceptAnswer: (projectId, questionId, answerId) => api.post(`/projects/${projectId}/questions/${questionId}/answers/${answerId}/accept`),
}

export const problemsApi = {
  list: (projectId, params) => api.get(`/projects/${projectId}/problems`, { params }),
  get: (projectId, problemId) => api.get(`/projects/${projectId}/problems/${problemId}`),
  create: (projectId, data) => api.post(`/projects/${projectId}/problems`, data),
  update: (projectId, problemId, data) => api.put(`/projects/${projectId}/problems/${problemId}`, data),
  resolve: (projectId, problemId, resolution) => api.post(`/projects/${projectId}/problems/${problemId}/resolve`, { resolution }),
}
```

---

## WebSocket Service

### resources/js/services/websocket.js
```javascript
import Echo from 'laravel-echo'
import Pusher from 'pusher-js'
import { useAuthStore } from '@/stores/auth'
import { useTasksStore } from '@/stores/tasks'

// Make Pusher available globally (required by Laravel Echo)
window.Pusher = Pusher

let echoInstance = null

export function initializeWebSocket() {
  const auth = useAuthStore()
  
  if (!auth.token) {
    console.warn('Cannot initialize WebSocket without auth token')
    return null
  }

  echoInstance = new Echo({
    broadcaster: 'reverb',
    key: import.meta.env.VITE_REVERB_APP_KEY,
    wsHost: import.meta.env.VITE_REVERB_HOST,
    wsPort: import.meta.env.VITE_REVERB_PORT ?? 8080,
    wssPort: import.meta.env.VITE_REVERB_PORT ?? 443,
    forceTLS: import.meta.env.VITE_REVERB_SCHEME === 'https',
    enabledTransports: ['ws', 'wss'],
    authEndpoint: '/broadcasting/auth',
    auth: {
      headers: {
        Authorization: `Bearer ${auth.token}`,
      },
    },
  })

  return echoInstance
}

export function getEcho() {
  return echoInstance
}

export function subscribeToProject(projectId) {
  const echo = getEcho()
  if (!echo) return null

  const tasksStore = useTasksStore()

  return echo.private(`project.${projectId}`)
    .listen('.task.created', (e) => {
      console.log('Task created:', e.task)
      tasksStore.handleTaskCreated(e.task)
    })
    .listen('.task.state.changed', (e) => {
      console.log('Task state changed:', e)
      tasksStore.handleTaskUpdated({ 
        id: e.task_id, 
        state: e.to_state 
      })
    })
    .listen('.task.updated', (e) => {
      console.log('Task updated:', e.task)
      tasksStore.handleTaskUpdated(e.task)
    })
}

export function subscribeToUser(userId) {
  const echo = getEcho()
  if (!echo) return null

  return echo.private(`user.${userId}`)
    .notification((notification) => {
      console.log('Notification received:', notification)
      // Handle notifications (show toast, update badge, etc.)
    })
}

export function leaveChannel(channelName) {
  const echo = getEcho()
  if (echo) {
    echo.leave(channelName)
  }
}

export function disconnect() {
  const echo = getEcho()
  if (echo) {
    echo.disconnect()
    echoInstance = null
  }
}
```

---

## Auth Store (Complete)

### resources/js/stores/auth.js
```javascript
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authApi } from '@/services/api'
import { initializeWebSocket, disconnect } from '@/services/websocket'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref(null)
  const token = ref(localStorage.getItem('auth_token'))
  const loading = ref(false)
  const error = ref(null)

  // Getters
  const isAuthenticated = computed(() => !!token.value && !!user.value)
  const organization = computed(() => user.value?.organization)

  // Actions
  async function login(credentials) {
    loading.value = true
    error.value = null

    try {
      const response = await authApi.login(credentials)
      setAuth(response.data.user, response.data.token)
      return response.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Login failed'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function register(data) {
    loading.value = true
    error.value = null

    try {
      const response = await authApi.register(data)
      setAuth(response.data.user, response.data.token)
      return response.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Registration failed'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchUser() {
    if (!token.value) return null

    loading.value = true
    error.value = null

    try {
      const response = await authApi.user()
      user.value = response.data.user
      
      // Initialize WebSocket after successful user fetch
      initializeWebSocket()
      
      return response.data.user
    } catch (err) {
      // If unauthorized, clear auth
      if (err.response?.status === 401) {
        clearAuth()
      }
      throw err
    } finally {
      loading.value = false
    }
  }

  async function logout() {
    try {
      await authApi.logout()
    } catch (err) {
      // Continue with local logout even if API fails
      console.error('Logout API error:', err)
    } finally {
      clearAuth()
    }
  }

  function setAuth(userData, tokenValue) {
    user.value = userData
    token.value = tokenValue
    localStorage.setItem('auth_token', tokenValue)
    
    // Initialize WebSocket
    initializeWebSocket()
  }

  function clearAuth() {
    user.value = null
    token.value = null
    localStorage.removeItem('auth_token')
    
    // Disconnect WebSocket
    disconnect()
  }

  return {
    // State
    user,
    token,
    loading,
    error,
    
    // Getters
    isAuthenticated,
    organization,
    
    // Actions
    login,
    register,
    fetchUser,
    logout,
    setAuth,
    clearAuth,
  }
})
```

---

## ✅ API & Frontend Checklist

### API
- [ ] All routes defined
- [ ] AuthController
- [ ] ProjectController
- [ ] TaskController with state transitions
- [ ] QuestionController
- [ ] ProblemController
- [ ] WebhookController
- [ ] All Form Requests
- [ ] All API Resources

### Frontend
- [ ] Router with all routes
- [ ] Auth store
- [ ] Tasks store
- [ ] API service
- [ ] WebSocket service
- [ ] TaskCard component
- [ ] TaskStateBadge component
- [ ] KanbanBoard component
- [ ] KanbanColumn component
- [ ] CreateTaskModal component

---

## Quick Test Commands

```bash
# Test API endpoints
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","password":"password","password_confirmation":"password","organization_name":"Test Org"}'

# Test authenticated endpoint
curl http://localhost:8000/api/dashboard \
  -H "Authorization: Bearer YOUR_TOKEN"

# Test task creation
curl -X POST http://localhost:8000/api/projects/PROJECT_ID/tasks \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Task","priority":"high"}'
```
