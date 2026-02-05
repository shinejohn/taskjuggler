<?php

namespace App\Models;

use App\Models\Concerns\HasUuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class MarketplaceListing extends Model
{
    use HasFactory, HasUuid;

    protected $fillable = [
        'requestor_id',
        'organization_id',
        'task_id',
        'title',
        'description',
        'category',
        'location_required',
        'location',
        'location_radius_miles',
        'budget_type',
        'budget_min',
        'budget_max',
        'status',
        'assigned_vendor_id',
        'assigned_at',
        'needed_by',
        'expires_at',
    ];

    protected $casts = [
        'location_required' => 'boolean',
        'location' => 'array',
        'budget_min' => 'decimal:2',
        'budget_max' => 'decimal:2',
        'assigned_at' => 'datetime',
        'needed_by' => 'datetime',
        'expires_at' => 'datetime',
    ];

    const STATUS_OPEN = 'open';
    const STATUS_ASSIGNED = 'assigned';
    const STATUS_COMPLETED = 'completed';
    const STATUS_CANCELLED = 'cancelled';

    const BUDGET_TYPE_FIXED = 'fixed';
    const BUDGET_TYPE_HOURLY = 'hourly';
    const BUDGET_TYPE_QUOTE = 'quote';

    // Relationships
    public function requestor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'requestor_id');
    }

    public function organization(): BelongsTo
    {
        return $this->belongsTo(Organization::class);
    }

    public function task(): BelongsTo
    {
        return $this->belongsTo(Task::class);
    }

    public function assignedVendor(): BelongsTo
    {
        return $this->belongsTo(MarketplaceVendor::class, 'assigned_vendor_id');
    }

    public function bids(): HasMany
    {
        return $this->hasMany(MarketplaceBid::class, 'listing_id');
    }
}
