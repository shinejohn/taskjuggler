<?php

namespace App\Modules\Urpa\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UrpaArtifact extends Model
{
    use HasUuids, HasFactory;

    protected $table = 'urpa_artifacts';

    protected $fillable = [
        'user_id',
        'session_id',
        'artifact_type',
        'title',
        'content',
        'language',
        'storage_provider',
        'storage_path',
        'file_size_bytes',
        'tags',
    ];

    protected $casts = [
        'tags' => 'array',
        'file_size_bytes' => 'integer',
    ];

    // Relationships
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function session(): BelongsTo
    {
        return $this->belongsTo(UrpaAiSession::class, 'session_id');
    }

    // Scopes
    public function scopeByType($query, string $type)
    {
        return $query->where('artifact_type', $type);
    }

    public function scopeByLanguage($query, string $language)
    {
        return $query->where('language', $language);
    }

    // Methods
    public function getFileSizeHumanAttribute(): string
    {
        $bytes = $this->file_size_bytes ?? 0;
        $units = ['B', 'KB', 'MB', 'GB'];
        $i = 0;
        while ($bytes >= 1024 && $i < count($units) - 1) {
            $bytes /= 1024;
            $i++;
        }
        return round($bytes, 2) . ' ' . $units[$i];
    }
}

