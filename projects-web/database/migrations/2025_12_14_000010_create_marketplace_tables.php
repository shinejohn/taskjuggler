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
            $table->uuid('user_id')->nullable();
            $table->uuid('organization_id');
            
            $table->string('vendor_type', 20); // 'human', 'ai_tool'
            $table->string('name');
            $table->text('description')->nullable();
            $table->string('logo_url', 500)->nullable();
            $table->jsonb('categories')->nullable();
            $table->jsonb('services')->default('[]');
            $table->string('address', 500)->nullable();
            $table->string('pricing_model', 20)->nullable();
            $table->decimal('base_rate', 10, 2)->nullable();
            $table->string('currency', 3)->default('USD');
            $table->boolean('is_active')->default(true);
            $table->boolean('is_verified')->default(false);
            $table->integer('total_jobs')->default(0);
            $table->integer('completed_jobs')->default(0);
            $table->decimal('average_rating', 3, 2)->nullable();
            $table->string('stripe_account_id')->nullable();
            $table->jsonb('ai_config')->nullable();
            
            $table->timestampsTz();

            $table->foreign('user_id')
                ->references('id')
                ->on('users')
                ->onDelete('set null');

            $table->foreign('organization_id')
                ->references('id')
                ->on('organizations')
                ->onDelete('cascade');

            $table->index(['vendor_type', 'is_active']);
            $table->index('organization_id');
        });

        Schema::create('marketplace_listings', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('requestor_id');
            $table->uuid('organization_id');
            $table->uuid('task_id')->nullable();
            $table->string('title', 500);
            $table->text('description')->nullable();
            $table->string('category', 100)->nullable();
            $table->boolean('location_required')->default(false);
            $table->jsonb('location')->nullable();
            $table->integer('location_radius_miles')->nullable();
            $table->string('budget_type', 20)->nullable();
            $table->decimal('budget_min', 10, 2)->nullable();
            $table->decimal('budget_max', 10, 2)->nullable();
            $table->string('status', 20)->default('open');
            $table->uuid('assigned_vendor_id')->nullable();
            $table->timestampTz('assigned_at')->nullable();
            $table->timestampTz('needed_by')->nullable();
            $table->timestampTz('expires_at')->nullable();
            $table->timestampsTz();

            $table->foreign('requestor_id')
                ->references('id')
                ->on('users')
                ->onDelete('cascade');

            $table->foreign('organization_id')
                ->references('id')
                ->on('organizations')
                ->onDelete('cascade');

            $table->foreign('task_id')
                ->references('id')
                ->on('tasks')
                ->onDelete('set null');

            $table->foreign('assigned_vendor_id')
                ->references('id')
                ->on('marketplace_vendors')
                ->onDelete('set null');

            $table->index(['status', 'organization_id']);
            $table->index('category');
        });

        Schema::create('marketplace_bids', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('listing_id');
            $table->uuid('vendor_id');
            $table->decimal('amount', 10, 2);
            $table->text('message')->nullable();
            $table->timestampTz('estimated_completion')->nullable();
            $table->string('status', 20)->default('pending');
            $table->timestampsTz();

            $table->foreign('listing_id')
                ->references('id')
                ->on('marketplace_listings')
                ->onDelete('cascade');

            $table->foreign('vendor_id')
                ->references('id')
                ->on('marketplace_vendors')
                ->onDelete('cascade');

            $table->index(['listing_id', 'status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('marketplace_bids');
        Schema::dropIfExists('marketplace_listings');
        Schema::dropIfExists('marketplace_vendors');
    }
};
