<?php

namespace App\Modules\Coordinator\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class RoleTemplate extends Model
{
    use HasUuids;

    protected $table = 'coord_role_templates';

    protected $fillable = [
        'name',
        'display_name',
        'description',
        'direction',
        'base_price',
        'primary_goal',
        'capabilities',
        'channels',
        'suggested_industries',
        'default_prompts',
        'default_scripts',
        'is_active',
        'sort_order',
    ];

    protected $casts = [
        'base_price' => 'decimal:2',
        'capabilities' => 'array',
        'channels' => 'array',
        'suggested_industries' => 'array',
        'default_prompts' => 'array',
        'default_scripts' => 'array',
        'is_active' => 'boolean',
    ];

    // Relationships
    public function coordinators()
    {
        return $this->hasMany(Coordinator::class, 'role_template_id');
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeByDirection($query, string $direction)
    {
        return $query->where('direction', $direction);
    }
}




