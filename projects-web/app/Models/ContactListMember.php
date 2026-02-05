<?php

namespace App\Models;

use App\Models\Concerns\HasUuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ContactListMember extends Model
{
    use HasFactory, HasUuid;

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

    // Relationships
    public function list(): BelongsTo
    {
        return $this->belongsTo(ContactList::class, 'list_id');
    }
}
