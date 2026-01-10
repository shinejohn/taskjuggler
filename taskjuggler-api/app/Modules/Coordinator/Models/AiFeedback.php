<?php

namespace App\Modules\Coordinator\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class AiFeedback extends Model
{
    use HasUuids;

    protected $table = 'coord_ai_feedback';

    protected $fillable = [
        'interaction_id',
        'organization_id',
        'feedback_type',
        'rating',
        'source',
        'comments',
    ];

    protected $casts = [
        'rating' => 'integer',
    ];

    // Relationships
    public function interaction()
    {
        return $this->belongsTo(AiInteraction::class, 'interaction_id');
    }

    public function organization()
    {
        return $this->belongsTo(Organization::class, 'organization_id');
    }

    // Scopes
    public function scopeByType($query, string $type)
    {
        return $query->where('feedback_type', $type);
    }

    public function scopePositive($query)
    {
        return $query->where('rating', '>=', 4);
    }

    public function scopeNegative($query)
    {
        return $query->where('rating', '<=', 2);
    }
}




