<?php

namespace App\Modules\Doctors\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Provider extends Model
{
    use HasUuids, SoftDeletes;

    protected $table = 'doctors_providers';

    protected $fillable = [
        'user_id',
        'organization_id',
        'specialty',
        'license_number',
        'npi_number',
        'bio',
        'availability',
    ];

    protected $casts = [
        'availability' => 'json',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function posts()
    {
        return $this->hasMany(DocConnectPost::class, 'provider_id');
    }

    public function onlineStatus()
    {
        return $this->hasOne(DocConnectOnlineStatus::class, 'provider_id');
    }
}
