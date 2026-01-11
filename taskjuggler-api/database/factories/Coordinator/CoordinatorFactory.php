<?php

namespace Database\Factories\Coordinator;

use App\Modules\Coordinator\Models\Coordinator;
use App\Modules\Coordinator\Models\Organization;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class CoordinatorFactory extends Factory
{
    protected $model = Coordinator::class;

    public function definition(): array
    {
        // Create role and persona templates if they don't exist
        $roleTemplateId = $this->ensureRoleTemplate();
        $personaTemplateId = $this->ensurePersonaTemplate();

        return [
            'id' => Str::uuid(),
            'organization_id' => Organization::factory(),
            'role_template_id' => $roleTemplateId,
            'persona_template_id' => $personaTemplateId,
            'display_name' => $this->faker->firstName(),
            'status' => $this->faker->randomElement(['active', 'inactive', 'draft']),
            'monthly_price' => $this->faker->randomFloat(2, 49, 99),
            'activated_at' => now(),
        ];
    }

    protected function ensureRoleTemplate(): string
    {
        $role = DB::table('coord_role_templates')->first();
        if (!$role) {
            $id = Str::uuid();
            DB::table('coord_role_templates')->insert([
                'id' => $id,
                'name' => 'test_role_' . Str::random(8),
                'display_name' => 'Test Role',
                'description' => 'Test role template',
                'direction' => 'both',
                'base_price' => 49.99,
                'primary_goal' => 'Test goal',
                'capabilities' => json_encode(['test']),
                'channels' => json_encode(['voice']),
                'default_prompts' => json_encode(['test']),
                'default_scripts' => json_encode(['test']),
                'is_active' => true,
                'sort_order' => 0,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
            return $id;
        }
        return $role->id;
    }

    protected function ensurePersonaTemplate(): string
    {
        $persona = DB::table('coord_persona_templates')->first();
        if (!$persona) {
            $id = Str::uuid();
            DB::table('coord_persona_templates')->insert([
                'id' => $id,
                'name' => 'test_persona_' . Str::random(8),
                'display_name' => 'Test Persona',
                'description' => 'Test persona template',
                'personality_traits' => json_encode(['friendly']),
                'communication_style' => 'Professional',
                'personality_prompts' => json_encode(['test']),
                'is_active' => true,
                'sort_order' => 0,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
            return $id;
        }
        return $persona->id;
    }
}

