<?php

namespace App\Modules\OfficialNotice\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class SignatureAuditLog extends Model
{
    use HasUuids;

    protected $guarded = ['id'];

    protected $casts = [
        'event_data' => 'array',
    ];

    public function signature()
    {
        return $this->belongsTo(Signature::class);
    }
}
