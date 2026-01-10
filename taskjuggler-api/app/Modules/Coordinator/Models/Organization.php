<?php

namespace App\Modules\Coordinator\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Organization extends Model
{
    use HasUuids, SoftDeletes, HasFactory;

    protected $table = 'coord_organizations';

    protected $fillable = [
        'user_id',
        'name',
        'slug',
        'industry',
        'phone',
        'email',
        'website',
        'address',
        'city',
        'state',
        'postal_code',
        'country',
        'timezone',
        'business_hours',
        'settings',
        'subscription_tier',
        'subscription_status',
        'stripe_customer_id',
        'stripe_subscription_id',
        'stripe_payment_method_id',
        'compliance_modes',
        'trial_ends_at',
    ];

    protected $casts = [
        'business_hours' => 'array',
        'settings' => 'array',
        'compliance_modes' => 'array',
        'trial_ends_at' => 'datetime',
    ];

    // Relationships
    public function owner()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function members()
    {
        return $this->hasMany(OrganizationMember::class, 'organization_id');
    }

    public function coordinators()
    {
        return $this->hasMany(Coordinator::class, 'organization_id');
    }

    public function contacts()
    {
        return $this->hasMany(Contact::class, 'organization_id');
    }

    public function appointments()
    {
        return $this->hasMany(Appointment::class, 'organization_id');
    }

    public function aiAgents()
    {
        return $this->hasMany(AiAgent::class, 'organization_id');
    }

    public function contextPackets()
    {
        return $this->hasMany(ContextPacket::class, 'organization_id');
    }

    // Scopes
    public function scopeByIndustry($query, string $industry)
    {
        return $query->where('industry', $industry);
    }

    public function scopeByTier($query, string $tier)
    {
        return $query->where('subscription_tier', $tier);
    }

    public function scopeActive($query)
    {
        return $query->whereNull('deleted_at');
    }
}

