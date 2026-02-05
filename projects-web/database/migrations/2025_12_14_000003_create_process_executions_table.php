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
        Schema::create('process_executions', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('process_id');
            $table->uuid('task_id')->nullable(); // Optional: linked task that triggered execution
            $table->uuid('project_id')->nullable(); // Optional: linked project
            $table->enum('status', ['pending', 'running', 'completed', 'failed', 'cancelled'])->default('pending');
            $table->timestamp('started_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->text('error_message')->nullable();
            $table->jsonb('execution_data')->nullable(); // Context data for execution
            $table->jsonb('step_results')->nullable(); // Results from each step
            $table->integer('current_step_order')->nullable(); // Track which step is executing
            $table->timestamps();

            $table->foreign('process_id')
                ->references('id')
                ->on('processes')
                ->onDelete('cascade');

            $table->foreign('task_id')
                ->references('id')
                ->on('tasks')
                ->onDelete('set null');

            $table->foreign('project_id')
                ->references('id')
                ->on('projects')
                ->onDelete('set null');

            $table->index(['process_id', 'status']);
            $table->index('task_id');
            $table->index('project_id');
            $table->index('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('process_executions');
    }
};
