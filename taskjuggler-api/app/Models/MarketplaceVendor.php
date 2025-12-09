<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class MarketplaceVendor extends Model
{
    use HasUuids;

    protected $fillable = [
        'vendor_type',
        'user_id',
        'business_name',
        'ai_provider',
        'ai_config',
        'name',
        'description',
        'logo_url',
        'categories',
        'services',
        'service_area',
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
    ];

    protected $casts = [
        'ai_config' => 'array',
        'categories' => 'array',
        'services' => 'array',
        'service_area' => 'array',
        'is_active' => 'boolean',
        'is_verified' => 'boolean',
        'base_rate' => 'decimal:2',
        'average_rating' => 'decimal:2',
    ];

    const TYPE_HUMAN = 'human';
    const TYPE_AI = 'ai';
    const TYPE_HYBRID = 'hybrid';

    const PROVIDER_INTERNAL = 'internal';
    const PROVIDER_BOTJOB = 'botjob';
    const PROVIDER_ALPHASITE = 'alphasite';
    const PROVIDER_FOURPROJECTS = 'fourprojects';
    const PROVIDER_EXTERNAL = 'external';

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function aiToolConfig()
    {
        return $this->hasOne(AiToolConfig::class, 'vendor_id');
    }

    public function tasks()
    {
        return $this->hasMany(Task::class);
    }

    public function listings()
    {
        return $this->hasMany(MarketplaceListing::class, 'assigned_vendor_id');
    }

    public function bids()
    {
        return $this->hasMany(MarketplaceBid::class, 'vendor_id');
    }

    public function executions()
    {
        return $this->hasMany(AiToolExecution::class, 'vendor_id');
    }

    // Scopes
    public function scopeHuman($query)
    {
        return $query->where('vendor_type', self::TYPE_HUMAN);
    }

    public function scopeAi($query)
    {
        return $query->where('vendor_type', self::TYPE_AI);
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeInCategory($query, string $category)
    {
        return $query->whereJsonContains('categories', $category);
    }

    // Methods
    public function isAi(): bool
    {
        return $this->vendor_type === self::TYPE_AI;
    }

    public function isHuman(): bool
    {
        return $this->vendor_type === self::TYPE_HUMAN;
    }

    public function canAutoExecute(): bool
    {
        return $this->isAi() && $this->aiToolConfig?->auto_execute;
    }
}
