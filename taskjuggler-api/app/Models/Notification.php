<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    use HasUuids;

    protected $fillable = [
        'user_id',
        'type',
        'title',
        'body',
        'data',
        'channels',
        'sent_at',
        'read_at',
    ];

    protected $casts = [
        'data' => 'array',
        'channels' => 'array',
        'sent_at' => 'datetime',
        'read_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function markAsRead(): void
    {
        $this->update(['read_at' => now()]);
    }

    public function markAsSent(): void
    {
        $this->update(['sent_at' => now()]);
    }

    public function isRead(): bool
    {
        return $this->read_at !== null;
    }

    public function isUnread(): bool
    {
        return $this->read_at === null;
    }
}
