<?php

namespace App\Modules\Projects\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProjectMember extends Model
{
    use HasUuids;

    protected $fillable = [
        'project_id',
        'user_id',
        'role',
        'allocation_percentage',
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
        return in_array($this->role, ['owner', 'admin']);
    }

    public function hasPermission(string $permission): bool
    {
        // Owner and admin have all permissions
        if ($this->canManage()) {
            return true;
        }

        // Member permissions
        $memberPermissions = ['view', 'comment', 'create_task'];
        
        // Viewer permissions
        $viewerPermissions = ['view'];

        $permissions = $this->role === 'member' ? $memberPermissions : $viewerPermissions;
        
        return in_array('*', $permissions) || in_array($permission, $permissions);
    }
}



