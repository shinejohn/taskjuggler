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
        'last_scan_at',
    ];
    
    protected $casts = [
        'auth_config' => 'array',
        'last_scan_at' => 'datetime',
        'health_score' => 'integer',
        'issue_count' => 'integer',
        'max_pages' => 'integer',
    ];
    
    public function team(): BelongsTo
    {
        return $this->belongsTo(\App\Modules\Core\Models\Team::class);
    }
    
    public function scans(): HasMany
    {
        return $this->hasMany(Scan::class);
    }
    
    public function latestScan(): HasMany
    {
        return $this->hasMany(Scan::class)->latest();
    }
    
    public function issues(): HasMany
    {
        return $this->hasMany(Issue::class);
    }
}

