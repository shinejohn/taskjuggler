<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     * 
     * Creates core ScribeMD Live Dashboard tables:
     * - scribemd_visits (visit sessions)
     * - scribemd_dashboard_items (unified items table)
     * - scribemd_claims (claim assembly)
     * - scribemd_notes (auto-generated notes)
     */
    public function up(): void
    {
        // =====================================================
        // VISIT DASHBOARD SESSION
        // =====================================================
        Schema::create('scribemd_visits', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('organization_id')->constrained('organizations')->onDelete('cascade');
            $table->foreignUuid('provider_id')->constrained('doctors_providers')->onDelete('cascade');
            $table->foreignUuid('patient_id')->constrained('doctors_patients')->onDelete('cascade');
            $table->foreignUuid('appointment_id')->nullable()->constrained('doctors_appointments')->onDelete('set null');
            $table->foreignUuid('encounter_id')->nullable()->constrained('doctors_clinical_encounters')->onDelete('set null');
            
            // Status: 'in_progress', 'review', 'approved', 'sent'
            $table->string('status', 20)->default('in_progress');
            
            // Recording
            $table->timestamp('recording_started_at')->nullable();
            $table->timestamp('recording_ended_at')->nullable();
            $table->integer('duration_seconds')->nullable();
            
            // Transcript
            $table->longText('full_transcript')->nullable();
            
            // Approval
            $table->timestamp('approved_at')->nullable();
            $table->foreignUuid('approved_by')->nullable()->constrained('users')->onDelete('set null');
            
            // Routing results (JSON)
            $table->json('routing_results')->nullable();
            
            $table->timestamps();
            $table->softDeletes();
            
            // Indexes
            $table->index(['organization_id', 'status']);
            $table->index(['provider_id', 'created_at']);
            $table->index(['patient_id', 'created_at']);
        });

        // =====================================================
        // DASHBOARD ITEMS (All categories in one table)
        // =====================================================
        Schema::create('scribemd_dashboard_items', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('visit_id')->constrained('scribemd_visits')->onDelete('cascade');
            
            // Category: 'symptom', 'finding', 'assessment', 'plan', 'prescription', 
            //           'order', 'prior_auth', 'diagnosis_code', 'procedure_code', 
            //           'follow_up', 'instruction'
            $table->string('category', 30);
            
            // Content (flexible JSON based on category)
            $table->json('item_data');
            
            // Source: 'ai' or 'manual'
            $table->string('source', 20)->default('ai');
            $table->text('source_text')->nullable(); // Transcript text that triggered this
            $table->decimal('ai_confidence', 3, 2)->nullable();
            
            // Status
            $table->boolean('is_accepted')->default(true); // Doctor can uncheck
            $table->boolean('is_modified')->default(false);
            
            // Execution (for actionable items): 'pending', 'sent', 'queued', 'completed', 'failed'
            $table->string('execution_status', 20)->nullable();
            $table->timestamp('executed_at')->nullable();
            $table->json('execution_result')->nullable();
            $table->string('routed_to', 50)->nullable(); // 'pharmacy', 'lab', 'pa_queue', 'billing'
            
            // Linking to actual records
            $table->string('linked_record_type', 50)->nullable();
            $table->uuid('linked_record_id')->nullable();
            
            // Display ordering
            $table->integer('display_order')->default(0);
            
            $table->timestamps();
            
            // Indexes
            $table->index('visit_id');
            $table->index('category');
            $table->index(['visit_id', 'category']);
        });

        // =====================================================
        // CLAIM (Assembled from diagnosis_code + procedure_code items)
        // =====================================================
        Schema::create('scribemd_claims', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('visit_id')->constrained('scribemd_visits')->onDelete('cascade');
            
            // Claim data (arrays of codes)
            $table->json('diagnoses')->default('[]');
            $table->json('procedures')->default('[]');
            
            // Calculated fields
            $table->string('primary_diagnosis', 10)->nullable();
            $table->tinyInteger('em_level')->nullable(); // E/M level 1-5
            $table->string('em_method', 20)->nullable(); // 'mdm' or 'time'
            $table->decimal('total_units', 5, 2)->nullable();
            $table->decimal('estimated_reimbursement', 10, 2)->nullable();
            
            // Validation
            $table->decimal('denial_risk_score', 3, 2)->nullable();
            $table->json('validation_flags')->default('[]');
            $table->boolean('documentation_complete')->default(false);
            
            // Submission
            $table->timestamp('submitted_at')->nullable();
            $table->string('submitted_to', 100)->nullable(); // Clearinghouse name
            $table->json('submission_result')->nullable();
            
            $table->timestamps();
            
            // Unique constraint
            $table->unique('visit_id');
        });

        // =====================================================
        // CLINICAL NOTE (Auto-generated from symptoms/findings/assessment/plan)
        // =====================================================
        Schema::create('scribemd_notes', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('visit_id')->constrained('scribemd_visits')->onDelete('cascade');
            
            // Note content
            $table->string('note_type', 30)->default('soap');
            $table->text('subjective')->nullable();
            $table->text('objective')->nullable();
            $table->text('assessment')->nullable();
            $table->text('plan_text')->nullable();
            $table->longText('full_note')->nullable();
            
            // Signature
            $table->boolean('is_signed')->default(false);
            $table->timestamp('signed_at')->nullable();
            $table->foreignUuid('signed_by')->nullable()->constrained('doctors_providers')->onDelete('set null');
            
            $table->timestamps();
            
            // Unique constraint
            $table->unique('visit_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('scribemd_notes');
        Schema::dropIfExists('scribemd_claims');
        Schema::dropIfExists('scribemd_dashboard_items');
        Schema::dropIfExists('scribemd_visits');
    }
};
