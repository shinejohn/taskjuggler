<?php

/**
 * Run migrations script
 * Execute this via Railway web shell: php run-migrations.php
 */

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\DB;

echo "🚀 Starting migrations...\n\n";

try {
    // Test database connection
    DB::connection()->getPdo();
    echo "✅ Database connected!\n\n";
    
    // Run migrations
    echo "Running migrations...\n";
    Artisan::call('migrate', ['--force' => true]);
    
    echo "\n" . Artisan::output() . "\n";
    echo "✅ Migrations completed successfully!\n\n";
    
    // Verify current_profile_id column exists
    if (DB::getSchemaBuilder()->hasColumn('users', 'current_profile_id')) {
        echo "✅ current_profile_id column exists in users table\n";
    } else {
        echo "❌ current_profile_id column MISSING in users table\n";
    }
    
    // Check if profiles table exists
    if (DB::getSchemaBuilder()->hasTable('profiles')) {
        echo "✅ profiles table exists\n";
        
        // Count profiles
        $profileCount = DB::table('profiles')->count();
        echo "   Found $profileCount profiles\n";
    } else {
        echo "❌ profiles table MISSING\n";
    }
    
    // Check users without current_profile_id
    $usersWithoutProfile = DB::table('users')
        ->whereNull('current_profile_id')
        ->count();
    
    if ($usersWithoutProfile > 0) {
        echo "⚠️  $usersWithoutProfile users without current_profile_id\n";
        echo "   Run VERIFY_AND_FIX_USERS_TABLE.sql to fix this\n";
    } else {
        echo "✅ All users have current_profile_id set\n";
    }
    
} catch (\Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
    echo "File: " . $e->getFile() . ":" . $e->getLine() . "\n";
    exit(1);
}

