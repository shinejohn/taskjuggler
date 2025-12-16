<?php

/**
 * Force run migration regardless of migrations table
 * Run via: railway run --service api-web php FORCE_RUN_MIGRATION.php
 * OR better: trigger redeploy and check logs
 */

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

echo "🔍 Checking database state...\n\n";

// Check personal_access_tokens
if (Schema::hasTable('personal_access_tokens')) {
    echo "✅ personal_access_tokens table exists\n";
} else {
    echo "❌ personal_access_tokens table MISSING - creating...\n";
    Schema::create('personal_access_tokens', function ($table) {
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
}

// Check current_profile_id
if (Schema::hasColumn('users', 'current_profile_id')) {
    echo "✅ current_profile_id column exists\n";
} else {
    echo "❌ current_profile_id column MISSING - adding...\n";
    Schema::table('users', function ($table) {
        $table->uuid('current_profile_id')->nullable();
    });
    Schema::table('users', function ($table) {
        $table->index('current_profile_id');
    });
    if (Schema::hasTable('profiles')) {
        try {
            Schema::table('users', function ($table) {
                $table->foreign('current_profile_id')
                    ->references('id')
                    ->on('profiles')
                    ->onDelete('set null');
            });
        } catch (\Exception $e) {
            echo "⚠️  Could not add foreign key: " . $e->getMessage() . "\n";
        }
    }
    echo "✅ Added current_profile_id column\n";
}

// Link users to profiles
if (Schema::hasTable('profiles') && Schema::hasColumn('users', 'current_profile_id')) {
    $count = DB::table('users')->whereNull('current_profile_id')->count();
    if ($count > 0) {
        echo "🔗 Linking $count users to profiles...\n";
        $users = DB::table('users')->whereNull('current_profile_id')->get();
        foreach ($users as $user) {
            $profile = DB::table('profiles')
                ->where('user_id', $user->id)
                ->where('is_default', true)
                ->first();
            
            if (!$profile) {
                $profileId = (string) \Illuminate\Support\Str::uuid();
                DB::table('profiles')->insert([
                    'id' => $profileId,
                    'user_id' => $user->id,
                    'name' => 'Default',
                    'slug' => 'default',
                    'is_default' => true,
                    'settings' => '{}',
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            } else {
                $profileId = $profile->id;
            }
            
            DB::table('users')
                ->where('id', $user->id)
                ->update(['current_profile_id' => $profileId]);
        }
        echo "✅ Linked all users to profiles\n";
    } else {
        echo "✅ All users already linked to profiles\n";
    }
}

echo "\n✅ Database fix complete!\n";

