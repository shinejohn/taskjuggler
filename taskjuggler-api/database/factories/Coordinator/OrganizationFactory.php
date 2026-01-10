<?php

namespace Database\Factories\Coordinator;

use App\Modules\Coordinator\Models\Organization;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class OrganizationFactory extends Factory
{
    protected $model = Organization::class;

    public function definition(): array
    {
        $name = $this->faker->company();
        
        return [
            'id' => Str::uuid(),
            'user_id' => User::factory(),
            'name' => $name,
            'slug' => Str::slug($name) . '-' . Str::random(6),
            'industry' => $this->faker->randomElement(['dental', 'plumbing', 'restaurant', 'legal', 'medical', 'auto_repair']),
            'phone' => $this->faker->phoneNumber(),
            'email' => $this->faker->companyEmail(),
            'website' => $this->faker->url(),
            'address' => $this->faker->streetAddress(),
            'city' => $this->faker->city(),
            'state' => $this->faker->stateAbbr(),
            'postal_code' => $this->faker->postcode(),
            'country' => 'US',
            'timezone' => 'America/New_York',
            'subscription_tier' => 'starter',
            'subscription_status' => 'active',
        ];
    }
}

