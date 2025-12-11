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
        Schema::create('task_actions', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('task_id');
            $table->foreign('task_id')->references('id')->on('tasks')->onDelete('cascade');
            $table->uuid('user_id')->nullable();
            $table->foreign('user_id')->references('id')->on('users')->onDelete('set null');
            $table->string('action_type', 50)->notNull(); // 'status_change', 'assign', 'complete', 'decline', 'watch', etc.
            $table->jsonb('action_data')->default('{}'); // Store additional context
            $table->string('previous_value')->nullable(); // Previous status/state
            $table->string('new_value')->nullable(); // New status/state
            $table->text('reason')->nullable(); // Optional reason for the action
            $table->timestampTz('created_at')->default(now());
            
            $table->index(['task_id', 'created_at']);
            $table->index(['user_id', 'created_at']);
            $table->index('action_type');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('task_actions');
    }
};
