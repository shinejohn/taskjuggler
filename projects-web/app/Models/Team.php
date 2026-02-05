<?php

namespace App\Models;

use App\Models\Concerns\HasUuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class Team extends Model
{
    use HasFactory, HasUuid, SoftDeletes;

    protected $fillable = [
        'organization_id',
        'name',
        'description',
        'avatar_url',
        'created_by',
        'invite_code',
    ];

    // Relationships
    public function organization(): BelongsTo
    {
        return $this->belongsTo(Organization::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function members(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'team_members')
            ->withPivot(['is_admin', 'joined_at'])
            ->withTimestamps();
    }

    public function teamMembers(): HasMany
    {
        return $this->hasMany(TeamMember::class);
    }

    public function admins(): BelongsToMany
    {
        return $this->members()->wherePivot('is_admin', true);
    }

    public function tasks(): HasMany
    {
        return $this->hasMany(Task::class);
    }

    public function invitations(): HasMany
    {
        return $this->hasMany(TeamInvitation::class);
    }

    // Methods
    public function hasMember(User $user): bool
    {
        return $this->members()->where('user_id', $user->id)->exists();
    }

    public function hasAdmin(User $user): bool
    {
        return $this->admins()->where('user_id', $user->id)->exists();
    }

    public function addMember(User $user, bool $isAdmin = false): void
    {
        if (!$this->hasMember($user)) {
            $this->members()->attach($user->id, [
                'is_admin' => $isAdmin,
                'joined_at' => now(),
            ]);
        }
    }

    public function removeMember(User $user): void
    {
        $this->members()->detach($user->id);
    }

    public function generateInviteCode(): string
    {
        $code = Str::random(32);
        $this->update(['invite_code' => $code]);
        return $code;
    }

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($team) {
            if (empty($team->invite_code)) {
                $team->invite_code = Str::random(32);
            }
        });
    }
}
