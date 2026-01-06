<?php

namespace Database\Seeders;

use App\Models\User;
use App\Modules\Coordinator\Models\Organization;
use App\Modules\Coordinator\Models\Coordinator;
use App\Modules\Coordinator\Models\RoleTemplate;
use App\Modules\Coordinator\Models\PersonaTemplate;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class CoordinatorTestUserSeeder extends Seeder
{
    /**
     * Seed test user for 4calls.ai coordinator platform
     */
    public function run(): void
    {
        // Create test user
        $user = User::firstOrCreate(
            ['email' => 'test@4calls.ai'],
            [
                'id' => Str::uuid(),
                'name' => 'Test User',
                'email' => 'test@4calls.ai',
                'password' => Hash::make('password123'),
                'actor_type' => 'human',
            ]
        );

        // Create test organization
        $organization = Organization::firstOrCreate(
            [
                'user_id' => $user->id,
                'slug' => 'test-organization',
            ],
            [
                'id' => Str::uuid(),
                'name' => 'Test Organization',
                'industry' => 'Healthcare',
                'phone' => '+15551234567',
                'email' => 'test@4calls.ai',
                'address' => '123 Test Street',
                'city' => 'San Francisco',
                'state' => 'CA',
                'postal_code' => '94102',
                'country' => 'US',
                'timezone' => 'America/Los_Angeles',
                'status' => 'active',
                'subscription_tier' => 'pro',
            ]
        );

        // Get or create a default role template
        $roleTemplate = RoleTemplate::firstOrCreate(
            ['name' => 'Receptionist'],
            [
                'id' => Str::uuid(),
                'name' => 'Receptionist',
                'description' => 'Front desk receptionist',
                'base_price' => 99.00,
            ]
        );

        // Get or create a default persona template
        $personaTemplate = PersonaTemplate::firstOrCreate(
            ['name' => 'Friendly Professional'],
            [
                'id' => Str::uuid(),
                'name' => 'Friendly Professional',
                'description' => 'Warm and professional persona',
                'voice_id' => 'default',
            ]
        );

        // Create test coordinator
        Coordinator::firstOrCreate(
            [
                'organization_id' => $organization->id,
                'display_name' => 'Sally',
            ],
            [
                'id' => Str::uuid(),
                'organization_id' => $organization->id,
                'role_template_id' => $roleTemplate->id,
                'persona_template_id' => $personaTemplate->id,
                'display_name' => 'Sally',
                'status' => 'active',
                'monthly_price' => 99.00,
                'activated_at' => now(),
            ]
        );

            $this->command->info('✅ Test user created:');
            $this->command->info('   Email: test@4calls.ai');
            $this->command->info('   Password: password123');
            $this->command->info('   Organization: Test Organization');
        } catch (\Exception $e) {
            $this->command->error('Error creating test user: ' . $e->getMessage());
            throw $e;
        }
    }
}

