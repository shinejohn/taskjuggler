<?php

declare(strict_types=1);

namespace App\Models\Scanner;

use App\Models\Team;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

final class Site extends Model
{
    use HasUuids;

    protected $table = 'scanner_sites';

    protected $fillable = [
        'team_id',
        'name',
        'url',
        'auth_type',
        'auth_config',
        'max_pages',
        'health_score',
    ];

    protected function casts(): array
    {
        return [
            'auth_config' => 'array',
            'max_pages' => 'integer',
            'health_score' => 'integer',
        ];
    }

    public function team(): BelongsTo
    {
        return $this->belongsTo(Team::class);
    }

    public function scans(): HasMany
    {
        return $this->hasMany(Scan::class, 'site_id');
    }

    public function issues(): HasMany
    {
        return $this->hasMany(Issue::class, 'site_id');
    }

    public function latestScan(): HasOne
    {
        return $this->hasOne(Scan::class, 'site_id')->latestOfMany();
    }
}
