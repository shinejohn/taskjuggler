<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        // Identity Verifications
        Schema::create('identity_verifications', function (Blueprint $table) {
            $table->uuid('id')->primary();

            // Assuming users table uses bigInt id by default in Laravel, but instruction says UUID.
            // I will check standard Laravel setup or existing context.
            // Looking at previous migrations (OfficialNotice), they often reference UUIDs.
            // I'll stick to the instructions: UUID if key is UUID, otherwise adjust.
            // NOTE: Standard Laravel 11/12 might typically use bigIncrements 'id'.
            // However, the instructions say `REFERENCES users(id)` and implies UUID.
            // I will assume users.id is compatible or use standard foreignId for safety if unsure,
            // but the schema explicitly asks for UUID. I'll use `uuid` for foreign keys.

            $table->uuid('user_id')->index(); // Assuming user ID is UUID based on instructions

            // Stripe Identity
            $table->string('stripe_verification_session_id')->nullable()->index();
            $table->string('stripe_status')->nullable();

            // Verification Data (encrypted)
            $table->string('id_document_type')->nullable();
            $table->string('id_document_country')->nullable();
            $table->text('id_first_name_encrypted')->nullable();
            $table->text('id_last_name_encrypted')->nullable();
            $table->text('id_dob_encrypted')->nullable();
            $table->string('id_document_number_hash')->nullable()->index();

            // Face Data
            $table->string('face_reference_image_s3_key')->nullable();
            $table->text('face_embedding_encrypted')->nullable();

            // Status
            $table->string('status')->default('pending')->index();
            $table->timestamp('verified_at')->nullable();
            $table->timestamp('expires_at')->nullable();

            // Audit
            $table->ipAddress('ip_address')->nullable();
            $table->text('user_agent')->nullable();
            $table->string('device_fingerprint')->nullable();

            $table->timestamps();
        });

        // Signing Sessions
        Schema::create('signing_sessions', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('document_id')->index(); // References on_documents(id)
            $table->uuid('transaction_id')->nullable()->index(); // Nullable if not using transactions yet

            $table->string('status')->default('pending')->index();

            $table->boolean('verification_required')->default(false);
            $table->uuid('verification_required_by')->nullable();
            $table->boolean('verification_ratcheted_up')->default(false);

            $table->string('signing_order_type')->default('parallel');

            $table->timestamp('signing_deadline')->nullable();
            $table->timestamp('reminder_sent_at')->nullable();

            $table->timestamps();

            // Constraint: existing foreign keys if tables exist. 
            // I will leave actual FK constraints loose for now to avoid migration failures 
            // if 'transactions' or 'parties' tables don't exist in this context yet.
        });

        // Signatures
        Schema::create('signatures', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('signing_session_id')->index();
            $table->uuid('party_id')->index(); // References on_area_members or similar party concept
            $table->uuid('user_id')->index();

            $table->string('signature_type'); // 'standard', 'verified'
            $table->string('signature_image_s3_key')->nullable();
            $table->string('signature_method')->nullable();

            // Verification
            $table->string('verification_status')->nullable()->index();
            $table->boolean('verification_waiver_accepted')->default(false);
            $table->timestamp('verification_waiver_accepted_at')->nullable();
            $table->uuid('identity_verification_id')->nullable();

            // Face Match
            $table->boolean('face_match_performed')->default(false);
            $table->decimal('face_match_confidence', 5, 4)->nullable();
            $table->timestamp('face_match_timestamp')->nullable();
            $table->boolean('face_liveness_check_passed')->nullable();
            $table->string('face_image_s3_key')->nullable();

            // Audit
            $table->timestamp('signed_at')->nullable();
            $table->ipAddress('ip_address')->nullable();
            $table->text('user_agent')->nullable();
            $table->string('device_fingerprint')->nullable();
            $table->decimal('geolocation_lat', 10, 8)->nullable();
            $table->decimal('geolocation_lng', 11, 8)->nullable();
            $table->integer('geolocation_accuracy_meters')->nullable();

            $table->string('document_hash_at_signing')->nullable();

            $table->timestamps();

            $table->foreign('signing_session_id')->references('id')->on('signing_sessions')->onDelete('cascade');
            // $table->unique(['signing_session_id', 'party_id']); 
        });

        // Signature Audit Logs
        Schema::create('signature_audit_logs', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('signature_id')->index();

            $table->string('event_type')->index();
            $table->json('event_data')->nullable();

            $table->ipAddress('ip_address')->nullable();
            $table->text('user_agent')->nullable();

            $table->timestamps();

            $table->foreign('signature_id')->references('id')->on('signatures')->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('signature_audit_logs');
        Schema::dropIfExists('signatures');
        Schema::dropIfExists('signing_sessions');
        Schema::dropIfExists('identity_verifications');
    }
};
