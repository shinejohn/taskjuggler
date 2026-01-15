<?php

namespace App\Models\Scanner;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Issue extends Model
{
    protected $table = 'scanner_issues';
    
    protected $fillable = [
        'scan_id',
        'site_id',
        'team_id',
        'category',
        'severity',
        'status',
        'title',
        'message',
        'page_url',
        'selector',
        'html_context',
        'wcag_criteria',
        'fix_code',
        'fix_explanation',
        'fix_confidence',
        'task_id',
    ];
    
    protected $casts = [
        'wcag_criteria' => 'array',
        'fix_confidence' => 'integer',
    ];
    
    public function scan(): BelongsTo
    {
        return $this->belongsTo(Scan::class);
    }
    
    public function site(): BelongsTo
    {
        return $this->belongsTo(Site::class);
    }
    
    public function team(): BelongsTo
    {
        return $this->belongsTo(\App\Modules\Core\Models\Team::class);
    }
    
    public function task(): BelongsTo
    {
        return $this->belongsTo(\App\Models\Task::class);
    }
}

