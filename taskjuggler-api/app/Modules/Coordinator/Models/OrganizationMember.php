<?php

namespace App\Modules\Coordinator\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class OrganizationMember extends Model
{
    use HasUuids;

    protected $table = 'coord_organization_members';

    protected $fillable = [
        'organization_id',
        'user_id',
        'role',
        'permissions',
    ];

    protected $casts = [
        'permissions' => 'array',
    ];

    // Relationships
    public function organization()
    {
        return $this->belongsTo(Organization::class, 'organization_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    // Scopes
    public function scopeOwners($query)
    {
        return $query->where('role', 'owner');
    }

    public function scopeAdmins($query)
    {
        return $query->where('role', 'admin');
    }
}




