<?php

namespace App\Modules\OfficialNotice\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;

class IdentityVerification extends Model
{
    use HasUuids;

    protected $guarded = ['id'];

    protected $casts = [
        'verified_at' => 'datetime',
        'expires_at' => 'datetime',
        'event_data' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
