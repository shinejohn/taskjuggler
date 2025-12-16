<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Only add columns if they don't exist
            if (!Schema::hasColumn('users', 'phone')) {
                $table->string('phone', 20)->nullable();
            }
            if (!Schema::hasColumn('users', 'avatar_url')) {
                $table->string('avatar_url')->nullable();
            }
            if (!Schema::hasColumn('users', 'settings')) {
                // Use jsonb for PostgreSQL, json for MySQL/SQLite
                $driver = Schema::getConnection()->getDriverName();
                if ($driver === 'pgsql') {
                    $table->jsonb('settings')->nullable();
                } else {
                    $table->json('settings')->nullable();
                }
            }
            if (!Schema::hasColumn('users', 'current_team_id')) {
                $table->uuid('current_team_id')->nullable();
            }
            if (!Schema::hasColumn('users', 'current_profile_id')) {
                $table->uuid('current_profile_id')->nullable();
            }
            if (!Schema::hasColumn('users', 'deleted_at')) {
                $table->softDeletes();
            }
        });

        // Add foreign key for current_team_id
        if (Schema::hasTable('teams') && 
            Schema::hasColumn('users', 'current_team_id') &&
            config('database.default') !== 'sqlite') {
            try {
                Schema::table('users', function (Blueprint $table) {
                    $table->foreign('current_team_id')->references('id')->on('teams')->nullOnDelete();
                });
            } catch (\Exception $e) {
                // Foreign key might already exist, ignore
                if (strpos($e->getMessage(), 'already exists') === false) {
                    throw $e;
                }
            }
        }
        
        // Add foreign key for current_profile_id
        if (Schema::hasTable('profiles') && 
            Schema::hasColumn('users', 'current_profile_id') &&
            config('database.default') !== 'sqlite') {
            try {
                Schema::table('users', function (Blueprint $table) {
                    $table->foreign('current_profile_id')->references('id')->on('profiles')->nullOnDelete();
                });
            } catch (\Exception $e) {
                // Foreign key might already exist, ignore
                if (strpos($e->getMessage(), 'already exists') === false) {
                    throw $e;
                }
            }
        }
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $columns = ['phone', 'avatar_url', 'settings', 'current_team_id', 'deleted_at'];
            $existingColumns = array_filter($columns, fn($col) => Schema::hasColumn('users', $col));
            
            if (!empty($existingColumns)) {
                $table->dropColumn($existingColumns);
            }
        });
    }
};

