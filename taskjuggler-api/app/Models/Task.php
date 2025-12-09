<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    use HasUuids;

    protected $fillable = [
        'title',
        'description',
        'status',
        'priority',
        'requestor_id',
        'owner_id',
        'team_member_id',
        'marketplace_vendor_id',
        'source_type',
        'source_channel_id',
        'extracted_data',
        'routing_rule_id',
        'contact_name',
        'contact_phone',
        'contact_email',
        'location_address',
        'location_unit',
        'location_city',
        'location_state',
        'location_zip',
        'location_coords',
        'due_date',
        'start_date',
        'completed_at',
        'marketplace_listing_id',
        'deliverables',
        'tags',
        'metadata',
    ];

    protected $casts = [
        'extracted_data' => 'array',
        'deliverables' => 'array',
        'tags' => 'array',
        'metadata' => 'array',
        'location_coords' => 'array',
        'due_date' => 'datetime',
        'start_date' => 'datetime',
        'completed_at' => 'datetime',
    ];

    // Statuses
    const STATUS_PENDING = 'pending';
    const STATUS_ACCEPTED = 'accepted';
    const STATUS_IN_PROGRESS = 'in_progress';
    const STATUS_COMPLETED = 'completed';
    const STATUS_CANCELLED = 'cancelled';

    // Priorities
    const PRIORITY_LOW = 'low';
    const PRIORITY_NORMAL = 'normal';
    const PRIORITY_HIGH = 'high';
    const PRIORITY_URGENT = 'urgent';

    // Relationships
    public function requestor()
    {
        return $this->belongsTo(User::class, 'requestor_id');
    }

    public function owner()
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    public function teamMember()
    {
        return $this->belongsTo(TeamMember::class);
    }

    public function marketplaceVendor()
    {
        return $this->belongsTo(MarketplaceVendor::class);
    }

    public function routingRule()
    {
        return $this->belongsTo(RoutingRule::class);
    }

    public function sourceChannel()
    {
        return $this->belongsTo(AssistantChannel::class, 'source_channel_id');
    }

    public function marketplaceListing()
    {
        return $this->hasOne(MarketplaceListing::class);
    }

    public function aiExecutions()
    {
        return $this->hasMany(AiToolExecution::class);
    }

    // Scopes
    public function scopeForUser($query, User $user)
    {
        return $query->where('requestor_id', $user->id)
            ->orWhere('owner_id', $user->id);
    }

    public function scopeStatus($query, string $status)
    {
        return $query->where('status', $status);
    }

    public function scopePending($query)
    {
        return $query->where('status', self::STATUS_PENDING);
    }

    // Methods
    public function markCompleted(): void
    {
        $this->update([
            'status' => self::STATUS_COMPLETED,
            'completed_at' => now(),
        ]);
    }

    public function assignTo(User|TeamMember|MarketplaceVendor $assignee): void
    {
        if ($assignee instanceof User) {
            $this->update(['owner_id' => $assignee->id]);
        } elseif ($assignee instanceof TeamMember) {
            $this->update(['team_member_id' => $assignee->id]);
        } elseif ($assignee instanceof MarketplaceVendor) {
            $this->update(['marketplace_vendor_id' => $assignee->id]);
        }

        $this->update(['status' => self::STATUS_ACCEPTED]);
    }

    public function addDeliverable(string $url, string $type, array $metadata = []): void
    {
        $deliverables = $this->deliverables ?? [];
        $deliverables[] = [
            'url' => $url,
            'type' => $type,
            'metadata' => $metadata,
            'added_at' => now()->toIso8601String(),
        ];
        $this->update(['deliverables' => $deliverables]);
    }
}
