<?php

namespace App\Models;

use App\Models\Concerns\HasUuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class MarketplaceVendor extends Model
{
    use HasFactory, HasUuid;

    protected $fillable = [
        'user_id',
        'organization_id',
        'vendor_type',
        'name',
        'description',
        'logo_url',
        'categories',
        'services',
        'address',
        'pricing_model',
        'base_rate',
        'currency',
        'is_active',
        'is_verified',
        'total_jobs',
        'completed_jobs',
        'average_rating',
        'stripe_account_id',
        'ai_config',
    ];

    protected $casts = [
        'categories' => 'array',
        'services' => 'array',
        'is_active' => 'boolean',
        'is_verified' => 'boolean',
        'base_rate' => 'decimal:2',
        'average_rating' => 'decimal:2',
        'ai_config' => 'array',
    ];

    const TYPE_HUMAN = 'human';
    const TYPE_AI_TOOL = 'ai_tool';

    // Relationships
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function organization(): BelongsTo
    {
        return $this->belongsTo(Organization::class);
    }

    public function listings(): HasMany
    {
        return $this->hasMany(MarketplaceListing::class, 'assigned_vendor_id');
    }

    public function bids(): HasMany
    {
        return $this->hasMany(MarketplaceBid::class, 'vendor_id');
    }
}
