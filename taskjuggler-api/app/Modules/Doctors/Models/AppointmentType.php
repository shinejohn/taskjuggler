<?php
/**
 * Clinical Appointment Type Model
 * Path: App\Modules\Doctors\Models\AppointmentType.php
 */

namespace App\Modules\Doctors\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class AppointmentType extends Model
{
    use HasUuids;

    protected $table = 'doctors_appointment_types';

    protected $fillable = [
        'organization_id',
        'name',
        'duration_minutes',
        'price',
    ];

    public function appointments()
    {
        return $this->hasMany(Appointment::class, 'type_id');
    }
}
