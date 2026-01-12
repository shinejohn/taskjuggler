<?php

namespace Database\Factories\Coordinator;

use App\Modules\Coordinator\Models\Contact;
use App\Modules\Coordinator\Models\Organization;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class ContactFactory extends Factory
{
    protected $model = Contact::class;

    public function definition(): array
    {
        return [
            'id' => Str::uuid(),
            'organization_id' => Organization::factory(),
            'first_name' => $this->faker->firstName(),
            'last_name' => $this->faker->lastName(),
            'email' => $this->faker->unique()->safeEmail(),
            'phone' => $this->faker->phoneNumber(),
            'status' => $this->faker->randomElement(['active', 'inactive', 'lead']),
            'source' => $this->faker->randomElement(['call', 'website', 'referral', 'walk_in']),
            'tags' => [],
        ];
    }
}

