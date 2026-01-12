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
        Schema::create('ideacircuit_meeting_messages', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('meeting_id');
            $table->foreign('meeting_id')->references('id')->on('ideacircuit_meetings')->onDelete('cascade');
            
            $table->uuid('participant_id')->nullable();
            $table->foreign('participant_id')->references('id')->on('ideacircuit_meeting_participants')->onDelete('set null');
            
            $table->uuid('user_id')->nullable();
            $table->foreign('user_id')->references('id')->on('users')->onDelete('set null');
            
            // Message Content
            $table->text('message_text');
            $table->string('message_type')->default('text'); // text, system, ai_response, file, action, poll, reaction
            
            // Reply/Thread Support
            $table->uuid('reply_to_message_id')->nullable();
            $table->foreign('reply_to_message_id')->references('id')->on('ideacircuit_meeting_messages')->onDelete('set null');
            $table->integer('thread_count')->default(0);
            
            // AI Detection & Analysis
            $table->boolean('is_ai_generated')->default(false);
            $table->string('sentiment')->nullable(); // positive, neutral, negative, mixed
            $table->string('intent')->nullable();
            $table->decimal('confidence_score', 3, 2)->nullable();
            
            // Extracted Entities
            $table->jsonb('mentioned_users')->default('[]');
            $table->jsonb('action_items')->default('[]');
            $table->jsonb('key_phrases')->default('[]');
            
            // Attachments
            $table->boolean('has_attachments')->default(false);
            $table->jsonb('attachment_urls')->default('[]');
            
            // Status
            $table->boolean('is_edited')->default(false);
            $table->boolean('is_deleted')->default(false);
            
            // Timestamps
            $table->timestampTz('edited_at')->nullable();
            $table->timestampTz('deleted_at')->nullable();
            $table->timestampsTz();
            
            // Metadata
            $table->jsonb('metadata')->default('{}');
            
            // Indexes
            $table->index(['meeting_id', 'created_at']);
            $table->index('participant_id');
            $table->index('reply_to_message_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ideacircuit_meeting_messages');
    }
};
