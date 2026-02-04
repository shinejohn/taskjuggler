<?php

namespace App\Modules\Doctors\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class Referral extends Model
{
    use HasUuids;

    protected $table = 'doctors_referrals';

    protected $fillable = [
        'referring_provider_id',
        'referring_org_id',
        'receiving_provider_id',
        'receiving_org_id',
        'patient_id',
        'specialty',
        'reason',
        'clinical_question',
        'urgency',
        'status',
        'consent_id',
        'consent_obtained_at',
        'shared_record_types',
        'shared_record_ids',
        'shared_data_hash',
        'includes_sensitive_data',
        'sensitive_data_types',
        'sensitive_consent_ids',
        'bidirectional_authorized',
        'bidirectional_consent_id',
        'sent_at',
        'received_at',
        'completed_at',
    ];

    protected $casts = [
        'consent_obtained_at' => 'datetime',
        'shared_record_types' => 'json',
        'shared_record_ids' => 'json',
        'sensitive_data_types' => 'json',
        'sensitive_consent_ids' => 'json',
        'sent_at' => 'datetime',
        'received_at' => 'datetime',
        'completed_at' => 'datetime',
    ];

    public function referringProvider()
    {
        return $this->belongsTo(Provider::class, 'referring_provider_id');
    }

    public function receivingProvider()
    {
        return $this->belongsTo(Provider::class, 'receiving_provider_id');
    }

    public function patient()
    {
        return $this->belongsTo(Patient::class, 'patient_id');
    }
}
