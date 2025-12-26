<?php

/**
 * Ensure Critical Tables Exist
 * 
 * Run this script to ensure all critical database tables exist.
 * This is a safety net if migrations fail or haven't run.
 * 
 * Usage: railway run --service api-web php ensure_critical_tables.php
 */

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Schema\Blueprint;

echo "🔍 Checking critical database tables...\n\n";

$errors = [];

// 1. Ensure personal_access_tokens table exists
if (!Schema::hasTable('personal_access_tokens')) {
    echo "📝 Creating personal_access_tokens table...\n";
    try {
        Schema::create('personal_access_tokens', function (Blueprint $table) {
            $table->id();
            $table->morphs('tokenable');
            $table->text('name');
            $table->string('token', 64)->unique();
            $table->text('abilities')->nullable();
            $table->timestamp('last_used_at')->nullable();
            $table->timestamp('expires_at')->nullable()->index();
            $table->timestamps();
        });
        echo "✅ Created personal_access_tokens table\n";
    } catch (\Exception $e) {
        $errors[] = "Failed to create personal_access_tokens: " . $e->getMessage();
        echo "❌ Error: " . $e->getMessage() . "\n";
    }
} else {
    echo "✅ personal_access_tokens table exists\n";
}

// 2. Ensure profiles table exists
if (!Schema::hasTable('profiles')) {
    echo "📝 Creating profiles table...\n";
    try {
        Schema::create('profiles', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('user_id');
            if (Schema::hasTable('users')) {
                $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            }
            $table->string('name');
            $table->string('slug');
            $table->text('description')->nullable();
            $table->string('color', 7)->nullable();
            $table->string('icon')->nullable();
            $table->boolean('is_default')->default(false);
            $table->jsonb('settings')->default('{}');
            $table->softDeletes();
            $table->timestampsTz();
            
            $table->index('user_id');
            $table->index(['user_id', 'is_default']);
            $table->unique(['user_id', 'slug']);
        });
        echo "✅ Created profiles table\n";
    } catch (\Exception $e) {
        $errors[] = "Failed to create profiles: " . $e->getMessage();
        echo "❌ Error: " . $e->getMessage() . "\n";
    }
} else {
    echo "✅ profiles table exists\n";
}

// 3. Ensure current_profile_id column exists on users table
if (Schema::hasTable('users') && !Schema::hasColumn('users', 'current_profile_id')) {
    echo "📝 Adding current_profile_id column to users table...\n";
    try {
        Schema::table('users', function (Blueprint $table) {
            $table->uuid('current_profile_id')->nullable();
        });
        
        Schema::table('users', function (Blueprint $table) {
            $table->index('current_profile_id');
        });
        
        if (Schema::hasTable('profiles')) {
            try {
                Schema::table('users', function (Blueprint $table) {
                    $table->foreign('current_profile_id')
                        ->references('id')
                        ->on('profiles')
                        ->onDelete('set null');
                });
            } catch (\Exception $e) {
                echo "⚠️  Could not add foreign key (may already exist): " . $e->getMessage() . "\n";
            }
        }
        
        echo "✅ Added current_profile_id column\n";
    } catch (\Exception $e) {
        $errors[] = "Failed to add current_profile_id: " . $e->getMessage();
        echo "❌ Error: " . $e->getMessage() . "\n";
    }
} else {
    if (Schema::hasTable('users')) {
        echo "✅ current_profile_id column exists\n";
    } else {
        echo "⚠️  users table does not exist - skipping current_profile_id\n";
    }
}

echo "\n";

if (empty($errors)) {
    echo "✅ All critical tables are ready!\n";
    echo "\nYou can now try logging in again.\n";
    exit(0);
} else {
    echo "❌ Some errors occurred:\n";
    foreach ($errors as $error) {
        echo "   - $error\n";
    }
    exit(1);
}
