<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class ContactList extends Model
{
    use HasUuids;

    // Table has created_at only (no updated_at) — disable Eloquent's updated_at
    // to prevent "no column updated_at" on insert/update.
    const UPDATED_AT = null;

    protected $fillable = [
        'user_id',
        'name',
        'description',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function members()
    {
        return $this->hasMany(ContactListMember::class, 'list_id');
    }
}
