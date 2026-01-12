<?php

namespace App\Modules\Urpa\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class UrpaContact extends Model
{
    use HasUuids, HasFactory;

    protected $table = 'urpa_contacts';

    protected $fillable = [
        'user_id',
        'first_name',
        'last_name',
        'email',
        'phone',
        'company',
        'job_title',
        'source',
        'external_id',
        'tags',
        'notes',
        'avatar_url',
        'last_contacted_at',
    ];

    protected $casts = [
        'tags' => 'array',
        'last_contacted_at' => 'datetime',
    ];

    // Relationships
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function activities(): HasMany
    {
        return $this->hasMany(UrpaActivity::class, 'contact_id');
    }

    public function phoneCalls(): HasMany
    {
        return $this->hasMany(UrpaPhoneCall::class, 'contact_id');
    }

    // Methods
    public function getFullNameAttribute(): string
    {
        return trim("{$this->first_name} {$this->last_name}") ?: 'Unknown';
    }

    public function touchLastContacted(): void
    {
        $this->update(['last_contacted_at' => now()]);
    }

    // Scopes
    public function scopeByEmail($query, string $email)
    {
        return $query->where('email', $email);
    }

    public function scopeBySource($query, string $source)
    {
        return $query->where('source', $source);
    }
}

