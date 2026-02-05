<?php

namespace App\Models;

use App\Models\Concerns\HasUuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class AssistantChannel extends Model
{
    use HasFactory, HasUuid;

    protected $fillable = [
        'user_id',
        'organization_id',
        'channel_type',
        'phone_number',
        'twilio_sid',
        'email_address',
        'is_active',
        'greeting_message',
        'voicemail_greeting',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    const TYPE_PHONE = 'phone';
    const TYPE_EMAIL = 'email';
    const TYPE_SMS = 'sms';

    // Relationships
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function organization(): BelongsTo
    {
        return $this->belongsTo(Organization::class);
    }

    public function inboxItems(): HasMany
    {
        return $this->hasMany(InboxItem::class, 'channel_id');
    }

    public function tasks(): HasMany
    {
        return $this->hasMany(Task::class, 'source_channel_id');
    }

    // Methods
    public function isPhone(): bool
    {
        return $this->channel_type === self::TYPE_PHONE;
    }

    public function isEmail(): bool
    {
        return $this->channel_type === self::TYPE_EMAIL;
    }

    public function isSms(): bool
    {
        return $this->channel_type === self::TYPE_SMS;
    }
}
