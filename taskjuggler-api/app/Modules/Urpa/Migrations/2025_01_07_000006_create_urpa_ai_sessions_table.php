<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('urpa_ai_sessions')) {
            return;
        }

        Schema::create('urpa_ai_sessions', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('user_id');
            
            // Session Type
            $table->string('session_type', 20); // chat, voice, video
            $table->string('persona_used', 20)->nullable();
            
            // Status
            $table->string('status', 20)->default('active'); // active, completed, abandoned
            
            // Duration
            $table->timestamp('started_at')->useCurrent();
            $table->timestamp('ended_at')->nullable();
            
            // Metrics
            $table->integer('message_count')->default(0);
            $table->integer('ai_request_count')->default(0);
            
            // Context
            $table->json('context')->default('{}'); // Session context for continuity
            
            $table->timestamp('created_at')->useCurrent();
            
            $table->index('user_id');
            
            if (Schema::hasTable('users')) {
                $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            }
        });

        Schema::create('urpa_ai_messages', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('session_id');
            
            // Message
            $table->string('role', 20); // user, assistant, system
            $table->text('content');
            
            // Voice-specific
            $table->boolean('is_voice')->default(false);
            $table->text('audio_url')->nullable();
            $table->text('transcript')->nullable();
            $table->boolean('used_prerecorded')->default(false);
            $table->uuid('prerecorded_response_id')->nullable();
            
            // Tokens
            $table->integer('input_tokens')->nullable();
            $table->integer('output_tokens')->nullable();
            
            // Timestamp
            $table->timestamp('created_at')->useCurrent();
            
            $table->index('session_id');
            
            if (Schema::hasTable('urpa_ai_sessions')) {
                $table->foreign('session_id')->references('id')->on('urpa_ai_sessions')->onDelete('cascade');
            }
            if (Schema::hasTable('urpa_voice_responses')) {
                $table->foreign('prerecorded_response_id')->references('id')->on('urpa_voice_responses')->onDelete('set null');
            }
        });

        Schema::create('urpa_ai_tasks', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('user_id');
            $table->uuid('session_id')->nullable();
            
            // Task Details
            $table->string('title', 255);
            $table->text('description')->nullable();
            
            // Status
            $table->string('status', 20)->default('pending'); // pending, in_progress, completed, failed
            
            // Source
            $table->string('source_type', 50)->nullable(); // email, call, chat, calendar
            $table->uuid('source_id')->nullable(); // Reference to source activity/call
            
            // TaskJuggler sync
            $table->uuid('taskjuggler_task_id')->nullable();
            $table->boolean('synced_to_taskjuggler')->default(false);
            
            // Timestamps
            $table->timestamp('due_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->timestamp('created_at')->useCurrent();
            
            $table->index('user_id');
            $table->index('status');
            
            if (Schema::hasTable('users')) {
                $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            }
            if (Schema::hasTable('urpa_ai_sessions')) {
                $table->foreign('session_id')->references('id')->on('urpa_ai_sessions')->onDelete('set null');
            }
        });

        // Now add foreign key for session_id in urpa_artifacts
        if (Schema::hasTable('urpa_artifacts') && Schema::hasTable('urpa_ai_sessions')) {
            Schema::table('urpa_artifacts', function (Blueprint $table) {
                $table->foreign('session_id')->references('id')->on('urpa_ai_sessions')->onDelete('set null');
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasTable('urpa_artifacts')) {
            Schema::table('urpa_artifacts', function (Blueprint $table) {
                $table->dropForeign(['session_id']);
            });
        }
        
        Schema::dropIfExists('urpa_ai_tasks');
        Schema::dropIfExists('urpa_ai_messages');
        Schema::dropIfExists('urpa_ai_sessions');
    }
};

