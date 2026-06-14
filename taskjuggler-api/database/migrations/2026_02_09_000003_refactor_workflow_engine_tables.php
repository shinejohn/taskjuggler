<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Drop old tables if they exist
        Schema::dropIfExists('workflow_logs'); // Old name
        Schema::dropIfExists('workflow_executions');
        Schema::dropIfExists('workflow_edges');
        Schema::dropIfExists('workflow_nodes');
        Schema::dropIfExists('workflows');
        
        // Also drop potential new names if re-running
        Schema::dropIfExists('workflow_step_logs');
        Schema::dropIfExists('workflow_data_maps');
        Schema::dropIfExists('workflow_action_registry');
        Schema::dropIfExists('workflow_event_registry');
        Schema::dropIfExists('workflow_definitions');

        // 2. Create Workflow Definitions
        Schema::create('workflow_definitions', function (Blueprint $table) {
            $table->id();
            $table->ulid('ulid')->unique();
            $table->foreignId('organization_id')->nullable(); // Nullable for system workflows or dev

            $table->string('name');
            $table->text('description')->nullable();
            $table->string('slug')->nullable(); // Made nullable to avoid strict unique constraints during dev

            // Who/what created this workflow
            $table->string('creator_type')->default('human'); // 'human', 'ai', 'api', 'system'
            $table->foreignId('created_by_id')->nullable(); // Assumes users table exists
            $table->string('api_client_id')->nullable();

            // Trigger
            $table->string('trigger_event');
            $table->json('trigger_conditions')->nullable(); // Schema: array of condition objects

            // Steps (Linear JSON array)
            $table->json('steps')->nullable(); 

            // Metadata
            $table->string('vertical')->nullable();
            $table->string('category')->nullable();
            $table->json('tags')->nullable();

            // Control
            $table->boolean('is_active')->default(true);
            $table->boolean('is_template')->default(false);
            $table->boolean('is_system')->default(false);
            $table->integer('priority')->default(50);
            $table->integer('max_concurrent')->default(10);

            // Stats
            $table->integer('execution_count')->default(0);
            $table->integer('failure_count')->default(0);
            $table->timestamp('last_executed_at')->nullable();

            // Versioning
            $table->integer('version')->default(1);
            $table->foreignId('parent_definition_id')->nullable();

            $table->timestamps();
            $table->softDeletes();
            
            // Indexes
            $table->index(['organization_id', 'trigger_event', 'is_active'], 'wf_def_org_trigger_index');
        });

        // 3. Create Workflow Executions
        Schema::create('workflow_executions', function (Blueprint $table) {
            $table->id();
            $table->ulid('ulid')->unique();
            $table->foreignId('organization_id')->nullable();
            $table->foreignId('definition_id')->constrained('workflow_definitions')->cascadeOnDelete();

            $table->string('trigger_event');
            $table->json('trigger_payload')->nullable();
            $table->string('correlation_id')->nullable();
            $table->foreignId('triggered_by_id')->nullable();

            // State
            $table->string('status')->default('pending'); // pending, running, paused, completed, failed, cancelled
            $table->integer('current_step')->default(0);
            $table->integer('total_steps')->default(0);
            
            // Context Accumulator
            $table->json('context')->nullable();

            // Timing
            $table->timestamp('started_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->integer('duration_ms')->nullable();

            // Error info
            $table->text('error_message')->nullable();
            $table->json('error_details')->nullable();
            $table->integer('retry_count')->default(0);
            $table->integer('max_retries')->default(3);
            $table->timestamp('next_retry_at')->nullable();

            $table->timestamps();

            $table->index(['organization_id', 'status']);
            $table->index('correlation_id');
        });

        // 4. Create Workflow Step Logs
        Schema::create('workflow_step_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('execution_id')->constrained('workflow_executions')->cascadeOnDelete();

            $table->integer('step_number');
            $table->string('step_name')->nullable();
            $table->string('action'); // e.g., 'invoicing.create_invoice'

            $table->json('input')->nullable();
            $table->json('output')->nullable();

            $table->string('status')->default('pending'); // pending, running, completed, failed, skipped

            $table->timestamp('started_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->integer('duration_ms')->nullable();

            $table->text('error_message')->nullable();
            $table->json('error_details')->nullable();
            $table->integer('retry_count')->default(0);

            $table->timestamps();
            
            $table->index(['execution_id', 'step_number']);
        });

        // 5. Create Event Registry
        Schema::create('workflow_event_registry', function (Blueprint $table) {
            $table->id();
            $table->string('module');
            $table->string('event_key')->unique();
            $table->text('description')->nullable();
            $table->json('payload_schema')->nullable();
            $table->string('category')->nullable();
            $table->timestamps();
            
            $table->index('module');
        });

        // 6. Create Action Registry
        Schema::create('workflow_action_registry', function (Blueprint $table) {
            $table->id();
            $table->string('module');
            $table->string('action_key')->unique();
            $table->text('description')->nullable();
            $table->json('input_schema')->nullable();
            $table->json('output_schema')->nullable();
            $table->string('category')->nullable();
            $table->boolean('is_async')->default(false);
            $table->timestamps();

            $table->index('module');
        });

        // 7. Create Data Maps (optional but part of spec)
        Schema::create('workflow_data_maps', function (Blueprint $table) {
            $table->id();
            $table->foreignId('organization_id')->nullable();
            $table->string('name');
            $table->string('source_event')->nullable();
            $table->string('target_action')->nullable();
            $table->json('mappings');
            $table->boolean('is_system')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('workflow_data_maps');
        Schema::dropIfExists('workflow_action_registry');
        Schema::dropIfExists('workflow_event_registry');
        Schema::dropIfExists('workflow_step_logs');
        Schema::dropIfExists('workflow_executions');
        Schema::dropIfExists('workflow_definitions');
    }
};
