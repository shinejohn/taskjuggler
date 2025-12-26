<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     * This migration checks actual database state, not migrations table
     */
    public function up(): void
    {
        // Force create personal_access_tokens table
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
            
            // Log that we created it
            \Log::info('Created personal_access_tokens table');
        }

        // Force add current_profile_id column
        if (!Schema::hasColumn('users', 'current_profile_id')) {
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
                    \Log::warning('Could not add foreign key: ' . $e->getMessage());
                }
            }
            
            \Log::info('Added current_profile_id column to users table');
        }

        // Create profiles table if it doesn't exist
        if (!Schema::hasTable('profiles')) {
            Schema::create('profiles', function (Blueprint $table) {
                $table->uuid('id')->primary();
                $table->uuid('user_id');
                $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
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
            
            \Log::info('Created profiles table');
        }

        // Ensure all users have profiles
        if (Schema::hasTable('profiles') && Schema::hasColumn('users', 'current_profile_id')) {
            $usersWithoutProfile = DB::table('users')
                ->whereNull('current_profile_id')
                ->get();

            foreach ($usersWithoutProfile as $user) {
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
            
            \Log::info('Linked ' . count($usersWithoutProfile) . ' users to profiles');
        }
    }

    public function down(): void
    {
        // Don't reverse - these are required tables/columns
    }
};

