<?php

namespace App\Models;

use App\Models\Concerns\HasUuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class Process extends Model
{
    use HasFactory, HasUuid, SoftDeletes;

    protected $fillable = [
        'organization_id',
        'project_id',
        'name',
        'slug',
        'description',
        'status',
        'trigger_type',
        'trigger_config',
    ];

    protected $casts = [
        'trigger_config' => 'array',
    ];

    // Relationships
    public function organization(): BelongsTo
    {
        return $this->belongsTo(Organization::class);
    }

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function steps(): HasMany
    {
        return $this->hasMany(ProcessStep::class)->orderBy('order');
    }

    public function executions(): HasMany
    {
        return $this->hasMany(ProcessExecution::class);
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    public function scopeDraft($query)
    {
        return $query->where('status', 'draft');
    }

    public function scopeForOrganization($query, $organizationId)
    {
        return $query->where('organization_id', $organizationId);
    }

    // Methods
    public function publish(): bool
    {
        if ($this->status !== 'draft') {
            return false;
        }

        if ($this->steps()->count() === 0) {
            throw new \Exception('Cannot publish process without steps');
        }

        $this->status = 'active';
        return $this->save();
    }

    public function canExecute(): bool
    {
        return $this->status === 'active' && $this->steps()->count() > 0;
    }

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($process) {
            if (empty($process->slug)) {
                $baseSlug = Str::slug($process->name);
                $slug = $baseSlug;
                $counter = 1;

                // Ensure slug uniqueness within organization
                while (static::where('organization_id', $process->organization_id)
                    ->where('slug', $slug)
                    ->exists()) {
                    $slug = $baseSlug . '-' . $counter;
                    $counter++;
                }

                $process->slug = $slug;
            }
        });
    }
}
