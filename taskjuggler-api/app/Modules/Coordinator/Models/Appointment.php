<?php

namespace App\Modules\Coordinator\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Appointment extends Model
{
    use HasUuids, SoftDeletes, HasFactory;

    protected $table = 'coord_appointments';

    protected $fillable = [
        'organization_id',
        'contact_id',
        'appointment_type_id',
        'booked_by_coordinator_id',
        'assigned_to_user_id',
        'title',
        'description',
        'starts_at',
        'ends_at',
        'status',
        'location',
        'location_type',
        'notes',
        'cancellation_reason',
        'reminders_sent',
        'confirmed_at',
        'cancelled_at',
    ];

    protected $casts = [
        'starts_at' => 'datetime',
        'ends_at' => 'datetime',
        'reminders_sent' => 'array',
        'confirmed_at' => 'datetime',
        'cancelled_at' => 'datetime',
    ];

    // Relationships
    public function organization()
    {
        return $this->belongsTo(Organization::class, 'organization_id');
    }

    public function contact()
    {
        return $this->belongsTo(Contact::class, 'contact_id');
    }

    public function appointmentType()
    {
        return $this->belongsTo(AppointmentType::class, 'appointment_type_id');
    }

    public function bookedByCoordinator()
    {
        return $this->belongsTo(Coordinator::class, 'booked_by_coordinator_id');
    }

    public function assignedToUser()
    {
        return $this->belongsTo(User::class, 'assigned_to_user_id');
    }

    // Methods
    public function confirm(): void
    {
        $this->update([
            'status' => 'confirmed',
            'confirmed_at' => now(),
        ]);
    }

    public function cancel(?string $reason = null): void
    {
        $this->update([
            'status' => 'cancelled',
            'cancelled_at' => now(),
            'cancellation_reason' => $reason,
        ]);
    }

    // Scopes
    public function scopeUpcoming($query)
    {
        return $query->where('starts_at', '>', now())
            ->whereIn('status', ['scheduled', 'confirmed']);
    }

    public function scopeByStatus($query, string $status)
    {
        return $query->where('status', $status);
    }
}

