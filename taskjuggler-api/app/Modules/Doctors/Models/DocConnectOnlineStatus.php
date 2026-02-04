<?php

namespace App\Modules\Doctors\Models;

use Illuminate\Database\Eloquent\Model;

class DocConnectOnlineStatus extends Model
{
    protected $table = 'docconnect_online_status';
    protected $primaryKey = 'provider_id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'provider_id',
        'status',
        'last_seen_at',
    ];

    protected $casts = [
        'last_seen_at' => 'datetime',
    ];

    public function provider()
    {
        return $this->belongsTo(Provider::class, 'provider_id');
    }
}
