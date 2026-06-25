<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class ContactListMember extends Model
{
    use HasUuids;

    // Table has created_at only (no updated_at) — disable Eloquent's updated_at
    // to prevent "no column updated_at" on insert/update.
    const UPDATED_AT = null;

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
