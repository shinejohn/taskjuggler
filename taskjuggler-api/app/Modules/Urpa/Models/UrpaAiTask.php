<?php

namespace App\Modules\Urpa\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UrpaAiTask extends Model
{
    use HasUuids, HasFactory;

    protected $table = 'urpa_ai_tasks';

    protected $fillable = [
        'user_id',
        'session_id',
        'title',
        'description',
        'status',
        'source_type',
        'source_id',
        'taskjuggler_task_id',
        'synced_to_taskjuggler',
        'due_at',
        'completed_at',
    ];

    protected $casts = [
        'synced_to_taskjuggler' => 'boolean',
        'due_at' => 'datetime',
        'completed_at' => 'datetime',
    ];

    // Relationships
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function session(): BelongsTo
    {
        return $this->belongsTo(UrpaAiSession::class, 'session_id');
    }

    // Scopes
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function scopeCompleted($query)
    {
        return $query->where('status', 'completed');
    }

    public function scopeSynced($query)
    {
        return $query->where('synced_to_taskjuggler', true);
    }

    public function scopeNotSynced($query)
    {
        return $query->where('synced_to_taskjuggler', false);
    }

    // Methods
    public function markAsCompleted(): void
    {
        $this->update([
            'status' => 'completed',
            'completed_at' => now(),
        ]);
    }

    public function markAsSynced(string $taskjugglerTaskId): void
    {
        $this->update([
            'synced_to_taskjuggler' => true,
            'taskjuggler_task_id' => $taskjugglerTaskId,
        ]);
    }
}

