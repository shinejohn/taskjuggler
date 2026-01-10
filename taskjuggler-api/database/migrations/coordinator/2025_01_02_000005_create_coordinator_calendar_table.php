<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Appointment Types
        Schema::create('coord_appointment_types', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('organization_id');
            $table->string('name'); // "Initial Consultation", "Cleaning", "Service Call"
            $table->text('description')->nullable();
            $table->integer('duration_minutes')->default(60);
            $table->decimal('price', 10, 2)->nullable();
            $table->string('color')->default('#3B82F6'); // For calendar display
            $table->json('buffer_before')->nullable(); // Minutes before
            $table->json('buffer_after')->nullable(); // Minutes after
            $table->json('availability')->nullable(); // Specific availability rules
            $table->boolean('requires_confirmation')->default(true);
            $table->boolean('allow_online_booking')->default(true);
            $table->boolean('is_active')->default(true);
            $table->integer('sort_order')->default(0);
            $table->timestamps();
            
            $table->foreign('organization_id')
                ->references('id')
                ->on('coord_organizations')
                ->onDelete('cascade');
        });

        // Appointments
        Schema::create('coord_appointments', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('organization_id');
            $table->uuid('contact_id');
            $table->uuid('appointment_type_id')->nullable();
            $table->uuid('booked_by_coordinator_id')->nullable();
            $table->foreignId('assigned_to_user_id')->nullable()->constrained('users');
            $table->string('title');
            $table->text('description')->nullable();
            $table->timestamp('starts_at');
            $table->timestamp('ends_at');
            $table->string('status')->default('scheduled'); 
            // scheduled, confirmed, in_progress, completed, cancelled, no_show, rescheduled
            $table->string('location')->nullable();
            $table->string('location_type')->default('in_person'); // in_person, phone, video
            $table->text('notes')->nullable();
            $table->text('cancellation_reason')->nullable();
            $table->json('reminders_sent')->nullable(); // Track sent reminders
            $table->timestamp('confirmed_at')->nullable();
            $table->timestamp('cancelled_at')->nullable();
            $table->timestamps();
            $table->softDeletes();
            
            $table->foreign('organization_id')
                ->references('id')
                ->on('coord_organizations')
                ->onDelete('cascade');
                
            $table->foreign('contact_id')
                ->references('id')
                ->on('coord_contacts')
                ->onDelete('cascade');
                
            $table->foreign('appointment_type_id')
                ->references('id')
                ->on('coord_appointment_types')
                ->onDelete('set null');
                
            $table->foreign('booked_by_coordinator_id')
                ->references('id')
                ->on('coord_coordinators')
                ->onDelete('set null');
                
            $table->index(['organization_id', 'starts_at']);
            $table->index(['organization_id', 'status']);
            $table->index(['contact_id', 'starts_at']);
        });

        // Availability Schedules
        Schema::create('coord_availability_schedules', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('organization_id');
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('cascade');
            $table->string('name');
            $table->boolean('is_default')->default(false);
            $table->json('weekly_hours'); // Hours for each day of week
            $table->json('exceptions')->nullable(); // Date-specific overrides
            $table->timestamps();
            
            $table->foreign('organization_id')
                ->references('id')
                ->on('coord_organizations')
                ->onDelete('cascade');
        });

        // Blocked Time Slots
        Schema::create('coord_blocked_times', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('organization_id');
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('cascade');
            $table->string('title')->nullable();
            $table->timestamp('starts_at');
            $table->timestamp('ends_at');
            $table->boolean('all_day')->default(false);
            $table->string('recurrence_rule')->nullable(); // RRULE for recurring blocks
            $table->timestamps();
            
            $table->foreign('organization_id')
                ->references('id')
                ->on('coord_organizations')
                ->onDelete('cascade');
                
            $table->index(['organization_id', 'starts_at', 'ends_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('coord_blocked_times');
        Schema::dropIfExists('coord_availability_schedules');
        Schema::dropIfExists('coord_appointments');
        Schema::dropIfExists('coord_appointment_types');
    }
};




