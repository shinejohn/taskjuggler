<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        // Identity Verifications (Stripe Identity)
        Schema::create('on_identity_verifications', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('user_id')->index();
            $table->string('stripe_verification_session_id')->nullable()->unique();
            $table->string('stripe_status')->nullable();
            $table->string('status')->default('pending'); // pending, verified, failed
            $table->timestamp('verified_at')->nullable();
            $table->timestamp('expires_at')->nullable();
            
            // Encrypted PII from Stripe
            $table->text('id_first_name_encrypted')->nullable();
            $table->text('id_last_name_encrypted')->nullable();
            $table->text('id_dob_encrypted')->nullable();
            $table->string('id_document_type')->nullable();
            $table->string('id_document_country')->nullable();
            
            // Face reference for matching
            $table->string('face_reference_image_s3_key')->nullable();
            
            $table->timestamps();
        });

        // Signing Sessions
        Schema::create('on_signing_sessions', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('document_id')->index();
            $table->uuid('created_by')->nullable();
            $table->string('status')->default('pending'); // pending, in_progress, completed, expired
            $table->boolean('verification_required')->default(false);
            $table->timestamp('deadline')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();

            $table->foreign('document_id')->references('id')->on('on_documents')->onDelete('cascade');
        });

        // Signatures (individual party signatures)
        Schema::create('on_signatures', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('session_id')->index();
            $table->uuid('user_id')->index();
            $table->string('party_name');
            $table->string('party_email');
            $table->string('verification_status')->default('pending'); // pending, verified, skipped
            $table->boolean('face_match_passed')->nullable();
            $table->float('face_match_confidence')->nullable();
            $table->string('signature_image_s3_key')->nullable();
            $table->string('signature_method')->nullable(); // draw, type, upload
            $table->string('document_hash')->nullable();
            $table->json('geolocation')->nullable();
            $table->string('ip_address')->nullable();
            $table->string('user_agent')->nullable();
            $table->timestamp('signed_at')->nullable();
            $table->timestamps();

            $table->foreign('session_id')->references('id')->on('on_signing_sessions')->onDelete('cascade');
        });

        // Signature Audit Logs
        Schema::create('on_signature_audit_logs', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('signature_id')->index();
            $table->string('action'); // created, verification_requested, face_match_passed, signed, etc.
            $table->json('metadata')->nullable();
            $table->string('ip_address')->nullable();
            $table->string('user_agent')->nullable();
            $table->timestamps();

            $table->foreign('signature_id')->references('id')->on('on_signatures')->onDelete('cascade');
        });

        // Add last_reminder_sent_at to critical dates
        Schema::table('on_critical_dates', function (Blueprint $table) {
            $table->timestamp('last_reminder_sent_at')->nullable()->after('is_resolved');
        });
    }

    public function down()
    {
        Schema::table('on_critical_dates', function (Blueprint $table) {
            $table->dropColumn('last_reminder_sent_at');
        });
        Schema::dropIfExists('on_signature_audit_logs');
        Schema::dropIfExists('on_signatures');
        Schema::dropIfExists('on_signing_sessions');
        Schema::dropIfExists('on_identity_verifications');
    }
};
