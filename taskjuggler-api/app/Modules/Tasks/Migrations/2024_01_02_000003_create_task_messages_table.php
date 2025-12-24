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
            $table->uuid('sender_id')->nullable();  // Null for system messages
            $table->string('sender_type', 20)->default('human');  // human, ai_agent, system
            $table->text('content');
            $table->string('content_type', 20)->default('text');  // text, file, image, system
            $table->string('source_channel', 20)->nullable();  // email, sms, slack, in_app
            $table->string('source_channel_ref')->nullable();  // External message ID
            $table->jsonb('attachments')->nullable();  // File attachments
            $table->jsonb('metadata')->nullable();  // Extra data
            $table->timestamps();
            
            $table->index('task_id');
            $table->index('sender_id');
            $table->index('created_at');
            
            // Only add foreign keys if tables exist
            if (Schema::hasTable('tasks')) {
                $table->foreign('task_id')->references('id')->on('tasks')->onDelete('cascade');
            }
            if (Schema::hasTable('users')) {
                $table->foreign('sender_id')->references('id')->on('users')->nullOnDelete();
            }
        });
        
        // Track who has read messages (for unread counts)
        if (!Schema::hasTable('task_message_reads')) {
            Schema::create('task_message_reads', function (Blueprint $table) {
                $table->uuid('id')->primary();
                $table->uuid('task_id');
                $table->uuid('user_id');
                $table->uuid('last_read_message_id')->nullable();
                $table->timestamp('last_read_at')->nullable();
                $table->timestamps();

                $table->foreign('task_id')->references('id')->on('tasks')->onDelete('cascade');
                $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
                $table->foreign('last_read_message_id')->references('id')->on('task_messages')->nullOnDelete();
                
                $table->unique(['task_id', 'user_id']);
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('task_messages');
    }
};

