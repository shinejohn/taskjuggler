<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Skip if table already exists (from existing migrations)
        if (Schema::hasTable('tasks')) {
            return;
        }

        Schema::create('tasks', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('status')->default('pending');
            $table->string('priority')->default('normal');
            
            $table->uuid('requestor_id');
            $table->uuid('owner_id')->nullable();
            $table->uuid('team_id')->nullable();
            
            $table->timestamp('due_date')->nullable();
            $table->timestamp('started_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            
            $table->string('source_channel')->nullable();
            $table->json('metadata')->nullable();
            $table->json('tags')->nullable();
            
            // These will be added by later migrations (Processes/Projects modules)
            $table->uuid('process_id')->nullable();
            $table->string('process_step_id')->nullable();
            $table->uuid('project_id')->nullable();
            
            $table->timestamps();
            $table->softDeletes();
            
            $table->index('team_id');
            $table->index('owner_id');
            $table->index('requestor_id');
            $table->index('status');
            $table->index('process_id');
            $table->index('project_id');
            
            // Only add foreign keys if tables exist
            if (Schema::hasTable('users')) {
                $table->foreign('requestor_id')->references('id')->on('users');
                $table->foreign('owner_id')->references('id')->on('users');
            }
            if (Schema::hasTable('teams')) {
                $table->foreign('team_id')->references('id')->on('teams');
            }
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tasks');
    }
};

