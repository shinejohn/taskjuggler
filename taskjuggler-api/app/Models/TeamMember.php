<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class TeamMember extends Model
{
    use HasUuids;

    protected $fillable = [
        'owner_id',
        'user_id',
        'name',
        'email',
        'phone',
        'role',
        'can_receive_tasks',
        'notification_preferences',
    ];

    protected $casts = [
        'can_receive_tasks' => 'boolean',
        'notification_preferences' => 'array',
    ];

    public function owner()
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function tasks()
    {
        return $this->hasMany(Task::class, 'team_member_id');
    }

    public function hasAccount(): bool
    {
        return $this->user_id !== null;
    }
}
