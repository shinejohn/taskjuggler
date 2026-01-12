<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('urpa_phone_calls')) {
            return;
        }

        Schema::create('urpa_phone_calls', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('user_id');
            
            // Call Details
            $table->string('direction', 10); // inbound, outbound
            $table->string('caller_number', 50)->nullable();
            $table->string('callee_number', 50)->nullable();
            
            // Status
            $table->string('status', 20)->nullable(); // ringing, in_progress, completed, missed, voicemail
            $table->integer('duration_seconds')->nullable();
            
            // AI Handling
            $table->boolean('handled_by_ai')->default(false);
            $table->string('ai_persona_used', 20)->nullable();
            
            // Recording & Transcript
            $table->text('recording_url')->nullable();
            $table->text('recording_storage_path')->nullable();
            $table->text('transcript')->nullable();
            $table->text('ai_summary')->nullable();
            
            // Actions Taken
            $table->json('actions_taken')->default('[]'); // Tasks created, calendar events, etc.
            
            // Vapi Integration
            $table->string('vapi_call_id', 100)->nullable();
            $table->string('vapi_assistant_id', 100)->nullable();
            
            // Contact
            $table->uuid('contact_id')->nullable();
            
            // Timestamps
            $table->timestamp('started_at')->nullable();
            $table->timestamp('ended_at')->nullable();
            $table->timestamp('created_at')->useCurrent();
            
            $table->index('user_id');
            $table->index('status');
            $table->index('vapi_call_id');
            
            if (Schema::hasTable('users')) {
                $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            }
            if (Schema::hasTable('urpa_contacts')) {
                $table->foreign('contact_id')->references('id')->on('urpa_contacts')->onDelete('set null');
            }
        });

        Schema::create('urpa_voice_responses', function (Blueprint $table) {
            $table->uuid('id')->primary();
            
            // Categorization
            $table->string('category', 50); // greeting, scheduling, faq, transfer, goodbye
            $table->string('intent', 100)->nullable(); // specific intent within category
            
            // Content
            $table->text('text_content'); // What the AI says
            $table->text('audio_url')->nullable(); // Pre-recorded audio URL
            $table->integer('audio_duration_ms')->nullable();
            
            // Matching
            $table->json('trigger_phrases')->default('[]'); // Phrases that trigger this response
            $table->json('context_requirements')->default('{}'); // Required context to use this
            
            // Personalization slots
            $table->boolean('has_personalization')->default(false);
            $table->json('personalization_slots')->default('[]'); // [{slot: "name", default: "there"}]
            
            // Usage
            $table->integer('usage_count')->default(0);
            $table->boolean('is_active')->default(true);
            
            $table->timestamp('created_at')->useCurrent();
            
            $table->index('category');
            $table->index('intent');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('urpa_voice_responses');
        Schema::dropIfExists('urpa_phone_calls');
    }
};

