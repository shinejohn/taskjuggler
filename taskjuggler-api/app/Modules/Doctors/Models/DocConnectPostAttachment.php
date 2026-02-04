<?php

namespace App\Modules\Doctors\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class DocConnectPostAttachment extends Model
{
    use HasUuids;

    protected $table = 'docconnect_post_attachments';

    protected $fillable = [
        'post_id',
        'file_name',
        'file_path',
        'file_type',
        'file_size',
    ];

    public function post()
    {
        return $this->belongsTo(DocConnectPost::class, 'post_id');
    }
}
