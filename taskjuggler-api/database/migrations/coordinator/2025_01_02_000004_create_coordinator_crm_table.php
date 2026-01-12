<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // CRM Contacts
        Schema::create('coord_contacts', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('organization_id');
            $table->string('first_name');
            $table->string('last_name')->nullable();
            $table->string('email')->nullable();
            $table->string('phone')->nullable();
            $table->string('phone_secondary')->nullable();
            $table->string('company')->nullable();
            $table->string('job_title')->nullable();
            $table->text('address')->nullable();
            $table->string('city')->nullable();
            $table->string('state')->nullable();
            $table->string('postal_code')->nullable();
            $table->string('country')->default('US');
            $table->string('source')->nullable(); // manual, import, api, web_form
            $table->string('status')->default('active'); // active, inactive, do_not_contact
            $table->json('tags')->nullable();
            $table->json('custom_fields')->nullable();
            $table->text('notes')->nullable();
            $table->decimal('lifetime_value', 12, 2)->default(0);
            $table->timestamp('last_contacted_at')->nullable();
            $table->timestamps();
            $table->softDeletes();
            
            $table->foreign('organization_id')
                ->references('id')
                ->on('coord_organizations')
                ->onDelete('cascade');
                
            $table->index(['organization_id', 'status']);
            $table->index(['organization_id', 'email']);
            $table->index(['organization_id', 'phone']);
            $table->index(['organization_id', 'last_contacted_at']);
        });

        // Contact Interaction History
        Schema::create('coord_contact_interactions', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('contact_id');
            $table->uuid('coordinator_id')->nullable();
            $table->string('channel'); // voice, sms, email
            $table->string('direction'); // inbound, outbound
            $table->string('type'); // call, message, email
            $table->string('status'); // completed, missed, failed, pending
            $table->text('summary')->nullable();
            $table->string('outcome')->nullable(); // appointment_booked, callback_requested, etc.
            $table->json('metadata')->nullable(); // Duration, recording URL, etc.
            $table->timestamp('started_at');
            $table->timestamp('ended_at')->nullable();
            $table->timestamps();
            
            $table->foreign('contact_id')
                ->references('id')
                ->on('coord_contacts')
                ->onDelete('cascade');
                
            $table->foreign('coordinator_id')
                ->references('id')
                ->on('coord_coordinators')
                ->onDelete('set null');
                
            $table->index(['contact_id', 'created_at']);
            $table->index(['coordinator_id', 'created_at']);
        });

        // Contact Follow-ups
        Schema::create('coord_contact_followups', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('contact_id');
            $table->uuid('coordinator_id')->nullable();
            $table->foreignId('assigned_to_user_id')->nullable()->constrained('users');
            $table->string('type'); // call, email, sms, task
            $table->string('priority')->default('normal'); // low, normal, high, urgent
            $table->text('description');
            $table->timestamp('due_at');
            $table->timestamp('completed_at')->nullable();
            $table->text('completion_notes')->nullable();
            $table->timestamps();
            
            $table->foreign('contact_id')
                ->references('id')
                ->on('coord_contacts')
                ->onDelete('cascade');
                
            $table->foreign('coordinator_id')
                ->references('id')
                ->on('coord_coordinators')
                ->onDelete('set null');
                
            $table->index(['due_at', 'completed_at']);
        });

        // Business Information (Organization-specific knowledge)
        Schema::create('coord_business_information', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('organization_id');
            $table->string('category'); // hours, location, services, policies, etc.
            $table->string('key'); // hours, address, phone, services_offered, etc.
            $table->text('value'); // The actual information
            $table->text('description')->nullable();
            $table->integer('priority')->default(0); // Higher priority = more important
            $table->boolean('is_active')->default(true);
            $table->integer('sort_order')->default(0);
            $table->timestamps();
            
            $table->foreign('organization_id')
                ->references('id')
                ->on('coord_organizations')
                ->onDelete('cascade');
                
            $table->index(['organization_id', 'category', 'is_active']);
            $table->unique(['organization_id', 'key']);
        });

        // Surveys (Customer feedback collection)
        Schema::create('coord_surveys', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('organization_id');
            $table->string('name');
            $table->text('description')->nullable();
            $table->json('questions'); // Survey questions structure
            $table->string('trigger_type')->nullable(); // after_appointment, after_call, manual, etc.
            $table->json('trigger_conditions')->nullable(); // When to trigger survey
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->softDeletes();
            
            $table->foreign('organization_id')
                ->references('id')
                ->on('coord_organizations')
                ->onDelete('cascade');
        });

        // Survey Responses
        Schema::create('coord_survey_responses', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('survey_id');
            $table->uuid('contact_id')->nullable();
            $table->uuid('coordinator_id')->nullable(); // Which coordinator collected it
            $table->json('responses'); // Survey answers
            $table->text('notes')->nullable();
            $table->timestamp('completed_at');
            $table->timestamps();
            
            $table->foreign('survey_id')
                ->references('id')
                ->on('coord_surveys')
                ->onDelete('cascade');
                
            $table->foreign('contact_id')
                ->references('id')
                ->on('coord_contacts')
                ->onDelete('set null');
                
            $table->foreign('coordinator_id')
                ->references('id')
                ->on('coord_coordinators')
                ->onDelete('set null');
                
            $table->index(['survey_id', 'completed_at']);
            $table->index(['contact_id', 'completed_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('coord_survey_responses');
        Schema::dropIfExists('coord_surveys');
        Schema::dropIfExists('coord_business_information');
        Schema::dropIfExists('coord_contact_followups');
        Schema::dropIfExists('coord_contact_interactions');
        Schema::dropIfExists('coord_contacts');
    }
};




