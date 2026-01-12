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
        Schema::create('ideacircuit_meeting_transcripts', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('meeting_id');
            $table->foreign('meeting_id')->references('id')->on('ideacircuit_meetings')->onDelete('cascade');
            
            $table->uuid('participant_id')->nullable();
            $table->foreign('participant_id')->references('id')->on('ideacircuit_meeting_participants')->onDelete('set null');
            
            // Transcript Content
            $table->text('transcript_text');
            $table->string('speaker_name')->nullable();
            $table->uuid('speaker_id')->nullable();
            $table->foreign('speaker_id')->references('id')->on('users')->onDelete('set null');
            
            // Quality Metrics
            $table->decimal('confidence_score', 3, 2)->nullable();
            $table->boolean('is_final')->default(true);
            $table->boolean('is_partial')->default(false);
            
            // Language
            $table->string('language')->default('en-US');
            $table->string('detected_language')->nullable();
            
            // Timing (milliseconds from meeting start)
            $table->bigInteger('start_time_ms');
            $table->bigInteger('end_time_ms');
            $table->integer('duration_ms')->nullable();
            
            // AI Analysis
            $table->string('sentiment')->nullable(); // positive, neutral, negative, mixed
            $table->decimal('sentiment_score', 3, 2)->nullable();
            
            // Extracted Information
            $table->jsonb('key_phrases')->default('[]');
            $table->jsonb('entities')->default('[]');
            $table->jsonb('topics')->default('[]');
            $table->jsonb('action_items')->default('[]');
            $table->jsonb('questions')->default('[]');
            
            // Speaker Analysis
            $table->string('speaker_emotion')->nullable();
            $table->integer('speaking_rate_wpm')->nullable(); // words per minute
            
            // Timestamps
            $table->timestampsTz();
            
            // Metadata
            $table->jsonb('metadata')->default('{}');
            
            // Indexes
            $table->index(['meeting_id', 'start_time_ms']);
            $table->index('participant_id');
            $table->index('speaker_id');
            $table->index(['meeting_id', 'is_final']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ideacircuit_meeting_transcripts');
    }
};
