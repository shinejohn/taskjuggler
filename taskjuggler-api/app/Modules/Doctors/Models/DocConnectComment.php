<?php

namespace App\Modules\Doctors\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class DocConnectComment extends Model
{
    use HasUuids;

    protected $table = 'docconnect_comments';

    protected $fillable = [
        'post_id',
        'provider_id',
        'parent_id',
        'content',
    ];

    public function post()
    {
        return $this->belongsTo(DocConnectPost::class, 'post_id');
    }

    public function provider()
    {
        return $this->belongsTo(Provider::class, 'provider_id');
    }

    public function parent()
    {
        return $this->belongsTo(DocConnectComment::class, 'parent_id');
    }

    public function replies()
    {
        return $this->hasMany(DocConnectComment::class, 'parent_id');
    }
}
