<?php

namespace App\Models;

use App\Models\Concerns\HasUuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MarketplaceBid extends Model
{
    use HasFactory, HasUuid;

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

    // Relationships
    public function listing(): BelongsTo
    {
        return $this->belongsTo(MarketplaceListing::class, 'listing_id');
    }

    public function vendor(): BelongsTo
    {
        return $this->belongsTo(MarketplaceVendor::class, 'vendor_id');
    }
}
