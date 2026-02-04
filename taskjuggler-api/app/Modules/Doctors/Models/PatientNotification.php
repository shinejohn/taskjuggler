<?php

namespace App\Modules\Doctors\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class PatientNotification extends Model
{
    use HasUuids;

    protected $table = 'patient_notifications';
    public $timestamps = false; // migration uses custom timestamp column

    protected $fillable = [
        'patient_id',
        'source_type',
        'source_id',
        'source_provider_id',
        'title',
        'summary',
        'details',
        'patient_friendly_title',
        'patient_friendly_summary',
        'actions',
        'priority',
        'notification_type',
        'is_read',
        'read_at',
        'delivered_via',
    ];

    protected $casts = [
        'details' => 'json',
        'actions' => 'json',
        'delivered_via' => 'json',
        'is_read' => 'boolean',
        'read_at' => 'datetime',
        'created_at' => 'datetime',
    ];

    public function patient()
    {
        return $this->belongsTo(Patient::class);
    }

    public function provider()
    {
        return $this->belongsTo(Provider::class, 'source_provider_id');
    }
}
