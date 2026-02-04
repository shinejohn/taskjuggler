<?php

namespace App\Models;

use Spatie\Permission\Models\Role as SpatieRole;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Role extends SpatieRole
{
    // use HasUuids; // [FIX] DB uses integer IDs

    // public $incrementing = false;
    // protected $keyType = 'string';

    protected $fillable = [
        'organization_id',
        'name',
        'guard_name',
        'slug',
        'description',
        'is_system_role',
        'color',
        'display_order'
    ];

    protected $casts = [
        'is_system_role' => 'boolean',
        'display_order' => 'integer',
    ];

    // Relationships
    public function organization()
    {
        return $this->belongsTo(\App\Modules\Coordinator\Models\Organization::class, 'organization_id');
    }

    // Custom Pivot for Role-Permissions (if we use a model for the pivot)
    // Note: Spatie relationships usually handle the pivot table interactions. 
    // To access pivot data like 'granted' or 'scope', we need 'withPivot' on the relationship.
    public function permissions(): \Illuminate\Database\Eloquent\Relations\BelongsToMany
    {
        return $this->belongsToMany(
            config('permission.models.permission'),
            config('permission.table_names.role_has_permissions'),
            config('permission.column_names.role_pivot_key'),
            config('permission.column_names.permission_pivot_key')
        )->withPivot(['granted', 'scope_type', 'scope_value']);
    }
}
