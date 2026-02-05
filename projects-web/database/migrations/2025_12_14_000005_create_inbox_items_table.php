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
        Schema::create('inbox_items', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('user_id');
            $table->uuid('organization_id'); // Add organization for multi-tenancy
            
            // Source
            $table->string('source_type', 20); // 'phone', 'email', 'sms'
            $table->string('source_id', 255)->nullable(); // External ID (Twilio SID, email message ID)
            $table->uuid('channel_id')->nullable();
            
            // Sender
            $table->string('from_identifier', 255); // Phone or email
            $table->string('from_name')->nullable();
            
            // Content
            $table->string('subject', 500)->nullable();
            $table->text('body');
            $table->jsonb('attachments')->default('[]');
            
            // AI Processing
            $table->jsonb('extracted_data')->nullable();
            $table->string('processing_status', 20)->default('pending');
            $table->text('processing_error')->nullable();
            
            // Routing
            $table->uuid('routed_to_task_id')->nullable();
            $table->uuid('routing_rule_id')->nullable();
            
            // Auto-response
            $table->boolean('auto_response_sent')->default(false);
            $table->text('auto_response_text')->nullable();
            
            // Status
            $table->string('status', 20)->default('unprocessed');
            
            $table->timestampTz('received_at');
            $table->timestampTz('processed_at')->nullable();
            $table->timestampsTz();

            $table->foreign('user_id')
                ->references('id')
                ->on('users')
                ->onDelete('cascade');

            $table->foreign('organization_id')
                ->references('id')
                ->on('organizations')
                ->onDelete('cascade');

            $table->index(['user_id', 'status']);
            $table->index(['organization_id', 'status']);
            $table->index('received_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('inbox_items');
    }
};
