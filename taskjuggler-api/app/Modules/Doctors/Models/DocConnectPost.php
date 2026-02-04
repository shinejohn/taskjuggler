<?php

namespace App\Modules\Doctors\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class DocConnectPost extends Model
{
    use HasUuids;

    protected $table = 'docconnect_posts';

    protected $fillable = [
        'provider_id',
        'organization_id',
        'content',
        'visibility',
        'likes_count',
        'comments_count',
    ];

    public function provider()
    {
        return $this->belongsTo(Provider::class, 'provider_id');
    }

    public function attachments()
    {
        return $this->hasMany(DocConnectPostAttachment::class, 'post_id');
    }

    public function comments()
    {
        return $this->hasMany(DocConnectComment::class, 'post_id');
    }

    public function likes()
    {
        return $this->hasMany(DocConnectLike::class, 'post_id');
    }
}
