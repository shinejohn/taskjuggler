<?php

namespace App\Modules\Doctors\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class DocConnectConnection extends Model
{
    use HasUuids;

    protected $table = 'docconnect_connections';

    protected $fillable = [
        'requester_id',
        'recipient_id',
        'status',
        'connected_at',
    ];

    protected $casts = [
        'connected_at' => 'datetime',
    ];

    public function requester(): BelongsTo
    {
        return $this->belongsTo(DoctorsProvider::class, 'requester_id');
    }

    public function recipient(): BelongsTo
    {
        return $this->belongsTo(DoctorsProvider::class, 'recipient_id');
    }
}
