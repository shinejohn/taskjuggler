<?php

namespace Database\Factories\Coordinator;

use App\Modules\Coordinator\Models\Campaign;
use App\Modules\Coordinator\Models\Organization;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class CampaignFactory extends Factory
{
    protected $model = Campaign::class;

    public function definition(): array
    {
        return [
            'id' => Str::uuid(),
            'organization_id' => Organization::factory(),
            'name' => $this->faker->words(3, true) . ' Campaign',
            'type' => $this->faker->randomElement(['appointment_booking', 'appointment_confirmation', 'survey', 'sales']),
            'status' => $this->faker->randomElement(['draft', 'scheduled', 'running', 'paused', 'completed']),
            'description' => $this->faker->paragraph(),
            'target_count' => $this->faker->numberBetween(10, 100),
            'contacts_processed' => 0,
            'contacts_contacted' => 0,
            'appointments_booked' => 0,
        ];
    }
}

