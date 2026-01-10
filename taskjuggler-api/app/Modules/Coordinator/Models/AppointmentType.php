<?php

namespace App\Modules\Coordinator\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class AppointmentType extends Model
{
    use HasUuids;

    protected $table = 'coord_appointment_types';

    protected $fillable = [
        'organization_id',
        'name',
        'description',
        'duration_minutes',
        'price',
        'color',
        'buffer_before',
        'buffer_after',
        'availability',
        'requires_confirmation',
        'allow_online_booking',
        'is_active',
        'sort_order',
    ];

    protected $casts = [
        'duration_minutes' => 'integer',
        'price' => 'decimal:2',
        'buffer_before' => 'array',
        'buffer_after' => 'array',
        'availability' => 'array',
        'requires_confirmation' => 'boolean',
        'allow_online_booking' => 'boolean',
        'is_active' => 'boolean',
    ];

    // Relationships
    public function organization()
    {
        return $this->belongsTo(Organization::class, 'organization_id');
    }

    public function appointments()
    {
        return $this->hasMany(Appointment::class, 'appointment_type_id');
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}




