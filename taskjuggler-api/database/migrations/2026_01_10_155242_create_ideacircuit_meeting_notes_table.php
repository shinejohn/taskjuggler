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
        Schema::create('ideacircuit_meeting_notes', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('meeting_id');
            $table->foreign('meeting_id')->references('id')->on('ideacircuit_meetings')->onDelete('cascade');
            
            $table->uuid('user_id');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            
            // Note Content
            $table->string('category'); // Action Items, Decisions, Key Points, Questions, Follow-ups
            $table->text('content');
            $table->string('note_type')->default('manual'); // manual, ai_generated, auto_extracted, voice_note
            
            // Organization
            $table->jsonb('tags')->default('[]');
            $table->string('priority')->nullable(); // low, medium, high, urgent
            $table->string('status')->default('open'); // open, in_progress, completed, cancelled
            
            // Assignment
            $table->uuid('assigned_to')->nullable();
            $table->foreign('assigned_to')->references('id')->on('users')->onDelete('set null');
            $table->timestampTz('due_date')->nullable();
            
            // Collaboration
            $table->boolean('is_shared')->default(true);
            $table->jsonb('shared_with_participant_ids')->default('[]');
            
            // AI Metadata
            $table->decimal('confidence_score', 3, 2)->nullable();
            $table->boolean('extracted_from_transcript')->default(false);
            $table->bigInteger('source_timestamp_ms')->nullable(); // When in meeting this was mentioned
            
            // Timestamps
            $table->timestampTz('completed_at')->nullable();
            $table->timestampsTz();
            
            // Metadata
            $table->jsonb('metadata')->default('{}');
            
            // Indexes
            $table->index('meeting_id');
            $table->index('user_id');
            $table->index(['meeting_id', 'category']);
            $table->index('status');
            $table->index('assigned_to');
            $table->index('due_date');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ideacircuit_meeting_notes');
    }
};
