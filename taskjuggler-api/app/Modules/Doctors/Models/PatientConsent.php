<?php

namespace App\Modules\Doctors\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class PatientConsent extends Model
{
    use HasUuids;

    protected $table = 'patient_consents';

    protected $fillable = [
        'patient_id',
        'consent_type',
        'specialty',
        'sharing_code',
        'consent_scope',
        'specific_providers',
        'share_history',
        'share_medications',
        'share_allergies',
        'share_labs',
        'share_imaging',
        'share_notes',
        'share_insurance',
        'share_immunizations',
        'allow_bidirectional',
        'allow_global_emergency',
        'receive_updates',
        'is_active',
        'effective_date',
        'expiration_date',
        'revoked_at',
        'revoked_reason',
        'referral_id',
        'signature_method',
        'signature_data',
        'signature_ip_address',
        'signature_user_agent',
        'witness_name',
        'witness_signature',
    ];

    protected $casts = [
        'specific_providers' => 'json',
        'share_history' => 'boolean',
        'share_medications' => 'boolean',
        'share_allergies' => 'boolean',
        'share_labs' => 'boolean',
        'share_imaging' => 'boolean',
        'share_notes' => 'boolean',
        'share_insurance' => 'boolean',
        'share_immunizations' => 'boolean',
        'allow_bidirectional' => 'boolean',
        'allow_global_emergency' => 'boolean',
        'receive_updates' => 'boolean',
        'is_active' => 'boolean',
        'effective_date' => 'datetime',
        'expiration_date' => 'datetime',
        'revoked_at' => 'datetime',
    ];

    public function patient()
    {
        return $this->belongsTo(Patient::class);
    }
}
