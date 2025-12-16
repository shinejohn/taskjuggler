<?php

/**
 * Update test user password
 * Run via Railway shell: php update-test-user.php
 */

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

$email = 'test@taskjuggler.com';
$password = 'Test1234!';

try {
    echo "Connecting to database...\n";
    
    // Test connection
    DB::connection()->getPdo();
    echo "✅ Database connected!\n\n";
    
    $user = DB::table('users')->where('email', $email)->first();
    
    if (!$user) {
        echo "❌ User not found: $email\n";
        echo "Creating new user...\n";
        
        $userId = DB::table('users')->insertGetId([
            'id' => \Illuminate\Support\Str::uuid()->toString(),
            'name' => 'Test User',
            'email' => $email,
            'password' => Hash::make($password),
            'timezone' => 'America/New_York',
            'plan' => 'free',
            'settings' => '{}',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        
        echo "✅ User created with ID: $userId\n";
    } else {
        echo "Found user: {$user->name} ({$user->email})\n";
        echo "Updating password...\n";
        
        DB::table('users')
            ->where('email', $email)
            ->update([
                'password' => Hash::make($password),
                'updated_at' => now(),
            ]);
        
        echo "✅ Password updated successfully!\n";
    }
    
    // Create profile if profiles table exists
    try {
        if (DB::getSchemaBuilder()->hasTable('profiles')) {
            $profile = DB::table('profiles')
                ->where('user_id', $user->id ?? $userId ?? null)
                ->where('is_default', true)
                ->first();
            
            if (!$profile) {
                $profileId = DB::table('profiles')->insertGetId([
                    'id' => \Illuminate\Support\Str::uuid()->toString(),
                    'user_id' => $user->id ?? $userId,
                    'name' => 'Default',
                    'slug' => 'default',
                    'is_default' => true,
                    'settings' => '{}',
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
                echo "✅ Default profile created!\n";
            } else {
                echo "✅ Default profile already exists!\n";
            }
        }
    } catch (\Exception $e) {
        echo "⚠️  Could not create profile: " . $e->getMessage() . "\n";
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
    echo "\nStack trace:\n" . $e->getTraceAsString() . "\n";
    exit(1);
}

