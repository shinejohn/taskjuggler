<?php

namespace App\Modules\Coordinator\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CallLog extends Model
{
    use HasFactory;
    protected $table = 'coord_call_logs';

    protected $fillable = [
        'organization_id',
        'coordinator_id',
        'contact_id',
        'phone_number_id',
        'direction',
        'from_number',
        'to_number',
        'status',
        'duration_seconds',
        'recording_url',
        'transcript',
        'transcript_segments',
        'ai_summary',
        'outcome',
        'metadata',
        'provider',
        'provider_call_id',
        'cost',
        'started_at',
        'answered_at',
        'ended_at',
    ];

    protected $casts = [
        'transcript_segments' => 'array',
        'metadata' => 'array',
        'cost' => 'decimal:4',
        'started_at' => 'datetime',
        'answered_at' => 'datetime',
        'ended_at' => 'datetime',
    ];

    public function organization(): BelongsTo
    {
        return $this->belongsTo(Organization::class);
    }

    public function coordinator(): BelongsTo
    {
        return $this->belongsTo(Coordinator::class);
    }

    public function contact(): BelongsTo
    {
        return $this->belongsTo(Contact::class);
    }
}

