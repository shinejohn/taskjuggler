<?php

namespace App\Modules\Doctors\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class DocConnectLike extends Model
{
    use HasUuids;

    protected $table = 'docconnect_likes';

    protected $fillable = [
        'post_id',
        'provider_id',
    ];

    public function post()
    {
        return $this->belongsTo(DocConnectPost::class, 'post_id');
    }

    public function provider()
    {
        return $this->belongsTo(Provider::class, 'provider_id');
    }
}
