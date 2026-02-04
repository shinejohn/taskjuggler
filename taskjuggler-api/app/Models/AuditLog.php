<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class AuditLog extends Model
{
    use HasUuids;

    protected $table = 'audit_log';

    protected $fillable = [
        'organization_id',
        'user_id',
        'user_email',
        'user_name',
        'user_role',
        'action',
        'category',
        'severity',
        'resource_type',
        'resource_id',
        'resource_name',
        'description',
        'changes',
        'metadata',
        'ip_address',
        'user_agent'
    ];

    protected $casts = [
        'changes' => 'array',
        'metadata' => 'array',
        'severity' => 'string'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function organization()
    {
        return $this->belongsTo(\App\Modules\Coordinator\Models\Organization::class, 'organization_id');
    }
}
