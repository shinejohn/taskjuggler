<?php

namespace Database\Factories\Coordinator;

use App\Modules\Coordinator\Models\CallLog;
use App\Modules\Coordinator\Models\Organization;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;
use Carbon\Carbon;

class CallLogFactory extends Factory
{
    protected $model = CallLog::class;

    public function definition(): array
    {
        $startedAt = Carbon::now()->subHours($this->faker->numberBetween(0, 24));
        
        return [
            'id' => Str::uuid(),
            'organization_id' => Organization::factory(),
            'direction' => $this->faker->randomElement(['inbound', 'outbound']),
            'from_number' => $this->faker->phoneNumber(),
            'to_number' => $this->faker->phoneNumber(),
            'status' => 'completed',
            'duration_seconds' => $this->faker->numberBetween(30, 600),
            'outcome' => $this->faker->randomElement(['Appointment Booked', 'Completed', 'No Answer', 'Voicemail']),
            'provider' => 'twilio',
            'cost' => $this->faker->randomFloat(4, 0.01, 0.10),
            'started_at' => $startedAt,
            'ended_at' => $startedAt->copy()->addSeconds($this->faker->numberBetween(30, 600)),
        ];
    }
}

