<?php

namespace App\Modules\Coordinator\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class PersonaTemplate extends Model
{
    use HasUuids;

    protected $table = 'coord_persona_templates';

    protected $fillable = [
        'name',
        'display_name',
        'description',
        'age_range',
        'personality_traits',
        'communication_style',
        'best_for_industries',
        'gender',
        'voice_id',
        'personality_prompts',
        'example_greetings',
        'tone_guidelines',
        'is_active',
        'sort_order',
    ];

    protected $casts = [
        'personality_traits' => 'array',
        'best_for_industries' => 'array',
        'personality_prompts' => 'array',
        'example_greetings' => 'array',
        'tone_guidelines' => 'array',
        'is_active' => 'boolean',
    ];

    // Relationships
    public function coordinators()
    {
        return $this->hasMany(Coordinator::class, 'persona_template_id');
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}




