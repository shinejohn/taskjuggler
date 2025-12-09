<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('tasks', function (Blueprint $table) {
            $table->uuid('id')->primary();
            
            // Core
            $table->string('title', 500);
            $table->text('description')->nullable();
            $table->string('status', 20)->default('pending');
            $table->string('priority', 20)->default('normal');
            
            // Ownership
            $table->uuid('requestor_id');
            $table->foreign('requestor_id')->references('id')->on('users')->onDelete('cascade');
            $table->uuid('owner_id')->nullable();
            $table->foreign('owner_id')->references('id')->on('users');
            $table->uuid('team_member_id')->nullable();
            $table->foreign('team_member_id')->references('id')->on('team_members');
            $table->uuid('marketplace_vendor_id')->nullable();
            // Foreign key will be added in a separate migration after marketplace_vendors is created
            
            // Source tracking
            $table->string('source_type', 20)->nullable(); // 'phone', 'email', 'sms', 'web', 'api'
            $table->uuid('source_channel_id')->nullable();
            $table->foreign('source_channel_id')->references('id')->on('assistant_channels');
            $table->jsonb('extracted_data')->nullable(); // Full AI extraction
            $table->uuid('routing_rule_id')->nullable();
            $table->foreign('routing_rule_id')->references('id')->on('routing_rules');
            
            // Contact (the person who made the request)
            $table->string('contact_name')->nullable();
            $table->string('contact_phone', 20)->nullable();
            $table->string('contact_email')->nullable();
            
            // Location
            $table->string('location_address', 500)->nullable();
            $table->string('location_unit', 50)->nullable();
            $table->string('location_city', 100)->nullable();
            $table->string('location_state', 50)->nullable();
            $table->string('location_zip', 20)->nullable();
            // location_coords GEOGRAPHY(POINT, 4326) - will use point type in PostgreSQL
            // For broader compatibility, using JSONB for coordinates
            $table->jsonb('location_coords')->nullable(); // e.g., {'lat': 123.45, 'lng': 67.89}
            
            // Dates
            $table->timestampTz('due_date')->nullable();
            $table->timestampTz('start_date')->nullable();
            $table->timestampTz('completed_at')->nullable();
            
            // Marketplace specific - will add foreign key after marketplace_listings is created
            $table->uuid('marketplace_listing_id')->nullable();
            
            // Deliverables
            $table->jsonb('deliverables')->default('[]');
            
            // Metadata
            $table->jsonb('tags')->nullable(); // Using JSONB instead of TEXT[] for Laravel compatibility
            $table->jsonb('metadata')->default('{}');
            
            $table->timestampsTz();
        });
        
        // Add indexes
        Schema::table('tasks', function (Blueprint $table) {
            $table->index('requestor_id', 'idx_tasks_requestor');
            $table->index('owner_id', 'idx_tasks_owner');
            $table->index('status', 'idx_tasks_status');
            $table->index('created_at', 'idx_tasks_created');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tasks');
    }
};
