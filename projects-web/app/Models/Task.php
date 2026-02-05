<?php

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
        'project_id', // Now nullable for standalone tasks
        'requestor_id',
        'owner_id',
        'parent_id',
        'team_id',
        'team_member_id',
        'marketplace_vendor_id',
        'marketplace_listing_id',
        'routing_rule_id',
        'source_channel_id',
        'source_channel_ref',
        'title',
        'description',
        'state',
        'source_channel',
        'source_metadata',
        'priority',
        'color_state',
        'contact_name',
        'contact_phone',
        'contact_email',
        'location_address',
        'location_unit',
        'location_city',
        'location_state',
        'location_zip',
        'location_coords',
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
        'deliverables',
        'invite_code',
        'invite_expires_at',
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
        'deliverables' => 'array',
        'location_coords' => 'array',
        'due_date' => 'datetime',
        'started_at' => 'datetime',
        'completed_at' => 'datetime',
        'invite_expires_at' => 'datetime',
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

    public function team(): BelongsTo
    {
        return $this->belongsTo(Team::class);
    }

    public function routingRule(): BelongsTo
    {
        return $this->belongsTo(RoutingRule::class);
    }

    public function sourceChannel(): BelongsTo
    {
        return $this->belongsTo(AssistantChannel::class, 'source_channel_id');
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


