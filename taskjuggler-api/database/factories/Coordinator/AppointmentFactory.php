<?php

namespace Database\Factories\Coordinator;

use App\Modules\Coordinator\Models\Appointment;
use App\Modules\Coordinator\Models\Organization;
use App\Modules\Coordinator\Models\Contact;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;
use Carbon\Carbon;

class AppointmentFactory extends Factory
{
    protected $model = Appointment::class;

    public function definition(): array
    {
        $startsAt = Carbon::now()->addDays($this->faker->numberBetween(1, 30))->startOfHour();
        $endsAt = $startsAt->copy()->addHour();
        
        return [
            'id' => Str::uuid(),
            'organization_id' => Organization::factory(),
            'contact_id' => Contact::factory(),
            'title' => $this->faker->sentence(3),
            'description' => $this->faker->paragraph(),
            'starts_at' => $startsAt,
            'ends_at' => $endsAt,
            'status' => $this->faker->randomElement(['scheduled', 'confirmed', 'completed', 'cancelled']),
            'location' => $this->faker->address(),
            'location_type' => 'in_person',
        ];
    }
}

