<?php

namespace App\Modules\Processes\Models;

use App\Modules\Core\Models\Team;
use App\Modules\Core\Models\Profile;
use App\Modules\Projects\Models\Project;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class Process extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

    protected $fillable = [
        'team_id',
        'profile_id',
        'name',
        'slug',
        'description',
        'status',
        'trigger_type',
        'trigger_config',
        'project_id',
    ];

    protected $casts = [
        'trigger_config' => 'array',
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

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function steps(): HasMany
    {
        return $this->hasMany(ProcessStep::class)->orderBy('order');
    }

    public function executions(): HasMany
    {
        return $this->hasMany(ProcessExecution::class);
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    public function scopeDraft($query)
    {
        return $query->where('status', 'draft');
    }

    public function scopeForTeam($query, $teamId)
    {
        return $query->where('team_id', $teamId);
    }

    // Methods
    public function publish(): bool
    {
        if ($this->status !== 'draft') {
            return false;
        }

        if ($this->steps()->count() === 0) {
            throw new \Exception('Cannot publish process without steps');
        }

        $this->status = 'active';
        return $this->save();
    }

    public function canExecute(): bool
    {
        return $this->status === 'active' && $this->steps()->count() > 0;
    }

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($process) {
            if (empty($process->slug)) {
                $baseSlug = Str::slug($process->name);
                $slug = $baseSlug;
                $counter = 1;

                // Ensure slug uniqueness within team
                while (static::where('team_id', $process->team_id)
                    ->where('slug', $slug)
                    ->exists()) {
                    $slug = $baseSlug . '-' . $counter;
                    $counter++;
                }

                $process->slug = $slug;
            }

            // Auto-set profile_id from team if not provided
            if (empty($process->profile_id) && $process->team_id) {
                $team = Team::find($process->team_id);
                if ($team && $team->profile_id) {
                    $process->profile_id = $team->profile_id;
                }
            }
        });
    }
}

