<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Create tef_message_type enum (PostgreSQL only)
        if (config('database.default') === 'pgsql') {
            try {
                DB::statement("CREATE TYPE tef_message_type AS ENUM (
                    'TASK_CREATE', 'TASK_ACCEPT', 'TASK_REJECT', 'TASK_DELEGATE',
                    'TASK_STATUS_UPDATE', 'TASK_COMPLETE', 'TASK_CANCEL', 'TASK_REOPEN',
                    'TASK_MESSAGE', 'TASK_CLARIFICATION_REQUEST', 'TASK_CLARIFICATION_RESPONSE',
                    'TASK_ATTACHMENT_ADD', 'TASK_PROGRESS_REPORT', 'TASK_TIMELINE_UPDATE',
                    'TASK_DISPUTE', 'TASK_RESOLUTION'
                )");
            } catch (\Exception $e) {
                // Enum might already exist
            }
        }

        Schema::create('conversations', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('task_id');
            $table->json('participants'); // Array of actor UUIDs
            $table->integer('message_count')->default(0);
            $table->timestamp('last_message_at')->nullable();
            $table->timestamps();
            
            $table->index('task_id');
            
            // Foreign key
            if (Schema::hasTable('tasks')) {
                $table->foreign('task_id')->references('id')->on('tasks')->onDelete('cascade');
            }
        });

        Schema::create('messages', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('conversation_id');
            $table->uuid('task_id');
            $table->string('message_type', 50); // Using string instead of enum
            $table->uuid('source_actor_id');
            $table->uuid('target_actor_id');
            $table->uuid('reply_to_id')->nullable();
            $table->json('payload');
            $table->timestamp('delivered_at')->nullable();
            $table->timestamp('read_at')->nullable();
            $table->timestamps();
            
            $table->index('conversation_id');
            $table->index('task_id');
            $table->index('source_actor_id');
            $table->index('target_actor_id');
            $table->index('message_type');
            
            // Foreign keys
            $table->foreign('conversation_id')->references('id')->on('conversations')->onDelete('cascade');
            if (Schema::hasTable('tasks')) {
                $table->foreign('task_id')->references('id')->on('tasks')->onDelete('cascade');
            }
            $table->foreign('source_actor_id')->references('id')->on('actors');
            $table->foreign('target_actor_id')->references('id')->on('actors');
            $table->foreign('reply_to_id')->references('id')->on('messages')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('messages');
        Schema::dropIfExists('conversations');
        
        // Drop enum (PostgreSQL only)
        if (config('database.default') === 'pgsql') {
            DB::statement('DROP TYPE IF EXISTS tef_message_type');
        }
    }
};

