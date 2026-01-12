<?php

namespace App\Services\AI;

use App\Models\Actor;
use App\Models\Task;
use App\Services\TEF\TEFMessageFactory;
use App\Services\TEF\TEFValidator;
use Illuminate\Support\Facades\Log;
// use PhpMcp\Laravel\Facades\Mcp; // Package not available

/**
 * MCP Server Service for AI Agent Integration
 * 
 * Handles MCP server setup, tool registration, and AI agent communication
 */
class McpServerService
{
    private TEFMessageFactory $messageFactory;
    private TEFValidator $validator;

    public function __construct(
        TEFMessageFactory $messageFactory,
        TEFValidator $validator
    ) {
        $this->messageFactory = $messageFactory;
        $this->validator = $validator;
    }

    /**
     * Register MCP tools for AI agents
     */
    public function registerMcpTools(): void
    {
        if (!class_exists('PhpMcp\Laravel\Facades\Mcp')) {
            Log::warning('MCP package not installed. Skipping MCP tool registration.');
            return;
        }
        // Tool: Create Task
        \PhpMcp\Laravel\Facades\Mcp::tool('create_task', 'Create a new task in TaskJuggler')
            ->description('Creates a new task with title, description, priority, and optional due date')
            ->inputSchema([
                'type' => 'object',
                'properties' => [
                    'title' => ['type' => 'string', 'description' => 'Task title'],
                    'description' => ['type' => 'string', 'description' => 'Task description'],
                    'priority' => ['type' => 'string', 'enum' => ['low', 'normal', 'high', 'urgent']],
                    'due_date' => ['type' => 'string', 'format' => 'date-time', 'description' => 'Optional due date'],
                    'tags' => ['type' => 'array', 'items' => ['type' => 'string']],
                ],
                'required' => ['title'],
            ])
            ->handler(function (array $arguments) {
                return $this->handleCreateTask($arguments);
            });

        // Tool: Get Task
        \PhpMcp\Laravel\Facades\Mcp::tool('get_task', 'Get task details by ID')
            ->description('Retrieves detailed information about a specific task')
            ->inputSchema([
                'type' => 'object',
                'properties' => [
                    'task_id' => ['type' => 'string', 'format' => 'uuid', 'description' => 'Task UUID'],
                ],
                'required' => ['task_id'],
            ])
            ->handler(function (array $arguments) {
                return $this->handleGetTask($arguments);
            });

        // Tool: List Tasks
        \PhpMcp\Laravel\Facades\Mcp::tool('list_tasks', 'List tasks with optional filters')
            ->description('Retrieves a list of tasks, optionally filtered by status, priority, or owner')
            ->inputSchema([
                'type' => 'object',
                'properties' => [
                    'status' => ['type' => 'string', 'enum' => ['pending', 'accepted', 'in_progress', 'completed', 'cancelled']],
                    'priority' => ['type' => 'string', 'enum' => ['low', 'normal', 'high', 'urgent']],
                    'owner_id' => ['type' => 'string', 'format' => 'uuid'],
                    'limit' => ['type' => 'integer', 'minimum' => 1, 'maximum' => 100],
                ],
            ])
            ->handler(function (array $arguments) {
                return $this->handleListTasks($arguments);
            });

        // Tool: Update Task Status
        \PhpMcp\Laravel\Facades\Mcp::tool('update_task_status', 'Update task status')
            ->description('Updates the status of a task (accept, complete, cancel, etc.)')
            ->inputSchema([
                'type' => 'object',
                'properties' => [
                    'task_id' => ['type' => 'string', 'format' => 'uuid'],
                    'status' => ['type' => 'string', 'enum' => ['accepted', 'in_progress', 'completed', 'cancelled']],
                ],
                'required' => ['task_id', 'status'],
            ])
            ->handler(function (array $arguments) {
                return $this->handleUpdateTaskStatus($arguments);
            });

        // Tool: Accept Task
        \PhpMcp\Laravel\Facades\Mcp::tool('accept_task', 'Accept a task assignment')
            ->description('Accepts a task that has been assigned to the AI agent')
            ->inputSchema([
                'type' => 'object',
                'properties' => [
                    'task_id' => ['type' => 'string', 'format' => 'uuid'],
                ],
                'required' => ['task_id'],
            ])
            ->handler(function (array $arguments) {
                return $this->handleAcceptTask($arguments);
            });

        // Tool: Complete Task
        \PhpMcp\Laravel\Facades\Mcp::tool('complete_task', 'Mark a task as completed')
            ->description('Marks a task as completed, optionally with completion notes')
            ->inputSchema([
                'type' => 'object',
                'properties' => [
                    'task_id' => ['type' => 'string', 'format' => 'uuid'],
                    'completion_notes' => ['type' => 'string'],
                    'output_data' => ['type' => 'object'],
                ],
                'required' => ['task_id'],
            ])
            ->handler(function (array $arguments) {
                return $this->handleCompleteTask($arguments);
            });

        Log::info('MCP tools registered');
    }

    /**
     * Handle create_task tool
     */
    private function handleCreateTask(array $arguments): array
    {
        try {
            $task = Task::create([
                'title' => $arguments['title'],
                'description' => $arguments['description'] ?? null,
                'priority' => $arguments['priority'] ?? 'normal',
                'due_date' => isset($arguments['due_date']) ? \Carbon\Carbon::parse($arguments['due_date']) : null,
                'tags' => $arguments['tags'] ?? [],
                'status' => 'pending',
                'source_channel' => 'ai_agent',
            ]);

            return [
                'success' => true,
                'task_id' => $task->id,
                'message' => 'Task created successfully',
            ];
        } catch (\Exception $e) {
            Log::error('MCP create_task failed', ['error' => $e->getMessage()]);
            return [
                'success' => false,
                'error' => $e->getMessage(),
            ];
        }
    }

    /**
     * Handle get_task tool
     */
    private function handleGetTask(array $arguments): array
    {
        try {
            $task = Task::findOrFail($arguments['task_id']);
            
            return [
                'success' => true,
                'task' => [
                    'id' => $task->id,
                    'title' => $task->title,
                    'description' => $task->description,
                    'status' => $task->status,
                    'priority' => $task->priority,
                    'due_date' => $task->due_date?->toIso8601String(),
                    'created_at' => $task->created_at->toIso8601String(),
                ],
            ];
        } catch (\Exception $e) {
            return [
                'success' => false,
                'error' => $e->getMessage(),
            ];
        }
    }

    /**
     * Handle list_tasks tool
     */
    private function handleListTasks(array $arguments): array
    {
        try {
            $query = Task::query();

            if (isset($arguments['status'])) {
                $query->where('status', $arguments['status']);
            }

            if (isset($arguments['priority'])) {
                $query->where('priority', $arguments['priority']);
            }

            if (isset($arguments['owner_id'])) {
                $query->where('owner_id', $arguments['owner_id']);
            }

            $limit = $arguments['limit'] ?? 20;
            $tasks = $query->limit($limit)->get();

            return [
                'success' => true,
                'tasks' => $tasks->map(function ($task) {
                    return [
                        'id' => $task->id,
                        'title' => $task->title,
                        'status' => $task->status,
                        'priority' => $task->priority,
                        'due_date' => $task->due_date?->toIso8601String(),
                    ];
                })->toArray(),
            ];
        } catch (\Exception $e) {
            return [
                'success' => false,
                'error' => $e->getMessage(),
            ];
        }
    }

    /**
     * Handle update_task_status tool
     */
    private function handleUpdateTaskStatus(array $arguments): array
    {
        try {
            $task = Task::findOrFail($arguments['task_id']);
            $task->update(['status' => $arguments['status']]);

            return [
                'success' => true,
                'message' => 'Task status updated',
                'task_id' => $task->id,
                'status' => $task->status,
            ];
        } catch (\Exception $e) {
            return [
                'success' => false,
                'error' => $e->getMessage(),
            ];
        }
    }

    /**
     * Handle accept_task tool
     */
    private function handleAcceptTask(array $arguments): array
    {
        try {
            $task = Task::findOrFail($arguments['task_id']);
            $task->update(['status' => 'accepted']);

            return [
                'success' => true,
                'message' => 'Task accepted',
                'task_id' => $task->id,
            ];
        } catch (\Exception $e) {
            return [
                'success' => false,
                'error' => $e->getMessage(),
            ];
        }
    }

    /**
     * Handle complete_task tool
     */
    private function handleCompleteTask(array $arguments): array
    {
        try {
            $task = Task::findOrFail($arguments['task_id']);
            
            $updateData = ['status' => 'completed'];
            
            if (isset($arguments['completion_notes'])) {
                $metadata = $task->metadata ?? [];
                $metadata['completion_notes'] = $arguments['completion_notes'];
                $updateData['metadata'] = $metadata;
            }

            if (isset($arguments['output_data'])) {
                $metadata = $task->metadata ?? [];
                $metadata['output_data'] = $arguments['output_data'];
                $updateData['metadata'] = $metadata;
            }

            $task->update($updateData);

            return [
                'success' => true,
                'message' => 'Task completed',
                'task_id' => $task->id,
            ];
        } catch (\Exception $e) {
            return [
                'success' => false,
                'error' => $e->getMessage(),
            ];
        }
    }

    /**
     * Send TEF message to AI agent via MCP
     */
    public function sendTaskToAgent(Actor $agent, Task $task): bool
    {
        try {
            // Get requestor actor
            $requestorActor = Actor::where('user_id', $task->requestor_id)
                ->where('actor_type', Actor::TYPE_HUMAN)
                ->first();

            if (!$requestorActor) {
                Log::error('Requestor actor not found', ['task_id' => $task->id]);
                return false;
            }

            // Create TEF envelope
            $envelope = $this->messageFactory->createTaskCreate(
                $task,
                $requestorActor,
                $agent
            );

            // Validate envelope
            $validation = $this->validator->validateMessage($envelope);
            if (!$validation['valid']) {
                Log::error('Invalid TEF envelope', ['errors' => $validation['errors']]);
                return false;
            }

            // Get agent's MCP endpoint
            $mcpEndpoint = $this->getAgentMcpEndpoint($agent);
            if (!$mcpEndpoint) {
                Log::error('Agent MCP endpoint not found', ['agent_id' => $agent->id]);
                return false;
            }

            // Send via HTTP to MCP endpoint
            $response = \Illuminate\Support\Facades\Http::post($mcpEndpoint . '/mcp/call', [
                'method' => 'tools/call',
                'params' => [
                    'name' => 'receive_task',
                    'arguments' => $envelope,
                ],
            ]);

            if ($response->successful()) {
                // Store message
                $this->storeTefMessage($envelope, $task);
                return true;
            }

            Log::error('Failed to send task to agent', [
                'agent_id' => $agent->id,
                'status' => $response->status(),
            ]);

            return false;
        } catch (\Exception $e) {
            Log::error('Error sending task to agent', [
                'agent_id' => $agent->id,
                'error' => $e->getMessage(),
            ]);
            return false;
        }
    }

    /**
     * Get agent's MCP endpoint from contact methods
     */
    private function getAgentMcpEndpoint(Actor $agent): ?string
    {
        $contactMethods = $agent->contact_methods ?? [];
        
        foreach ($contactMethods as $method) {
            if (($method['protocol'] ?? null) === 'mcp' || ($method['protocol'] ?? null) === 'http') {
                return $method['endpoint'] ?? null;
            }
        }

        return null;
    }

    /**
     * Store TEF message in database
     */
    private function storeTefMessage(array $envelope, Task $task): void
    {
        try {
            $conversation = \App\Models\Conversation::firstOrCreate(
                ['task_id' => $task->id],
                [
                    'participants' => [
                        $envelope['source_actor']['actor_id'] ?? null,
                        $envelope['target_actor']['actor_id'] ?? null,
                    ],
                    'message_count' => 0,
                ]
            );

            \App\Models\Message::create([
                'conversation_id' => $conversation->id,
                'task_id' => $task->id,
                'message_type' => $envelope['message_type'],
                'source_actor_id' => $envelope['source_actor']['actor_id'] ?? null,
                'target_actor_id' => $envelope['target_actor']['actor_id'] ?? null,
                'reply_to_id' => $envelope['reply_to_message_id'] ?? null,
                'payload' => $envelope,
                'delivered_at' => now(),
            ]);

            $conversation->incrementMessageCount();
        } catch (\Exception $e) {
            Log::error('Failed to store TEF message', [
                'error' => $e->getMessage(),
                'task_id' => $task->id,
            ]);
        }
    }
}
