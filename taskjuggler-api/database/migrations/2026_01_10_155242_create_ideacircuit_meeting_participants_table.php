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
        Schema::create('ideacircuit_meeting_participants', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('meeting_id');
            $table->foreign('meeting_id')->references('id')->on('ideacircuit_meetings')->onDelete('cascade');
            
            // User Reference (NULL for guests)
            $table->uuid('user_id')->nullable();
            $table->foreign('user_id')->references('id')->on('users')->onDelete('set null');
            
            // Guest Information
            $table->boolean('is_guest')->default(false);
            $table->string('guest_name')->nullable();
            $table->string('guest_email')->nullable();
            $table->string('guest_access_token')->unique()->nullable();
            $table->timestampTz('guest_expires_at')->nullable();
            
            // Display Info
            $table->string('display_name');
            $table->string('avatar_url')->nullable();
            
            // Role
            $table->string('role')->default('attendee'); // host, co-host, presenter, attendee, ai_facilitator, guest
            
            // Chime Attendee Info
            $table->string('chime_attendee_id')->nullable();
            $table->string('chime_external_user_id')->nullable();
            $table->string('chime_join_token')->nullable();
            
            // Status
            $table->boolean('is_active')->default(false);
            $table->string('connection_status')->default('disconnected'); // connected, disconnected, reconnecting
            $table->timestampTz('joined_at')->nullable();
            $table->timestampTz('left_at')->nullable();
            $table->integer('total_duration_seconds')->default(0);
            
            // Audio/Video State
            $table->boolean('is_muted')->default(false);
            $table->boolean('is_video_off')->default(true);
            $table->boolean('is_screen_sharing')->default(false);
            
            // Permissions
            $table->boolean('can_chat')->default(true);
            $table->boolean('can_share_screen')->default(true);
            $table->boolean('can_record')->default(false);
            $table->boolean('can_view_notes')->default(true);
            $table->boolean('can_edit_notes')->default(false);
            $table->boolean('can_invite_others')->default(false);
            
            // Metadata
            $table->jsonb('metadata')->default('{}');
            $table->timestampsTz();
            
            // Indexes
            $table->index('meeting_id');
            $table->index('user_id');
            $table->index('guest_access_token');
            $table->index(['meeting_id', 'is_active']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ideacircuit_meeting_participants');
    }
};
