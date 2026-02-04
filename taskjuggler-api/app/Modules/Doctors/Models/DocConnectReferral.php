<?php

namespace App\Modules\Doctors\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class DocConnectReferral extends Model
{
    use HasUuids;

    protected $table = 'docconnect_referrals';

    protected $fillable = [
        'sending_provider_id',
        'receiving_provider_id',
        'patient_id',
        'specialty_requested',
        'urgency',
        'clinical_reason',
        'diagnosis_code',
        'requires_prior_auth',
        'prior_auth_type',
        'prior_auth_id',
        'status',
        'rejection_reason',
    ];

    protected $casts = [
        'requires_prior_auth' => 'boolean',
    ];

    public function sender(): BelongsTo
    {
        return $this->belongsTo(DoctorsProvider::class, 'sending_provider_id');
    }

    public function receiver(): BelongsTo
    {
        return $this->belongsTo(DoctorsProvider::class, 'receiving_provider_id');
    }

    public function patient(): BelongsTo
    {
        return $this->belongsTo(Patient::class, 'patient_id');
    }
}
