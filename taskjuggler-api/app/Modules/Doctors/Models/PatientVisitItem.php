<?php

namespace App\Modules\Doctors\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class PatientVisitItem extends Model
{
    use HasUuids;

    protected $table = 'patient_visit_items';

    protected $fillable = [
        'patient_id',
        'visit_id',
        'item_type',
        'title',
        'description',
        'why_explanation',
        'status',
        'status_message',
        'linked_record_type',
        'linked_record_id',
        'available_actions',
        'display_order',
        'is_visible',
    ];

    protected $casts = [
        'available_actions' => 'json',
        'is_visible' => 'boolean',
        'display_order' => 'integer',
    ];

    public function patient()
    {
        return $this->belongsTo(Patient::class);
    }
}
