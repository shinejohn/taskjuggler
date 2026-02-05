<?php

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


