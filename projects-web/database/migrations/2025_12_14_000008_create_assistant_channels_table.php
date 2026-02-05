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
        Schema::create('assistant_channels', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('user_id');
            $table->uuid('organization_id'); // Add organization for multi-tenancy
            
            $table->string('channel_type', 20); // 'phone', 'email', 'sms'
            
            // Phone (Twilio)
            $table->string('phone_number', 20)->nullable();
            $table->string('twilio_sid', 50)->nullable();
            
            // Email (SendGrid)
            $table->string('email_address', 255)->nullable();
            
            // Settings
            $table->boolean('is_active')->default(true);
            $table->text('greeting_message')->nullable();
            $table->text('voicemail_greeting')->nullable();
            
            $table->timestampsTz();

            $table->foreign('user_id')
                ->references('id')
                ->on('users')
                ->onDelete('cascade');

            $table->foreign('organization_id')
                ->references('id')
                ->on('organizations')
                ->onDelete('cascade');

            $table->index(['user_id', 'is_active']);
            $table->index(['organization_id', 'channel_type']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('assistant_channels');
    }
};
