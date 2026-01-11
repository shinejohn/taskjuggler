<?php

namespace App\Modules\Coordinator\Models;

use Database\Factories\Coordinator\CoordinatorFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Coordinator extends Model
{
    use HasUuids, SoftDeletes, HasFactory;

    protected $table = 'coord_coordinators';

    protected $fillable = [
        'organization_id',
        'role_template_id',
        'persona_template_id',
        'display_name',
        'voice_id',
        'custom_greeting',
        'custom_prompts',
        'custom_scripts',
        'availability',
        'status',
        'monthly_price',
        'activated_at',
    ];

    protected $casts = [
        'custom_prompts' => 'array',
        'custom_scripts' => 'array',
        'availability' => 'array',
        'monthly_price' => 'decimal:2',
        'activated_at' => 'datetime',
    ];

    // Relationships
    public function organization()
    {
        return $this->belongsTo(Organization::class, 'organization_id');
    }

    public function roleTemplate()
    {
        return $this->belongsTo(RoleTemplate::class, 'role_template_id');
    }

    public function personaTemplate()
    {
        return $this->belongsTo(PersonaTemplate::class, 'persona_template_id');
    }

    public function aiAgents()
    {
        return $this->hasMany(AiAgent::class, 'coordinator_id');
    }

    public function personaConfigurations()
    {
        return $this->hasMany(PersonaConfiguration::class, 'coordinator_id');
    }

    public function activePersonaConfiguration()
    {
        return $this->hasOne(PersonaConfiguration::class, 'coordinator_id')
            ->where('is_active', true);
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('status', 'active')->whereNull('deleted_at');
    }

    public function scopeByRole($query, string $roleTemplateId)
    {
        return $query->where('role_template_id', $roleTemplateId);
    }

    public function scopeByPersona($query, string $personaTemplateId)
    {
        return $query->where('persona_template_id', $personaTemplateId);
    }

    /**
     * Create a new factory instance for the model.
     */
    protected static function newFactory()
    {
        return CoordinatorFactory::new();
    }
}

