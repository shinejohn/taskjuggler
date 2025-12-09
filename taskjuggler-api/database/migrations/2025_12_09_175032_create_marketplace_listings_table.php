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
        Schema::create('marketplace_listings', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('task_id')->nullable();
            // Foreign key to tasks will be added after tasks table exists
            $table->uuid('requestor_id');
            $table->foreign('requestor_id')->references('id')->on('users');
            
            // Listing details
            $table->string('title', 500);
            $table->text('description')->nullable();
            $table->string('category', 100)->nullable();
            
            // Requirements
            $table->boolean('location_required')->default(false);
            // location GEOGRAPHY(POINT, 4326) - will use point type in PostgreSQL
            // For broader compatibility, using JSONB for location coordinates
            $table->jsonb('location')->nullable(); // e.g., {'lat': 123.45, 'lng': 67.89}
            $table->integer('location_radius_miles')->nullable();
            
            // Budget
            $table->string('budget_type', 20)->nullable(); // 'fixed', 'hourly', 'quote'
            $table->decimal('budget_min', 10, 2)->nullable();
            $table->decimal('budget_max', 10, 2)->nullable();
            
            // Status
            $table->string('status', 20)->default('open'); // 'open', 'assigned', 'completed', 'cancelled'
            
            // Assignment
            $table->uuid('assigned_vendor_id')->nullable();
            // Foreign key will be added in a separate migration after marketplace_vendors is created
            $table->timestampTz('assigned_at')->nullable();
            
            // Timing
            $table->timestampTz('needed_by')->nullable();
            $table->timestampTz('expires_at')->nullable();
            
            $table->timestampsTz();
        });
        
        // Add indexes
        Schema::table('marketplace_listings', function (Blueprint $table) {
            $table->index('status', 'idx_listings_status');
            $table->index('category', 'idx_listings_category');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('marketplace_listings');
    }
};
