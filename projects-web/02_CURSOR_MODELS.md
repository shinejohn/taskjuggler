# 02 - Cursor Models Guide

All Eloquent models for 4 Projects.ai.

---

## Directory Structure

```
app/
├── Enums/
│   ├── TaskState.php
│   ├── TaskPriority.php
│   ├── TaskChannel.php
│   ├── ProjectStatus.php
│   ├── ProjectMethodology.php
│   ├── ProblemType.php
│   ├── ProblemSeverity.php
│   ├── ProblemStatus.php
│   ├── QuestionStatus.php
│   ├── MemberRole.php
│   └── OrganizationPlan.php
└── Models/
    ├── Concerns/
    │   └── HasUuid.php
    ├── Organization.php
    ├── User.php
    ├── Project.php
    ├── ProjectMember.php
    ├── Task.php
    ├── TaskAction.php
    ├── TaskMessage.php
    ├── TaskDependency.php
    ├── Question.php
    ├── Answer.php
    ├── QuestionVote.php
    ├── Problem.php
    ├── Sprint.php
    └── Milestone.php
```

---

## All Enums

### ProjectStatus
```php
<?php
// app/Enums/ProjectStatus.php

namespace App\Enums;

enum ProjectStatus: string
{
    case PLANNING = 'planning';
    case ACTIVE = 'active';
    case ON_HOLD = 'on_hold';
    case COMPLETED = 'completed';
    case ARCHIVED = 'archived';

    public function label(): string
    {
        return match($this) {
            self::PLANNING => 'Planning',
            self::ACTIVE => 'Active',
            self::ON_HOLD => 'On Hold',
            self::COMPLETED => 'Completed',
            self::ARCHIVED => 'Archived',
        };
    }

    public function color(): string
    {
        return match($this) {
            self::PLANNING => 'purple',
            self::ACTIVE => 'green',
            self::ON_HOLD => 'yellow',
            self::COMPLETED => 'blue',
            self::ARCHIVED => 'gray',
        };
    }
}
```

### ProjectMethodology
```php
<?php
// app/Enums/ProjectMethodology.php

namespace App\Enums;

enum ProjectMethodology: string
{
    case AGILE = 'agile';
    case WATERFALL = 'waterfall';
    case HYBRID = 'hybrid';

    public function label(): string
    {
        return match($this) {
            self::AGILE => 'Agile',
            self::WATERFALL => 'Waterfall',
            self::HYBRID => 'Hybrid',
        };
    }
}
```

### ProblemStatus
```php
<?php
// app/Enums/ProblemStatus.php

namespace App\Enums;

enum ProblemStatus: string
{
    case OPEN = 'open';
    case INVESTIGATING = 'investigating';
    case RESOLVED = 'resolved';
    case CLOSED = 'closed';
    case WONT_FIX = 'wont_fix';

    public function label(): string
    {
        return match($this) {
            self::OPEN => 'Open',
            self::INVESTIGATING => 'Investigating',
            self::RESOLVED => 'Resolved',
            self::CLOSED => 'Closed',
            self::WONT_FIX => "Won't Fix",
        };
    }

    public function color(): string
    {
        return match($this) {
            self::OPEN => 'red',
            self::INVESTIGATING => 'yellow',
            self::RESOLVED => 'green',
            self::CLOSED => 'gray',
            self::WONT_FIX => 'gray',
        };
    }
}
```

### QuestionStatus
```php
<?php
// app/Enums/QuestionStatus.php

namespace App\Enums;

enum QuestionStatus: string
{
    case OPEN = 'open';
    case ANSWERED = 'answered';
    case RESOLVED = 'resolved';
    case CLOSED = 'closed';

    public function label(): string
    {
        return match($this) {
            self::OPEN => 'Open',
            self::ANSWERED => 'Answered',
            self::RESOLVED => 'Resolved',
            self::CLOSED => 'Closed',
        };
    }

    public function color(): string
    {
        return match($this) {
            self::OPEN => 'blue',
            self::ANSWERED => 'yellow',
            self::RESOLVED => 'green',
            self::CLOSED => 'gray',
        };
    }
}
```

### OrganizationPlan
```php
<?php
// app/Enums/OrganizationPlan.php

namespace App\Enums;

enum OrganizationPlan: string
{
    case FREE = 'free';
    case TEAM = 'team';
    case BUSINESS = 'business';
    case ENTERPRISE = 'enterprise';

    public function label(): string
    {
        return ucfirst($this->value);
    }

    public function maxUsers(): int
    {
        return match($this) {
            self::FREE => 5,
            self::TEAM => 25,
            self::BUSINESS => 100,
            self::ENTERPRISE => -1, // unlimited
        };
    }

    public function maxProjects(): int
    {
        return match($this) {
            self::FREE => 3,
            self::TEAM => 25,
            self::BUSINESS => 100,
            self::ENTERPRISE => -1, // unlimited
        };
    }

    public function price(): int
    {
        return match($this) {
            self::FREE => 0,
            self::TEAM => 12,
            self::BUSINESS => 25,
            self::ENTERPRISE => 0, // custom
        };
    }

    public function features(): array
    {
        return match($this) {
            self::FREE => ['web', 'mobile', 'basic_ai'],
            self::TEAM => ['web', 'mobile', 'email', 'slack', 'basic_ai', 'question_forum'],
            self::BUSINESS => ['web', 'mobile', 'email', 'sms', 'voice', 'slack', 'advanced_ai', 'question_forum', 'tef_export', 'sso'],
            self::ENTERPRISE => ['*'],
        };
    }
}
```

---

## All Models

### Organization Model
```php
<?php
// app/Models/Organization.php

namespace App\Models;

use App\Enums\OrganizationPlan;
use App\Models\Concerns\HasUuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Organization extends Model
{
    use HasFactory, HasUuid, SoftDeletes;

    protected $fillable = [
        'name',
        'slug',
        'plan',
        'max_users',
        'max_projects',
        'features',
        'settings',
        'trial_ends_at',
    ];

    protected $casts = [
        'plan' => OrganizationPlan::class,
        'features' => 'array',
        'settings' => 'array',
        'trial_ends_at' => 'datetime',
    ];

    // Relationships
    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }

    public function projects(): HasMany
    {
        return $this->hasMany(Project::class);
    }

    public function tasks(): HasMany
    {
        return $this->hasMany(Task::class);
    }

    // Helpers
    public function canAddUser(): bool
    {
        $max = $this->plan->maxUsers();
        return $max === -1 || $this->users()->count() < $max;
    }

    public function canAddProject(): bool
    {
        $max = $this->plan->maxProjects();
        return $max === -1 || $this->projects()->count() < $max;
    }

    public function hasFeature(string $feature): bool
    {
        $features = $this->plan->features();
        return in_array('*', $features) || in_array($feature, $features);
    }

    public function isOnTrial(): bool
    {
        return $this->trial_ends_at && $this->trial_ends_at->isFuture();
    }
}
```

### User Model (Enhanced)
```php
<?php
// app/Models/User.php

namespace App\Models;

use App\Models\Concerns\HasUuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, HasUuid, Notifiable, SoftDeletes;

    protected $fillable = [
        'organization_id',
        'name',
        'email',
        'password',
        'phone',
        'phone_verified',
        'timezone',
        'avatar',
        'notification_preferences',
        'skills',
        'capacity_hours_per_week',
        'slack_user_id',
        'last_active_at',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
        'phone_verified' => 'boolean',
        'notification_preferences' => 'array',
        'skills' => 'array',
        'last_active_at' => 'datetime',
    ];

    // Relationships
    public function organization(): BelongsTo
    {
        return $this->belongsTo(Organization::class);
    }

    public function ownedProjects(): HasMany
    {
        return $this->hasMany(Project::class, 'owner_id');
    }

    public function projects(): BelongsToMany
    {
        return $this->belongsToMany(Project::class, 'project_members')
            ->withPivot('role', 'allocation_percentage')
            ->withTimestamps();
    }

    public function ownedTasks(): HasMany
    {
        return $this->hasMany(Task::class, 'owner_id');
    }

    public function requestedTasks(): HasMany
    {
        return $this->hasMany(Task::class, 'requestor_id');
    }

    public function taskActions(): HasMany
    {
        return $this->hasMany(TaskAction::class);
    }

    public function questions(): HasMany
    {
        return $this->hasMany(Question::class, 'author_id');
    }

    public function answers(): HasMany
    {
        return $this->hasMany(Answer::class, 'author_id');
    }

    // Scopes
    public function scopeInOrganization($query, $organizationId)
    {
        return $query->where('organization_id', $organizationId);
    }

    public function scopeWithSkill($query, string $skill)
    {
        return $query->whereJsonContains('skills', $skill);
    }

    // Helpers
    public function updateLastActive(): void
    {
        $this->update(['last_active_at' => now()]);
    }

    public function getActiveTaskCount(): int
    {
        return $this->ownedTasks()
            ->whereIn('state', ['accepted', 'in_progress'])
            ->count();
    }

    public function getWorkloadHours(): float
    {
        return $this->ownedTasks()
            ->whereIn('state', ['accepted', 'in_progress'])
            ->sum('estimated_hours') ?? 0;
    }

    public function hasCapacity(int $hours): bool
    {
        return ($this->getWorkloadHours() + $hours) <= $this->capacity_hours_per_week;
    }

    public function isMemberOf(Project $project): bool
    {
        return $this->projects()->where('project_id', $project->id)->exists();
    }

    public function roleIn(Project $project): ?string
    {
        $member = $this->projects()->where('project_id', $project->id)->first();
        return $member?->pivot?->role;
    }
}
```

### Project Model
```php
<?php
// app/Models/Project.php

namespace App\Models;

use App\Enums\ProjectStatus;
use App\Enums\ProjectMethodology;
use App\Models\Concerns\HasUuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Project extends Model
{
    use HasFactory, HasUuid, SoftDeletes;

    protected $fillable = [
        'organization_id',
        'owner_id',
        'name',
        'code',
        'description',
        'methodology',
        'status',
        'priority',
        'start_date',
        'target_end_date',
        'actual_end_date',
        'budget',
        'budget_spent',
        'settings',
        'tags',
        'health_score',
    ];

    protected $casts = [
        'methodology' => ProjectMethodology::class,
        'status' => ProjectStatus::class,
        'start_date' => 'date',
        'target_end_date' => 'date',
        'actual_end_date' => 'date',
        'budget' => 'decimal:2',
        'budget_spent' => 'decimal:2',
        'settings' => 'array',
        'tags' => 'array',
    ];

    // Relationships
    public function organization(): BelongsTo
    {
        return $this->belongsTo(Organization::class);
    }

    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    public function members(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'project_members')
            ->withPivot('role', 'allocation_percentage')
            ->withTimestamps();
    }

    public function projectMembers(): HasMany
    {
        return $this->hasMany(ProjectMember::class);
    }

    public function tasks(): HasMany
    {
        return $this->hasMany(Task::class);
    }

    public function questions(): HasMany
    {
        return $this->hasMany(Question::class);
    }

    public function problems(): HasMany
    {
        return $this->hasMany(Problem::class);
    }

    public function sprints(): HasMany
    {
        return $this->hasMany(Sprint::class);
    }

    public function milestones(): HasMany
    {
        return $this->hasMany(Milestone::class);
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('status', ProjectStatus::ACTIVE);
    }

    public function scopeForUser($query, User $user)
    {
        return $query->whereHas('members', fn($q) => $q->where('user_id', $user->id));
    }

    // Stats
    public function getTaskStats(): array
    {
        $tasks = $this->tasks()
            ->selectRaw("
                COUNT(*) as total,
                SUM(CASE WHEN state = 'pending' THEN 1 ELSE 0 END) as pending,
                SUM(CASE WHEN state IN ('accepted', 'in_progress') THEN 1 ELSE 0 END) as active,
                SUM(CASE WHEN state = 'completed' THEN 1 ELSE 0 END) as completed,
                SUM(CASE WHEN due_date < NOW() AND state NOT IN ('completed', 'cancelled') THEN 1 ELSE 0 END) as overdue
            ")
            ->first();

        return [
            'total' => $tasks->total ?? 0,
            'pending' => $tasks->pending ?? 0,
            'active' => $tasks->active ?? 0,
            'completed' => $tasks->completed ?? 0,
            'overdue' => $tasks->overdue ?? 0,
            'completion_rate' => $tasks->total > 0 
                ? round(($tasks->completed / $tasks->total) * 100, 1) 
                : 0,
        ];
    }

    public function calculateHealthScore(): int
    {
        $stats = $this->getTaskStats();
        
        // Simple algorithm: penalize overdue tasks, reward completion
        $score = 100;
        
        if ($stats['total'] > 0) {
            $overdueRatio = $stats['overdue'] / $stats['total'];
            $completionRatio = $stats['completed'] / $stats['total'];
            
            $score = (int) round(
                100 - ($overdueRatio * 50) + ($completionRatio * 20)
            );
        }
        
        return max(0, min(100, $score));
    }
}
```

### ProjectMember Model
```php
<?php
// app/Models/ProjectMember.php

namespace App\Models;

use App\Enums\MemberRole;
use App\Models\Concerns\HasUuid;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProjectMember extends Model
{
    use HasUuid;

    protected $fillable = [
        'project_id',
        'user_id',
        'role',
        'allocation_percentage',
    ];

    protected $casts = [
        'role' => MemberRole::class,
    ];

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function canManage(): bool
    {
        return $this->role->canManage();
    }

    public function hasPermission(string $permission): bool
    {
        $permissions = $this->role->permissions();
        return in_array('*', $permissions) || in_array($permission, $permissions);
    }
}
```

### TaskAction Model
```php
<?php
// app/Models/TaskAction.php

namespace App\Models;

use App\Models\Concerns\HasUuid;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TaskAction extends Model
{
    use HasUuid;

    public $timestamps = false;

    protected $fillable = [
        'task_id',
        'user_id',
        'action_type',
        'from_state',
        'to_state',
        'changes',
        'comment',
        'channel',
    ];

    protected $casts = [
        'changes' => 'array',
        'created_at' => 'datetime',
    ];

    protected static function booted(): void
    {
        static::creating(function ($action) {
            $action->created_at = now();
        });
    }

    public function task(): BelongsTo
    {
        return $this->belongsTo(Task::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    // Action type constants
    const TYPE_CREATED = 'created';
    const TYPE_ASSIGNED = 'assigned';
    const TYPE_STATE_CHANGED = 'state_changed';
    const TYPE_COMMENTED = 'commented';
    const TYPE_UPDATED = 'updated';
    const TYPE_ATTACHMENT_ADDED = 'attachment_added';
    const TYPE_DUE_DATE_CHANGED = 'due_date_changed';
    const TYPE_PRIORITY_CHANGED = 'priority_changed';
}
```

### TaskMessage Model
```php
<?php
// app/Models/TaskMessage.php

namespace App\Models;

use App\Models\Concerns\HasUuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class TaskMessage extends Model
{
    use HasFactory, HasUuid, SoftDeletes;

    protected $fillable = [
        'task_id',
        'user_id',
        'content',
        'channel',
        'mentions',
        'reply_to_id',
    ];

    protected $casts = [
        'mentions' => 'array',
    ];

    public function task(): BelongsTo
    {
        return $this->belongsTo(Task::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function replyTo(): BelongsTo
    {
        return $this->belongsTo(TaskMessage::class, 'reply_to_id');
    }
}
```

### TaskDependency Model
```php
<?php
// app/Models/TaskDependency.php

namespace App\Models;

use App\Models\Concerns\HasUuid;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TaskDependency extends Model
{
    use HasUuid;

    const TYPE_FINISH_TO_START = 'finish_to_start';
    const TYPE_START_TO_START = 'start_to_start';
    const TYPE_FINISH_TO_FINISH = 'finish_to_finish';
    const TYPE_START_TO_FINISH = 'start_to_finish';

    protected $fillable = [
        'task_id',
        'depends_on_id',
        'type',
        'lag_days',
    ];

    public function task(): BelongsTo
    {
        return $this->belongsTo(Task::class);
    }

    public function dependsOn(): BelongsTo
    {
        return $this->belongsTo(Task::class, 'depends_on_id');
    }

    public function isBlocking(): bool
    {
        $dependency = $this->dependsOn;
        
        return match($this->type) {
            self::TYPE_FINISH_TO_START => !$dependency->state->isTerminal(),
            self::TYPE_START_TO_START => !$dependency->started_at,
            self::TYPE_FINISH_TO_FINISH => !$dependency->completed_at,
            self::TYPE_START_TO_FINISH => !$dependency->started_at,
            default => false,
        };
    }
}
```

### Question Model
```php
<?php
// app/Models/Question.php

namespace App\Models;

use App\Enums\QuestionStatus;
use App\Enums\TaskPriority;
use App\Models\Concerns\HasUuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Question extends Model
{
    use HasFactory, HasUuid, SoftDeletes;

    protected $fillable = [
        'organization_id',
        'project_id',
        'author_id',
        'accepted_answer_id',
        'converted_task_id',
        'title',
        'body',
        'status',
        'priority',
        'tags',
        'view_count',
        'vote_count',
    ];

    protected $casts = [
        'status' => QuestionStatus::class,
        'priority' => TaskPriority::class,
        'tags' => 'array',
    ];

    // Relationships
    public function organization(): BelongsTo
    {
        return $this->belongsTo(Organization::class);
    }

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'author_id');
    }

    public function acceptedAnswer(): BelongsTo
    {
        return $this->belongsTo(Answer::class, 'accepted_answer_id');
    }

    public function convertedTask(): BelongsTo
    {
        return $this->belongsTo(Task::class, 'converted_task_id');
    }

    public function answers(): HasMany
    {
        return $this->hasMany(Answer::class)->orderByDesc('vote_count');
    }

    public function votes(): MorphMany
    {
        return $this->morphMany(QuestionVote::class, 'voteable');
    }

    // Helpers
    public function incrementViewCount(): void
    {
        $this->increment('view_count');
    }

    public function acceptAnswer(Answer $answer): void
    {
        $this->update([
            'accepted_answer_id' => $answer->id,
            'status' => QuestionStatus::RESOLVED,
        ]);
    }

    public function convertToTask(User $requestor): Task
    {
        $task = Task::create([
            'organization_id' => $this->organization_id,
            'project_id' => $this->project_id,
            'requestor_id' => $requestor->id,
            'title' => $this->title,
            'description' => "Converted from question:\n\n{$this->body}",
            'state' => 'pending',
            'source_channel' => 'web',
            'priority' => $this->priority->value,
        ]);

        $this->update([
            'converted_task_id' => $task->id,
            'status' => QuestionStatus::CLOSED,
        ]);

        return $task;
    }
}
```

### Answer Model
```php
<?php
// app/Models/Answer.php

namespace App\Models;

use App\Models\Concerns\HasUuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Answer extends Model
{
    use HasFactory, HasUuid, SoftDeletes;

    protected $fillable = [
        'question_id',
        'author_id',
        'body',
        'vote_count',
        'is_ai_suggested',
    ];

    protected $casts = [
        'is_ai_suggested' => 'boolean',
    ];

    public function question(): BelongsTo
    {
        return $this->belongsTo(Question::class);
    }

    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'author_id');
    }

    public function votes(): MorphMany
    {
        return $this->morphMany(QuestionVote::class, 'voteable');
    }

    public function isAccepted(): bool
    {
        return $this->question->accepted_answer_id === $this->id;
    }
}
```

### QuestionVote Model
```php
<?php
// app/Models/QuestionVote.php

namespace App\Models;

use App\Models\Concerns\HasUuid;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class QuestionVote extends Model
{
    use HasUuid;

    protected $fillable = [
        'user_id',
        'voteable_type',
        'voteable_id',
        'value',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function voteable(): MorphTo
    {
        return $this->morphTo();
    }
}
```

### Problem Model
```php
<?php
// app/Models/Problem.php

namespace App\Models;

use App\Enums\ProblemType;
use App\Enums\ProblemSeverity;
use App\Enums\ProblemStatus;
use App\Models\Concerns\HasUuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Problem extends Model
{
    use HasFactory, HasUuid, SoftDeletes;

    protected $fillable = [
        'organization_id',
        'project_id',
        'reporter_id',
        'assignee_id',
        'title',
        'description',
        'type',
        'severity',
        'status',
        'impact_score',
        'likelihood_score',
        'root_cause',
        'resolution',
        'resolved_at',
        'related_task_ids',
        'tags',
    ];

    protected $casts = [
        'type' => ProblemType::class,
        'severity' => ProblemSeverity::class,
        'status' => ProblemStatus::class,
        'resolved_at' => 'datetime',
        'related_task_ids' => 'array',
        'tags' => 'array',
    ];

    // Relationships
    public function organization(): BelongsTo
    {
        return $this->belongsTo(Organization::class);
    }

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function reporter(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reporter_id');
    }

    public function assignee(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assignee_id');
    }

    // Scopes
    public function scopeOpen($query)
    {
        return $query->whereIn('status', [ProblemStatus::OPEN, ProblemStatus::INVESTIGATING]);
    }

    public function scopeBySeverity($query, ProblemSeverity $severity)
    {
        return $query->where('severity', $severity);
    }

    public function scopeByType($query, ProblemType $type)
    {
        return $query->where('type', $type);
    }

    // Helpers
    public function getRiskScore(): ?int
    {
        if ($this->impact_score && $this->likelihood_score) {
            return $this->impact_score * $this->likelihood_score;
        }
        return null;
    }

    public function resolve(string $resolution): void
    {
        $this->update([
            'status' => ProblemStatus::RESOLVED,
            'resolution' => $resolution,
            'resolved_at' => now(),
        ]);
    }
}
```

### Sprint Model
```php
<?php
// app/Models/Sprint.php

namespace App\Models;

use App\Models\Concerns\HasUuid;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Sprint extends Model
{
    use HasUuid;

    protected $fillable = [
        'project_id',
        'name',
        'goal',
        'start_date',
        'end_date',
        'status',
        'velocity',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
    ];

    const STATUS_PLANNING = 'planning';
    const STATUS_ACTIVE = 'active';
    const STATUS_COMPLETED = 'completed';

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function tasks(): HasMany
    {
        return $this->hasMany(Task::class);
    }

    public function isActive(): bool
    {
        return $this->status === self::STATUS_ACTIVE;
    }

    public function getCompletedTaskCount(): int
    {
        return $this->tasks()->where('state', 'completed')->count();
    }

    public function getTotalTaskCount(): int
    {
        return $this->tasks()->count();
    }

    public function calculateVelocity(): int
    {
        return $this->tasks()
            ->where('state', 'completed')
            ->sum('estimated_hours') ?? 0;
    }
}
```

### Milestone Model
```php
<?php
// app/Models/Milestone.php

namespace App\Models;

use App\Models\Concerns\HasUuid;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Milestone extends Model
{
    use HasUuid;

    protected $fillable = [
        'project_id',
        'name',
        'description',
        'target_date',
        'completed_date',
        'status',
    ];

    protected $casts = [
        'target_date' => 'date',
        'completed_date' => 'date',
    ];

    const STATUS_PENDING = 'pending';
    const STATUS_IN_PROGRESS = 'in_progress';
    const STATUS_COMPLETED = 'completed';
    const STATUS_MISSED = 'missed';

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function tasks(): HasMany
    {
        return $this->hasMany(Task::class);
    }

    public function isOverdue(): bool
    {
        return $this->target_date->isPast() 
            && $this->status !== self::STATUS_COMPLETED;
    }

    public function complete(): void
    {
        $this->update([
            'status' => self::STATUS_COMPLETED,
            'completed_date' => now(),
        ]);
    }

    public function getProgress(): float
    {
        $total = $this->tasks()->count();
        if ($total === 0) return 0;
        
        $completed = $this->tasks()->where('state', 'completed')->count();
        return round(($completed / $total) * 100, 1);
    }
}
```

---

## Model Factories

### TaskFactory
```php
<?php
// database/factories/TaskFactory.php

namespace Database\Factories;

use App\Enums\TaskState;
use App\Enums\TaskPriority;
use App\Enums\TaskChannel;
use App\Models\Organization;
use App\Models\Project;
use App\Models\Task;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class TaskFactory extends Factory
{
    protected $model = Task::class;

    public function definition(): array
    {
        return [
            'organization_id' => Organization::factory(),
            'project_id' => Project::factory(),
            'requestor_id' => User::factory(),
            'owner_id' => User::factory(),
            'title' => fake()->sentence(4),
            'description' => fake()->paragraph(),
            'state' => fake()->randomElement(TaskState::cases()),
            'source_channel' => fake()->randomElement(TaskChannel::cases()),
            'priority' => fake()->randomElement(TaskPriority::cases()),
            'due_date' => fake()->dateTimeBetween('now', '+30 days'),
            'estimated_hours' => fake()->numberBetween(1, 40),
        ];
    }

    public function pending(): static
    {
        return $this->state(fn (array $attributes) => [
            'state' => TaskState::PENDING,
        ]);
    }

    public function inProgress(): static
    {
        return $this->state(fn (array $attributes) => [
            'state' => TaskState::IN_PROGRESS,
            'started_at' => now(),
        ]);
    }

    public function completed(): static
    {
        return $this->state(fn (array $attributes) => [
            'state' => TaskState::COMPLETED,
            'started_at' => now()->subDays(3),
            'completed_at' => now(),
        ]);
    }

    public function overdue(): static
    {
        return $this->state(fn (array $attributes) => [
            'state' => TaskState::IN_PROGRESS,
            'due_date' => now()->subDays(3),
        ]);
    }

    public function fromChannel(TaskChannel $channel): static
    {
        return $this->state(fn (array $attributes) => [
            'source_channel' => $channel,
        ]);
    }
}
```

---

## ✅ Models Checklist

- [ ] HasUuid trait created
- [ ] All enums created (9 total)
- [ ] Organization model
- [ ] User model enhanced
- [ ] Project model
- [ ] ProjectMember model
- [ ] Task model with state machine
- [ ] TaskAction model
- [ ] TaskMessage model
- [ ] TaskDependency model
- [ ] Question model
- [ ] Answer model
- [ ] QuestionVote model
- [ ] Problem model
- [ ] Sprint model
- [ ] Milestone model
- [ ] TaskFactory created
