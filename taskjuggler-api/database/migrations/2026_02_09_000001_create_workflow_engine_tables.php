<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     * 
     * Creates tables for the Universal Workflow Engine:
     * - workflows: Definitions
     * - workflow_nodes: Steps
     * - workflow_edges: Relationships
     * - workflow_executions: Run instances
     * - workflow_logs: Audit trail
     */
    public function up(): void
    {
        // 1. Workflows (Definitions)
        Schema::create('workflows', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name');
            $table->string('slug')->unique(); // e.g. 'prescription-routing'
            $table->string('trigger_event')->nullable(); // e.g. 'scribemd.prescription.created'
            $table->boolean('is_active')->default(true);
            $table->integer('version')->default(1);
            $table->json('input_schema')->nullable(); // Expected JSON schema for trigger payload
            $table->timestamps();
            $table->softDeletes();
        });

        // 2. Nodes (The Action Steps)
        Schema::create('workflow_nodes', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('workflow_id')->constrained('workflows')->onDelete('cascade');
            
            $table->string('key'); // Unique slug within workflow (e.g., 'check_db')
            $table->string('type'); // 'api', 'database', 'ai', 'manual'
            $table->string('label')->nullable();
            
            $table->json('config')->default('{}'); // Settings specific to type
            $table->json('retry_policy')->nullable(); // { max_attempts: 3, backoff: 60 }
            
            // For simple linear flows (optional, edges are preferred for graph)
            $table->foreignUuid('next_node_id')->nullable()->constrained('workflow_nodes')->onDelete('set null');
            
            $table->timestamps();
            
            $table->unique(['workflow_id', 'key']);
        });

        // 3. Edges (Branching Logic)
        Schema::create('workflow_edges', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('workflow_id')->constrained('workflows')->onDelete('cascade');
            
            $table->foreignUuid('source_node_id')->constrained('workflow_nodes')->onDelete('cascade');
            $table->foreignUuid('target_node_id')->constrained('workflow_nodes')->onDelete('cascade');
            
            $table->text('condition_expression')->nullable(); // Logic to traverse this edge
            $table->string('label')->nullable(); // e.g., 'If Approved'
            
            $table->timestamps();
        });

        // 4. Executions (Runtime Instances)
        Schema::create('workflow_executions', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('workflow_id')->constrained('workflows')->onDelete('cascade');
            
            $table->string('trigger_source')->nullable(); // 'webhook', 'user', 'system'
            $table->string('trigger_id')->nullable(); // ID of user/webhook
            $table->string('correlation_id')->index(); // Trace across systems
            
            $table->string('status', 20)->default('pending'); // pending, running, completed, failed, paused
            $table->foreignUuid('current_node_id')->nullable()->constrained('workflow_nodes')->onDelete('set null');
            
            $table->json('context_data')->default('{}'); // Accumulated data
            $table->json('trigger_payload')->nullable(); // Initial input
            
            $table->timestamp('started_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->text('error_message')->nullable();
            
            $table->timestamps();
        });

        // 5. Logs (Step-by-step Audit)
        Schema::create('workflow_logs', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('execution_id')->constrained('workflow_executions')->onDelete('cascade');
            $table->foreignUuid('node_id')->nullable()->constrained('workflow_nodes')->onDelete('cascade');
            
            $table->string('status', 20); // started, completed, failed, retrying
            $table->json('input_data')->nullable();
            $table->json('output_data')->nullable(); // Response from API/AI
            $table->text('message')->nullable();
            $table->integer('duration_ms')->nullable();
            
            $table->timestamp('created_at')->useCurrent();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('workflow_logs');
        Schema::dropIfExists('workflow_executions');
        Schema::dropIfExists('workflow_edges');
        Schema::dropIfExists('workflow_nodes');
        Schema::dropIfExists('workflows');
    }
};
