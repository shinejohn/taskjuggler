# 4 Projects.ai - Cursor Code Templates

Copy-paste ready code blocks for building 4 Projects.ai.

---

## 🔧 PHP Enums

### TaskState Enum
```php
<?php
// app/Enums/TaskState.php

namespace App\Enums;

enum TaskState: string
{
    case PENDING = 'pending';
    case ACCEPTED = 'accepted';
    case DECLINED = 'declined';
    case IN_PROGRESS = 'in_progress';
    case COMPLETED = 'completed';
    case CANCELLED = 'cancelled';
    case OVERDUE = 'overdue';

    public function label(): string
    {
        return match($this) {
            self::PENDING => 'Pending',
            self::ACCEPTED => 'Accepted',
            self::DECLINED => 'Declined',
            self::IN_PROGRESS => 'In Progress',
            self::COMPLETED => 'Completed',
            self::CANCELLED => 'Cancelled',
            self::OVERDUE => 'Overdue',
        };
    }

    public function color(): string
    {
        return match($this) {
            self::PENDING => 'gray',
            self::ACCEPTED => 'blue',
            self::DECLINED => 'red',
            self::IN_PROGRESS => 'yellow',
            self::COMPLETED => 'green',
            self::CANCELLED => 'gray',
            self::OVERDUE => 'red',
        };
    }

    public function canTransitionTo(): array
    {
        return match($this) {
            self::PENDING => [self::ACCEPTED, self::DECLINED],
            self::ACCEPTED => [self::IN_PROGRESS, self::CANCELLED],
            self::IN_PROGRESS => [self::COMPLETED, self::CANCELLED, self::OVERDUE],
            self::OVERDUE => [self::IN_PROGRESS, self::COMPLETED, self::CANCELLED],
            self::COMPLETED, self::DECLINED, self::CANCELLED => [],
        };
    }

    public function isTerminal(): bool
    {
        return in_array($this, [self::COMPLETED, self::DECLINED, self::CANCELLED]);
    }
}
```

### TaskPriority Enum
```php
<?php
// app/Enums/TaskPriority.php

namespace App\Enums;

enum TaskPriority: string
{
    case LOW = 'low';
    case MEDIUM = 'medium';
    case HIGH = 'high';
    case CRITICAL = 'critical';

    public function label(): string
    {
        return match($this) {
            self::LOW => 'Low',
            self::MEDIUM => 'Medium',
            self::HIGH => 'High',
            self::CRITICAL => 'Critical',
        };
    }

    public function color(): string
    {
        return match($this) {
            self::LOW => 'gray',
            self::MEDIUM => 'blue',
            self::HIGH => 'orange',
            self::CRITICAL => 'red',
        };
    }

    public function sortOrder(): int
    {
        return match($this) {
            self::CRITICAL => 1,
            self::HIGH => 2,
            self::MEDIUM => 3,
            self::LOW => 4,
        };
    }
}
```

### TaskChannel Enum
```php
<?php
// app/Enums/TaskChannel.php

namespace App\Enums;

enum TaskChannel: string
{
    case WEB = 'web';
    case MOBILE = 'mobile';
    case EMAIL = 'email';
    case SMS = 'sms';
    case VOICE = 'voice';
    case SLACK = 'slack';

    public function label(): string
    {
        return match($this) {
            self::WEB => 'Web',
            self::MOBILE => 'Mobile',
            self::EMAIL => 'Email',
            self::SMS => 'SMS',
            self::VOICE => 'Voice',
            self::SLACK => 'Slack',
        };
    }

    public function icon(): string
    {
        return match($this) {
            self::WEB => 'globe-alt',
            self::MOBILE => 'device-phone-mobile',
            self::EMAIL => 'envelope',
            self::SMS => 'chat-bubble-left',
            self::VOICE => 'microphone',
            self::SLACK => 'hashtag',
        };
    }
}
```

### ProblemType Enum
```php
<?php
// app/Enums/ProblemType.php

namespace App\Enums;

enum ProblemType: string
{
    case BUG = 'bug';
    case RISK = 'risk';
    case IMPEDIMENT = 'impediment';
    case DEPENDENCY = 'dependency';

    public function label(): string
    {
        return match($this) {
            self::BUG => 'Bug',
            self::RISK => 'Risk',
            self::IMPEDIMENT => 'Impediment',
            self::DEPENDENCY => 'Dependency',
        };
    }

    public function color(): string
    {
        return match($this) {
            self::BUG => 'red',
            self::RISK => 'orange',
            self::IMPEDIMENT => 'yellow',
            self::DEPENDENCY => 'blue',
        };
    }
}
```

### ProblemSeverity Enum
```php
<?php
// app/Enums/ProblemSeverity.php

namespace App\Enums;

enum ProblemSeverity: string
{
    case LOW = 'low';
    case MEDIUM = 'medium';
    case HIGH = 'high';
    case CRITICAL = 'critical';

    public function label(): string
    {
        return ucfirst($this->value);
    }

    public function color(): string
    {
        return match($this) {
            self::LOW => 'gray',
            self::MEDIUM => 'yellow',
            self::HIGH => 'orange',
            self::CRITICAL => 'red',
        };
    }
}
```

### MemberRole Enum
```php
<?php
// app/Enums/MemberRole.php

namespace App\Enums;

enum MemberRole: string
{
    case OWNER = 'owner';
    case ADMIN = 'admin';
    case MEMBER = 'member';
    case VIEWER = 'viewer';

    public function label(): string
    {
        return ucfirst($this->value);
    }

    public function permissions(): array
    {
        return match($this) {
            self::OWNER => ['*'],
            self::ADMIN => ['create', 'read', 'update', 'delete', 'manage_members'],
            self::MEMBER => ['create', 'read', 'update'],
            self::VIEWER => ['read'],
        };
    }

    public function canManage(): bool
    {
        return in_array($this, [self::OWNER, self::ADMIN]);
    }
}
```

---

## 🔑 UUID Trait

```php
<?php
// app/Models/Concerns/HasUuid.php

namespace App\Models\Concerns;

use Illuminate\Support\Str;

trait HasUuid
{
    public static function bootHasUuid(): void
    {
        static::creating(function ($model) {
            if (empty($model->{$model->getKeyName()})) {
                $model->{$model->getKeyName()} = (string) Str::uuid();
            }
        });
    }

    public function getIncrementing(): bool
    {
        return false;
    }

    public function getKeyType(): string
    {
        return 'string';
    }
}
```

---

## 📦 Complete Task Model

```php
<?php
// app/Models/Task.php

namespace App\Models;

use App\Enums\TaskState;
use App\Enums\TaskPriority;
use App\Enums\TaskChannel;
use App\Models\Concerns\HasUuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Task extends Model
{
    use HasFactory, HasUuid, SoftDeletes;

    protected $fillable = [
        'organization_id',
        'project_id',
        'requestor_id',
        'owner_id',
        'parent_id',
        'title',
        'description',
        'state',
        'source_channel',
        'source_metadata',
        'priority',
        'due_date',
        'started_at',
        'completed_at',
        'estimated_hours',
        'actual_hours',
        'sprint_id',
        'milestone_id',
        'overdue_risk_score',
        'ai_suggestions',
        'extracted_entities',
        'tags',
        'custom_fields',
        'position',
    ];

    protected $casts = [
        'state' => TaskState::class,
        'priority' => TaskPriority::class,
        'source_channel' => TaskChannel::class,
        'source_metadata' => 'array',
        'ai_suggestions' => 'array',
        'extracted_entities' => 'array',
        'tags' => 'array',
        'custom_fields' => 'array',
        'due_date' => 'datetime',
        'started_at' => 'datetime',
        'completed_at' => 'datetime',
        'overdue_risk_score' => 'decimal:2',
        'actual_hours' => 'decimal:2',
    ];

    protected $appends = ['is_overdue'];

    // ==================== RELATIONSHIPS ====================

    public function organization(): BelongsTo
    {
        return $this->belongsTo(Organization::class);
    }

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function requestor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'requestor_id');
    }

    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    public function parent(): BelongsTo
    {
        return $this->belongsTo(Task::class, 'parent_id');
    }

    public function subtasks(): HasMany
    {
        return $this->hasMany(Task::class, 'parent_id');
    }

    public function actions(): HasMany
    {
        return $this->hasMany(TaskAction::class)->orderByDesc('created_at');
    }

    public function messages(): HasMany
    {
        return $this->hasMany(TaskMessage::class)->orderBy('created_at');
    }

    public function dependencies(): HasMany
    {
        return $this->hasMany(TaskDependency::class);
    }

    public function dependents(): HasMany
    {
        return $this->hasMany(TaskDependency::class, 'depends_on_id');
    }

    public function sprint(): BelongsTo
    {
        return $this->belongsTo(Sprint::class);
    }

    public function milestone(): BelongsTo
    {
        return $this->belongsTo(Milestone::class);
    }

    // ==================== SCOPES ====================

    public function scopeForUser($query, User $user)
    {
        return $query->where(function ($q) use ($user) {
            $q->where('owner_id', $user->id)
              ->orWhere('requestor_id', $user->id);
        });
    }

    public function scopeOwnedBy($query, User $user)
    {
        return $query->where('owner_id', $user->id);
    }

    public function scopeRequestedBy($query, User $user)
    {
        return $query->where('requestor_id', $user->id);
    }

    public function scopePending($query)
    {
        return $query->where('state', TaskState::PENDING);
    }

    public function scopeActive($query)
    {
        return $query->whereIn('state', [TaskState::ACCEPTED, TaskState::IN_PROGRESS]);
    }

    public function scopeCompleted($query)
    {
        return $query->where('state', TaskState::COMPLETED);
    }

    public function scopeOverdue($query)
    {
        return $query->where('due_date', '<', now())
            ->whereNotIn('state', [TaskState::COMPLETED, TaskState::CANCELLED]);
    }

    public function scopeByChannel($query, TaskChannel $channel)
    {
        return $query->where('source_channel', $channel);
    }

    public function scopeByPriority($query, TaskPriority $priority)
    {
        return $query->where('priority', $priority);
    }

    public function scopeDueBefore($query, $date)
    {
        return $query->where('due_date', '<=', $date);
    }

    public function scopeDueThisWeek($query)
    {
        return $query->whereBetween('due_date', [now()->startOfWeek(), now()->endOfWeek()]);
    }

    // ==================== ACCESSORS ====================

    public function getIsOverdueAttribute(): bool
    {
        return $this->due_date 
            && $this->due_date->isPast() 
            && !$this->state->isTerminal();
    }

    // ==================== HELPERS ====================

    public function canTransitionTo(TaskState $state): bool
    {
        return in_array($state, $this->state->canTransitionTo());
    }

    public function transitionTo(TaskState $state, ?User $user = null, ?string $comment = null): bool
    {
        if (!$this->canTransitionTo($state)) {
            return false;
        }

        $fromState = $this->state;
        $this->state = $state;

        if ($state === TaskState::IN_PROGRESS && !$this->started_at) {
            $this->started_at = now();
        }

        if ($state === TaskState::COMPLETED) {
            $this->completed_at = now();
        }

        $this->save();

        $this->recordAction('state_changed', $user, [
            'from_state' => $fromState->value,
            'to_state' => $state->value,
            'comment' => $comment,
        ]);

        return true;
    }

    public function recordAction(string $type, ?User $user = null, array $data = []): TaskAction
    {
        return $this->actions()->create([
            'user_id' => $user?->id,
            'action_type' => $type,
            'from_state' => $data['from_state'] ?? null,
            'to_state' => $data['to_state'] ?? null,
            'changes' => $data['changes'] ?? null,
            'comment' => $data['comment'] ?? null,
            'channel' => $data['channel'] ?? null,
        ]);
    }

    public function addMessage(User $user, string $content, string $channel = 'web'): TaskMessage
    {
        $message = $this->messages()->create([
            'user_id' => $user->id,
            'content' => $content,
            'channel' => $channel,
            'mentions' => $this->extractMentions($content),
        ]);

        $this->recordAction('commented', $user, ['channel' => $channel]);

        return $message;
    }

    protected function extractMentions(string $content): array
    {
        preg_match_all('/@(\w+)/', $content, $matches);
        return $matches[1] ?? [];
    }

    public function toTEF(): array
    {
        return [
            'tef_version' => '1.0',
            'id' => $this->id,
            'title' => $this->title,
            'description' => $this->description,
            'state' => $this->state->value,
            'priority' => $this->priority->value,
            'requestor' => [
                'id' => $this->requestor_id,
                'name' => $this->requestor?->name,
                'email' => $this->requestor?->email,
            ],
            'owner' => $this->owner ? [
                'id' => $this->owner_id,
                'name' => $this->owner->name,
                'email' => $this->owner->email,
            ] : null,
            'source_channel' => $this->source_channel->value,
            'due_date' => $this->due_date?->toIso8601String(),
            'created_at' => $this->created_at->toIso8601String(),
            'updated_at' => $this->updated_at->toIso8601String(),
            'tags' => $this->tags,
            'custom_fields' => $this->custom_fields,
            'actions' => $this->actions->map(fn($a) => [
                'type' => $a->action_type,
                'user' => $a->user?->name,
                'from_state' => $a->from_state,
                'to_state' => $a->to_state,
                'comment' => $a->comment,
                'timestamp' => $a->created_at->toIso8601String(),
            ])->toArray(),
            'messages' => $this->messages->map(fn($m) => [
                'author' => $m->user->name,
                'content' => $m->content,
                'timestamp' => $m->created_at->toIso8601String(),
            ])->toArray(),
        ];
    }
}
```

---

## 🤖 OpenRouter AI Service

```php
<?php
// app/Services/AI/OpenRouterService.php

namespace App\Services\AI;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Exception;

class OpenRouterService
{
    protected string $apiKey;
    protected string $baseUrl;
    protected string $defaultModel;

    public function __construct()
    {
        $this->apiKey = config('services.openrouter.api_key');
        $this->baseUrl = config('services.openrouter.base_url', 'https://openrouter.ai/api/v1');
        $this->defaultModel = config('services.openrouter.default_model', 'anthropic/claude-3.5-sonnet');
    }

    /**
     * Send a chat completion request
     */
    public function chat(array $messages, ?string $model = null, array $options = []): array
    {
        $response = Http::withHeaders([
            'Authorization' => "Bearer {$this->apiKey}",
            'HTTP-Referer' => config('app.url'),
            'X-Title' => config('app.name'),
            'Content-Type' => 'application/json',
        ])->timeout(60)->post("{$this->baseUrl}/chat/completions", [
            'model' => $model ?? $this->defaultModel,
            'messages' => $messages,
            'temperature' => $options['temperature'] ?? 0.7,
            'max_tokens' => $options['max_tokens'] ?? 1000,
        ]);

        if ($response->failed()) {
            Log::error('OpenRouter API error', [
                'status' => $response->status(),
                'body' => $response->body(),
            ]);
            throw new Exception('OpenRouter API error: ' . $response->body());
        }

        return $response->json();
    }

    /**
     * Simple completion with single prompt
     */
    public function complete(string $prompt, ?string $model = null, array $options = []): string
    {
        $response = $this->chat([
            ['role' => 'user', 'content' => $prompt]
        ], $model, $options);

        return $response['choices'][0]['message']['content'] ?? '';
    }

    /**
     * Extract JSON from AI response
     */
    public function extractJson(string $prompt, ?string $model = null): ?array
    {
        $systemPrompt = "You are a helpful assistant that always responds with valid JSON. Do not include markdown code blocks, just raw JSON.";
        
        $response = $this->chat([
            ['role' => 'system', 'content' => $systemPrompt],
            ['role' => 'user', 'content' => $prompt]
        ], $model, [
            'temperature' => 0.3,
        ]);

        $content = $response['choices'][0]['message']['content'] ?? '';

        // Try to extract JSON from response
        $content = preg_replace('/```json\s*|\s*```/', '', $content);
        
        if (preg_match('/\{[\s\S]*\}/', $content, $matches)) {
            $decoded = json_decode($matches[0], true);
            if (json_last_error() === JSON_ERROR_NONE) {
                return $decoded;
            }
        }

        Log::warning('Failed to extract JSON from AI response', [
            'content' => $content,
        ]);

        return null;
    }

    /**
     * Get available models
     */
    public function getModels(): array
    {
        $response = Http::withHeaders([
            'Authorization' => "Bearer {$this->apiKey}",
        ])->get("{$this->baseUrl}/models");

        return $response->json()['data'] ?? [];
    }
}
```

---

## 🎨 Vue 3 App Entry Point

```javascript
// resources/js/app.js

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'

// Styles
import '../css/app.css'

// Bootstrap (Echo, Axios)
import './bootstrap'

// Create Vue app
const app = createApp(App)

// Use plugins
app.use(createPinia())
app.use(router)

// Global error handler
app.config.errorHandler = (err, instance, info) => {
    console.error('Vue Error:', err)
    console.error('Component:', instance)
    console.error('Info:', info)
}

// Mount
app.mount('#app')
```

### App.vue
```vue
<!-- resources/js/App.vue -->

<template>
  <RouterView />
</template>

<script setup>
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()

onMounted(async () => {
  if (auth.token) {
    await auth.fetchUser()
  }
})
</script>
```

---

## 📝 TypeScript Types (JSDoc)

```javascript
// resources/js/types/index.js

/**
 * @typedef {Object} User
 * @property {string} id
 * @property {string} name
 * @property {string} email
 * @property {string} [avatar]
 * @property {string} [phone]
 * @property {string} timezone
 * @property {string} organization_id
 */

/**
 * @typedef {Object} Organization
 * @property {string} id
 * @property {string} name
 * @property {string} slug
 * @property {'free'|'team'|'business'|'enterprise'} plan
 */

/**
 * @typedef {Object} Project
 * @property {string} id
 * @property {string} organization_id
 * @property {string} owner_id
 * @property {string} name
 * @property {string} [code]
 * @property {string} [description]
 * @property {'agile'|'waterfall'|'hybrid'} methodology
 * @property {'planning'|'active'|'on_hold'|'completed'|'archived'} status
 * @property {string} [start_date]
 * @property {string} [target_end_date]
 * @property {number} [health_score]
 * @property {User} owner
 */

/**
 * @typedef {'pending'|'accepted'|'declined'|'in_progress'|'completed'|'cancelled'|'overdue'} TaskState
 */

/**
 * @typedef {'low'|'medium'|'high'|'critical'} TaskPriority
 */

/**
 * @typedef {'web'|'mobile'|'email'|'sms'|'voice'|'slack'} TaskChannel
 */

/**
 * @typedef {Object} Task
 * @property {string} id
 * @property {string} organization_id
 * @property {string} project_id
 * @property {string} requestor_id
 * @property {string} [owner_id]
 * @property {string} [parent_id]
 * @property {string} title
 * @property {string} [description]
 * @property {TaskState} state
 * @property {TaskChannel} source_channel
 * @property {TaskPriority} priority
 * @property {string} [due_date]
 * @property {string} [started_at]
 * @property {string} [completed_at]
 * @property {number} [estimated_hours]
 * @property {number} actual_hours
 * @property {number} [overdue_risk_score]
 * @property {Object} [ai_suggestions]
 * @property {string[]} [tags]
 * @property {boolean} is_overdue
 * @property {User} requestor
 * @property {User} [owner]
 * @property {Project} project
 * @property {TaskAction[]} [actions]
 * @property {TaskMessage[]} [messages]
 */

/**
 * @typedef {Object} TaskAction
 * @property {string} id
 * @property {string} task_id
 * @property {string} [user_id]
 * @property {string} action_type
 * @property {string} [from_state]
 * @property {string} [to_state]
 * @property {string} [comment]
 * @property {string} created_at
 * @property {User} [user]
 */

/**
 * @typedef {Object} TaskMessage
 * @property {string} id
 * @property {string} task_id
 * @property {string} user_id
 * @property {string} content
 * @property {string} channel
 * @property {string} created_at
 * @property {User} user
 */

/**
 * @typedef {Object} Question
 * @property {string} id
 * @property {string} project_id
 * @property {string} author_id
 * @property {string} title
 * @property {string} body
 * @property {'open'|'answered'|'resolved'|'closed'} status
 * @property {string} priority
 * @property {number} vote_count
 * @property {number} view_count
 * @property {User} author
 * @property {Answer[]} [answers]
 */

/**
 * @typedef {Object} Answer
 * @property {string} id
 * @property {string} question_id
 * @property {string} author_id
 * @property {string} body
 * @property {number} vote_count
 * @property {boolean} is_ai_suggested
 * @property {User} author
 */

/**
 * @typedef {Object} Problem
 * @property {string} id
 * @property {string} project_id
 * @property {string} reporter_id
 * @property {string} [assignee_id]
 * @property {string} title
 * @property {string} [description]
 * @property {'bug'|'risk'|'impediment'|'dependency'} type
 * @property {'low'|'medium'|'high'|'critical'} severity
 * @property {'open'|'investigating'|'resolved'|'closed'|'wont_fix'} status
 * @property {User} reporter
 * @property {User} [assignee]
 */

export {}
```

---

## 🏪 Pinia Task Store

```javascript
// resources/js/stores/tasks.js

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/services/api'

export const useTasksStore = defineStore('tasks', () => {
    // ==================== STATE ====================
    
    const tasks = ref([])
    const currentTask = ref(null)
    const loading = ref(false)
    const error = ref(null)
    
    const filters = ref({
        state: null,
        priority: null,
        owner_id: null,
        search: '',
    })
    
    const pagination = ref({
        currentPage: 1,
        lastPage: 1,
        perPage: 25,
        total: 0,
    })

    // ==================== GETTERS ====================
    
    const pendingTasks = computed(() => 
        tasks.value.filter(t => t.state === 'pending')
    )
    
    const activeTasks = computed(() => 
        tasks.value.filter(t => ['accepted', 'in_progress'].includes(t.state))
    )
    
    const completedTasks = computed(() => 
        tasks.value.filter(t => t.state === 'completed')
    )
    
    const overdueTasks = computed(() => 
        tasks.value.filter(t => t.is_overdue)
    )
    
    const tasksByState = computed(() => {
        const grouped = {}
        for (const task of tasks.value) {
            if (!grouped[task.state]) {
                grouped[task.state] = []
            }
            grouped[task.state].push(task)
        }
        return grouped
    })

    // ==================== ACTIONS ====================
    
    async function fetchTasks(projectId, params = {}) {
        loading.value = true
        error.value = null
        
        try {
            const response = await api.get(`/projects/${projectId}/tasks`, {
                params: { ...filters.value, ...params }
            })
            
            tasks.value = response.data.data
            
            if (response.data.meta) {
                pagination.value = {
                    currentPage: response.data.meta.current_page,
                    lastPage: response.data.meta.last_page,
                    perPage: response.data.meta.per_page,
                    total: response.data.meta.total,
                }
            }
        } catch (err) {
            error.value = err.response?.data?.message || 'Failed to fetch tasks'
            throw err
        } finally {
            loading.value = false
        }
    }
    
    async function fetchTask(projectId, taskId) {
        loading.value = true
        error.value = null
        
        try {
            const response = await api.get(`/projects/${projectId}/tasks/${taskId}`)
            currentTask.value = response.data.data
            return response.data.data
        } catch (err) {
            error.value = err.response?.data?.message || 'Failed to fetch task'
            throw err
        } finally {
            loading.value = false
        }
    }
    
    async function createTask(projectId, data) {
        loading.value = true
        error.value = null
        
        try {
            const response = await api.post(`/projects/${projectId}/tasks`, data)
            const newTask = response.data.data
            tasks.value.unshift(newTask)
            return newTask
        } catch (err) {
            error.value = err.response?.data?.message || 'Failed to create task'
            throw err
        } finally {
            loading.value = false
        }
    }
    
    async function updateTask(projectId, taskId, data) {
        loading.value = true
        error.value = null
        
        try {
            const response = await api.put(`/projects/${projectId}/tasks/${taskId}`, data)
            const updatedTask = response.data.data
            
            // Update in list
            const index = tasks.value.findIndex(t => t.id === taskId)
            if (index !== -1) {
                tasks.value[index] = updatedTask
            }
            
            // Update current if viewing
            if (currentTask.value?.id === taskId) {
                currentTask.value = updatedTask
            }
            
            return updatedTask
        } catch (err) {
            error.value = err.response?.data?.message || 'Failed to update task'
            throw err
        } finally {
            loading.value = false
        }
    }
    
    async function deleteTask(projectId, taskId) {
        loading.value = true
        error.value = null
        
        try {
            await api.delete(`/projects/${projectId}/tasks/${taskId}`)
            tasks.value = tasks.value.filter(t => t.id !== taskId)
            
            if (currentTask.value?.id === taskId) {
                currentTask.value = null
            }
        } catch (err) {
            error.value = err.response?.data?.message || 'Failed to delete task'
            throw err
        } finally {
            loading.value = false
        }
    }
    
    /**
     * Transition task to new state
     * @param {string} projectId 
     * @param {string} taskId 
     * @param {'accept'|'decline'|'start'|'complete'|'cancel'} action 
     * @param {Object} data - Additional data (e.g., reason for decline)
     */
    async function transitionTask(projectId, taskId, action, data = {}) {
        loading.value = true
        error.value = null
        
        try {
            const response = await api.post(
                `/projects/${projectId}/tasks/${taskId}/${action}`,
                data
            )
            const updatedTask = response.data.data
            
            // Update in list
            const index = tasks.value.findIndex(t => t.id === taskId)
            if (index !== -1) {
                tasks.value[index] = updatedTask
            }
            
            // Update current if viewing
            if (currentTask.value?.id === taskId) {
                currentTask.value = updatedTask
            }
            
            return updatedTask
        } catch (err) {
            error.value = err.response?.data?.message || `Failed to ${action} task`
            throw err
        } finally {
            loading.value = false
        }
    }
    
    async function addMessage(projectId, taskId, content) {
        try {
            await api.post(`/projects/${projectId}/tasks/${taskId}/messages`, { content })
            // Refetch task to get updated messages
            await fetchTask(projectId, taskId)
        } catch (err) {
            error.value = err.response?.data?.message || 'Failed to add message'
            throw err
        }
    }
    
    // ==================== FILTER HELPERS ====================
    
    function setFilter(key, value) {
        filters.value[key] = value
    }
    
    function clearFilters() {
        filters.value = {
            state: null,
            priority: null,
            owner_id: null,
            search: '',
        }
    }
    
    function reset() {
        tasks.value = []
        currentTask.value = null
        error.value = null
        clearFilters()
    }
    
    // ==================== REAL-TIME HANDLERS ====================
    
    function handleTaskCreated(task) {
        if (!tasks.value.find(t => t.id === task.id)) {
            tasks.value.unshift(task)
        }
    }
    
    function handleTaskUpdated(updatedTask) {
        const index = tasks.value.findIndex(t => t.id === updatedTask.id)
        if (index !== -1) {
            tasks.value[index] = updatedTask
        }
        if (currentTask.value?.id === updatedTask.id) {
            currentTask.value = updatedTask
        }
    }
    
    function handleTaskDeleted(taskId) {
        tasks.value = tasks.value.filter(t => t.id !== taskId)
        if (currentTask.value?.id === taskId) {
            currentTask.value = null
        }
    }

    return {
        // State
        tasks,
        currentTask,
        loading,
        error,
        filters,
        pagination,
        
        // Getters
        pendingTasks,
        activeTasks,
        completedTasks,
        overdueTasks,
        tasksByState,
        
        // Actions
        fetchTasks,
        fetchTask,
        createTask,
        updateTask,
        deleteTask,
        transitionTask,
        addMessage,
        
        // Helpers
        setFilter,
        clearFilters,
        reset,
        
        // Real-time handlers
        handleTaskCreated,
        handleTaskUpdated,
        handleTaskDeleted,
    }
})
```

---

## 🚀 Railway Deployment Files

### nixpacks.toml
```toml
[phases.setup]
nixPkgs = ["php83", "php83Extensions.pdo_pgsql", "php83Extensions.redis", "php83Extensions.pcntl", "nodejs_20", "npm"]

[phases.install]
cmds = [
    "composer install --no-dev --optimize-autoloader",
    "npm ci",
    "npm run build"
]

[phases.build]
cmds = [
    "php artisan config:cache",
    "php artisan route:cache",
    "php artisan view:cache"
]

[start]
cmd = "php artisan migrate --force && php artisan serve --host=0.0.0.0 --port=$PORT"
```

### Procfile
```
web: php artisan serve --host=0.0.0.0 --port=$PORT
worker: php artisan horizon
```

### railway.json
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "numReplicas": 1,
    "startCommand": "php artisan config:cache && php artisan route:cache && php artisan migrate --force && php artisan serve --host=0.0.0.0 --port=$PORT",
    "healthcheckPath": "/api/health",
    "healthcheckTimeout": 100,
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

---

## 🔄 Cursor Prompt Snippets

Use these prompts when asking Cursor to generate specific parts:

### Generate Migration
```
Generate a Laravel migration for the tasks table based on the schema in CURSOR_MASTER_INSTRUCTIONS.md. Use UUID primary keys.
```

### Generate Model
```
Generate the Task Eloquent model with all relationships, scopes, and methods. Reference the complete model in CURSOR_CODE_TEMPLATES.md.
```

### Generate Controller
```
Generate a Laravel API controller for Tasks with these endpoints:
- index (list with filters)
- store (create)
- show (single)
- update
- destroy
- accept, decline, start, complete, cancel (state transitions)
- addMessage

Use Form Requests and API Resources.
```

### Generate Vue Component
```
Generate a Vue 3 TaskCard component using Composition API with <script setup>.
Display: title, state badge, priority badge, channel icon, due date, owner avatar.
Use Tailwind CSS. Support click event.
```

### Generate Service
```
Generate the TaskJugglerService that handles:
- Creating tasks from any channel
- NLP extraction for email/SMS/voice
- AI owner suggestion
- Recording audit actions
- Broadcasting real-time events
```

### Generate Tests
```
Generate Laravel feature tests for the Task API including:
- Create task
- Update task
- State transitions (valid and invalid)
- Audit trail verification
- Authorization checks
```
