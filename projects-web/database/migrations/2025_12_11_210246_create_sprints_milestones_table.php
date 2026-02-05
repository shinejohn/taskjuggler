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
        Schema::create('sprints', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('project_id');
            $table->string('name');
            $table->text('goal')->nullable();
            $table->date('start_date');
            $table->date('end_date');
            $table->string('status', 50)->default('planning');
            $table->integer('velocity')->nullable();
            $table->timestamps();

            $table->foreign('project_id')
                ->references('id')
                ->on('projects')
                ->onDelete('cascade');

            $table->index(['project_id', 'status']);
        });

        Schema::create('milestones', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('project_id');
            $table->string('name');
            $table->text('description')->nullable();
            $table->date('target_date');
            $table->date('completed_date')->nullable();
            $table->string('status', 50)->default('pending');
            $table->timestamps();

            $table->foreign('project_id')
                ->references('id')
                ->on('projects')
                ->onDelete('cascade');

            $table->index(['project_id', 'status']);
        });

        // Add foreign keys to tasks table for sprint and milestone
        Schema::table('tasks', function (Blueprint $table) {
            $table->foreign('sprint_id')
                ->references('id')
                ->on('sprints')
                ->onDelete('set null');

            $table->foreign('milestone_id')
                ->references('id')
                ->on('milestones')
                ->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::table('tasks', function (Blueprint $table) {
            $table->dropForeign(['sprint_id']);
            $table->dropForeign(['milestone_id']);
        });
        Schema::dropIfExists('milestones');
        Schema::dropIfExists('sprints');
    }
};
