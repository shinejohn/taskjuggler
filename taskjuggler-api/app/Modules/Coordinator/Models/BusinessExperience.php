<?php

namespace App\Modules\Coordinator\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class BusinessExperience extends Model
{
    use HasUuids;

    protected $table = 'coord_business_experience';

    protected $fillable = [
        'organization_id',
        'customer_patterns',
        'conversation_patterns',
        'faq_effectiveness',
        'customer_vocabulary',
        'period_start',
        'period_end',
        'interaction_count',
        'last_analyzed_at',
    ];

    protected $casts = [
        'customer_patterns' => 'array',
        'conversation_patterns' => 'array',
        'faq_effectiveness' => 'array',
        'customer_vocabulary' => 'array',
        'period_start' => 'date',
        'period_end' => 'date',
        'last_analyzed_at' => 'datetime',
    ];

    // Relationships
    public function organization()
    {
        return $this->belongsTo(Organization::class, 'organization_id');
    }
}




