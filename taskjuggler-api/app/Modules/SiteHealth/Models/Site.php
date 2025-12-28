<?php

namespace App\Modules\SiteHealth\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Site extends Model
{
    protected $fillable = [
        'user_id',
        'name',
        'url',
        'auth_type',
        'auth_config',
        'max_pages',
        'checks',
        'last_scan_at',
    ];

    protected $casts = [
        'auth_config' => 'array',
        'checks' => 'array',
        'last_scan_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(\App\Models\User::class);
    }

    public function scans(): HasMany
    {
        return $this->hasMany(Scan::class);
    }

    public function issues(): HasMany
    {
        return $this->hasMany(Issue::class);
    }

    public function scheduledScans(): HasMany
    {
        return $this->hasMany(ScheduledScan::class);
    }

    public function latestScan()
    {
        return $this->hasOne(Scan::class)->latestOfMany();
    }
}
