<?php

namespace App\Modules\Urpa\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class UrpaVoiceResponse extends Model
{
    use HasUuids, HasFactory;

    protected $table = 'urpa_voice_responses';

    protected $fillable = [
        'category',
        'intent',
        'text_content',
        'audio_url',
        'audio_duration_ms',
        'trigger_phrases',
        'context_requirements',
        'has_personalization',
        'personalization_slots',
        'usage_count',
        'is_active',
    ];

    protected $casts = [
        'trigger_phrases' => 'array',
        'context_requirements' => 'array',
        'has_personalization' => 'boolean',
        'personalization_slots' => 'array',
        'usage_count' => 'integer',
        'audio_duration_ms' => 'integer',
        'is_active' => 'boolean',
    ];

    // Relationships
    public function aiMessages(): HasMany
    {
        return $this->hasMany(UrpaAiMessage::class, 'prerecorded_response_id');
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeByCategory($query, string $category)
    {
        return $query->where('category', $category);
    }

    public function scopeByIntent($query, string $intent)
    {
        return $query->where('intent', $intent);
    }

    public function scopeMostUsed($query, int $limit = 10)
    {
        return $query->orderBy('usage_count', 'desc')->limit($limit);
    }

    // Methods
    public function incrementUsage(): void
    {
        $this->increment('usage_count');
    }

    public function matchesTrigger(string $input): bool
    {
        $inputLower = strtolower($input);
        foreach ($this->trigger_phrases ?? [] as $phrase) {
            if (str_contains($inputLower, strtolower($phrase))) {
                return true;
            }
        }
        return false;
    }

    public function personalize(array $context): string
    {
        $text = $this->text_content;
        foreach ($this->personalization_slots ?? [] as $slot) {
            $value = $context[$slot['slot']] ?? $slot['default'] ?? '';
            $text = str_replace('{' . $slot['slot'] . '}', $value, $text);
        }
        return $text;
    }
}

