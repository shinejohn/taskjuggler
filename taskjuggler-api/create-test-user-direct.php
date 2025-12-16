<?php

/**
 * Direct script to create test user
 * Run this via Railway shell: php create-test-user-direct.php
 */

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\User;
use App\Modules\Core\Models\Profile;
use Illuminate\Support\Facades\Hash;

$email = 'test@taskjuggler.com';
$password = 'Test1234!';
$name = 'Test User';

try {
    // Check if user exists
    $user = User::where('email', $email)->first();
    
    if ($user) {
        echo "User exists. Updating password...\n";
        $user->update([
            'password' => Hash::make($password),
        ]);
        echo "✅ Password updated!\n";
    } else {
        echo "Creating new user...\n";
        $user = User::create([
            'name' => $name,
            'email' => $email,
            'password' => Hash::make($password),
            'timezone' => 'America/New_York',
            'plan' => 'free',
        ]);
        
        // Create default profile
        $profile = Profile::create([
            'user_id' => $user->id,
            'name' => 'Default',
            'slug' => 'default',
            'is_default' => true,
        ]);
        
        $user->update(['current_profile_id' => $profile->id]);
        echo "✅ User created!\n";
    }
    
    echo "\n";
    echo "═══════════════════════════════════════════════════════\n";
    echo "  TEST USER CREDENTIALS\n";
    echo "═══════════════════════════════════════════════════════\n";
    echo "  Email:    $email\n";
    echo "  Password: $password\n";
    echo "═══════════════════════════════════════════════════════\n";
    echo "\n";
    
} catch (\Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
    echo "File: " . $e->getFile() . ":" . $e->getLine() . "\n";
    exit(1);
}

