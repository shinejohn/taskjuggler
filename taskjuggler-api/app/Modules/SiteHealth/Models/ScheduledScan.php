<?php

namespace App\Modules\SiteHealth\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ScheduledScan extends Model
{
    protected $fillable = [
        'site_id',
        'frequency',
        'day_of_week',
        'day_of_month',
        'time',
        'enabled',
    ];

    protected $casts = [
        'day_of_week' => 'integer',
        'day_of_month' => 'integer',
        'enabled' => 'boolean',
    ];

    public function site(): BelongsTo
    {
        return $this->belongsTo(Site::class);
    }
}
