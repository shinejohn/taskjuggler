<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class RoutingRule extends Model
{
    use HasUuids;

    protected $fillable = [
        'user_id',
        'name',
        'description',
        'priority',
        'is_active',
        'conditions',
        'actions',
        'times_matched',
        'last_matched_at',
    ];

    protected $casts = [
        'conditions' => 'array',
        'actions' => 'array',
        'is_active' => 'boolean',
        'last_matched_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function tasks()
    {
        return $this->hasMany(Task::class);
    }

    public function incrementMatches(): void
    {
        $this->increment('times_matched');
        $this->update(['last_matched_at' => now()]);
    }
}
