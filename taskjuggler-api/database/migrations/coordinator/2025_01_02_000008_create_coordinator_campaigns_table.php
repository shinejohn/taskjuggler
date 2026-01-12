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
        Schema::create('coord_campaigns', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('organization_id');
            $table->uuid('coordinator_id')->nullable();
            $table->string('name');
            $table->string('type'); // confirmation_calls, follow_up_calls, sales_calls, etc.
            $table->enum('status', ['draft', 'scheduled', 'running', 'paused', 'completed', 'cancelled'])->default('draft');
            $table->text('description')->nullable();
            
            // Campaign configuration
            $table->json('target_contacts')->nullable(); // Array of contact IDs or filters
            $table->integer('target_count')->nullable();
            $table->json('script')->nullable(); // AI script/prompts for the campaign
            $table->json('filters')->nullable(); // Contact filters (tags, status, etc.)
            
            // Scheduling
            $table->timestamp('scheduled_start_at')->nullable();
            $table->timestamp('scheduled_end_at')->nullable();
            $table->json('schedule_rules')->nullable(); // Business hours, timezone, etc.
            
            // Progress tracking
            $table->integer('contacts_processed')->default(0);
            $table->integer('contacts_contacted')->default(0);
            $table->integer('contacts_answered')->default(0);
            $table->integer('appointments_booked')->default(0);
            $table->integer('appointments_confirmed')->default(0);
            $table->integer('appointments_rescheduled')->default(0);
            
            // Statistics
            $table->decimal('answer_rate', 5, 2)->nullable();
            $table->decimal('booking_rate', 5, 2)->nullable();
            $table->decimal('confirmation_rate', 5, 2)->nullable();
            
            // Execution
            $table->timestamp('started_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->timestamp('paused_at')->nullable();
            
            // Metadata
            $table->json('settings')->nullable();
            $table->json('metadata')->nullable();
            
            $table->timestamps();
            $table->softDeletes();
            
            $table->foreign('organization_id')->references('id')->on('coord_organizations')->onDelete('cascade');
            $table->foreign('coordinator_id')->references('id')->on('coord_coordinators')->onDelete('set null');
            
            $table->index(['organization_id', 'status']);
            $table->index(['coordinator_id', 'status']);
            $table->index('scheduled_start_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('coord_campaigns');
    }
};




