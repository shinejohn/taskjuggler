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
        Schema::create('ideacircuit_meetings', function (Blueprint $table) {
            $table->uuid('id')->primary();
            
            // Host (must be authenticated user)
            $table->uuid('user_id');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            
            // Meeting Details
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('meeting_type')->default('general'); // general, presentation, sales_call, planning, workshop, webinar
            $table->string('status')->default('scheduled'); // scheduled, waiting, active, ended, cancelled
            
            // Access Control
            $table->string('visibility')->default('private'); // private, public, unlisted
            $table->boolean('requires_approval')->default(false);
            $table->boolean('allow_guests')->default(true);
            $table->integer('max_participants')->default(10);
            
            // Guest Access
            $table->string('guest_join_url')->unique()->nullable();
            $table->string('guest_access_code')->nullable();
            $table->timestampTz('guest_url_expires_at')->nullable();
            
            // Chime SDK Integration
            $table->string('chime_meeting_id')->unique()->nullable();
            $table->string('chime_region')->default('us-east-1');
            $table->string('chime_external_id')->nullable();
            $table->jsonb('chime_media_placement')->nullable();
            
            // AI Features
            $table->boolean('ai_participant_enabled')->default(false);
            $table->uuid('ai_script_id')->nullable();
            $table->boolean('ai_voice_enabled')->default(false);
            $table->string('ai_language')->default('en-US');
            
            // Recording & Transcription
            $table->boolean('recording_enabled')->default(false);
            $table->string('recording_status')->default('not_started'); // not_started, recording, stopped, processing, ready, failed
            $table->boolean('transcription_enabled')->default(false);
            
            // Timestamps
            $table->timestampTz('scheduled_at')->nullable();
            $table->timestampTz('started_at')->nullable();
            $table->timestampTz('ended_at')->nullable();
            $table->integer('duration_seconds')->nullable();
            
            // Metadata
            $table->jsonb('settings')->default('{}');
            $table->jsonb('metadata')->default('{}');
            $table->timestampsTz();
            
            // Indexes
            $table->index('user_id');
            $table->index('status');
            $table->index('scheduled_at');
            $table->index('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ideacircuit_meetings');
    }
};
