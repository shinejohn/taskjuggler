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
        Schema::create('marketplace_vendors', function (Blueprint $table) {
            $table->uuid('id')->primary();
            
            // Type
            $table->string('vendor_type', 20); // 'human', 'ai', 'hybrid'
            
            // Human vendors
            $table->uuid('user_id')->nullable();
            $table->foreign('user_id')->references('id')->on('users');
            $table->string('business_name')->nullable();
            
            // AI vendors
            $table->string('ai_provider', 50)->nullable(); // 'internal', 'botjob', 'alphasite', 'external'
            $table->jsonb('ai_config')->nullable();
            
            // Profile
            $table->string('name');
            $table->text('description')->nullable();
            $table->string('logo_url', 500)->nullable();
            
            // Services
            $table->jsonb('categories')->nullable(); // Using JSONB instead of TEXT[] for Laravel compatibility
            $table->jsonb('services')->default('[]');
            
            // Location (for human vendors)
            // service_area GEOGRAPHY(POLYGON, 4326) - will use geography type in PostgreSQL
            $table->string('address', 500)->nullable();
            
            // Pricing
            $table->string('pricing_model', 20)->nullable(); // 'fixed', 'hourly', 'quote', 'per_task'
            $table->decimal('base_rate', 10, 2)->nullable();
            $table->string('currency', 3)->default('USD');
            
            // Status
            $table->boolean('is_active')->default(true);
            $table->boolean('is_verified')->default(false);
            
            // Stats
            $table->integer('total_jobs')->default(0);
            $table->integer('completed_jobs')->default(0);
            $table->decimal('average_rating', 3, 2)->nullable();
            
            // Stripe
            $table->string('stripe_account_id')->nullable();
            
            $table->timestampsTz();
        });
        
        // Add indexes
        Schema::table('marketplace_vendors', function (Blueprint $table) {
            $table->index(['vendor_type', 'is_active'], 'idx_vendors_type');
            // GIN index for categories will be added via raw SQL if needed
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('marketplace_vendors');
    }
};
