<?php

namespace App\Modules\Doctors\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Patient extends Model
{
    use HasUuids, SoftDeletes;

    protected $table = 'doctors_patients';

    protected $fillable = [
        'organization_id',
        'user_id',
        'first_name',
        'last_name',
        'dob',
        'email',
        'phone',
        'address',
        'insurance_info',
        'portal_status',
        'portal_last_login_at',
    ];

    protected $casts = [
        'dob' => 'date',
        'insurance_info' => 'json',
        'portal_last_login_at' => 'datetime',
    ];

    public function getFullNameAttribute()
    {
        return "{$this->first_name} {$this->last_name}";
    }

    public function user()
    {
        return $this->belongsTo(\App\Models\User::class);
    }

    public function referrals()
    {
        return $this->hasMany(Referral::class, 'patient_id');
    }

    public function notifications()
    {
        return $this->hasMany(PatientNotification::class, 'patient_id')->orderBy('created_at', 'desc');
    }

    public function visitItems()
    {
        return $this->hasMany(PatientVisitItem::class, 'patient_id')->orderBy('created_at', 'desc');
    }

    public function consents()
    {
        return $this->hasMany(PatientConsent::class, 'patient_id');
    }
}
