<?php

namespace App\Modules\Projects\Models;

use App\Models\User;
use App\Modules\Core\Models\Team;
use App\Modules\Core\Models\Profile;
use App\Modules\Tasks\Models\Task;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Project extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

    protected $fillable = [
        'team_id',
        'profile_id',
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
        'start_date' => 'date',
        'target_end_date' => 'date',
        'actual_end_date' => 'date',
        'budget' => 'decimal:2',
        'budget_spent' => 'decimal:2',
        'settings' => 'array',
        'tags' => 'array',
    ];

    // Relationships
    public function team(): BelongsTo
    {
        return $this->belongsTo(Team::class);
    }

    public function profile(): BelongsTo
    {
        return $this->belongsTo(Profile::class);
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

    public function processes(): HasMany
    {
        return $this->hasMany(\App\Modules\Processes\Models\Process::class);
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    public function scopeForUser($query, User $user)
    {
        return $query->whereHas('members', fn($q) => $q->where('user_id', $user->id));
    }

    public function scopeForTeam($query, $teamId)
    {
        return $query->where('team_id', $teamId);
    }

    // Stats
    public function getTaskStats(): array
    {
        $tasks = $this->tasks()
            ->selectRaw("
                COUNT(*) as total,
                SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
                SUM(CASE WHEN status IN ('accepted', 'in_progress') THEN 1 ELSE 0 END) as active,
                SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed,
                SUM(CASE WHEN due_date < NOW() AND status NOT IN ('completed', 'cancelled') THEN 1 ELSE 0 END) as overdue
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

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($project) {
            // Auto-set profile_id from team if not provided
            if (empty($project->profile_id) && $project->team_id) {
                $team = Team::find($project->team_id);
                if ($team && $team->profile_id) {
                    $project->profile_id = $team->profile_id;
                }
            }
        });
    }
}

