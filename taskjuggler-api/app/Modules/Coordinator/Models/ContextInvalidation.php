<?php

namespace App\Modules\Coordinator\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class ContextInvalidation extends Model
{
    use HasUuids;

    protected $table = 'coord_context_invalidations';

    protected $fillable = [
        'organization_id',
        'context_packet_id',
        'event_type',
        'sections_affected',
        'urgency',
        'delivery_method',
        'delivered',
        'delivered_at',
        'metadata',
    ];

    protected $casts = [
        'sections_affected' => 'array',
        'metadata' => 'array',
        'delivered' => 'boolean',
        'delivered_at' => 'datetime',
    ];

    // Relationships
    public function organization()
    {
        return $this->belongsTo(Organization::class, 'organization_id');
    }

    public function contextPacket()
    {
        return $this->belongsTo(ContextPacket::class, 'context_packet_id');
    }

    // Methods
    public function markAsDelivered(): void
    {
        $this->update([
            'delivered' => true,
            'delivered_at' => now(),
        ]);
    }

    // Scopes
    public function scopeUndelivered($query)
    {
        return $query->where('delivered', false);
    }

    public function scopeImmediate($query)
    {
        return $query->where('urgency', 'immediate');
    }

    public function scopeByEventType($query, string $eventType)
    {
        return $query->where('event_type', $eventType);
    }
}




