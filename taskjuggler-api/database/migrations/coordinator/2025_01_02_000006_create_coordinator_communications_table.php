<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Phone Numbers
        Schema::create('coord_phone_numbers', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('organization_id');
            $table->string('phone_number')->unique();
            $table->string('provider')->default('twilio'); // twilio, vapi
            $table->string('provider_id')->nullable(); // External ID
            $table->string('type')->default('local'); // local, toll_free
            $table->string('capabilities')->default('voice,sms'); // voice, sms, mms
            $table->uuid('assigned_coordinator_id')->nullable();
            $table->boolean('is_primary')->default(false);
            $table->boolean('is_active')->default(true);
            $table->json('forwarding_rules')->nullable();
            $table->timestamps();
            
            $table->foreign('organization_id')
                ->references('id')
                ->on('coord_organizations')
                ->onDelete('cascade');
                
            $table->foreign('assigned_coordinator_id')
                ->references('id')
                ->on('coord_coordinators')
                ->onDelete('set null');
        });

        // Call Logs
        Schema::create('coord_call_logs', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('organization_id');
            $table->uuid('coordinator_id')->nullable();
            $table->uuid('contact_id')->nullable();
            $table->uuid('phone_number_id')->nullable();
            $table->string('direction'); // inbound, outbound
            $table->string('from_number');
            $table->string('to_number');
            $table->string('status'); // queued, ringing, in_progress, completed, busy, failed, no_answer
            $table->integer('duration_seconds')->default(0);
            $table->string('recording_url')->nullable();
            $table->text('transcript')->nullable();
            $table->json('transcript_segments')->nullable(); // Timestamped segments
            $table->text('ai_summary')->nullable();
            $table->string('outcome')->nullable();
            $table->json('metadata')->nullable(); // Provider-specific data
            $table->string('provider')->default('vapi');
            $table->string('provider_call_id')->nullable();
            $table->decimal('cost', 8, 4)->default(0);
            $table->timestamp('started_at');
            $table->timestamp('answered_at')->nullable();
            $table->timestamp('ended_at')->nullable();
            $table->timestamps();
            
            $table->foreign('organization_id')
                ->references('id')
                ->on('coord_organizations')
                ->onDelete('cascade');
                
            $table->foreign('coordinator_id')
                ->references('id')
                ->on('coord_coordinators')
                ->onDelete('set null');
                
            $table->foreign('contact_id')
                ->references('id')
                ->on('coord_contacts')
                ->onDelete('set null');
                
            $table->foreign('phone_number_id')
                ->references('id')
                ->on('coord_phone_numbers')
                ->onDelete('set null');
                
            $table->index(['organization_id', 'created_at']);
            $table->index(['coordinator_id', 'created_at']);
            $table->index(['contact_id', 'created_at']);
        });

        // SMS Messages
        Schema::create('coord_sms_messages', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('organization_id');
            $table->uuid('coordinator_id')->nullable();
            $table->uuid('contact_id')->nullable();
            $table->uuid('phone_number_id')->nullable();
            $table->string('direction'); // inbound, outbound
            $table->string('from_number');
            $table->string('to_number');
            $table->text('body');
            $table->string('status'); // queued, sent, delivered, failed, received
            $table->json('media_urls')->nullable(); // For MMS
            $table->string('provider')->default('twilio');
            $table->string('provider_message_id')->nullable();
            $table->decimal('cost', 8, 4)->default(0);
            $table->timestamp('sent_at')->nullable();
            $table->timestamp('delivered_at')->nullable();
            $table->timestamps();
            
            $table->foreign('organization_id')
                ->references('id')
                ->on('coord_organizations')
                ->onDelete('cascade');
                
            $table->foreign('coordinator_id')
                ->references('id')
                ->on('coord_coordinators')
                ->onDelete('set null');
                
            $table->foreign('contact_id')
                ->references('id')
                ->on('coord_contacts')
                ->onDelete('set null');
                
            $table->index(['organization_id', 'created_at']);
            $table->index(['contact_id', 'created_at']);
        });

        // Email Messages
        Schema::create('coord_email_messages', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('organization_id');
            $table->uuid('coordinator_id')->nullable();
            $table->uuid('contact_id')->nullable();
            $table->string('direction'); // inbound, outbound
            $table->string('from_email');
            $table->string('to_email');
            $table->json('cc')->nullable();
            $table->json('bcc')->nullable();
            $table->string('subject');
            $table->text('body_text')->nullable();
            $table->text('body_html')->nullable();
            $table->string('status'); // queued, sent, delivered, opened, clicked, bounced, failed
            $table->json('attachments')->nullable();
            $table->string('provider')->default('sendgrid');
            $table->string('provider_message_id')->nullable();
            $table->timestamp('sent_at')->nullable();
            $table->timestamp('opened_at')->nullable();
            $table->timestamps();
            
            $table->foreign('organization_id')
                ->references('id')
                ->on('coord_organizations')
                ->onDelete('cascade');
                
            $table->foreign('coordinator_id')
                ->references('id')
                ->on('coord_coordinators')
                ->onDelete('set null');
                
            $table->foreign('contact_id')
                ->references('id')
                ->on('coord_contacts')
                ->onDelete('set null');
                
            $table->index(['organization_id', 'created_at']);
            $table->index(['contact_id', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('coord_email_messages');
        Schema::dropIfExists('coord_sms_messages');
        Schema::dropIfExists('coord_call_logs');
        Schema::dropIfExists('coord_phone_numbers');
    }
};




