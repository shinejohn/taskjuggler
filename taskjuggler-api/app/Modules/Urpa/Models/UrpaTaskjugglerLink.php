<?php

namespace App\Modules\Urpa\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UrpaTaskjugglerLink extends Model
{
    use HasUuids, HasFactory;

    protected $table = 'urpa_taskjuggler_link';

    protected $fillable = [
        'urpa_user_id',
        'taskjuggler_user_id',
        'sync_tasks',
        'sync_projects',
        'auto_create_tasks',
        'urpa_originated',
        'tj_originated',
    ];

    protected $casts = [
        'sync_tasks' => 'boolean',
        'sync_projects' => 'boolean',
        'auto_create_tasks' => 'boolean',
        'urpa_originated' => 'boolean',
        'tj_originated' => 'boolean',
    ];

    // Relationships
    public function urpaUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'urpa_user_id');
    }

    public function taskjugglerUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'taskjuggler_user_id');
    }

    // Methods
    public function isLinked(): bool
    {
        return $this->taskjuggler_user_id !== null;
    }
}

