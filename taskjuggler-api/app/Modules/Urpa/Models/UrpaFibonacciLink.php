<?php

namespace App\Modules\Urpa\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UrpaFibonacciLink extends Model
{
    use HasUuids, HasFactory;

    protected $table = 'urpa_fibonacci_link';

    protected $fillable = [
        'urpa_user_id',
        'fibonacci_business_id',
        'sync_faqs',
        'sync_polls',
        'sync_business_info',
        'publishing_enabled',
        'publishing_team_id',
    ];

    protected $casts = [
        'sync_faqs' => 'boolean',
        'sync_polls' => 'boolean',
        'sync_business_info' => 'boolean',
        'publishing_enabled' => 'boolean',
    ];

    // Relationships
    public function urpaUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'urpa_user_id');
    }

    // Methods
    public function isLinked(): bool
    {
        return $this->fibonacci_business_id !== null;
    }

    public function hasPublishingEnabled(): bool
    {
        return $this->publishing_enabled && $this->publishing_team_id !== null;
    }
}

