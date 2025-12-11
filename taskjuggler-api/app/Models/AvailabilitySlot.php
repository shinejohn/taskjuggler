<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class AvailabilitySlot extends Model
{
    use HasUuids;

    protected $fillable = [
        'user_id',
        'day_of_week',
        'start_time',
        'end_time',
        'start_date',
        'end_date',
        'specific_date',
        'timezone',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'start_time' => 'datetime:H:i:s',
        'end_time' => 'datetime:H:i:s',
        'start_date' => 'date',
        'end_date' => 'date',
        'specific_date' => 'date',
        'day_of_week' => 'integer',
    ];

    // Relationships
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
