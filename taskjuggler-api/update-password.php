<?php

/**
 * Update test user password
 * Run via: railway run --service api-web php update-password.php
 */

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

$email = 'test@taskjuggler.com';
$password = 'Test1234!';

try {
    $user = DB::table('users')->where('email', $email)->first();
    
    if (!$user) {
        echo "❌ User not found: $email\n";
        exit(1);
    }
    
    echo "Found user: {$user->name} ({$user->email})\n";
    echo "Updating password...\n";
    
    DB::table('users')
        ->where('email', $email)
        ->update([
            'password' => Hash::make($password),
            'updated_at' => now(),
        ]);
    
    echo "✅ Password updated successfully!\n\n";
    echo "═══════════════════════════════════════════════════════\n";
    echo "  TEST USER CREDENTIALS\n";
    echo "═══════════════════════════════════════════════════════\n";
    echo "  Email:    $email\n";
    echo "  Password: $password\n";
    echo "═══════════════════════════════════════════════════════\n";
    
} catch (\Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
    echo "File: " . $e->getFile() . ":" . $e->getLine() . "\n";
    exit(1);
}

