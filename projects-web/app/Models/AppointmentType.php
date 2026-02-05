<?php

namespace App\Models;

use App\Models\Concerns\HasUuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class AppointmentType extends Model
{
    use HasFactory, HasUuid;

    protected $fillable = [
        'user_id',
        'organization_id',
        'name',
        'description',
        'duration_minutes',
        'color',
        'is_active',
        'buffer_before_minutes',
        'buffer_after_minutes',
        'advance_booking_days',
        'cancellation_hours',
        'price',
        'currency',
        'booking_slug',
        'is_public',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'is_public' => 'boolean',
        'price' => 'decimal:2',
    ];

    // Relationships
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function organization(): BelongsTo
    {
        return $this->belongsTo(Organization::class);
    }

    public function availabilitySlots(): HasMany
    {
        return $this->hasMany(AvailabilitySlot::class);
    }

    public function appointments(): HasMany
    {
        return $this->hasMany(Appointment::class);
    }

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($appointmentType) {
            if (empty($appointmentType->booking_slug)) {
                $appointmentType->booking_slug = Str::slug($appointmentType->name) . '-' . Str::random(8);
            }
        });
    }
}
