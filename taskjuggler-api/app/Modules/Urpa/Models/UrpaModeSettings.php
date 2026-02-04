<?php

namespace App\Modules\Urpa\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Models\User;

class UrpaModeSettings extends Model
{
    protected $table = 'urpa_mode_settings';
    
    protected $fillable = [
        'user_id',
        'current_mode',
        'default_mode',
        'unified_view_enabled',
        'auto_switch_mode',
        'notification_preferences',
        'require_mode_confirm',
        'hipaa_session_timeout',
        'last_mode_switch',
        'last_practice_access',
    ];
    
    protected $casts = [
        'unified_view_enabled' => 'boolean',
        'auto_switch_mode' => 'boolean',
        'require_mode_confirm' => 'boolean',
        'notification_preferences' => 'array',
        'last_mode_switch' => 'datetime',
        'last_practice_access' => 'datetime',
    ];
    
    public const MODE_PRACTICE = 'practice';
    public const MODE_BUSINESS = 'business';
    public const MODE_PERSONAL = 'personal';
    public const MODE_ALL = 'all';
    
    public const VALID_MODES = [
        self::MODE_PRACTICE,
        self::MODE_BUSINESS,
        self::MODE_PERSONAL,
        self::MODE_ALL,
    ];
    
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
    
    /**
     * Check if current mode requires HIPAA compliance
     */
    public function isHIPAAMode(): bool
    {
        return $this->current_mode === self::MODE_PRACTICE;
    }
    
    /**
     * Get or create settings for a user
     */
    public static function getOrCreateForUser(int $userId): self
    {
        return self::firstOrCreate(
            ['user_id' => $userId],
            [
                'current_mode' => self::MODE_PRACTICE,
                'default_mode' => self::MODE_PRACTICE,
            ]
        );
    }
}
