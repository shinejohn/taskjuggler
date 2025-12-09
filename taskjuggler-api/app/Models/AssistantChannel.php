<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class AssistantChannel extends Model
{
    use HasUuids;

    protected $fillable = [
        'user_id',
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

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function inboxItems()
    {
        return $this->hasMany(InboxItem::class, 'channel_id');
    }

    public function tasks()
    {
        return $this->hasMany(Task::class, 'source_channel_id');
    }

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
