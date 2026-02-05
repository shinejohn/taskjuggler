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
            $table->uuid('user_id')->nullable();
            
            $table->string('action_type', 100);
            $table->string('from_state', 50)->nullable();
            $table->string('to_state', 50)->nullable();
            $table->jsonb('changes')->nullable();
            $table->text('comment')->nullable();
            $table->string('channel', 50)->nullable();
            
            $table->timestamp('created_at');

            $table->foreign('task_id')
                ->references('id')
                ->on('tasks')
                ->onDelete('cascade');

            $table->foreign('user_id')
                ->references('id')
                ->on('users')
                ->onDelete('set null');

            $table->index(['task_id', 'created_at']);
            $table->index('action_type');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('task_actions');
    }
};
