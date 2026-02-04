<?php

namespace App\Models;

use Spatie\Permission\Models\Permission as SpatiePermission;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Permission extends SpatiePermission
{
    use HasUuids;

    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'name',
        'guard_name',
        'display_name',
        'module',
        'category',
        'description',
        'is_sensitive',
        'subscription_tier',
        'display_order'
    ];

    protected $casts = [
        'is_sensitive' => 'boolean',
        'display_order' => 'integer',
    ];

    // Scopes
    public function scopeByModule($query, $module)
    {
        return $query->where('module', $module);
    }
}
