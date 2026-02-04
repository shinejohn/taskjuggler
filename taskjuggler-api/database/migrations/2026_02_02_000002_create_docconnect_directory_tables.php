<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     * 
     * Creates DocConnect Directory and Referral tables.
     */
    public function up(): void
    {
        // =====================================================
        // DOCCONNECT PROFILES (Extended Professional Info)
        // =====================================================
        Schema::create('docconnect_profiles', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('provider_id')->constrained('doctors_providers')->onDelete('cascade');
            
            $table->text('bio')->nullable();
            $table->json('clinical_interests')->nullable(); // Tags: ["Cardiology", "Heart Failure"]
            $table->json('research_interests')->nullable();
            $table->json('education_history')->nullable(); // [{ "institution": "Harvard", "year": "2010", "degree": "MD" }]
            $table->json('publications')->nullable(); // List of DOI or titles
            $table->json('accepted_insurances')->nullable();
            
            $table->boolean('is_accepting_referrals')->default(true);
            $table->boolean('is_visible_in_directory')->default(true);
            
            $table->timestamps();
            
            $table->index('provider_id');
        });

        // =====================================================
        // DOCCONNECT CONNECTIONS (Professional Network)
        // =====================================================
        Schema::create('docconnect_connections', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('requester_id')->constrained('doctors_providers')->onDelete('cascade');
            $table->foreignUuid('recipient_id')->constrained('doctors_providers')->onDelete('cascade');
            
            // 'pending', 'connected', 'declined', 'blocked'
            $table->string('status', 20)->default('pending');
            $table->timestamp('connected_at')->nullable();
            
            $table->timestamps();
            
            $table->unique(['requester_id', 'recipient_id']);
            $table->index('status');
        });

        // =====================================================
        // DOCCONNECT REFERRALS (Secure Patient Handoff)
        // =====================================================
        Schema::create('docconnect_referrals', function (Blueprint $table) {
            $table->uuid('id')->primary();
            
            // Participants
            $table->foreignUuid('sending_provider_id')->constrained('doctors_providers');
            $table->foreignUuid('receiving_provider_id')->nullable()->constrained('doctors_providers'); // Nullable if general referral to a specialty/group
            $table->foreignUuid('patient_id')->constrained('patients'); // Link to existing patient record
            
            // Referral Details
            $table->string('specialty_requested'); // e.g. "Cardiology"
            $table->string('urgency', 20)->default('routine'); // 'routine', 'urgent', 'stat'
            $table->text('clinical_reason');
            $table->string('diagnosis_code')->nullable(); // ICD-10
            
            // Prior Auth Context
            $table->boolean('requires_prior_auth')->default(false);
            $table->string('prior_auth_type')->nullable(); // 'Radiology', 'Procedure', etc.
            $table->string('prior_auth_id')->nullable(); // Link to external PA system if needed
            
            // Workflow Status
            // 'draft', 'sent', 'viewed', 'accepted', 'scheduled', 'completed', 'declined', 'cancelled'
            $table->string('status', 20)->default('sent');
            $table->text('rejection_reason')->nullable();
            
            $table->timestamps();
            
            $table->index('sending_provider_id');
            $table->index('receiving_provider_id');
            $table->index('patient_id');
            $table->index('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('docconnect_referrals');
        Schema::dropIfExists('docconnect_connections');
        Schema::dropIfExists('docconnect_profiles');
    }
};
