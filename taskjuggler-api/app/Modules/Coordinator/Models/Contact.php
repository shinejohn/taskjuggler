<?php

namespace App\Modules\Coordinator\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Contact extends Model
{
    use HasUuids, SoftDeletes, HasFactory;

    protected $table = 'coord_contacts';

    protected $fillable = [
        'organization_id',
        'first_name',
        'last_name',
        'email',
        'phone',
        'phone_secondary',
        'company',
        'job_title',
        'address',
        'city',
        'state',
        'postal_code',
        'country',
        'source',
        'status',
        'tags',
        'custom_fields',
        'notes',
        'lifetime_value',
        'last_contacted_at',
    ];

    protected $casts = [
        'tags' => 'array',
        'custom_fields' => 'array',
        'lifetime_value' => 'decimal:2',
        'last_contacted_at' => 'datetime',
    ];

    // Relationships
    public function organization()
    {
        return $this->belongsTo(Organization::class, 'organization_id');
    }

    public function interactions()
    {
        return $this->hasMany(AiInteraction::class, 'contact_id');
    }

    public function appointments()
    {
        return $this->hasMany(Appointment::class, 'contact_id');
    }

    // Methods
    public function getFullNameAttribute(): string
    {
        return trim("{$this->first_name} {$this->last_name}");
    }

    public function touchLastContacted(): void
    {
        $this->update(['last_contacted_at' => now()]);
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    public function scopeByEmail($query, string $email)
    {
        return $query->where('email', $email);
    }

    public function scopeByPhone($query, string $phone)
    {
        return $query->where('phone', $phone)->orWhere('phone_secondary', $phone);
    }
}

