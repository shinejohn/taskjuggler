<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
use App\Modules\Core\Models\Profile;
use App\Modules\Core\Models\User;

return new class extends Migration
{
    public function up(): void
    {
        // Only run if profiles table exists
        if (!Schema::hasTable('profiles')) {
            return;
        }

        // Create default profile for all existing users who don't have one
        User::whereDoesntHave('profiles')->chunk(100, function ($users) {
            foreach ($users as $user) {
                Profile::create([
                    'user_id' => $user->id,
                    'name' => 'Default',
                    'slug' => 'default',
                    'is_default' => true,
                ]);
            }
        });

        // Update existing tasks, teams, etc. to use the default profile
        // This is optional - you may want to leave them null or handle differently
        // Only run if tasks table has profile_id column
        if (Schema::hasTable('tasks') && Schema::hasColumn('tasks', 'profile_id')) {
            try {
                DB::statement('
                    UPDATE tasks 
                    SET profile_id = (
                        SELECT p.id 
                        FROM profiles p 
                        WHERE p.user_id = tasks.requestor_id 
                        AND p.is_default = true 
                        LIMIT 1
                    )
                    WHERE profile_id IS NULL
                ');
            } catch (\Exception $e) {
                // Ignore errors - this is a backfill migration
            }
        }
    }

    public function down(): void
    {
        // This migration is not reversible without losing data
        // We don't remove profiles as they may contain important user configuration
    }
};

