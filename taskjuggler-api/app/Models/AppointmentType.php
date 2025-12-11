<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class AppointmentType extends Model
{
    use HasUuids;

    protected $fillable = [
        'user_id',
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
        'duration_minutes' => 'integer',
        'buffer_before_minutes' => 'integer',
        'buffer_after_minutes' => 'integer',
        'advance_booking_days' => 'integer',
        'cancellation_hours' => 'integer',
        'price' => 'decimal:2',
    ];

    // Relationships
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function appointments()
    {
        return $this->hasMany(Appointment::class);
    }

    // Generate unique booking slug
    public static function generateBookingSlug(): string
    {
        do {
            $slug = 'book-' . bin2hex(random_bytes(4));
        } while (self::where('booking_slug', $slug)->exists());

        return $slug;
    }
}
