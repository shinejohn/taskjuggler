<?php

namespace Database\Factories\Coordinator;

use App\Modules\Coordinator\Models\Coordinator;
use App\Modules\Coordinator\Models\Organization;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class CoordinatorFactory extends Factory
{
    protected $model = Coordinator::class;

    public function definition(): array
    {
        return [
            'id' => Str::uuid(),
            'organization_id' => Organization::factory(),
            'role_template_id' => Str::uuid(),
            'persona_template_id' => Str::uuid(),
            'display_name' => $this->faker->firstName(),
            'status' => $this->faker->randomElement(['active', 'inactive', 'draft']),
            'monthly_price' => $this->faker->randomFloat(2, 49, 99),
            'activated_at' => now(),
        ];
    }
}

