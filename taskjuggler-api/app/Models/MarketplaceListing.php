<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class MarketplaceListing extends Model
{
    use HasUuids;

    protected $fillable = [
        'requestor_id',
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

    public function requestor()
    {
        return $this->belongsTo(User::class, 'requestor_id');
    }

    public function task()
    {
        return $this->belongsTo(Task::class);
    }

    public function assignedVendor()
    {
        return $this->belongsTo(MarketplaceVendor::class, 'assigned_vendor_id');
    }

    public function bids()
    {
        return $this->hasMany(MarketplaceBid::class, 'listing_id');
    }

    public function assignTo(MarketplaceVendor $vendor): void
    {
        $this->update([
            'status' => self::STATUS_ASSIGNED,
            'assigned_vendor_id' => $vendor->id,
            'assigned_at' => now(),
        ]);
    }

    public function isOpen(): bool
    {
        return $this->status === self::STATUS_OPEN;
    }

    public function isExpired(): bool
    {
        return $this->expires_at && $this->expires_at->isPast();
    }
}
