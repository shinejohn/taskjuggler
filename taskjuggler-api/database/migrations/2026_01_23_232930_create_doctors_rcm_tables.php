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
        // Insurance Carriers
        Schema::create('doctors_rcm_insurance_carriers', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('organization_id')->nullable()->constrained('organizations')->onDelete('cascade'); // Nullable for global carriers
            $table->string('name');
            $table->string('payer_id')->nullable(); // Electronic Payer ID
            $table->string('phone')->nullable();
            $table->text('address')->nullable();
            $table->timestamps();
        });

        // Patient Policies
        Schema::create('doctors_rcm_patient_policies', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('patient_id')->constrained('doctors_patients')->onDelete('cascade');
            $table->foreignUuid('carrier_id')->constrained('doctors_rcm_insurance_carriers')->onDelete('cascade');
            $table->string('member_id');
            $table->string('group_number')->nullable();
            $table->string('relationship')->default('self'); // self, spouse, child
            $table->string('policy_holder_name')->nullable();
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();
            $table->string('status')->default('active');
            $table->integer('order')->default(1); // 1 = primary, 2 = secondary
            $table->timestamps();
        });

        // Claims
        Schema::create('doctors_rcm_claims', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('organization_id')->constrained('organizations')->onDelete('cascade');
            $table->foreignUuid('patient_id')->constrained('doctors_patients')->onDelete('cascade');
            $table->foreignUuid('provider_id')->constrained('doctors_providers')->onDelete('cascade');
            $table->foreignUuid('encounter_id')->nullable()->constrained('doctors_clinical_encounters')->onDelete('set null');
            $table->foreignUuid('primary_policy_id')->nullable()->constrained('doctors_rcm_patient_policies')->onDelete('set null');
            $table->decimal('total_billed', 10, 2);
            $table->decimal('patient_responsibility', 10, 2)->default(0);
            $table->decimal('insurance_paid', 10, 2)->default(0);
            $table->string('status')->default('draft'); // draft, submitted, paid, denied, appealed
            $table->date('service_date');
            $table->timestamps();
        });

        // Claim Lines (CPT Codes)
        Schema::create('doctors_rcm_claim_lines', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('claim_id')->constrained('doctors_rcm_claims')->onDelete('cascade');
            $table->string('visit_type_cpt')->nullable(); // CPT code
            $table->string('description')->nullable();
            $table->decimal('charge_amount', 10, 2);
            $table->integer('units')->default(1);
            $table->json('modifiers')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('doctors_rcm_claim_lines');
        Schema::dropIfExists('doctors_rcm_claims');
        Schema::dropIfExists('doctors_rcm_patient_policies');
        Schema::dropIfExists('doctors_rcm_insurance_carriers');
    }
};
