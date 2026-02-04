<?php

namespace App\Modules\Urpa\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Models\User;

class UrpaHipaaAuditLog extends Model
{
    protected $table = 'urpa_hipaa_audit_log';
    
    // Disable updated_at since we only track created_at
    public $timestamps = false;
    
    protected $fillable = [
        'user_id',
        'action',
        'resource_type',
        'resource_id',
        'from_mode',
        'to_mode',
        'ip_address',
        'user_agent',
        'additional_data',
    ];
    
    protected $casts = [
        'additional_data' => 'array',
        'created_at' => 'datetime',
    ];
    
    // Action constants
    public const ACTION_MODE_SWITCH = 'MODE_SWITCH';
    public const ACTION_PHI_ACCESS = 'PHI_ACCESS';
    public const ACTION_PHI_CREATE = 'PHI_CREATE';
    public const ACTION_PHI_UPDATE = 'PHI_UPDATE';
    public const ACTION_PHI_DELETE = 'PHI_DELETE';
    public const ACTION_PHI_EXPORT = 'PHI_EXPORT';
    public const ACTION_LOGIN = 'LOGIN';
    public const ACTION_LOGOUT = 'LOGOUT';
    
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
    
    /**
     * Log a mode switch event
     */
    public static function logModeSwitch(
        int $userId,
        string $fromMode,
        string $toMode,
        ?string $ipAddress = null,
        ?string $userAgent = null
    ): self {
        return self::create([
            'user_id' => $userId,
            'action' => self::ACTION_MODE_SWITCH,
            'from_mode' => $fromMode,
            'to_mode' => $toMode,
            'ip_address' => $ipAddress,
            'user_agent' => $userAgent,
        ]);
    }
    
    /**
     * Log PHI access
     */
    public static function logPHIAccess(
        int $userId,
        string $resourceType,
        int $resourceId,
        ?array $additionalData = null,
        ?string $ipAddress = null,
        ?string $userAgent = null
    ): self {
        return self::create([
            'user_id' => $userId,
            'action' => self::ACTION_PHI_ACCESS,
            'resource_type' => $resourceType,
            'resource_id' => $resourceId,
            'additional_data' => $additionalData,
            'ip_address' => $ipAddress,
            'user_agent' => $userAgent,
        ]);
    }
}
