<?php

namespace App\Modules\Core\Models;

use App\Models\User;
use App\Models\Task;
use App\Models\TeamInvitation;
use App\Modules\Core\Models\Profile;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Team extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'avatar_url',
        'owner_id',
        'created_by',
        'profile_id',
        'settings',
    ];

    /**
     * Team creator
     */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Profile this team belongs to
     */
    public function profile(): BelongsTo
    {
        return $this->belongsTo(Profile::class);
    }

    /**
     * Team members
     */
    public function members(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'team_members')
            ->withPivot(['is_admin', 'joined_at'])
            ->withTimestamps();
    }

    /**
     * Team admins
     */
    public function admins(): BelongsToMany
    {
        return $this->members()->wherePivot('is_admin', true);
    }

    /**
     * Tasks assigned to this team
     */
    public function tasks(): HasMany
    {
        return $this->hasMany(Task::class);
    }

    /**
     * Pending invitations
     */
    public function invitations(): HasMany
    {
        return $this->hasMany(TeamInvitation::class);
    }

    /**
     * Check if user is a member
     */
    public function hasMember(User $user): bool
    {
        return $this->members()->where('user_id', $user->id)->exists();
    }

    /**
     * Check if user is an admin
     */
    public function hasAdmin(User $user): bool
    {
        return $this->admins()->where('user_id', $user->id)->exists();
    }

    /**
     * Add a member
     */
    public function addMember(User $user, bool $isAdmin = false): void
    {
        if (!$this->hasMember($user)) {
            // Use Laravel's attach method for pivot tables
            // Convert UUID to string for SQLite compatibility
            $userId = is_string($user->id) ? $user->id : (string) $user->id;
            $this->members()->attach($userId, [
                'is_admin' => $isAdmin,
                'joined_at' => now(),
            ]);
        }
    }

    /**
     * Remove a member
     */
    public function removeMember(User $user): void
    {
        $this->members()->detach($user->id);
    }
}

