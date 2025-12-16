<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Step 1: Create personal_access_tokens table if it doesn't exist
        if (!Schema::hasTable('personal_access_tokens')) {
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
        }

        // Step 2: Add current_profile_id to users table if it doesn't exist
        if (!Schema::hasColumn('users', 'current_profile_id')) {
            Schema::table('users', function (Blueprint $table) {
                $table->uuid('current_profile_id')->nullable();
            });

            // Add index
            Schema::table('users', function (Blueprint $table) {
                $table->index('current_profile_id');
            });

            // Add foreign key if profiles table exists
            if (Schema::hasTable('profiles')) {
                try {
                    Schema::table('users', function (Blueprint $table) {
                        $table->foreign('current_profile_id')
                            ->references('id')
                            ->on('profiles')
                            ->onDelete('set null');
                    });
                } catch (\Exception $e) {
                    // Foreign key might already exist, ignore
                }
            }
        }

        // Step 3: Ensure all users have profiles and current_profile_id set
        if (Schema::hasTable('profiles') && Schema::hasColumn('users', 'current_profile_id')) {
            // Get all users without current_profile_id
            $usersWithoutProfile = DB::table('users')
                ->whereNull('current_profile_id')
                ->get();

            foreach ($usersWithoutProfile as $user) {
                // Check if user has a default profile
                $profile = DB::table('profiles')
                    ->where('user_id', $user->id)
                    ->where('is_default', true)
                    ->first();

                // If no default profile exists, create one
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

                // Update user's current_profile_id
                DB::table('users')
                    ->where('id', $user->id)
                    ->update(['current_profile_id' => $profileId]);
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Don't drop personal_access_tokens as it contains auth tokens
        // Don't drop current_profile_id as it's needed for profiles feature
    }
};

