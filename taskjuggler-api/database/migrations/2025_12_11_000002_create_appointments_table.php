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
        Schema::create('appointments', function (Blueprint $table) {
            $table->uuid('id')->primary();
            
            // Appointment type
            $table->uuid('appointment_type_id');
            $table->foreign('appointment_type_id')->references('id')->on('appointment_types')->onDelete('cascade');
            
            // Host (the user who owns the appointment type)
            $table->uuid('host_id');
            $table->foreign('host_id')->references('id')->on('users')->onDelete('cascade');
            
            // Guest/Attendee information
            $table->string('guest_name', 255);
            $table->string('guest_email', 255);
            $table->string('guest_phone', 50)->nullable();
            
            // Appointment details
            $table->timestamp('start_time');
            $table->timestamp('end_time');
            $table->string('timezone', 50)->default('UTC');
            
            // Status
            $table->string('status', 20)->default('scheduled'); // scheduled, confirmed, cancelled, completed, no_show
            $table->timestamp('confirmed_at')->nullable();
            $table->timestamp('cancelled_at')->nullable();
            $table->text('cancellation_reason')->nullable();
            
            // Meeting details
            $table->text('notes')->nullable(); // Notes from guest
            $table->text('internal_notes')->nullable(); // Internal notes (only visible to host)
            $table->string('meeting_location', 500)->nullable(); // Physical location or video link
            $table->string('meeting_url', 500)->nullable(); // Video conference URL
            
            // Task integration
            $table->uuid('task_id')->nullable();
            $table->foreign('task_id')->references('id')->on('tasks')->onDelete('set null');
            
            // Reminders
            $table->boolean('send_reminder_email')->default(true);
            $table->boolean('send_reminder_sms')->default(false);
            
            // Booking metadata
            $table->string('booking_source', 50)->default('web'); // web, api, mobile
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            
            $table->timestamps();
            
            $table->index(['host_id', 'status']);
            $table->index(['appointment_type_id', 'start_time']);
            $table->index(['start_time', 'end_time']);
            $table->index('guest_email');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('appointments');
    }
};
