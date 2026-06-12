<?php

declare(strict_types=1);

namespace App\Modules\Projects\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProjectMilestone extends Model
{
    use HasUuids;

    public const STATUS_PENDING = 'pending';
    public const STATUS_IN_PROGRESS = 'in_progress';
    public const STATUS_COMPLETED = 'completed';
    public const STATUS_MISSED = 'missed';

    protected $fillable = [
        'project_id',
        'name',
        'description',
        'target_date',
        'status',
        'order',
        'is_critical',
        'completed_date',
    ];

    protected $casts = [
        'target_date' => 'date',
        'completed_date' => 'date',
        'is_critical' => 'boolean',
        'order' => 'integer',
    ];

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }
}
