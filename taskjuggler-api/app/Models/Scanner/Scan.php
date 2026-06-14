<?php

declare(strict_types=1);

namespace App\Models\Scanner;

use App\Models\Team;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

final class Scan extends Model
{
    use HasUuids;

    protected $table = 'scanner_scans';

    protected $fillable = [
        'team_id',
        'site_id',
        'status',
        'max_pages',
        'pages_scanned',
        'total_pages',
        'issue_count',
        'health_score',
        'category_scores',
        'error',
        'created_by',
        'started_at',
        'completed_at',
    ];

    protected function casts(): array
    {
        return [
            'category_scores' => 'array',
            'max_pages' => 'integer',
            'pages_scanned' => 'integer',
            'total_pages' => 'integer',
            'issue_count' => 'integer',
            'health_score' => 'integer',
            'started_at' => 'datetime',
            'completed_at' => 'datetime',
        ];
    }

    public function team(): BelongsTo
    {
        return $this->belongsTo(Team::class);
    }

    public function site(): BelongsTo
    {
        return $this->belongsTo(Site::class, 'site_id');
    }

    public function issues(): HasMany
    {
        return $this->hasMany(Issue::class, 'scan_id');
    }
}
