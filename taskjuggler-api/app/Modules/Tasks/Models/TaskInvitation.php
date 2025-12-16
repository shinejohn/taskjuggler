<?php

namespace App\Modules\Tasks\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

class TaskInvitation extends Model
{
    use HasUuids;

    protected $fillable = [
        'task_id',
        'invite_code',
        'invited_email',
        'invited_phone',
        'invited_name',
        'status',
        'role',
        'invited_by_user_id',
        'accepted_by_user_id',
        'accepted_at',
        'expires_at',
    ];

    protected $casts = [
        'accepted_at' => 'datetime',
        'expires_at' => 'datetime',
    ];

    // Status constants
    const STATUS_PENDING = 'pending';
    const STATUS_ACCEPTED = 'accepted';
    const STATUS_DECLINED = 'declined';
    const STATUS_EXPIRED = 'expired';

    // Role constants
    const ROLE_OWNER = 'owner';
    const ROLE_WATCHER = 'watcher';
    const ROLE_COLLABORATOR = 'collaborator';

    protected static function boot()
    {
        parent::boot();
        
        static::creating(function ($invitation) {
            if (empty($invitation->invite_code)) {
                $invitation->invite_code = Str::random(32);
            }
            if (empty($invitation->expires_at)) {
                $invitation->expires_at = now()->addDays(7);
            }
        });
    }

    public function task(): BelongsTo
    {
        return $this->belongsTo(Task::class);
    }

    public function invitedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'invited_by_user_id');
    }

    public function acceptedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'accepted_by_user_id');
    }

    public function isExpired(): bool
    {
        return $this->expires_at && $this->expires_at->isPast();
    }

    public function isPending(): bool
    {
        return $this->status === self::STATUS_PENDING && !$this->isExpired();
    }

    public function getInviteUrl(): string
    {
        $frontendUrl = config('app.frontend_url', config('app.url'));
        return $frontendUrl . '/invite/' . $this->task_id . '/' . $this->invite_code;
    }

    public function accept(User $user): bool
    {
        if (!$this->isPending()) {
            return false;
        }

        $this->update([
            'status' => self::STATUS_ACCEPTED,
            'accepted_by_user_id' => $user->id,
            'accepted_at' => now(),
        ]);

        return true;
    }

    public function decline(): bool
    {
        if (!$this->isPending()) {
            return false;
        }

        $this->update(['status' => self::STATUS_DECLINED]);
        return true;
    }
}

