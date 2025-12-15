<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Skip if table already exists
        if (Schema::hasTable('task_actions')) {
            return;
        }

        Schema::create('task_actions', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('task_id');
            $table->uuid('user_id')->nullable();
            $table->string('actor_type')->default('human'); // human, system, ai
            $table->string('action');
            $table->string('from_value')->nullable();
            $table->string('to_value')->nullable();
            $table->json('metadata')->nullable();
            $table->timestamps();
            
            $table->index('task_id');
            
            // Only add foreign keys if tables exist
            if (Schema::hasTable('tasks')) {
                $table->foreign('task_id')->references('id')->on('tasks')->onDelete('cascade');
            }
            if (Schema::hasTable('users')) {
                $table->foreign('user_id')->references('id')->on('users')->nullOnDelete();
            }
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('task_actions');
    }
};

