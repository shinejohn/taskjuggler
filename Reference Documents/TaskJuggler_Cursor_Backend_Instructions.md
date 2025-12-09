# Task Juggler - Laravel Backend
## Complete Cursor Instructions

---

## Project Overview

You are building the backend for Task Juggler, a task management platform with:
- AI Receptionist (receives calls, emails, SMS and creates tasks)
- Deterministic routing rules (user-defined, no AI judgment)
- Marketplace with human vendors AND AI tools

**Stack:**
- Laravel 11
- PostgreSQL 16
- Redis (queues, cache)
- Twilio (voice, SMS)
- SendGrid (email)
- OpenRouter (AI)
- Stripe Connect (payments)

**Deployment:** Railway

---

## Initial Setup

### Create Laravel Project

```bash
composer create-project laravel/laravel taskjuggler-api
cd taskjuggler-api
```

### Install Required Packages

```bash
# Core
composer require laravel/sanctum
composer require twilio/sdk
composer require sendgrid/sendgrid
composer require stripe/stripe-php
composer require openai-php/laravel
composer require laravel/horizon
composer require pusher/pusher-php-server

# Development
composer require --dev laravel/pint
composer require --dev pestphp/pest
```

### Configure Database

```bash
# .env
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=taskjuggler
DB_USERNAME=postgres
DB_PASSWORD=password
```

---

## Directory Structure

Create this structure:

```
app/
├── Http/
│   ├── Controllers/
│   │   ├── Api/
│   │   │   ├── AuthController.php
│   │   │   ├── TaskController.php
│   │   │   ├── InboxController.php
│   │   │   ├── RoutingRuleController.php
│   │   │   ├── TeamController.php
│   │   │   ├── ContactListController.php
│   │   │   ├── ChannelController.php
│   │   │   └── Marketplace/
│   │   │       ├── ListingController.php
│   │   │       ├── VendorController.php
│   │   │       └── BidController.php
│   │   └── Webhooks/
│   │       ├── TwilioController.php
│   │       ├── SendGridController.php
│   │       ├── StripeController.php
│   │       └── AiToolController.php
│   ├── Middleware/
│   │   ├── ValidateTwilioSignature.php
│   │   └── ValidateSendGridSignature.php
│   └── Requests/
│       ├── Task/
│       ├── RoutingRule/
│       └── Marketplace/
│
├── Jobs/
│   ├── ProcessVoicemail.php
│   ├── ProcessEmail.php
│   ├── ProcessSms.php
│   ├── ExtractTaskData.php
│   ├── RouteTask.php
│   ├── ExecuteAiTool.php
│   ├── SendNotification.php
│   └── SendAutoResponse.php
│
├── Models/
│   ├── User.php
│   ├── Task.php
│   ├── InboxItem.php
│   ├── RoutingRule.php
│   ├── TeamMember.php
│   ├── ContactList.php
│   ├── ContactListMember.php
│   ├── AssistantChannel.php
│   ├── MarketplaceVendor.php
│   ├── AiToolConfig.php
│   ├── MarketplaceListing.php
│   ├── MarketplaceBid.php
│   ├── AiToolExecution.php
│   ├── Notification.php
│   └── Transaction.php
│
├── Services/
│   ├── AI/
│   │   ├── OpenRouterService.php
│   │   └── TaskExtractor.php
│   ├── Routing/
│   │   ├── RuleEngine.php
│   │   └── ConditionEvaluator.php
│   ├── Twilio/
│   │   ├── VoiceService.php
│   │   └── SmsService.php
│   ├── SendGrid/
│   │   └── EmailService.php
│   ├── Marketplace/
│   │   ├── VendorMatcher.php
│   │   └── AiToolExecutor.php
│   └── Notifications/
│       └── NotificationService.php
│
├── Events/
│   ├── TaskCreated.php
│   ├── TaskAssigned.php
│   ├── TaskCompleted.php
│   ├── InboxItemReceived.php
│   └── AiToolCompleted.php
│
└── Listeners/
    ├── SendTaskNotification.php
    └── UpdateTaskStats.php

database/
├── migrations/
│   ├── 2024_01_01_000001_create_users_table.php
│   ├── 2024_01_01_000002_create_assistant_channels_table.php
│   ├── 2024_01_01_000003_create_team_members_table.php
│   ├── 2024_01_01_000004_create_contact_lists_table.php
│   ├── 2024_01_01_000005_create_routing_rules_table.php
│   ├── 2024_01_01_000006_create_marketplace_vendors_table.php
│   ├── 2024_01_01_000007_create_ai_tool_configs_table.php
│   ├── 2024_01_01_000008_create_tasks_table.php
│   ├── 2024_01_01_000009_create_inbox_items_table.php
│   ├── 2024_01_01_000010_create_marketplace_listings_table.php
│   ├── 2024_01_01_000011_create_marketplace_bids_table.php
│   ├── 2024_01_01_000012_create_ai_tool_executions_table.php
│   ├── 2024_01_01_000013_create_notifications_table.php
│   └── 2024_01_01_000014_create_transactions_table.php
└── seeders/
    ├── DatabaseSeeder.php
    ├── CategorySeeder.php
    └── AiToolSeeder.php

routes/
├── api.php
├── webhooks.php
└── channels.php
```

---

## Models

### User Model

```php
<?php
// app/Models/User.php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasUuids;

    protected $fillable = [
        'email',
        'password',
        'name',
        'phone',
        'timezone',
        'plan',
        'plan_expires_at',
        'stripe_customer_id',
        'settings',
    ];

    protected $hidden = ['password'];

    protected $casts = [
        'settings' => 'array',
        'plan_expires_at' => 'datetime',
    ];

    // Relationships
    public function tasks()
    {
        return $this->hasMany(Task::class, 'requestor_id');
    }

    public function assignedTasks()
    {
        return $this->hasMany(Task::class, 'owner_id');
    }

    public function teamMembers()
    {
        return $this->hasMany(TeamMember::class, 'owner_id');
    }

    public function routingRules()
    {
        return $this->hasMany(RoutingRule::class)->orderBy('priority');
    }

    public function contactLists()
    {
        return $this->hasMany(ContactList::class);
    }

    public function assistantChannels()
    {
        return $this->hasMany(AssistantChannel::class);
    }

    public function inboxItems()
    {
        return $this->hasMany(InboxItem::class);
    }

    // Helpers
    public function getPhoneChannel(): ?AssistantChannel
    {
        return $this->assistantChannels()
            ->where('channel_type', 'phone')
            ->where('is_active', true)
            ->first();
    }

    public function getEmailChannel(): ?AssistantChannel
    {
        return $this->assistantChannels()
            ->where('channel_type', 'email')
            ->where('is_active', true)
            ->first();
    }

    public function isPro(): bool
    {
        return in_array($this->plan, ['pro', 'business']);
    }
}
```

### Task Model

```php
<?php
// app/Models/Task.php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    use HasUuids;

    protected $fillable = [
        'title',
        'description',
        'status',
        'priority',
        'requestor_id',
        'owner_id',
        'team_member_id',
        'marketplace_vendor_id',
        'source_type',
        'source_channel_id',
        'extracted_data',
        'routing_rule_id',
        'contact_name',
        'contact_phone',
        'contact_email',
        'location_address',
        'location_unit',
        'location_city',
        'location_state',
        'location_zip',
        'due_date',
        'start_date',
        'completed_at',
        'marketplace_listing_id',
        'deliverables',
        'tags',
        'metadata',
    ];

    protected $casts = [
        'extracted_data' => 'array',
        'deliverables' => 'array',
        'tags' => 'array',
        'metadata' => 'array',
        'due_date' => 'datetime',
        'start_date' => 'datetime',
        'completed_at' => 'datetime',
    ];

    // Statuses
    const STATUS_PENDING = 'pending';
    const STATUS_ACCEPTED = 'accepted';
    const STATUS_IN_PROGRESS = 'in_progress';
    const STATUS_COMPLETED = 'completed';
    const STATUS_CANCELLED = 'cancelled';

    // Priorities
    const PRIORITY_LOW = 'low';
    const PRIORITY_NORMAL = 'normal';
    const PRIORITY_HIGH = 'high';
    const PRIORITY_URGENT = 'urgent';

    // Relationships
    public function requestor()
    {
        return $this->belongsTo(User::class, 'requestor_id');
    }

    public function owner()
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    public function teamMember()
    {
        return $this->belongsTo(TeamMember::class);
    }

    public function marketplaceVendor()
    {
        return $this->belongsTo(MarketplaceVendor::class);
    }

    public function routingRule()
    {
        return $this->belongsTo(RoutingRule::class);
    }

    public function sourceChannel()
    {
        return $this->belongsTo(AssistantChannel::class, 'source_channel_id');
    }

    public function marketplaceListing()
    {
        return $this->hasOne(MarketplaceListing::class);
    }

    public function aiExecutions()
    {
        return $this->hasMany(AiToolExecution::class);
    }

    // Scopes
    public function scopeForUser($query, User $user)
    {
        return $query->where('requestor_id', $user->id)
            ->orWhere('owner_id', $user->id);
    }

    public function scopeStatus($query, string $status)
    {
        return $query->where('status', $status);
    }

    public function scopePending($query)
    {
        return $query->where('status', self::STATUS_PENDING);
    }

    // Methods
    public function markCompleted(): void
    {
        $this->update([
            'status' => self::STATUS_COMPLETED,
            'completed_at' => now(),
        ]);
    }

    public function assignTo(User|TeamMember|MarketplaceVendor $assignee): void
    {
        if ($assignee instanceof User) {
            $this->update(['owner_id' => $assignee->id]);
        } elseif ($assignee instanceof TeamMember) {
            $this->update(['team_member_id' => $assignee->id]);
        } elseif ($assignee instanceof MarketplaceVendor) {
            $this->update(['marketplace_vendor_id' => $assignee->id]);
        }

        $this->update(['status' => self::STATUS_ACCEPTED]);
    }

    public function addDeliverable(string $url, string $type, array $metadata = []): void
    {
        $deliverables = $this->deliverables ?? [];
        $deliverables[] = [
            'url' => $url,
            'type' => $type,
            'metadata' => $metadata,
            'added_at' => now()->toIso8601String(),
        ];
        $this->update(['deliverables' => $deliverables]);
    }
}
```

### RoutingRule Model

```php
<?php
// app/Models/RoutingRule.php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class RoutingRule extends Model
{
    use HasUuids;

    protected $fillable = [
        'user_id',
        'name',
        'description',
        'priority',
        'is_active',
        'conditions',
        'actions',
        'times_matched',
        'last_matched_at',
    ];

    protected $casts = [
        'conditions' => 'array',
        'actions' => 'array',
        'is_active' => 'boolean',
        'last_matched_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function tasks()
    {
        return $this->hasMany(Task::class);
    }

    public function incrementMatches(): void
    {
        $this->increment('times_matched');
        $this->update(['last_matched_at' => now()]);
    }

    // Example conditions structure:
    // {
    //   "match_type": "all",
    //   "rules": [
    //     {"field": "category", "operator": "in", "value": ["maintenance", "repair"]},
    //     {"field": "keywords", "operator": "contains_any", "value": ["urgent", "emergency"]}
    //   ]
    // }

    // Example actions structure:
    // {
    //   "create_task": true,
    //   "requestor": "owner",
    //   "assignee_type": "team_member",
    //   "assignee_id": "uuid",
    //   "priority": "high",
    //   "notifications": [
    //     {"type": "immediate", "recipient": "assignee"},
    //     {"type": "digest", "recipient": "owner"}
    //   ],
    //   "auto_response": "Thanks! We'll contact you within 24 hours.",
    //   "tags": ["maintenance", "tenant-request"]
    // }
}
```

### MarketplaceVendor Model

```php
<?php
// app/Models/MarketplaceVendor.php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class MarketplaceVendor extends Model
{
    use HasUuids;

    protected $fillable = [
        'vendor_type',
        'user_id',
        'business_name',
        'ai_provider',
        'ai_config',
        'name',
        'description',
        'logo_url',
        'categories',
        'services',
        'service_area',
        'address',
        'pricing_model',
        'base_rate',
        'currency',
        'is_active',
        'is_verified',
        'total_jobs',
        'completed_jobs',
        'average_rating',
        'stripe_account_id',
    ];

    protected $casts = [
        'ai_config' => 'array',
        'categories' => 'array',
        'services' => 'array',
        'is_active' => 'boolean',
        'is_verified' => 'boolean',
        'base_rate' => 'decimal:2',
        'average_rating' => 'decimal:2',
    ];

    const TYPE_HUMAN = 'human';
    const TYPE_AI = 'ai';
    const TYPE_HYBRID = 'hybrid';

    const PROVIDER_INTERNAL = 'internal';
    const PROVIDER_BOTJOB = 'botjob';
    const PROVIDER_ALPHASITE = 'alphasite';
    const PROVIDER_FOURPROJECTS = 'fourprojects';
    const PROVIDER_EXTERNAL = 'external';

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function aiToolConfig()
    {
        return $this->hasOne(AiToolConfig::class, 'vendor_id');
    }

    public function tasks()
    {
        return $this->hasMany(Task::class);
    }

    public function listings()
    {
        return $this->hasMany(MarketplaceListing::class, 'assigned_vendor_id');
    }

    public function bids()
    {
        return $this->hasMany(MarketplaceBid::class, 'vendor_id');
    }

    public function executions()
    {
        return $this->hasMany(AiToolExecution::class, 'vendor_id');
    }

    // Scopes
    public function scopeHuman($query)
    {
        return $query->where('vendor_type', self::TYPE_HUMAN);
    }

    public function scopeAi($query)
    {
        return $query->where('vendor_type', self::TYPE_AI);
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeInCategory($query, string $category)
    {
        return $query->whereJsonContains('categories', $category);
    }

    // Methods
    public function isAi(): bool
    {
        return $this->vendor_type === self::TYPE_AI;
    }

    public function isHuman(): bool
    {
        return $this->vendor_type === self::TYPE_HUMAN;
    }

    public function canAutoExecute(): bool
    {
        return $this->isAi() && $this->aiToolConfig?->auto_execute;
    }
}
```

### AiToolConfig Model

```php
<?php
// app/Models/AiToolConfig.php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class AiToolConfig extends Model
{
    use HasUuids;

    protected $fillable = [
        'vendor_id',
        'provider',
        'model',
        'api_endpoint',
        'api_key_encrypted',
        'input_schema',
        'output_schema',
        'prompt_template',
        'max_execution_time',
        'max_tokens',
        'retry_count',
        'auto_execute',
        'requires_approval',
    ];

    protected $casts = [
        'input_schema' => 'array',
        'output_schema' => 'array',
        'auto_execute' => 'boolean',
        'requires_approval' => 'boolean',
    ];

    protected $hidden = ['api_key_encrypted'];

    public function vendor()
    {
        return $this->belongsTo(MarketplaceVendor::class, 'vendor_id');
    }

    public function getApiKeyAttribute(): ?string
    {
        if (!$this->api_key_encrypted) {
            return null;
        }
        return decrypt($this->api_key_encrypted);
    }

    public function setApiKeyAttribute(?string $value): void
    {
        $this->attributes['api_key_encrypted'] = $value ? encrypt($value) : null;
    }
}
```

### InboxItem Model

```php
<?php
// app/Models/InboxItem.php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class InboxItem extends Model
{
    use HasUuids;

    protected $fillable = [
        'user_id',
        'source_type',
        'source_id',
        'channel_id',
        'from_identifier',
        'from_name',
        'subject',
        'body',
        'attachments',
        'extracted_data',
        'processing_status',
        'processing_error',
        'routed_to_task_id',
        'routing_rule_id',
        'auto_response_sent',
        'auto_response_text',
        'status',
        'received_at',
        'processed_at',
    ];

    protected $casts = [
        'attachments' => 'array',
        'extracted_data' => 'array',
        'auto_response_sent' => 'boolean',
        'received_at' => 'datetime',
        'processed_at' => 'datetime',
    ];

    const SOURCE_PHONE = 'phone';
    const SOURCE_EMAIL = 'email';
    const SOURCE_SMS = 'sms';

    const STATUS_UNPROCESSED = 'unprocessed';
    const STATUS_PROCESSING = 'processing';
    const STATUS_PROCESSED = 'processed';
    const STATUS_FAILED = 'failed';
    const STATUS_DISMISSED = 'dismissed';

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function channel()
    {
        return $this->belongsTo(AssistantChannel::class, 'channel_id');
    }

    public function task()
    {
        return $this->belongsTo(Task::class, 'routed_to_task_id');
    }

    public function routingRule()
    {
        return $this->belongsTo(RoutingRule::class);
    }

    public function markProcessed(Task $task, RoutingRule $rule = null): void
    {
        $this->update([
            'status' => self::STATUS_PROCESSED,
            'processing_status' => 'completed',
            'routed_to_task_id' => $task->id,
            'routing_rule_id' => $rule?->id,
            'processed_at' => now(),
        ]);
    }

    public function markFailed(string $error): void
    {
        $this->update([
            'status' => self::STATUS_FAILED,
            'processing_status' => 'failed',
            'processing_error' => $error,
            'processed_at' => now(),
        ]);
    }
}
```

---

## Services

### OpenRouter Service

```php
<?php
// app/Services/AI/OpenRouterService.php

namespace App\Services\AI;

use Illuminate\Support\Facades\Http;

class OpenRouterService
{
    private string $apiKey;
    private string $baseUrl;

    public function __construct()
    {
        $this->apiKey = config('services.openrouter.api_key');
        $this->baseUrl = config('services.openrouter.base_url');
    }

    public function chat(
        array $messages,
        string $model = null,
        float $temperature = 0.7,
        bool $jsonMode = false,
        int $maxTokens = 4000
    ): array {
        $model = $model ?? config('services.openrouter.default_model');

        $payload = [
            'model' => $model,
            'messages' => $messages,
            'temperature' => $temperature,
            'max_tokens' => $maxTokens,
        ];

        if ($jsonMode) {
            $payload['response_format'] = ['type' => 'json_object'];
        }

        $response = Http::withHeaders([
            'Authorization' => 'Bearer ' . $this->apiKey,
            'HTTP-Referer' => config('app.url'),
            'X-Title' => config('app.name'),
        ])->post($this->baseUrl . '/chat/completions', $payload);

        if (!$response->successful()) {
            throw new \Exception('OpenRouter API error: ' . $response->body());
        }

        return $response->json();
    }

    public function extractJson(array $messages, string $model = null): array
    {
        $response = $this->chat($messages, $model, 0.1, true);
        $content = $response['choices'][0]['message']['content'];
        return json_decode($content, true);
    }
}
```

### Task Extractor Service

```php
<?php
// app/Services/AI/TaskExtractor.php

namespace App\Services\AI;

class TaskExtractor
{
    private OpenRouterService $openRouter;

    private const SYSTEM_PROMPT = <<<'PROMPT'
You are a data extraction assistant for a task management system.

Your job is to extract structured information from incoming messages (phone calls, emails, SMS).
You ONLY extract and classify. You do NOT decide what to do with the message.

For every message, extract:
1. summary: Brief 10-word summary suitable for a task title
2. category: One of: maintenance, scheduling, billing, sales, support, legal, research, general
3. subcategory: More specific classification
4. keywords: Array of relevant terms from the message
5. urgency_indicators: Phrases suggesting time sensitivity
6. sentiment: positive, neutral, negative, frustrated, urgent
7. contact: {name, phone, email} if mentioned
8. location: {address, unit, city, state, zip} if mentioned
9. dates_mentioned: Array of any dates referenced
10. times_mentioned: Array of any times referenced

Respond ONLY with valid JSON. No other text.
PROMPT;

    public function __construct(OpenRouterService $openRouter)
    {
        $this->openRouter = $openRouter;
    }

    public function extract(string $content, string $source): array
    {
        $messages = [
            ['role' => 'system', 'content' => self::SYSTEM_PROMPT],
            ['role' => 'user', 'content' => "Source: {$source}\n\nContent:\n{$content}"],
        ];

        $model = config('services.openrouter.extraction_model', 'openai/gpt-4o');
        
        $result = $this->openRouter->extractJson($messages, $model);

        return $this->normalizeResult($result);
    }

    private function normalizeResult(array $result): array
    {
        return [
            'summary' => $result['summary'] ?? 'New request',
            'category' => $result['category'] ?? 'general',
            'subcategory' => $result['subcategory'] ?? null,
            'keywords' => $result['keywords'] ?? [],
            'urgency_indicators' => $result['urgency_indicators'] ?? [],
            'sentiment' => $result['sentiment'] ?? 'neutral',
            'contact' => [
                'name' => $result['contact']['name'] ?? null,
                'phone' => $result['contact']['phone'] ?? null,
                'email' => $result['contact']['email'] ?? null,
            ],
            'location' => [
                'address' => $result['location']['address'] ?? null,
                'unit' => $result['location']['unit'] ?? null,
                'city' => $result['location']['city'] ?? null,
                'state' => $result['location']['state'] ?? null,
                'zip' => $result['location']['zip'] ?? null,
            ],
            'dates_mentioned' => $result['dates_mentioned'] ?? [],
            'times_mentioned' => $result['times_mentioned'] ?? [],
        ];
    }
}
```

### Rule Engine

```php
<?php
// app/Services/Routing/RuleEngine.php

namespace App\Services\Routing;

use App\Models\User;
use App\Models\RoutingRule;
use App\Models\TeamMember;
use App\Models\MarketplaceVendor;
use App\Models\ContactList;
use Illuminate\Support\Collection;

class RuleEngine
{
    private User $user;
    private Collection $rules;
    private Collection $contactLists;
    private ConditionEvaluator $evaluator;

    public function __construct(ConditionEvaluator $evaluator)
    {
        $this->evaluator = $evaluator;
    }

    public function forUser(User $user): self
    {
        $this->user = $user;
        $this->rules = $user->routingRules()->where('is_active', true)->get();
        $this->contactLists = $user->contactLists()->with('members')->get();
        
        return $this;
    }

    public function evaluate(array $extractedData): RoutingDecision
    {
        foreach ($this->rules as $rule) {
            if ($this->matchesRule($rule, $extractedData)) {
                $rule->incrementMatches();
                return $this->buildDecision($rule, $extractedData);
            }
        }

        return $this->defaultDecision($extractedData);
    }

    private function matchesRule(RoutingRule $rule, array $data): bool
    {
        $conditions = $rule->conditions;
        $matchType = $conditions['match_type'] ?? 'all';
        $results = [];

        foreach ($conditions['rules'] ?? [] as $condition) {
            $results[] = $this->evaluator->evaluate($condition, $data, $this->contactLists);
        }

        if (empty($results)) {
            return false;
        }

        return $matchType === 'all'
            ? !in_array(false, $results, true)
            : in_array(true, $results, true);
    }

    private function buildDecision(RoutingRule $rule, array $data): RoutingDecision
    {
        $actions = $rule->actions;

        return new RoutingDecision(
            ruleId: $rule->id,
            ruleName: $rule->name,
            createTask: $actions['create_task'] ?? true,
            requestorId: $this->user->id,
            assigneeType: $actions['assignee_type'] ?? 'self',
            assigneeId: $actions['assignee_id'] ?? $this->user->id,
            priority: $actions['priority'] ?? 'normal',
            notifications: $actions['notifications'] ?? [],
            autoResponse: $actions['auto_response'] ?? null,
            tags: array_merge($actions['tags'] ?? [], [$data['category']]),
            taskTitle: $data['summary'],
            taskDescription: $this->buildDescription($data),
        );
    }

    private function defaultDecision(array $data): RoutingDecision
    {
        return new RoutingDecision(
            ruleId: null,
            ruleName: 'default',
            createTask: true,
            requestorId: $this->user->id,
            assigneeType: 'self',
            assigneeId: $this->user->id,
            priority: 'normal',
            notifications: [['type' => 'digest', 'recipient' => 'owner']],
            autoResponse: null,
            tags: [$data['category'], 'unrouted'],
            taskTitle: $data['summary'],
            taskDescription: $this->buildDescription($data),
        );
    }

    private function buildDescription(array $data): string
    {
        $parts = [];
        
        if ($data['contact']['name']) {
            $parts[] = "**From:** {$data['contact']['name']}";
        }
        if ($data['contact']['phone']) {
            $parts[] = "**Phone:** {$data['contact']['phone']}";
        }
        if ($data['contact']['email']) {
            $parts[] = "**Email:** {$data['contact']['email']}";
        }
        if ($data['location']['address']) {
            $location = implode(', ', array_filter([
                $data['location']['address'],
                $data['location']['unit'],
                $data['location']['city'],
                $data['location']['state'],
                $data['location']['zip'],
            ]));
            $parts[] = "**Location:** {$location}";
        }

        return implode("\n", $parts);
    }
}

// app/Services/Routing/RoutingDecision.php
class RoutingDecision
{
    public function __construct(
        public ?string $ruleId,
        public string $ruleName,
        public bool $createTask,
        public string $requestorId,
        public string $assigneeType,
        public ?string $assigneeId,
        public string $priority,
        public array $notifications,
        public ?string $autoResponse,
        public array $tags,
        public string $taskTitle,
        public string $taskDescription,
    ) {}
}
```

### Condition Evaluator

```php
<?php
// app/Services/Routing/ConditionEvaluator.php

namespace App\Services\Routing;

use Illuminate\Support\Collection;

class ConditionEvaluator
{
    public function evaluate(array $condition, array $data, Collection $contactLists): bool
    {
        $field = $condition['field'];
        $operator = $condition['operator'];
        $value = $condition['value'];

        $fieldValue = $this->getFieldValue($field, $data);

        return match ($operator) {
            'equals' => $fieldValue === $value,
            'not_equals' => $fieldValue !== $value,
            'in' => in_array($fieldValue, (array) $value, true),
            'not_in' => !in_array($fieldValue, (array) $value, true),
            'contains' => is_string($fieldValue) && str_contains(strtolower($fieldValue), strtolower($value)),
            'contains_any' => $this->containsAny($fieldValue, (array) $value),
            'contains_all' => $this->containsAll($fieldValue, (array) $value),
            'greater_than' => is_numeric($fieldValue) && $fieldValue > $value,
            'less_than' => is_numeric($fieldValue) && $fieldValue < $value,
            'time_between' => $this->timeBetween($value[0], $value[1]),
            'caller_in_list' => $this->callerInList($data, $value, $contactLists),
            'caller_not_in_list' => !$this->callerInList($data, $value, $contactLists),
            default => false,
        };
    }

    private function getFieldValue(string $field, array $data): mixed
    {
        return match ($field) {
            'category' => $data['category'] ?? null,
            'subcategory' => $data['subcategory'] ?? null,
            'keywords' => $data['keywords'] ?? [],
            'sentiment' => $data['sentiment'] ?? null,
            'summary' => $data['summary'] ?? '',
            'urgency_indicators' => $data['urgency_indicators'] ?? [],
            'source' => $data['source'] ?? null,
            default => $data[$field] ?? null,
        };
    }

    private function containsAny(mixed $fieldValue, array $searchValues): bool
    {
        if (is_array($fieldValue)) {
            $fieldLower = array_map('strtolower', $fieldValue);
            foreach ($searchValues as $search) {
                if (in_array(strtolower($search), $fieldLower, true)) {
                    return true;
                }
            }
            return false;
        }

        if (is_string($fieldValue)) {
            $fieldLower = strtolower($fieldValue);
            foreach ($searchValues as $search) {
                if (str_contains($fieldLower, strtolower($search))) {
                    return true;
                }
            }
        }

        return false;
    }

    private function containsAll(mixed $fieldValue, array $searchValues): bool
    {
        if (is_array($fieldValue)) {
            $fieldLower = array_map('strtolower', $fieldValue);
            foreach ($searchValues as $search) {
                if (!in_array(strtolower($search), $fieldLower, true)) {
                    return false;
                }
            }
            return true;
        }

        return false;
    }

    private function timeBetween(string $start, string $end): bool
    {
        $now = now()->format('H:i');
        
        if ($start <= $end) {
            return $now >= $start && $now <= $end;
        }
        
        // Overnight range (e.g., 22:00 to 06:00)
        return $now >= $start || $now <= $end;
    }

    private function callerInList(array $data, string $listName, Collection $contactLists): bool
    {
        $list = $contactLists->firstWhere('name', $listName);
        
        if (!$list) {
            return false;
        }

        $callerPhone = $data['contact']['phone'] ?? null;
        $callerEmail = $data['contact']['email'] ?? null;

        foreach ($list->members as $member) {
            if ($callerPhone && $member->phone === $callerPhone) {
                return true;
            }
            if ($callerEmail && strtolower($member->email) === strtolower($callerEmail)) {
                return true;
            }
        }

        return false;
    }
}
```

### AI Tool Executor

```php
<?php
// app/Services/Marketplace/AiToolExecutor.php

namespace App\Services\Marketplace;

use App\Models\Task;
use App\Models\MarketplaceVendor;
use App\Models\AiToolExecution;
use App\Services\AI\OpenRouterService;
use Illuminate\Support\Facades\Http;

class AiToolExecutor
{
    private OpenRouterService $openRouter;

    public function __construct(OpenRouterService $openRouter)
    {
        $this->openRouter = $openRouter;
    }

    public function execute(Task $task, MarketplaceVendor $vendor): AiToolExecution
    {
        $config = $vendor->aiToolConfig;
        
        if (!$config) {
            throw new \Exception("AI tool configuration not found for vendor {$vendor->id}");
        }

        // Create execution record
        $execution = AiToolExecution::create([
            'task_id' => $task->id,
            'vendor_id' => $vendor->id,
            'config_id' => $config->id,
            'input_data' => $task->extracted_data,
            'status' => 'running',
            'started_at' => now(),
        ]);

        try {
            $result = match ($config->provider) {
                'internal' => $this->executeInternal($task, $config),
                'botjob' => $this->executeBotJob($task, $config),
                'alphasite' => $this->executeAlphaSite($task, $config),
                'fourprojects' => $this->executeFourProjects($task, $config),
                'external' => $this->executeExternal($task, $config),
                default => throw new \Exception("Unknown AI provider: {$config->provider}"),
            };

            $execution->update([
                'status' => 'completed',
                'completed_at' => now(),
                'output_data' => $result['data'],
                'deliverable_urls' => $result['deliverables'] ?? [],
                'tokens_used' => $result['tokens'] ?? null,
                'cost' => $result['cost'] ?? null,
            ]);

            // Attach deliverables to task
            foreach ($result['deliverables'] ?? [] as $deliverable) {
                $task->addDeliverable(
                    $deliverable['url'],
                    $deliverable['type'],
                    $deliverable['metadata'] ?? []
                );
            }

            // Mark task complete if auto-execute
            if ($config->auto_execute) {
                $task->markCompleted();
            }

        } catch (\Exception $e) {
            $execution->update([
                'status' => 'failed',
                'completed_at' => now(),
                'error_message' => $e->getMessage(),
            ]);

            throw $e;
        }

        return $execution;
    }

    private function executeInternal(Task $task, $config): array
    {
        $prompt = $this->buildPrompt($config->prompt_template, $task);

        $response = $this->openRouter->chat(
            messages: [
                ['role' => 'system', 'content' => 'You are an AI assistant that completes tasks.'],
                ['role' => 'user', 'content' => $prompt],
            ],
            model: $config->model,
            maxTokens: $config->max_tokens,
        );

        $content = $response['choices'][0]['message']['content'];
        $tokens = $response['usage']['total_tokens'] ?? 0;

        return [
            'data' => ['response' => $content],
            'deliverables' => [],
            'tokens' => $tokens,
            'cost' => $this->calculateCost($tokens, $config->model),
        ];
    }

    private function executeBotJob(Task $task, $config): array
    {
        $response = Http::withHeaders([
            'Authorization' => 'Bearer ' . $config->api_key,
        ])->timeout($config->max_execution_time)->post($config->api_endpoint, [
            'task_title' => $task->title,
            'task_description' => $task->description,
            'category' => $task->extracted_data['category'] ?? 'general',
            'metadata' => [
                'contact' => $task->extracted_data['contact'] ?? [],
                'location' => $task->extracted_data['location'] ?? [],
            ],
            'webhook_url' => route('webhooks.ai-tool', ['vendor' => $task->marketplace_vendor_id]),
        ]);

        if (!$response->successful()) {
            throw new \Exception('BotJob API error: ' . $response->body());
        }

        return [
            'data' => $response->json(),
            'deliverables' => $response->json('deliverables', []),
            'cost' => $response->json('cost'),
        ];
    }

    private function executeAlphaSite(Task $task, $config): array
    {
        // Similar implementation for AlphaSite.ai
        // Would call their API to generate websites
        throw new \Exception('AlphaSite integration not yet implemented');
    }

    private function executeFourProjects(Task $task, $config): array
    {
        // Similar implementation for 4Projects.ai
        throw new \Exception('4Projects integration not yet implemented');
    }

    private function executeExternal(Task $task, $config): array
    {
        $response = Http::withHeaders([
            'Authorization' => 'Bearer ' . $config->api_key,
        ])->timeout($config->max_execution_time)->post($config->api_endpoint, [
            'task' => $task->toArray(),
            'webhook_url' => route('webhooks.ai-tool', ['vendor' => $task->marketplace_vendor_id]),
        ]);

        if (!$response->successful()) {
            throw new \Exception('External AI API error: ' . $response->body());
        }

        return [
            'data' => $response->json(),
            'deliverables' => $response->json('deliverables', []),
            'cost' => $response->json('cost'),
        ];
    }

    private function buildPrompt(string $template, Task $task): string
    {
        $data = array_merge(
            ['title' => $task->title, 'description' => $task->description],
            $task->extracted_data ?? []
        );

        return preg_replace_callback('/\{\{(\w+)\}\}/', function ($matches) use ($data) {
            return $data[$matches[1]] ?? '';
        }, $template);
    }

    private function calculateCost(int $tokens, string $model): float
    {
        // Approximate costs per 1K tokens
        $costs = [
            'openai/gpt-4o' => 0.005,
            'openai/gpt-4o-mini' => 0.00015,
            'anthropic/claude-3-sonnet' => 0.003,
            'anthropic/claude-3-haiku' => 0.00025,
        ];

        $rate = $costs[$model] ?? 0.001;
        return ($tokens / 1000) * $rate;
    }
}
```

---

## Controllers

### Task Controller

```php
<?php
// app/Http/Controllers/Api/TaskController.php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Task;
use App\Http\Requests\Task\StoreTaskRequest;
use App\Http\Requests\Task\UpdateTaskRequest;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    public function index(Request $request)
    {
        $tasks = $request->user()
            ->tasks()
            ->with(['owner', 'teamMember', 'marketplaceVendor'])
            ->when($request->status, fn($q, $status) => $q->where('status', $status))
            ->when($request->priority, fn($q, $priority) => $q->where('priority', $priority))
            ->orderBy('created_at', 'desc')
            ->paginate($request->per_page ?? 20);

        return response()->json($tasks);
    }

    public function store(StoreTaskRequest $request)
    {
        $task = Task::create([
            ...$request->validated(),
            'requestor_id' => $request->user()->id,
            'status' => Task::STATUS_PENDING,
        ]);

        return response()->json($task, 201);
    }

    public function show(Task $task)
    {
        $this->authorize('view', $task);
        
        $task->load(['owner', 'teamMember', 'marketplaceVendor', 'marketplaceListing']);

        return response()->json($task);
    }

    public function update(UpdateTaskRequest $request, Task $task)
    {
        $this->authorize('update', $task);
        
        $task->update($request->validated());

        return response()->json($task);
    }

    public function destroy(Task $task)
    {
        $this->authorize('delete', $task);
        
        $task->delete();

        return response()->json(null, 204);
    }

    public function complete(Task $task)
    {
        $this->authorize('update', $task);
        
        $task->markCompleted();

        return response()->json($task);
    }

    public function assign(Request $request, Task $task)
    {
        $this->authorize('update', $task);

        $request->validate([
            'assignee_type' => 'required|in:user,team_member,vendor',
            'assignee_id' => 'required|uuid',
        ]);

        match ($request->assignee_type) {
            'user' => $task->update(['owner_id' => $request->assignee_id]),
            'team_member' => $task->update(['team_member_id' => $request->assignee_id]),
            'vendor' => $task->update(['marketplace_vendor_id' => $request->assignee_id]),
        };

        $task->update(['status' => Task::STATUS_ACCEPTED]);

        return response()->json($task->fresh());
    }
}
```

### Routing Rule Controller

```php
<?php
// app/Http/Controllers/Api/RoutingRuleController.php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\RoutingRule;
use App\Services\Routing\RuleEngine;
use Illuminate\Http\Request;

class RoutingRuleController extends Controller
{
    public function index(Request $request)
    {
        $rules = $request->user()
            ->routingRules()
            ->orderBy('priority')
            ->get();

        return response()->json($rules);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'description' => 'nullable|string',
            'conditions' => 'required|array',
            'conditions.match_type' => 'required|in:all,any',
            'conditions.rules' => 'required|array|min:1',
            'actions' => 'required|array',
            'actions.assignee_type' => 'required|in:self,team_member,marketplace_human,marketplace_ai',
        ]);

        // Get next priority
        $maxPriority = $request->user()->routingRules()->max('priority') ?? 0;

        $rule = RoutingRule::create([
            ...$validated,
            'user_id' => $request->user()->id,
            'priority' => $maxPriority + 10,
            'is_active' => true,
        ]);

        return response()->json($rule, 201);
    }

    public function show(RoutingRule $routingRule)
    {
        $this->authorize('view', $routingRule);
        return response()->json($routingRule);
    }

    public function update(Request $request, RoutingRule $routingRule)
    {
        $this->authorize('update', $routingRule);

        $validated = $request->validate([
            'name' => 'sometimes|string|max:100',
            'description' => 'nullable|string',
            'conditions' => 'sometimes|array',
            'actions' => 'sometimes|array',
            'is_active' => 'sometimes|boolean',
        ]);

        $routingRule->update($validated);

        return response()->json($routingRule);
    }

    public function destroy(RoutingRule $routingRule)
    {
        $this->authorize('delete', $routingRule);
        $routingRule->delete();
        return response()->json(null, 204);
    }

    public function reorder(Request $request)
    {
        $request->validate([
            'rules' => 'required|array',
            'rules.*.id' => 'required|uuid|exists:routing_rules,id',
            'rules.*.priority' => 'required|integer|min:0',
        ]);

        foreach ($request->rules as $ruleData) {
            RoutingRule::where('id', $ruleData['id'])
                ->where('user_id', $request->user()->id)
                ->update(['priority' => $ruleData['priority']]);
        }

        return response()->json(['success' => true]);
    }

    public function test(Request $request, RuleEngine $ruleEngine)
    {
        $request->validate([
            'sample_data' => 'required|array',
        ]);

        $ruleEngine->forUser($request->user());
        $decision = $ruleEngine->evaluate($request->sample_data);

        return response()->json([
            'matched_rule' => $decision->ruleName,
            'assignee_type' => $decision->assigneeType,
            'priority' => $decision->priority,
            'auto_response' => $decision->autoResponse,
            'tags' => $decision->tags,
        ]);
    }
}
```

### Twilio Webhook Controller

```php
<?php
// app/Http/Controllers/Webhooks/TwilioController.php

namespace App\Http\Controllers\Webhooks;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\AssistantChannel;
use App\Jobs\ProcessVoicemail;
use App\Jobs\ProcessSms;
use Illuminate\Http\Request;
use Twilio\TwiML\VoiceResponse;
use Twilio\TwiML\MessagingResponse;

class TwilioController extends Controller
{
    public function voice(Request $request, User $user)
    {
        $channel = $user->getPhoneChannel();
        $fromNumber = $request->input('From');
        $isFromUser = $fromNumber === $user->phone;

        $response = new VoiceResponse();

        if ($isFromUser) {
            // User calling their own assistant - command mode
            $response->say(
                "Hello! I'm ready to take your instructions. Please speak after the beep.",
                ['voice' => 'Polly.Joanna']
            );
        } else {
            // External caller - receptionist mode
            $greeting = $channel?->voicemail_greeting 
                ?? "Hi, you've reached {$user->name}'s assistant. Please leave a message with your name, number, and how I can help.";
            $response->say($greeting, ['voice' => 'Polly.Joanna']);
        }

        $response->record([
            'maxLength' => 180,
            'action' => route('webhooks.twilio.recording', ['user' => $user->id]),
            'transcribe' => true,
            'transcribeCallback' => route('webhooks.twilio.transcription', ['user' => $user->id]),
            'playBeep' => true,
        ]);

        $response->say("Thank you. Goodbye.");
        $response->hangup();

        return response($response)->header('Content-Type', 'text/xml');
    }

    public function recording(Request $request, User $user)
    {
        // Recording saved, waiting for transcription
        $response = new VoiceResponse();
        $response->say("Thank you. Goodbye.");
        $response->hangup();

        return response($response)->header('Content-Type', 'text/xml');
    }

    public function transcription(Request $request, User $user)
    {
        ProcessVoicemail::dispatch(
            user: $user,
            transcript: $request->input('TranscriptionText'),
            recordingUrl: $request->input('RecordingUrl'),
            fromNumber: $request->input('From'),
            callSid: $request->input('CallSid'),
        );

        return response('OK', 200);
    }

    public function sms(Request $request, User $user)
    {
        $fromNumber = $request->input('From');
        $body = $request->input('Body');
        $isFromUser = $fromNumber === $user->phone;

        ProcessSms::dispatch(
            user: $user,
            body: $body,
            fromNumber: $fromNumber,
            messageSid: $request->input('MessageSid'),
            isCommand: $isFromUser,
        );

        // Immediate acknowledgment
        $response = new MessagingResponse();
        $response->message("Got it! I'll process this right away.");

        return response($response)->header('Content-Type', 'text/xml');
    }
}
```

### SendGrid Webhook Controller

```php
<?php
// app/Http/Controllers/Webhooks/SendGridController.php

namespace App\Http\Controllers\Webhooks;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\AssistantChannel;
use App\Jobs\ProcessEmail;
use Illuminate\Http\Request;

class SendGridController extends Controller
{
    public function inbound(Request $request)
    {
        $toEmail = $request->input('to');
        $fromEmail = $request->input('from');
        $subject = $request->input('subject');
        $text = $request->input('text');
        $html = $request->input('html');

        // Find user by assistant email
        $channel = AssistantChannel::where('email_address', $this->extractEmail($toEmail))
            ->where('channel_type', 'email')
            ->where('is_active', true)
            ->first();

        if (!$channel) {
            return response('Channel not found', 404);
        }

        $user = $channel->user;
        $isFromUser = $this->extractEmail($fromEmail) === $user->email;

        // Check if this is a forwarded email
        $originalSender = $this->parseForwardedSender($text ?? $html);

        ProcessEmail::dispatch(
            user: $user,
            subject: $subject,
            body: $text ?? strip_tags($html),
            fromEmail: $originalSender ?? $this->extractEmail($fromEmail),
            fromName: $this->extractName($fromEmail),
            attachments: $this->parseAttachments($request),
            isCommand: $isFromUser && !$originalSender,
        );

        return response('OK', 200);
    }

    private function extractEmail(string $address): string
    {
        if (preg_match('/<([^>]+)>/', $address, $matches)) {
            return $matches[1];
        }
        return $address;
    }

    private function extractName(string $address): ?string
    {
        if (preg_match('/^([^<]+)</', $address, $matches)) {
            return trim($matches[1], ' "');
        }
        return null;
    }

    private function parseForwardedSender(string $content): ?string
    {
        // Look for common forwarded email patterns
        $patterns = [
            '/From:\s*([^\n<]+(?:<[^>]+>)?)/i',
            '/---------- Forwarded message ---------\s*From:\s*([^\n]+)/i',
        ];

        foreach ($patterns as $pattern) {
            if (preg_match($pattern, $content, $matches)) {
                return $this->extractEmail($matches[1]);
            }
        }

        return null;
    }

    private function parseAttachments(Request $request): array
    {
        // SendGrid sends attachments as attachment1, attachment2, etc.
        $attachments = [];
        $i = 1;
        
        while ($request->hasFile("attachment{$i}")) {
            $file = $request->file("attachment{$i}");
            $attachments[] = [
                'name' => $file->getClientOriginalName(),
                'type' => $file->getMimeType(),
                'size' => $file->getSize(),
            ];
            $i++;
        }

        return $attachments;
    }
}
```

---

## Jobs

### Process Voicemail Job

```php
<?php
// app/Jobs/ProcessVoicemail.php

namespace App\Jobs;

use App\Models\User;
use App\Models\Task;
use App\Models\InboxItem;
use App\Services\AI\TaskExtractor;
use App\Services\Routing\RuleEngine;
use App\Services\Notifications\NotificationService;
use App\Services\Twilio\SmsService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class ProcessVoicemail implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(
        public User $user,
        public string $transcript,
        public string $recordingUrl,
        public string $fromNumber,
        public string $callSid,
    ) {}

    public function handle(
        TaskExtractor $extractor,
        RuleEngine $ruleEngine,
        NotificationService $notifications,
        SmsService $sms,
    ): void {
        // 1. Create inbox item
        $inboxItem = InboxItem::create([
            'user_id' => $this->user->id,
            'source_type' => InboxItem::SOURCE_PHONE,
            'source_id' => $this->callSid,
            'channel_id' => $this->user->getPhoneChannel()?->id,
            'from_identifier' => $this->fromNumber,
            'body' => $this->transcript,
            'status' => InboxItem::STATUS_PROCESSING,
            'received_at' => now(),
            'attachments' => [['type' => 'recording', 'url' => $this->recordingUrl]],
        ]);

        try {
            // 2. AI extraction
            $extracted = $extractor->extract($this->transcript, 'phone');
            $extracted['source'] = 'phone';
            $extracted['from_number'] = $this->fromNumber;

            $inboxItem->update(['extracted_data' => $extracted]);

            // 3. Deterministic routing
            $ruleEngine->forUser($this->user);
            $decision = $ruleEngine->evaluate($extracted);

            // 4. Create task
            $task = Task::create([
                'title' => $decision->taskTitle,
                'description' => $decision->taskDescription,
                'status' => Task::STATUS_PENDING,
                'priority' => $decision->priority,
                'requestor_id' => $decision->requestorId,
                'source_type' => 'phone',
                'source_channel_id' => $inboxItem->channel_id,
                'extracted_data' => $extracted,
                'routing_rule_id' => $decision->ruleId,
                'contact_name' => $extracted['contact']['name'],
                'contact_phone' => $extracted['contact']['phone'] ?? $this->fromNumber,
                'contact_email' => $extracted['contact']['email'],
                'location_address' => $extracted['location']['address'],
                'location_unit' => $extracted['location']['unit'],
                'location_city' => $extracted['location']['city'],
                'location_state' => $extracted['location']['state'],
                'location_zip' => $extracted['location']['zip'],
                'tags' => $decision->tags,
                'metadata' => ['recording_url' => $this->recordingUrl],
            ]);

            // 5. Assign task based on routing decision
            $this->assignTask($task, $decision);

            // 6. Send notifications
            foreach ($decision->notifications as $notification) {
                $notifications->send($notification, $task, $this->user);
            }

            // 7. Send auto-response if configured
            if ($decision->autoResponse) {
                $sms->send($this->fromNumber, $decision->autoResponse);
                $inboxItem->update([
                    'auto_response_sent' => true,
                    'auto_response_text' => $decision->autoResponse,
                ]);
            }

            // 8. Mark inbox item processed
            $inboxItem->markProcessed($task, 
                $decision->ruleId ? \App\Models\RoutingRule::find($decision->ruleId) : null
            );

        } catch (\Exception $e) {
            $inboxItem->markFailed($e->getMessage());
            throw $e;
        }
    }

    private function assignTask(Task $task, $decision): void
    {
        match ($decision->assigneeType) {
            'self' => $task->update(['owner_id' => $this->user->id]),
            'team_member' => $task->update(['team_member_id' => $decision->assigneeId]),
            'marketplace_human', 'marketplace_ai' => $this->routeToMarketplace($task, $decision),
            default => $task->update(['owner_id' => $this->user->id]),
        };
    }

    private function routeToMarketplace(Task $task, $decision): void
    {
        $vendor = \App\Models\MarketplaceVendor::find($decision->assigneeId);

        if (!$vendor) {
            // Fallback to owner if vendor not found
            $task->update(['owner_id' => $this->user->id]);
            return;
        }

        $task->update(['marketplace_vendor_id' => $vendor->id]);

        // If AI tool, execute immediately
        if ($vendor->canAutoExecute()) {
            ExecuteAiTool::dispatch($task, $vendor);
        }
    }
}
```

### Execute AI Tool Job

```php
<?php
// app/Jobs/ExecuteAiTool.php

namespace App\Jobs;

use App\Models\Task;
use App\Models\MarketplaceVendor;
use App\Services\Marketplace\AiToolExecutor;
use App\Services\Notifications\NotificationService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class ExecuteAiTool implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $timeout = 300; // 5 minutes
    public $tries = 3;

    public function __construct(
        public Task $task,
        public MarketplaceVendor $vendor,
    ) {}

    public function handle(
        AiToolExecutor $executor,
        NotificationService $notifications,
    ): void {
        $execution = $executor->execute($this->task, $this->vendor);

        // Notify requestor of completion
        $notifications->send([
            'type' => 'immediate',
            'recipient' => 'owner',
        ], $this->task, $this->task->requestor);
    }

    public function failed(\Throwable $e): void
    {
        // Log failure and notify owner
        \Log::error("AI Tool execution failed for task {$this->task->id}: {$e->getMessage()}");
        
        $this->task->update([
            'status' => Task::STATUS_PENDING,
            'metadata' => array_merge($this->task->metadata ?? [], [
                'ai_execution_error' => $e->getMessage(),
            ]),
        ]);
    }
}
```

---

## Routes

### API Routes

```php
<?php
// routes/api.php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\TaskController;
use App\Http\Controllers\Api\InboxController;
use App\Http\Controllers\Api\RoutingRuleController;
use App\Http\Controllers\Api\TeamController;
use App\Http\Controllers\Api\ContactListController;
use App\Http\Controllers\Api\ChannelController;
use App\Http\Controllers\Api\Marketplace\ListingController;
use App\Http\Controllers\Api\Marketplace\VendorController;

// Auth
Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    // Auth
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/user', [AuthController::class, 'user']);

    // Tasks
    Route::apiResource('tasks', TaskController::class);
    Route::post('/tasks/{task}/complete', [TaskController::class, 'complete']);
    Route::post('/tasks/{task}/assign', [TaskController::class, 'assign']);

    // Inbox
    Route::get('/inbox', [InboxController::class, 'index']);
    Route::get('/inbox/{inboxItem}', [InboxController::class, 'show']);
    Route::post('/inbox/{inboxItem}/process', [InboxController::class, 'process']);
    Route::post('/inbox/{inboxItem}/dismiss', [InboxController::class, 'dismiss']);
    Route::post('/inbox/{inboxItem}/create-task', [InboxController::class, 'createTask']);

    // Routing Rules
    Route::apiResource('routing-rules', RoutingRuleController::class);
    Route::post('/routing-rules/reorder', [RoutingRuleController::class, 'reorder']);
    Route::post('/routing-rules/test', [RoutingRuleController::class, 'test']);

    // Team
    Route::apiResource('team', TeamController::class);

    // Contact Lists
    Route::apiResource('contact-lists', ContactListController::class);
    Route::post('/contact-lists/{contactList}/members', [ContactListController::class, 'addMember']);
    Route::delete('/contact-lists/{contactList}/members/{member}', [ContactListController::class, 'removeMember']);

    // Channels
    Route::get('/channels', [ChannelController::class, 'index']);
    Route::post('/channels/phone', [ChannelController::class, 'provisionPhone']);
    Route::post('/channels/email', [ChannelController::class, 'createEmail']);
    Route::put('/channels/{channel}', [ChannelController::class, 'update']);
    Route::delete('/channels/{channel}', [ChannelController::class, 'destroy']);

    // Marketplace
    Route::prefix('marketplace')->group(function () {
        Route::get('/listings', [ListingController::class, 'index']);
        Route::post('/listings', [ListingController::class, 'store']);
        Route::get('/listings/{listing}', [ListingController::class, 'show']);
        Route::post('/listings/{listing}/bid', [ListingController::class, 'bid']);
        Route::post('/listings/{listing}/assign', [ListingController::class, 'assign']);

        Route::get('/vendors', [VendorController::class, 'index']);
        Route::get('/vendors/{vendor}', [VendorController::class, 'show']);
        Route::post('/vendors', [VendorController::class, 'store']);
        Route::put('/vendors/{vendor}', [VendorController::class, 'update']);
    });

    // Vendor Dashboard (for vendors)
    Route::prefix('vendor')->group(function () {
        Route::get('/dashboard', [VendorController::class, 'dashboard']);
        Route::get('/jobs', [VendorController::class, 'jobs']);
        Route::get('/earnings', [VendorController::class, 'earnings']);
    });
});
```

### Webhook Routes

```php
<?php
// routes/webhooks.php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Webhooks\TwilioController;
use App\Http\Controllers\Webhooks\SendGridController;
use App\Http\Controllers\Webhooks\StripeController;
use App\Http\Controllers\Webhooks\AiToolController;

Route::prefix('webhooks')->group(function () {
    // Twilio
    Route::post('/twilio/voice/{user}', [TwilioController::class, 'voice'])
        ->name('webhooks.twilio.voice')
        ->middleware('twilio.signature');
    Route::post('/twilio/recording/{user}', [TwilioController::class, 'recording'])
        ->name('webhooks.twilio.recording')
        ->middleware('twilio.signature');
    Route::post('/twilio/transcription/{user}', [TwilioController::class, 'transcription'])
        ->name('webhooks.twilio.transcription')
        ->middleware('twilio.signature');
    Route::post('/twilio/sms/{user}', [TwilioController::class, 'sms'])
        ->name('webhooks.twilio.sms')
        ->middleware('twilio.signature');

    // SendGrid
    Route::post('/sendgrid/inbound', [SendGridController::class, 'inbound'])
        ->name('webhooks.sendgrid.inbound');

    // Stripe
    Route::post('/stripe', [StripeController::class, 'handle'])
        ->name('webhooks.stripe');

    // AI Tool Callbacks
    Route::post('/ai-tool/{vendor}', [AiToolController::class, 'handle'])
        ->name('webhooks.ai-tool');
});
```

---

## Configuration Files

### Services Config

```php
<?php
// config/services.php

return [
    // ... other services

    'twilio' => [
        'sid' => env('TWILIO_ACCOUNT_SID'),
        'token' => env('TWILIO_AUTH_TOKEN'),
        'verify_signature' => env('TWILIO_VERIFY_SIGNATURE', true),
    ],

    'sendgrid' => [
        'api_key' => env('SENDGRID_API_KEY'),
        'inbound_domain' => env('SENDGRID_INBOUND_DOMAIN', 'assistant.taskjuggler.com'),
    ],

    'openrouter' => [
        'api_key' => env('OPENROUTER_API_KEY'),
        'base_url' => env('OPENROUTER_BASE_URL', 'https://openrouter.ai/api/v1'),
        'default_model' => env('OPENROUTER_DEFAULT_MODEL', 'openai/gpt-4o'),
        'extraction_model' => env('OPENROUTER_EXTRACTION_MODEL', 'openai/gpt-4o'),
    ],

    'stripe' => [
        'key' => env('STRIPE_KEY'),
        'secret' => env('STRIPE_SECRET'),
        'webhook_secret' => env('STRIPE_WEBHOOK_SECRET'),
    ],
];
```

### Environment Variables

```bash
# .env.example

APP_NAME="Task Juggler"
APP_ENV=production
APP_KEY=
APP_DEBUG=false
APP_URL=https://api.taskjuggler.com

# Database
DB_CONNECTION=pgsql
DB_HOST=
DB_PORT=5432
DB_DATABASE=taskjuggler
DB_USERNAME=
DB_PASSWORD=

# Redis
REDIS_HOST=
REDIS_PASSWORD=
REDIS_PORT=6379

# Queue
QUEUE_CONNECTION=redis

# Twilio
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_VERIFY_SIGNATURE=true

# SendGrid
SENDGRID_API_KEY=
SENDGRID_INBOUND_DOMAIN=assistant.taskjuggler.com

# OpenRouter
OPENROUTER_API_KEY=
OPENROUTER_DEFAULT_MODEL=openai/gpt-4o
OPENROUTER_EXTRACTION_MODEL=openai/gpt-4o

# Stripe
STRIPE_KEY=
STRIPE_SECRET=
STRIPE_WEBHOOK_SECRET=

# Pusher (for real-time)
PUSHER_APP_ID=
PUSHER_APP_KEY=
PUSHER_APP_SECRET=
PUSHER_APP_CLUSTER=us2
```

---

## Railway Deployment

### railway.json

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "php artisan migrate --force && php artisan serve --host=0.0.0.0 --port=$PORT",
    "healthcheckPath": "/api/health",
    "healthcheckTimeout": 100
  }
}
```

### Procfile

```
web: php artisan serve --host=0.0.0.0 --port=$PORT
worker: php artisan queue:work --tries=3 --timeout=300
scheduler: php artisan schedule:work
```

---

## Testing Commands

```bash
# Run migrations
php artisan migrate

# Seed database with default AI tools
php artisan db:seed --class=AiToolSeeder

# Test routing rule
php artisan tinker
>>> $user = User::first();
>>> $engine = app(RuleEngine::class)->forUser($user);
>>> $decision = $engine->evaluate(['category' => 'maintenance', 'summary' => 'AC broken']);

# Process queue
php artisan queue:work

# Start development server
php artisan serve
```

---

## Next Steps

After implementing this backend:

1. Test webhook endpoints with Twilio/SendGrid test tools
2. Create admin seeder for default AI tools
3. Set up Stripe Connect for marketplace payments
4. Configure Pusher/Soketi for real-time updates
5. Deploy to Railway and configure environment variables
