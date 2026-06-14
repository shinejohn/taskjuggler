<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class WorkflowDefinition extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'organization_id',
        'name',
        'description',
        'slug',
        'creator_type',
        'created_by_id',
        'api_client_id',
        'trigger_event',
        'trigger_conditions',
        'steps',
        'vertical',
        'category',
        'tags',
        'is_active',
        'is_template',
        'is_system',
        'priority',
        'max_concurrent',
        'version',
        'parent_definition_id',
    ];

    protected $casts = [
        'trigger_conditions' => 'array',
        'steps' => 'array',
        'tags' => 'array',
        'is_active' => 'boolean',
        'is_template' => 'boolean',
        'is_system' => 'boolean',
        'last_executed_at' => 'datetime',
    ];

    protected static function boot()
    {
        parent::boot();
        static::creating(function ($model) {
            $model->ulid = $model->ulid ?? (string) Str::ulid();
            $model->slug = $model->slug ?? Str::slug($model->name) . '-' . Str::random(6);
        });
    }

    // ── Relationships ──

    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by_id');
    }

    public function executions(): HasMany
    {
        return $this->hasMany(WorkflowExecution::class, 'definition_id');
    }

    public function parentDefinition(): BelongsTo
    {
        return $this->belongsTo(self::class, 'parent_definition_id');
    }

    // ── Scopes ──

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeForEvent($query, string $eventKey)
    {
        return $query->where('trigger_event', $eventKey);
    }

    public function scopeForVertical($query, ?string $vertical)
    {
        return $query->where(function ($q) use ($vertical) {
            $q->whereNull('vertical')
              ->orWhere('vertical', $vertical);
        });
    }
}
