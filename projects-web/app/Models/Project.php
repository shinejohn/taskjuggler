<?php

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


