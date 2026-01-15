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
        'issue_count',
        'category_scores',
        'created_by',
        'error',
    ];
    
    protected $casts = [
        'started_at' => 'datetime',
        'completed_at' => 'datetime',
        'category_scores' => 'array',
        'pages_scanned' => 'integer',
        'total_pages' => 'integer',
        'health_score' => 'integer',
        'issue_count' => 'integer',
    ];
    
    public function site(): BelongsTo
    {
        return $this->belongsTo(Site::class);
    }
    
    public function team(): BelongsTo
    {
        return $this->belongsTo(\App\Modules\Core\Models\Team::class);
    }
    
    public function issues(): HasMany
    {
        return $this->hasMany(Issue::class);
    }
}

