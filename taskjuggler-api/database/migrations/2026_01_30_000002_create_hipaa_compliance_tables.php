<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    /**
     * Run the migrations.
     * 
     * Creates HIPAA compliance tables for Care Coordination Network:
     * - patient_consents (authorization tracking)
     * - patient_notifications (real-time updates)
     * - patient_visit_items (patient-facing view)
     * - referrals (with ROI tracking)
     * - care_coordination_events (bi-directional updates)
     * - phi_access_log (immutable audit trail)
     * - consent_audit_log (consent change tracking)
     */
    public function up(): void
    {
        // =====================================================
        // PATIENT CONSENTS (HIPAA-compliant authorization)
        // =====================================================
        Schema::create('patient_consents', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('patient_id')->constrained('doctors_patients')->onDelete('cascade');
            
            // Consent type: 'network_sharing', 'referral_specific', 'sensitive_42cfr', 
            //               'sensitive_mental_health', 'sensitive_hiv', 'sensitive_reproductive', 'sensitive_genetic'
            $table->string('consent_type', 30);
            
            // Scope: 'network', 'care_team', 'specific'
            $table->string('consent_scope', 20)->default('network');
            $table->json('specific_providers')->nullable(); // If scope is 'specific'
            
            // What's consented
            $table->boolean('share_history')->default(true);
            $table->boolean('share_medications')->default(true);
            $table->boolean('share_allergies')->default(true);
            $table->boolean('share_labs')->default(true);
            $table->boolean('share_imaging')->default(true);
            $table->boolean('share_notes')->default(true);
            $table->boolean('share_insurance')->default(true);
            $table->boolean('share_immunizations')->default(true);
            
            // Bi-directional
            $table->boolean('allow_bidirectional')->default(true);
            $table->boolean('receive_updates')->default(true);
            
            // Validity
            $table->boolean('is_active')->default(true);
            $table->timestamp('effective_date')->useCurrent();
            $table->timestamp('expiration_date')->nullable();
            $table->timestamp('revoked_at')->nullable();
            $table->text('revoked_reason')->nullable();
            
            // For referral-specific consents
            $table->uuid('referral_id')->nullable();
            
            // Signature capture
            $table->string('signature_method', 20); // 'electronic', 'paper', 'verbal'
            $table->text('signature_data')->nullable();
            $table->ipAddress('signature_ip_address')->nullable();
            $table->text('signature_user_agent')->nullable();
            $table->timestamp('signature_timestamp')->useCurrent();
            
            // Witness (for paper/verbal)
            $table->string('witness_name', 200)->nullable();
            $table->text('witness_signature')->nullable();
            
            $table->timestamps();
            
            // Indexes
            $table->index('patient_id');
            $table->index(['patient_id', 'is_active']);
            $table->index(['patient_id', 'consent_type']);
        });

        // =====================================================
        // PATIENT NOTIFICATIONS / UPDATES
        // =====================================================
        Schema::create('patient_notifications', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('patient_id')->constrained('doctors_patients')->onDelete('cascade');
            
            // Source type: 'scribemd_visit', 'referral', 'lab_result', 'pa_status', 
            //              'rx_status', 'appointment', 'care_coordination', 'message'
            $table->string('source_type', 30);
            $table->uuid('source_id')->nullable();
            $table->foreignUuid('source_provider_id')->nullable()->constrained('doctors_providers')->onDelete('set null');
            
            // Notification content
            $table->string('title', 200);
            $table->text('summary');
            $table->json('details')->nullable();
            
            // Patient-friendly content
            $table->string('patient_friendly_title', 200)->nullable();
            $table->text('patient_friendly_summary')->nullable();
            
            // Actions available
            $table->json('actions')->default('[]');
            
            // Priority: 'urgent', 'high', 'normal', 'low'
            $table->string('priority', 20)->default('normal');
            // Type: 'info', 'action_required', 'result', 'update'
            $table->string('notification_type', 30)->nullable();
            
            // Status
            $table->boolean('is_read')->default(false);
            $table->timestamp('read_at')->nullable();
            $table->boolean('is_dismissed')->default(false);
            $table->timestamp('dismissed_at')->nullable();
            
            // Delivery tracking
            $table->json('delivered_via')->default('{}');
            
            $table->timestamp('created_at')->useCurrent();
            
            // Indexes
            $table->index('patient_id');
            $table->index(['patient_id', 'is_read']);
        });

        // =====================================================
        // PATIENT VISIT VIEW (What patient sees from ScribeMD)
        // =====================================================
        Schema::create('patient_visit_items', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('patient_id')->constrained('doctors_patients')->onDelete('cascade');
            $table->foreignUuid('visit_id')->constrained('scribemd_visits')->onDelete('cascade');
            
            // Item type: 'medication', 'test', 'referral', 'follow_up', 'instruction', 'diagnosis_explained'
            $table->string('item_type', 30);
            
            // Patient-friendly content
            $table->string('title', 200);
            $table->text('description')->nullable();
            $table->text('why_explanation')->nullable(); // "Why am I taking this?"
            
            // Status: 'pending', 'processing', 'sent', 'ready', 'approved', 'denied', 'completed'
            $table->string('status', 30);
            $table->text('status_message')->nullable();
            
            // Links to actual records
            $table->string('linked_record_type', 50)->nullable();
            $table->uuid('linked_record_id')->nullable();
            
            // Actions
            $table->json('available_actions')->default('[]');
            
            // Display
            $table->integer('display_order')->default(0);
            $table->boolean('is_visible')->default(true);
            
            $table->timestamps();
            
            // Indexes
            $table->index(['patient_id', 'visit_id']);
        });

        // =====================================================
        // REFERRALS WITH ROI
        // =====================================================
        Schema::create('doctors_referrals', function (Blueprint $table) {
            $table->uuid('id')->primary();
            
            // Parties
            $table->foreignUuid('referring_provider_id')->constrained('doctors_providers')->onDelete('cascade');
            $table->foreignUuid('referring_org_id')->constrained('organizations')->onDelete('cascade');
            $table->foreignUuid('receiving_provider_id')->nullable()->constrained('doctors_providers')->onDelete('set null');
            $table->foreignUuid('receiving_org_id')->nullable()->constrained('organizations')->onDelete('set null');
            $table->foreignUuid('patient_id')->constrained('doctors_patients')->onDelete('cascade');
            
            // Referral details
            $table->string('specialty', 100);
            $table->text('reason');
            $table->text('clinical_question')->nullable();
            $table->string('urgency', 20)->default('routine');
            
            // Status: 'pending_consent', 'sent', 'received', 'scheduled', 'in_progress', 'completed', 'cancelled'
            $table->string('status', 30)->default('pending_consent');
            
            // Consent linkage
            $table->foreignUuid('consent_id')->nullable()->constrained('patient_consents')->onDelete('set null');
            $table->timestamp('consent_obtained_at')->nullable();
            
            // What was shared (audit trail)
            $table->json('shared_record_types')->nullable();
            $table->json('shared_record_ids')->nullable();
            $table->string('shared_data_hash', 64)->nullable(); // SHA-256
            
            // Sensitive data handling
            $table->boolean('includes_sensitive_data')->default(false);
            $table->json('sensitive_data_types')->nullable();
            $table->json('sensitive_consent_ids')->nullable();
            
            // Bi-directional authorization
            $table->boolean('bidirectional_authorized')->default(true);
            $table->uuid('bidirectional_consent_id')->nullable();
            
            // Timestamps
            $table->timestamp('sent_at')->nullable();
            $table->timestamp('received_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();
            
            // Indexes
            $table->index(['patient_id', 'status']);
            $table->index(['referring_provider_id', 'created_at']);
        });

        // Add referral_id foreign key to patient_consents
        Schema::table('patient_consents', function (Blueprint $table) {
            $table->foreign('referral_id')->references('id')->on('doctors_referrals')->onDelete('set null');
        });

        // =====================================================
        // CARE COORDINATION EVENTS
        // =====================================================
        Schema::create('care_coordination_events', function (Blueprint $table) {
            $table->uuid('id')->primary();
            
            // Context
            $table->foreignUuid('patient_id')->constrained('doctors_patients')->onDelete('cascade');
            $table->foreignUuid('referral_id')->nullable()->constrained('doctors_referrals')->onDelete('set null');
            
            // Source
            $table->foreignUuid('source_provider_id')->constrained('doctors_providers')->onDelete('cascade');
            $table->foreignUuid('source_org_id')->constrained('organizations')->onDelete('cascade');
            $table->foreignUuid('source_visit_id')->nullable()->constrained('scribemd_visits')->onDelete('set null');
            
            // Event details
            $table->string('event_type', 50);
            $table->json('event_data');
            
            // What's being shared
            $table->text('shared_data_summary')->nullable();
            $table->json('shared_record_types')->nullable();
            $table->json('shared_record_ids')->nullable();
            
            // Consent verification (CRITICAL FOR HIPAA)
            $table->boolean('consent_verified')->default(false);
            $table->foreignUuid('consent_id')->nullable()->constrained('patient_consents')->onDelete('set null');
            $table->timestamp('consent_verification_timestamp')->nullable();
            
            // Recipients
            $table->json('recipient_providers');
            $table->boolean('notify_patient')->default(true);
            
            // Delivery tracking
            $table->json('delivered_to_providers')->default('{}');
            $table->timestamp('delivered_to_patient_at')->nullable();
            $table->timestamp('patient_viewed_at')->nullable();
            
            $table->timestamp('created_at')->useCurrent();
            
            // Indexes
            $table->index('patient_id');
            $table->index('consent_id');
        });

        // =====================================================
        // PHI ACCESS LOG (HIPAA Audit Requirement) - IMMUTABLE
        // =====================================================
        Schema::create('phi_access_log', function (Blueprint $table) {
            $table->uuid('id')->primary();
            
            // Who accessed
            $table->foreignUuid('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignUuid('provider_id')->nullable()->constrained('doctors_providers')->onDelete('set null');
            $table->foreignUuid('organization_id')->nullable()->constrained('organizations')->onDelete('set null');
            
            // Session info
            $table->string('session_id', 100)->nullable();
            $table->ipAddress('ip_address')->nullable();
            $table->text('user_agent')->nullable();
            
            // What was accessed
            $table->foreignUuid('patient_id')->constrained('doctors_patients')->onDelete('cascade');
            $table->string('record_type', 50); // 'note', 'lab', 'medication', 'referral', etc.
            $table->uuid('record_id')->nullable();
            
            // Access details: 'view', 'create', 'update', 'delete', 'export', 'share'
            $table->string('access_type', 20);
            // Purpose: 'treatment', 'payment', 'operations', 'referral', 'patient_request'
            $table->string('access_purpose', 50)->nullable();
            
            // Consent reference
            $table->uuid('consent_id')->nullable();
            
            // Data accessed (for granular audit)
            $table->json('fields_accessed')->nullable();
            
            // Emergency access (break the glass)
            $table->boolean('is_emergency_access')->default(false);
            $table->text('emergency_reason')->nullable();
            
            // Timestamp (immutable)
            $table->timestamp('accessed_at')->useCurrent();
            
            // Indexes
            $table->index('patient_id');
            $table->index('user_id');
            $table->index('accessed_at');
        });

        // =====================================================
        // CONSENT AUDIT TRAIL
        // =====================================================
        Schema::create('consent_audit_log', function (Blueprint $table) {
            $table->uuid('id')->primary();
            
            $table->foreignUuid('consent_id')->constrained('patient_consents')->onDelete('cascade');
            $table->foreignUuid('patient_id')->constrained('doctors_patients')->onDelete('cascade');
            
            $table->string('action', 30); // 'created', 'activated', 'modified', 'revoked', 'expired'
            $table->foreignUuid('action_by')->nullable()->constrained('users')->onDelete('set null');
            
            $table->json('previous_state')->nullable();
            $table->json('new_state')->nullable();
            
            $table->text('reason')->nullable();
            
            $table->ipAddress('ip_address')->nullable();
            $table->text('user_agent')->nullable();
            
            $table->timestamp('created_at')->useCurrent();
            
            // Index
            $table->index(['consent_id', 'created_at']);
        });

        // Create trigger to prevent modifications to PHI access log (PostgreSQL)
        // For MySQL, this would need to be handled at the application level
        if (DB::connection()->getDriverName() === 'pgsql') {
            DB::unprepared('
                CREATE OR REPLACE FUNCTION prevent_phi_log_modification()
                RETURNS TRIGGER AS $$
                BEGIN
                    RAISE EXCEPTION \'PHI access log records cannot be modified or deleted\';
                END;
                $$ LANGUAGE plpgsql;
                
                CREATE TRIGGER phi_log_immutable
                    BEFORE UPDATE OR DELETE ON phi_access_log
                    FOR EACH ROW EXECUTE FUNCTION prevent_phi_log_modification();
            ');
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Drop trigger first (PostgreSQL)
        if (DB::connection()->getDriverName() === 'pgsql') {
            DB::unprepared('DROP TRIGGER IF EXISTS phi_log_immutable ON phi_access_log');
            DB::unprepared('DROP FUNCTION IF EXISTS prevent_phi_log_modification');
        }

        Schema::dropIfExists('consent_audit_log');
        Schema::dropIfExists('phi_access_log');
        Schema::dropIfExists('care_coordination_events');
        
        // Remove foreign key before dropping referrals
        Schema::table('patient_consents', function (Blueprint $table) {
            $table->dropForeign(['referral_id']);
        });
        
        Schema::dropIfExists('doctors_referrals');
        Schema::dropIfExists('patient_visit_items');
        Schema::dropIfExists('patient_notifications');
        Schema::dropIfExists('patient_consents');
    }
};
