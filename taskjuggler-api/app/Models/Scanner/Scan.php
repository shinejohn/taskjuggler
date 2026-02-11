<?php

namespace App\Models\Scanner;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Scan extends Model
{
    protected $table = 'scanner_scans';

    protected $fillable = [
        'site_id',
        'team_id',
        'status',
        'started_at',
        'completed_at',
        'pages_scanned',
        'total_pages',
        'health_score',
        'category_scores',
        'issue_count',
        'error',
        'created_by',
        'max_pages',
    ];

    protected $casts = [
        'started_at' => 'datetime',
        'completed_at' => 'datetime',
        'category_scores' => 'array',
    ];

    public function site(): BelongsTo
    {
        return $this->belongsTo(Site::class, 'site_id');
    }

    public function team(): BelongsTo
    {
        return $this->belongsTo(\App\Models\Team::class, 'team_id');
    }

    public function issues(): HasMany
    {
        return $this->hasMany(Issue::class, 'scan_id');
    }
}
