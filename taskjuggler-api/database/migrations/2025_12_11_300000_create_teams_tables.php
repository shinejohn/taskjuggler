<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Teams table
        Schema::create('teams', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name');
            $table->string('description')->nullable();
            $table->string('avatar_url')->nullable();
            $table->uuid('created_by')->nullable();
            $table->timestamps();

            $table->foreign('created_by')->references('id')->on('users')->nullOnDelete();
        });

        // Team members (simple - no roles for now)
        // Drop old table if it exists (from old migration) and create new one
        // First drop foreign key constraint from tasks table if it exists
        if (Schema::hasTable('tasks')) {
            // Use raw SQL to drop the constraint if it exists (PostgreSQL specific)
            DB::statement('
                DO $$ 
                BEGIN 
                    IF EXISTS (
                        SELECT 1 FROM pg_constraint 
                        WHERE conname = \'tasks_team_member_id_foreign\'
                    ) THEN
                        ALTER TABLE tasks DROP CONSTRAINT tasks_team_member_id_foreign;
                    END IF;
                END $$;
            ');
        }
        Schema::dropIfExists('team_members');
        Schema::create('team_members', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('team_id');
            $table->uuid('user_id');
            $table->boolean('is_admin')->default(false);
            $table->timestamp('joined_at')->useCurrent();
            $table->timestamps();

            $table->foreign('team_id')->references('id')->on('teams')->onDelete('cascade');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            
            $table->unique(['team_id', 'user_id']);
            $table->index('user_id');
        });

        // Team invitations
        Schema::create('team_invitations', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('team_id');
            $table->string('email')->nullable();
            $table->string('phone')->nullable();
            $table->string('invite_code', 32)->unique();
            $table->uuid('invited_by');
            $table->enum('status', ['pending', 'accepted', 'declined', 'expired'])->default('pending');
            $table->timestamp('expires_at')->nullable();
            $table->timestamps();

            $table->foreign('team_id')->references('id')->on('teams')->onDelete('cascade');
            $table->foreign('invited_by')->references('id')->on('users');
            
            $table->index('invite_code');
            $table->index('email');
        });

        // Add team_id to tasks
        Schema::table('tasks', function (Blueprint $table) {
            $table->uuid('team_id')->nullable()->after('owner_id');
            $table->foreign('team_id')->references('id')->on('teams')->nullOnDelete();
            $table->index('team_id');
        });
    }

    public function down(): void
    {
        Schema::table('tasks', function (Blueprint $table) {
            $table->dropForeign(['team_id']);
            $table->dropColumn('team_id');
        });
        
        Schema::dropIfExists('team_invitations');
        Schema::dropIfExists('team_members');
        Schema::dropIfExists('teams');
    }
};
