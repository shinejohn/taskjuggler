<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Skip if table already exists
        if (Schema::hasTable('task_messages')) {
            return;
        }

        Schema::create('task_messages', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('task_id');
            $table->uuid('sender_id');
            $table->text('content');
            $table->string('content_type')->default('text'); // text, html
            $table->json('attachments')->nullable();
            $table->json('metadata')->nullable();
            $table->timestamps();
            
            $table->index('task_id');
            
            // Only add foreign keys if tables exist
            if (Schema::hasTable('tasks')) {
                $table->foreign('task_id')->references('id')->on('tasks')->onDelete('cascade');
            }
            if (Schema::hasTable('users')) {
                $table->foreign('sender_id')->references('id')->on('users');
            }
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('task_messages');
    }
};

