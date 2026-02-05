<?php

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

    // New relationships from taskjuggler-api
    public function teams(): BelongsToMany
    {
        return $this->belongsToMany(Team::class, 'team_members')
            ->withPivot('is_admin', 'joined_at')
            ->withTimestamps();
    }

    public function inboxItems(): HasMany
    {
        return $this->hasMany(InboxItem::class);
    }

    public function routingRules(): HasMany
    {
        return $this->hasMany(RoutingRule::class);
    }

    public function contactLists(): HasMany
    {
        return $this->hasMany(ContactList::class);
    }

    public function assistantChannels(): HasMany
    {
        return $this->hasMany(AssistantChannel::class);
    }

    public function sentMessages(): HasMany
    {
        return $this->hasMany(DirectMessage::class, 'sender_id');
    }

    public function receivedMessages(): HasMany
    {
        return $this->hasMany(DirectMessage::class, 'recipient_id');
    }

    public function notifications(): HasMany
    {
        return $this->hasMany(Notification::class);
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
