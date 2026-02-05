<?php

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


