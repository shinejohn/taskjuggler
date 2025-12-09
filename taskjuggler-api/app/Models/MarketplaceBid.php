<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class MarketplaceBid extends Model
{
    use HasUuids;

    protected $fillable = [
        'listing_id',
        'vendor_id',
        'amount',
        'message',
        'estimated_completion',
        'status',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'estimated_completion' => 'datetime',
    ];

    const STATUS_PENDING = 'pending';
    const STATUS_ACCEPTED = 'accepted';
    const STATUS_REJECTED = 'rejected';
    const STATUS_WITHDRAWN = 'withdrawn';

    public function listing()
    {
        return $this->belongsTo(MarketplaceListing::class, 'listing_id');
    }

    public function vendor()
    {
        return $this->belongsTo(MarketplaceVendor::class, 'vendor_id');
    }

    public function accept(): void
    {
        $this->update(['status' => self::STATUS_ACCEPTED]);
        $this->listing->assignTo($this->vendor);
    }

    public function reject(): void
    {
        $this->update(['status' => self::STATUS_REJECTED]);
    }

    public function withdraw(): void
    {
        $this->update(['status' => self::STATUS_WITHDRAWN]);
    }
}
