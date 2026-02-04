<?php

namespace App\Modules\Doctors\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class DocConnectProfile extends Model
{
    use HasUuids;

    protected $table = 'docconnect_profiles';

    protected $fillable = [
        'provider_id',
        'bio',
        'clinical_interests',
        'research_interests',
        'education_history',
        'publications',
        'accepted_insurances',
        'is_accepting_referrals',
        'is_visible_in_directory',
        'practice_info',
        'services',
        'insurance_billing',
        'patient_experience',
        'emergency_info',
        'communication',
        'brand_voice',
        'compliance',
        'profile_version'
    ];

    protected $casts = [
        'clinical_interests' => 'array',
        'research_interests' => 'array',
        'education_history' => 'array',
        'publications' => 'array',
        'accepted_insurances' => 'array',
        'is_accepting_referrals' => 'boolean',
        'is_visible_in_directory' => 'boolean',
        'practice_info' => 'array',
        'services' => 'array',
        'insurance_billing' => 'array',
        'patient_experience' => 'array',
        'emergency_info' => 'array',
        'communication' => 'array',
        'brand_voice' => 'array',
        'compliance' => 'array'
    ];

    public function provider(): BelongsTo
    {
        return $this->belongsTo(Provider::class, 'provider_id');
    }
}
