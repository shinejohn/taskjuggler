<?php

declare(strict_types=1);

namespace App\Models\Scanner;

use App\Models\Task;
use App\Models\Team;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

final class Issue extends Model
{
    use HasUuids;

    protected $table = 'scanner_issues';

    protected $fillable = [
        'team_id',
        'site_id',
        'scan_id',
        'category',
        'severity',
        'title',
        'message',
        'page_url',
        'selector',
        'html_context',
        'wcag_criteria',
        'screenshot_url',
        'status',
        'fix_code',
        'task_id',
    ];

    protected function casts(): array
    {
        return [
            'wcag_criteria' => 'array',
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

    public function scan(): BelongsTo
    {
        return $this->belongsTo(Scan::class, 'scan_id');
    }

    public function task(): BelongsTo
    {
        return $this->belongsTo(Task::class, 'task_id');
    }
}
