<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('processes', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('team_id'); // Team-scoped (required)
            $table->uuid('profile_id')->nullable(); // Profile-scoped (optional, derived from team)
            $table->string('name');
            $table->string('slug');
            $table->text('description')->nullable();
            $table->enum('status', ['draft', 'active', 'archived'])->default('draft');
            $table->string('trigger_type'); // manual, task_created, task_updated, schedule, webhook
            $table->jsonb('trigger_config')->nullable(); // Configuration for trigger (e.g., schedule times, webhook URLs)
            $table->uuid('project_id')->nullable(); // Optional: link to a project
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('team_id')
                ->references('id')
                ->on('teams')
                ->onDelete('cascade');

            $table->foreign('profile_id')
                ->references('id')
                ->on('profiles')
                ->onDelete('cascade');

            $table->foreign('project_id')
                ->references('id')
                ->on('projects')
                ->onDelete('set null');

            // Unique constraint: slug must be unique within team
            $table->unique(['team_id', 'slug']);
            $table->index(['team_id', 'status']);
            $table->index('slug');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('processes');
    }
};



