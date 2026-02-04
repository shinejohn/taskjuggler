<?php

namespace App\Modules\OfficialNotice\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class SigningSession extends Model
{
    use HasUuids;

    protected $table = 'on_signing_sessions';

    protected $guarded = ['id'];

    protected $casts = [
        'verification_required' => 'boolean',
        'verification_ratcheted_up' => 'boolean',
        'signing_deadline' => 'datetime',
        'reminder_sent_at' => 'datetime',
    ];

    public function signatures()
    {
        return $this->hasMany(Signature::class, 'session_id');
    }

    public function document()
    {
        return $this->belongsTo(Document::class);
    }
}
