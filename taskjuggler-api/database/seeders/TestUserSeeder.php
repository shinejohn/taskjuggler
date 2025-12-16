<?php

namespace Database\Seeders;

use App\Models\User;
use App\Modules\Core\Models\Profile;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class TestUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Check if test user already exists
        $testUser = User::where('email', 'test@taskjuggler.com')->first();
        
        if ($testUser) {
            $this->command->info('Test user already exists. Updating password...');
            $testUser->update([
                'password' => Hash::make('Test1234!'),
            ]);
            $this->command->info('Test user password updated successfully!');
        } else {
            // Create test user
            $user = User::create([
                'name' => 'Test User',
                'email' => 'test@taskjuggler.com',
                'password' => Hash::make('Test1234!'),
                'timezone' => 'America/New_York',
                'plan' => 'free',
            ]);

            // Create default profile for the test user
            $profile = Profile::create([
                'user_id' => $user->id,
                'name' => 'Default',
                'slug' => 'default',
                'is_default' => true,
            ]);

            // Set current_profile_id on user
            $user->update(['current_profile_id' => $profile->id]);

            $this->command->info('Test user created successfully!');
        }

        $this->command->info('');
        $this->command->info('═══════════════════════════════════════════════════════');
        $this->command->info('  TEST USER CREDENTIALS');
        $this->command->info('═══════════════════════════════════════════════════════');
        $this->command->info('  Email:    test@taskjuggler.com');
        $this->command->info('  Password: Test1234!');
        $this->command->info('═══════════════════════════════════════════════════════');
        $this->command->info('');
    }
}

