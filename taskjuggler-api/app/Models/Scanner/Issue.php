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
        'task_id',
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
        'screenshot_url',
    ];

    protected $casts = [
        'wcag_criteria' => 'array',
    ];

    public function scan(): BelongsTo
    {
        return $this->belongsTo(Scan::class, 'scan_id');
    }

    public function site(): BelongsTo
    {
        return $this->belongsTo(Site::class, 'site_id');
    }

    public function team(): BelongsTo
    {
        return $this->belongsTo(\App\Models\Team::class, 'team_id');
    }

    public function task(): BelongsTo
    {
        return $this->belongsTo(\App\Models\Task::class, 'task_id');
    }
}
