<?php

namespace App\Models\Scanner;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Site extends Model
{
    protected $table = 'scanner_sites';

    protected $fillable = [
        'team_id',
        'name',
        'url',
        'auth_type',
        'auth_config',
        'max_pages',
        'health_score',
        'issue_count',
    ];

    protected $casts = [
        'auth_config' => 'array',
    ];

    public function team(): BelongsTo
    {
        return $this->belongsTo(\App\Models\Team::class, 'team_id');
    }

    public function scans(): HasMany
    {
        return $this->hasMany(Scan::class, 'site_id');
    }

    public function issues(): HasMany
    {
        return $this->hasMany(Issue::class, 'site_id');
    }

    public function latestScan(): HasMany
    {
        return $this->hasMany(Scan::class, 'site_id')->latest()->limit(1);
    }
}
