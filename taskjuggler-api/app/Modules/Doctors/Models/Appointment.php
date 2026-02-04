<?php
/**
 * Clinical Appointment Model
 * Path: App\Modules\Doctors\Models\Appointment.php
 */

namespace App\Modules\Doctors\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Appointment extends Model
{
    use HasUuids, SoftDeletes;

    protected $table = 'doctors_appointments';

    protected $fillable = [
        'organization_id',
        'patient_id',
        'provider_id',
        'type_id',
        'start_time',
        'end_time',
        'status',
        'notes',
    ];

    protected $casts = [
        'start_time' => 'datetime',
        'end_time' => 'datetime',
    ];

    public function patient()
    {
        return $this->belongsTo(Patient::class, 'patient_id');
    }

    public function provider()
    {
        return $this->belongsTo(Provider::class, 'provider_id');
    }

    public function type()
    {
        return $this->belongsTo(AppointmentType::class, 'type_id');
    }
}
