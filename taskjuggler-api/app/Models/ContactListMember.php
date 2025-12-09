<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class ContactListMember extends Model
{
    use HasUuids;

    protected $fillable = [
        'list_id',
        'name',
        'phone',
        'email',
        'metadata',
    ];

    protected $casts = [
        'metadata' => 'array',
    ];

    public function list()
    {
        return $this->belongsTo(ContactList::class, 'list_id');
    }
}
