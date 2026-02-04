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
        // Clinical Encounters (Visits)
        Schema::create('doctors_clinical_encounters', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('organization_id')->constrained('organizations')->onDelete('cascade');
            $table->foreignUuid('patient_id')->constrained('doctors_patients')->onDelete('cascade');
            $table->foreignUuid('provider_id')->constrained('doctors_providers')->onDelete('cascade');
            $table->foreignUuid('appointment_id')->nullable()->constrained('doctors_appointments')->onDelete('set null');
            $table->dateTime('encounter_date');
            $table->string('type'); // office_visit, tele_health, etc.
            $table->text('chief_complaint')->nullable();
            $table->text('subjective')->nullable(); // SOAP: S
            $table->text('objective')->nullable();  // SOAP: O
            $table->text('assessment')->nullable(); // SOAP: A
            $table->text('plan')->nullable();       // SOAP: P
            $table->string('status')->default('draft'); // draft, signed, addendum
            $table->timestamps();
            $table->softDeletes();
        });

        // Vitals
        Schema::create('doctors_clinical_vitals', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('encounter_id')->constrained('doctors_clinical_encounters')->onDelete('cascade');
            $table->string('blood_pressure_systolic')->nullable();
            $table->string('blood_pressure_diastolic')->nullable();
            $table->string('heart_rate')->nullable();
            $table->string('respiratory_rate')->nullable();
            $table->string('temperature')->nullable();
            $table->string('weight_kg')->nullable();
            $table->string('height_cm')->nullable();
            $table->string('oxygen_saturation')->nullable();
            $table->timestamps();
        });

        // Diagnoses (ICD-10)
        Schema::create('doctors_clinical_diagnoses', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('encounter_id')->constrained('doctors_clinical_encounters')->onDelete('cascade');
            $table->foreignUuid('patient_id')->constrained('doctors_patients')->onDelete('cascade');
            $table->string('code'); // ICD-10 code
            $table->string('description');
            $table->boolean('is_primary')->default(false);
            $table->string('status')->default('active'); // active, resolved
            $table->timestamps();
        });

        // Medications
        Schema::create('doctors_clinical_medications', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('encounter_id')->nullable()->constrained('doctors_clinical_encounters')->onDelete('cascade');
            $table->foreignUuid('patient_id')->constrained('doctors_patients')->onDelete('cascade');
            $table->string('drug_name');
            $table->string('dosage');
            $table->string('frequency');
            $table->string('route')->nullable(); // oral, iv, etc.
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();
            $table->string('status')->default('active'); // active, discontinued
            $table->boolean('is_prescribed')->default(true); // true = prescribed here, false = reported by patient
            $table->timestamps();
        });

        // Allergies
        Schema::create('doctors_clinical_allergies', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('patient_id')->constrained('doctors_patients')->onDelete('cascade');
            $table->string('allergen');
            $table->string('reaction')->nullable();
            $table->string('severity')->nullable(); // mild, moderate, severe
            $table->date('onset_date')->nullable();
            $table->string('status')->default('active');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('doctors_clinical_allergies');
        Schema::dropIfExists('doctors_clinical_medications');
        Schema::dropIfExists('doctors_clinical_diagnoses');
        Schema::dropIfExists('doctors_clinical_vitals');
        Schema::dropIfExists('doctors_clinical_encounters');
    }
};
