<?php

namespace App\Models;

use App\Enums\ProblemType;
use App\Enums\ProblemSeverity;
use App\Enums\ProblemStatus;
use App\Models\Concerns\HasUuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Problem extends Model
{
    use HasFactory, HasUuid, SoftDeletes;

    protected $fillable = [
        'organization_id',
        'project_id',
        'reporter_id',
        'assignee_id',
        'title',
        'description',
        'type',
        'severity',
        'status',
        'impact_score',
        'likelihood_score',
        'root_cause',
        'resolution',
        'resolved_at',
        'related_task_ids',
        'tags',
    ];

    protected $casts = [
        'type' => ProblemType::class,
        'severity' => ProblemSeverity::class,
        'status' => ProblemStatus::class,
        'resolved_at' => 'datetime',
        'related_task_ids' => 'array',
        'tags' => 'array',
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

    public function reporter(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reporter_id');
    }

    public function assignee(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assignee_id');
    }

    // Scopes
    public function scopeOpen($query)
    {
        return $query->whereIn('status', [ProblemStatus::OPEN, ProblemStatus::INVESTIGATING]);
    }

    public function scopeBySeverity($query, ProblemSeverity $severity)
    {
        return $query->where('severity', $severity);
    }

    public function scopeByType($query, ProblemType $type)
    {
        return $query->where('type', $type);
    }

    // Helpers
    public function getRiskScore(): ?int
    {
        if ($this->impact_score && $this->likelihood_score) {
            return $this->impact_score * $this->likelihood_score;
        }
        return null;
    }

    public function resolve(string $resolution): void
    {
        $this->update([
            'status' => ProblemStatus::RESOLVED,
            'resolution' => $resolution,
            'resolved_at' => now(),
        ]);
    }
}


