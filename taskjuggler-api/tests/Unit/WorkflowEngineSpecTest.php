<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Models\User;
use App\Models\WorkflowDefinition;
use App\Models\WorkflowExecution;
use App\WorkflowEngine\ActionRegistry;
use App\WorkflowEngine\ConditionEvaluator;
use App\WorkflowEngine\DataMapper;
use App\WorkflowEngine\Engine;
use App\WorkflowEngine\EventRegistry;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;

class WorkflowEngineSpecTest extends TestCase
{
    // Use manual migration to avoid conflicts
    
    protected Engine $engine;
    protected ActionRegistry $actionRegistry;

    protected function setUp(): void
    {
        parent::setUp();
        
        // Manual Schema Setup
        Schema::create('workflow_definitions', function (Blueprint $table) {
            $table->id();
            $table->ulid('ulid')->nullable();
            $table->foreignId('organization_id')->nullable();
            $table->string('name');
            $table->string('slug')->nullable();
            $table->string('trigger_event');
            $table->json('trigger_conditions')->nullable();
            $table->json('steps')->nullable();
            $table->boolean('is_active')->default(true);
            $table->integer('max_concurrent')->default(10);
            $table->integer('priority')->default(50);
            $table->integer('execution_count')->default(0);
            $table->integer('failure_count')->default(0); // Added this
            $table->string('creator_type')->default('test');
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('workflow_executions', function (Blueprint $table) {
            $table->id();
            $table->ulid('ulid')->nullable();
            $table->foreignId('organization_id')->nullable();
            $table->foreignId('definition_id');
            $table->string('trigger_event');
            $table->json('trigger_payload')->nullable();
            $table->string('correlation_id')->nullable();
            $table->foreignId('triggered_by_id')->nullable(); // Added this
            $table->string('status')->default('pending');
            $table->integer('max_retries')->default(3); // Added this
            $table->integer('current_step')->default(0);
            $table->integer('total_steps')->default(0);
            $table->json('context')->nullable();
            $table->timestamp('started_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->integer('duration_ms')->nullable();
            $table->text('error_message')->nullable();
            $table->json('error_details')->nullable();
            $table->timestamps();
        });

        Schema::create('workflow_step_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('execution_id');
            $table->integer('step_number');
            $table->string('step_name')->nullable();
            $table->string('action');
            $table->json('input')->nullable();
            $table->json('output')->nullable();
            $table->string('status')->default('pending');
            $table->timestamp('started_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->integer('duration_ms')->nullable(); // Restored this
            $table->text('error_message')->nullable();
            $table->json('error_details')->nullable();
            $table->integer('retry_count')->default(0);
            $table->timestamps();
        });

        // Initialize Services
        $this->actionRegistry = new ActionRegistry();
        $this->engine = new Engine(
            $this->actionRegistry,
            new ConditionEvaluator(),
            new DataMapper()
        );

        // Register a test action
        $this->actionRegistry->register(
            'test',
            'test.echo',
            ['description' => 'Echoes input'],
            fn($input) => $input
        );
    }

    public function test_it_executes_a_simple_linear_workflow()
    {
        \Illuminate\Support\Facades\Queue::fake();

        // 1. Create Definition
        $definition = WorkflowDefinition::create([
            'name' => 'Test Workflow',
            'trigger_event' => 'test.event',
            'steps' => [
                [
                    'name' => 'Step 1',
                    'action' => 'test.echo',
                    'input_map' => [
                        'message' => ['source' => 'trigger', 'path' => 'message']
                    ],
                    'output_map' => [
                        'echoed_message' => 'message'
                    ]
                ]
            ]
        ]);

        // 2. Trigger Event
        $payload = ['message' => 'Hello World'];
        $executionIds = $this->engine->handleEvent('test.event', $payload);

        $this->assertCount(1, $executionIds);
        $execution = WorkflowExecution::find($executionIds[0]);

        // 3. Execute Steps
        $this->engine->execute($execution);

        // 4. Assertions
        $execution->refresh();
        $this->assertEquals('completed', $execution->status);
        $this->assertEquals('Hello World', $execution->context['echoed_message']);
        
        $this->assertCount(1, $execution->stepLogs);
        $this->assertEquals('completed', $execution->stepLogs->first()->status);
    }
}
