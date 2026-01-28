<?php

namespace App\Modules\OfficialNotice\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class Signature extends Model
{
    use HasUuids;

    protected $guarded = ['id'];

    protected $casts = [
        'verification_waiver_accepted' => 'boolean',
        'verification_waiver_accepted_at' => 'datetime',
        'face_match_performed' => 'boolean',
        'face_match_timestamp' => 'datetime',
        'face_liveness_check_passed' => 'boolean',
        'signed_at' => 'datetime',
        'face_match_confidence' => 'decimal:4',
        'geolocation_lat' => 'decimal:8',
        'geolocation_lng' => 'decimal:8',
    ];

    public function signingSession()
    {
        return $this->belongsTo(SigningSession::class);
    }

    public function auditLogs()
    {
        return $this->hasMany(SignatureAuditLog::class);
    }

    public function identityVerification()
    {
        return $this->belongsTo(IdentityVerification::class);
    }
}
