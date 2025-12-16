<?php

namespace App\Console\Commands;

use App\Models\User;
use App\Modules\Core\Models\Profile;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Schema;

class CreateTestUser extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'user:create-test';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Create a test user account for testing Task Juggler';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $email = 'test@taskjuggler.com';
        $password = 'Test1234!';
        $name = 'Test User';

        // Check if test user already exists
        $testUser = User::where('email', $email)->first();
        
        if ($testUser) {
            $this->info('Test user already exists. Updating password...');
            $testUser->update([
                'password' => Hash::make($password),
            ]);
            $this->info('Test user password updated successfully!');
        } else {
            // Create test user
            $user = User::create([
                'name' => $name,
                'email' => $email,
                'password' => Hash::make($password),
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

            // Set current_profile_id on user (if column exists)
            try {
                if (\Schema::hasColumn('users', 'current_profile_id')) {
                    $user->update(['current_profile_id' => $profile->id]);
                }
            } catch (\Exception $e) {
                // Column doesn't exist, skip
                $this->warn('Note: current_profile_id column not found. User created without profile assignment.');
            }

            $this->info('Test user created successfully!');
        }

        $this->newLine();
        $this->line('═══════════════════════════════════════════════════════');
        $this->info('  TEST USER CREDENTIALS');
        $this->line('═══════════════════════════════════════════════════════');
        $this->line('  Email:    ' . $email);
        $this->line('  Password: ' . $password);
        $this->line('═══════════════════════════════════════════════════════');
        $this->newLine();

        return Command::SUCCESS;
    }
}

