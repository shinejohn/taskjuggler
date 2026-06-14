<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Modules\Workflows\Models\Workflow;
use App\Modules\Workflows\Models\WorkflowNode;
use App\Modules\Workflows\Models\WorkflowExecution;
use App\Services\Workflow\WorkflowEngine;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Str;

class WorkflowEngineTest extends TestCase
{
    // Do NOT use RefreshDatabase as it triggers broken migrations in the main app
    // use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        // Manual Schema Setup for Workflow Engine Tables
        Schema::create('workflows', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('trigger_event')->nullable();
            $table->boolean('is_active')->default(true);
            $table->integer('version')->default(1);
            $table->json('input_schema')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('workflow_nodes', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('workflow_id'); // No FK constraint for unit test simplicity in sqlite
            $table->string('key');
            $table->string('type');
            $table->string('label')->nullable();
            $table->json('config')->default('{}');
            $table->json('retry_policy')->nullable();
            $table->string('next_node_id')->nullable();
            $table->timestamps();
            $table->unique(['workflow_id', 'key']);
        });

        Schema::create('workflow_edges', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('workflow_id');
            $table->string('source_node_id');
            $table->string('target_node_id');
            $table->text('condition_expression')->nullable();
            $table->string('label')->nullable();
            $table->timestamps();
        });

        Schema::create('workflow_executions', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('workflow_id');
            $table->string('trigger_source')->nullable();
            $table->string('trigger_id')->nullable();
            $table->string('correlation_id')->index();
            $table->string('status', 20)->default('pending');
            $table->string('current_node_id')->nullable();
            $table->json('context_data')->default('{}');
            $table->json('trigger_payload')->nullable();
            $table->timestamp('started_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->text('error_message')->nullable();
            $table->timestamps();
        });

        Schema::create('workflow_logs', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('execution_id');
            $table->string('node_id')->nullable();
            $table->string('status', 20);
            $table->json('input_data')->nullable();
            $table->json('output_data')->nullable();
            $table->text('message')->nullable();
            $table->integer('duration_ms')->nullable();
            $table->timestamps();
        });
        
        // Create a dummy users table for testing database operations
        Schema::create('users', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name');
            $table->string('email');
            $table->string('password');
            $table->timestamps();
        });
    }

    public function test_can_execute_simple_linear_workflow()
    {
        // 1. Create Workflow Definition
        $workflow = Workflow::create([
            'name' => 'Test Linear Flow',
            'slug' => 'test_linear_flow',
            'is_active' => true
        ]);

        // Node 1: Start
        $node1 = WorkflowNode::create([
            'workflow_id' => $workflow->id,
            'key' => 'start',
            'type' => 'database',
            'config' => [
                'operation' => 'create',
                'table' => 'users', // Use users table for test simplicity
                'data' => [
                    'name' => '{{ user_name }}',
                    'email' => '{{ user_email }}',
                    'password' => 'secret',
                ]
            ]
        ]);

        // 2. Execute
        $payload = [
            'user_name' => 'Test User',
            'user_email' => 'test@example.com'
        ];

        /** @var WorkflowEngine $engine */
        $engine = app(WorkflowEngine::class);
        $execution = $engine->start('test_linear_flow', $payload);

        // 3. Verify Execution Status
        $this->assertEquals('completed', $execution->status);
        $this->assertNotNull($execution->completed_at);

        // 4. Verify Side Effects (User created in DB)
        $this->assertDatabaseHas('users', [
            'email' => 'test@example.com'
        ]);

        // 5. Verify Context Update
        $this->assertArrayHasKey('nodes', $execution->context_data);
        $this->assertArrayHasKey('start', $execution->context_data['nodes']);
        $this->assertEquals('create', $execution->context_data['nodes']['start']['operation']);
    }

    public function test_fails_execution_on_error()
    {
        $workflow = Workflow::create([
            'name' => 'Test Error Flow',
            'slug' => 'test_error_flow',
            'is_active' => true
        ]);

        WorkflowNode::create([
            'workflow_id' => $workflow->id,
            'key' => 'start',
            'type' => 'database',
            'config' => [
                'operation' => 'create',
                'table' => 'non_existent_table', // Will cause SQL error
                'data' => []
            ]
        ]);

        try {
            /** @var WorkflowEngine $engine */
            $engine = app(WorkflowEngine::class);
            $engine->start('test_error_flow', []);
        } catch (\Exception $e) {
            // Expected
        }

        $execution = WorkflowExecution::first();
        $this->assertEquals('failed', $execution->status);
        $this->assertStringContainsString('non_existent_table', $execution->error_message);
    }
}
