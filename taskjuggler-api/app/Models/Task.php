<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Task extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'title',
        'description',
        'status',
        'color_state',
        'priority',
        'requestor_id',
        'owner_id',
        'team_member_id',
        'marketplace_vendor_id',
        'source_type',
        'source_channel_id',
        'source_channel',
        'source_channel_ref',
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
        'invite_code',
        'invite_expires_at',
        'team_id',
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
        'invite_expires_at' => 'datetime',
    ];

    // Statuses
    const STATUS_PENDING = 'pending';
    const STATUS_ACCEPTED = 'accepted';
    const STATUS_DECLINED = 'declined';
    const STATUS_WATCHING = 'watching';
    const STATUS_IN_PROGRESS = 'in_progress';
    const STATUS_COMPLETED = 'completed';
    const STATUS_CANCELLED = 'cancelled';
    const STATUS_OVERDUE = 'overdue';

    // Color state constants
    const COLOR_BLUE = 'blue';      // Normal/default
    const COLOR_GREEN = 'green';    // Completed
    const COLOR_YELLOW = 'yellow';  // Due soon (within 24 hours)
    const COLOR_RED = 'red';        // Overdue

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

    public function actions()
    {
        return $this->hasMany(TaskAction::class)->orderBy('created_at', 'desc');
    }

    public function invitations()
    {
        return $this->hasMany(TaskInvitation::class);
    }

    /**
     * Team this task is assigned to
     */
    public function team(): BelongsTo
    {
        return $this->belongsTo(Team::class);
    }

    /**
     * Messages on this task
     */
    public function messages(): HasMany
    {
        return $this->hasMany(TaskMessage::class)->orderBy('created_at', 'asc');
    }

    /**
     * Get latest message
     */
    public function latestMessage(): HasMany
    {
        return $this->hasMany(TaskMessage::class)->latest()->limit(1);
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
    /**
     * @deprecated Use TaskStateMachine::completeTask() instead
     */
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

    // Accessors (computed fields)
    public function getRequestorNameAttribute(): ?string
    {
        return $this->requestor?->name;
    }

    public function getOwnerNameAttribute(): ?string
    {
        return $this->owner?->name;
    }

    public function getOwnerEmailAttribute(): ?string
    {
        return $this->owner?->email;
    }

    public function getOwnerPhoneAttribute(): ?string
    {
        return $this->owner?->phone;
    }

    public function getLocationAttribute(): ?array
    {
        if (!$this->location_address) {
            return null;
        }

        return [
            'address' => $this->location_address,
            'latitude' => $this->location_coords['lat'] ?? null,
            'longitude' => $this->location_coords['lng'] ?? null,
        ];
    }

    public function getContactInfoAttribute(): ?array
    {
        if (!$this->contact_phone && !$this->contact_email) {
            return null;
        }

        return [
            'phone' => $this->contact_phone,
            'email' => $this->contact_email,
        ];
    }

    /**
     * Get expected_completion as alias for due_date
     */
    public function getExpectedCompletionAttribute()
    {
        return $this->due_date;
    }

    /**
     * Set expected_completion as alias for due_date
     */
    public function setExpectedCompletionAttribute($value)
    {
        $this->attributes['due_date'] = $value;
    }

    /**
     * Calculate and update color state based on status and due date
     */
    public function updateColorState(): void
    {
        $color = $this->calculateColorState();
        
        if ($this->color_state !== $color) {
            $this->update(['color_state' => $color]);
        }
    }

    /**
     * Calculate what the color state should be
     */
    public function calculateColorState(): string
    {
        // Completed = green
        if ($this->status === self::STATUS_COMPLETED) {
            return self::COLOR_GREEN;
        }

        // Cancelled = blue (neutral)
        if ($this->status === self::STATUS_CANCELLED) {
            return self::COLOR_BLUE;
        }

        // No due date = blue
        if (!$this->due_date) {
            return self::COLOR_BLUE;
        }

        $now = now();
        $dueDate = $this->due_date;

        // Overdue = red
        if ($dueDate->isPast()) {
            return self::COLOR_RED;
        }

        // Due within 24 hours = yellow
        if ($dueDate->diffInHours($now) <= 24) {
            return self::COLOR_YELLOW;
        }

        // Default = blue
        return self::COLOR_BLUE;
    }

    /**
     * Boot method - auto-update color state
     */
    protected static function boot()
    {
        parent::boot();

        static::saving(function ($task) {
            if (!$task->color_state || $task->isDirty(['status', 'due_date'])) {
                $task->color_state = $task->calculateColorState();
            }
        });
    }

    /**
     * Add computed fields to JSON output
     */
    protected $appends = [
        'expected_completion',
        'requestor_name',
        'owner_name',
        'owner_email',
        'owner_phone',
        'location',
        'contact_info',
    ];
}
