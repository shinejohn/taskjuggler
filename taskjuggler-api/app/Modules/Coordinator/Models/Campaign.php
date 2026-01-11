<?php

namespace App\Modules\Coordinator\Models;

use Database\Factories\Coordinator\CampaignFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Campaign extends Model
{
    use HasUuids, SoftDeletes, HasFactory;

    protected $table = 'coord_campaigns';

    protected $fillable = [
        'organization_id',
        'coordinator_id',
        'name',
        'type',
        'status',
        'description',
        'target_contacts',
        'target_count',
        'script',
        'filters',
        'scheduled_start_at',
        'scheduled_end_at',
        'schedule_rules',
        'contacts_processed',
        'contacts_contacted',
        'contacts_answered',
        'appointments_booked',
        'appointments_confirmed',
        'appointments_rescheduled',
        'answer_rate',
        'booking_rate',
        'confirmation_rate',
        'started_at',
        'completed_at',
        'paused_at',
        'settings',
        'metadata',
    ];

    protected $casts = [
        'target_contacts' => 'array',
        'script' => 'array',
        'filters' => 'array',
        'schedule_rules' => 'array',
        'settings' => 'array',
        'metadata' => 'array',
        'scheduled_start_at' => 'datetime',
        'scheduled_end_at' => 'datetime',
        'started_at' => 'datetime',
        'completed_at' => 'datetime',
        'paused_at' => 'datetime',
        'answer_rate' => 'decimal:2',
        'booking_rate' => 'decimal:2',
        'confirmation_rate' => 'decimal:2',
    ];

    // Relationships
    public function organization()
    {
        return $this->belongsTo(Organization::class, 'organization_id');
    }

    public function coordinator()
    {
        return $this->belongsTo(Coordinator::class, 'coordinator_id');
    }

    // Methods
    public function start(): void
    {
        $this->update([
            'status' => 'running',
            'started_at' => now(),
        ]);
    }

    public function pause(): void
    {
        $this->update([
            'status' => 'paused',
            'paused_at' => now(),
        ]);
    }

    public function complete(): void
    {
        $this->update([
            'status' => 'completed',
            'completed_at' => now(),
        ]);
    }

    public function cancel(): void
    {
        $this->update([
            'status' => 'cancelled',
        ]);
    }

    // Scopes
    public function scopeByStatus($query, string $status)
    {
        return $query->where('status', $status);
    }

    public function scopeActive($query)
    {
        return $query->whereIn('status', ['running', 'scheduled']);
    }

    /**
     * Create a new factory instance for the model.
     */
    protected static function newFactory()
    {
        return CampaignFactory::new();
    }
}

