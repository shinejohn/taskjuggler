<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class Appointment extends Model
{
    use HasUuids;

    protected $fillable = [
        'appointment_type_id',
        'host_id',
        'guest_name',
        'guest_email',
        'guest_phone',
        'start_time',
        'end_time',
        'timezone',
        'status',
        'confirmed_at',
        'cancelled_at',
        'cancellation_reason',
        'notes',
        'internal_notes',
        'meeting_location',
        'meeting_url',
        'task_id',
        'send_reminder_email',
        'send_reminder_sms',
        'booking_source',
        'ip_address',
        'user_agent',
    ];

    protected $casts = [
        'start_time' => 'datetime',
        'end_time' => 'datetime',
        'confirmed_at' => 'datetime',
        'cancelled_at' => 'datetime',
        'send_reminder_email' => 'boolean',
        'send_reminder_sms' => 'boolean',
    ];

    // Status constants
    const STATUS_SCHEDULED = 'scheduled';
    const STATUS_CONFIRMED = 'confirmed';
    const STATUS_CANCELLED = 'cancelled';
    const STATUS_COMPLETED = 'completed';
    const STATUS_NO_SHOW = 'no_show';

    // Relationships
    public function appointmentType()
    {
        return $this->belongsTo(AppointmentType::class);
    }

    public function host()
    {
        return $this->belongsTo(User::class, 'host_id');
    }

    public function task()
    {
        return $this->belongsTo(Task::class);
    }

    // Scopes
    public function scopeUpcoming($query)
    {
        return $query->where('start_time', '>', now())
            ->where('status', '!=', self::STATUS_CANCELLED);
    }

    public function scopePast($query)
    {
        return $query->where('start_time', '<', now());
    }
}
