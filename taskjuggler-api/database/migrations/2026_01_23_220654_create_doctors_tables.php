<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Providers (Doctors)
        Schema::create('doctors_providers', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignUuid('organization_id')->constrained('organizations')->onDelete('cascade');
            $table->string('specialty')->nullable();
            $table->string('license_number')->nullable();
            $table->string('npi_number')->nullable();
            $table->text('bio')->nullable();
            $table->json('availability')->nullable(); // Standard schedule
            $table->timestamps();
            $table->softDeletes();
        });

        // Patients
        Schema::create('doctors_patients', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('organization_id')->constrained('organizations')->onDelete('cascade');
            $table->string('first_name');
            $table->string('last_name');
            $table->date('dob')->nullable();
            $table->string('email')->nullable();
            $table->string('phone')->nullable();
            $table->text('address')->nullable();
            $table->json('insurance_info')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });

        // Appointment Types
        Schema::create('doctors_appointment_types', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('organization_id')->constrained('organizations')->onDelete('cascade');
            $table->string('name'); // e.g., "Initial Consultation", "Follow-up"
            $table->integer('duration_minutes')->default(30);
            $table->decimal('price', 10, 2)->nullable();
            $table->timestamps();
        });

        // Appointments
        Schema::create('doctors_appointments', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('organization_id')->constrained('organizations')->onDelete('cascade');
            $table->foreignUuid('patient_id')->constrained('doctors_patients')->onDelete('cascade');
            $table->foreignUuid('provider_id')->constrained('doctors_providers')->onDelete('cascade');
            $table->foreignUuid('type_id')->nullable()->constrained('doctors_appointment_types')->onDelete('set null');
            $table->dateTime('start_time');
            $table->dateTime('end_time');
            $table->string('status')->default('scheduled'); // scheduled, confirmed, cancelled, completed, no_show
            $table->text('notes')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('doctors_appointments');
        Schema::dropIfExists('doctors_appointment_types');
        Schema::dropIfExists('doctors_patients');
        Schema::dropIfExists('doctors_providers');
    }
};
