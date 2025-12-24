<?php

namespace App\Modules\Tasks\Controllers;

use App\Modules\Core\Traits\ApiResponses;
use App\Modules\Core\Traits\ScopesToProfile;
use App\Http\Controllers\Controller;
use App\Models\Task;
use App\Models\TaskAction;
use App\Events\TaskCreated;
use App\Events\TaskAssigned;
use App\Events\TaskCompleted;
use App\Services\Calendar\CalendarService;
use App\Services\Export\TaskExportService;
use App\Services\Tasks\TaskStateMachine;
use App\Services\Tasks\TaskInvitationService;
use App\Services\Tasks\TaskMessageService;
use App\Models\TaskMessage;
use App\TaskExchange\TaskExchangeFormat;
use App\Services\TEF\TEFMessageFactory;
use App\Services\TEF\TEFValidator;
use App\Services\TEF\ActorService;
use App\Models\Actor;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    use AuthorizesRequests, ApiResponses, ScopesToProfile;
    public function __construct(
        private TaskStateMachine $stateMachine,
        private TaskInvitationService $invitationService,
        private TaskMessageService $messageService,
        private TEFMessageFactory $tefMessageFactory,
        private TEFValidator $tefValidator,
        private ActorService $actorService
    ) {}
    public function index(Request $request)
    {
        $query = $request->user()
            ->tasks()
            ->with(['owner', 'teamMember', 'marketplaceVendor']);
            
        // Scope to current profile
        $this->scopeToProfile($query, $request);
        
        $tasks = $query
            ->when($request->status, fn($q, $status) => $q->where('status', $status))
            ->when($request->priority, fn($q, $priority) => $q->where('priority', $priority))
            ->orderBy('created_at', 'desc')
            ->paginate($request->per_page ?? 20);

        return response()->json($tasks);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:500',
            'description' => 'nullable|string',
            'priority' => 'nullable|in:low,normal,high,urgent',
            'due_date' => 'nullable|date',
            'contact_name' => 'nullable|string|max:255',
            'contact_phone' => 'nullable|string|max:20',
            'contact_email' => 'nullable|email|max:255',
            'location_address' => 'nullable|string|max:500',
            'tags' => 'nullable|array',
        ]);

        $task = Task::create([
            ...$validated,
            'requestor_id' => $request->user()->id,
            'status' => Task::STATUS_PENDING,
            'priority' => $validated['priority'] ?? Task::PRIORITY_NORMAL,
            'profile_id' => $this->getCurrentProfileId($request),
        ]);

        event(new TaskCreated($task));

        return response()->json($task, 201);
    }

    public function show(Task $task)
    {
        $this->authorize('view', $task);
        
        $task->load(['owner', 'teamMember', 'marketplaceVendor', 'marketplaceListing', 'routingRule']);

        return response()->json($task);
    }

    public function update(Request $request, Task $task)
    {
        $this->authorize('update', $task);

        $validated = $request->validate([
            'title' => 'sometimes|string|max:500',
            'description' => 'nullable|string',
            'status' => 'sometimes|in:pending,accepted,declined,watching,in_progress,completed,cancelled,overdue',
            'priority' => 'sometimes|in:low,normal,high,urgent',
            'due_date' => 'nullable|date',
            'contact_name' => 'nullable|string|max:255',
            'contact_phone' => 'nullable|string|max:20',
            'contact_email' => 'nullable|email|max:255',
            'location_address' => 'nullable|string|max:500',
            'tags' => 'nullable|array',
            'source_channel' => 'nullable|string',
            'source_channel_ref' => 'nullable|string',
        ]);

        // If status is being changed, use state machine
        if (isset($validated['status']) && $validated['status'] !== $task->status) {
            $task = $this->stateMachine->transitionTaskStatus(
                $task,
                $validated['status'],
                $request->user(),
                $request->input('reason')
            );
            unset($validated['status']); // Remove status from update array
        }
        
        // Update other fields
        if (!empty($validated)) {
            $task->update($validated);
        }

        return response()->json($task->fresh());
    }

    public function destroy(Task $task)
    {
        $this->authorize('delete', $task);
        
        $task->delete();

        return response()->json(null, 204);
    }

    public function complete(Request $request, Task $task)
    {
        $this->authorize('update', $task);
        
        $task = $this->stateMachine->completeTask(
            $task,
            $request->user(),
            $request->input('reason')
        );
        
        event(new TaskCompleted($task));

        return response()->json($task);
    }

    public function accept(Request $request, Task $task)
    {
        $this->authorize('update', $task);
        
        $task = $this->stateMachine->acceptTask(
            $task,
            $request->user(),
            $request->input('reason')
        );
        
        event(new TaskAssigned($task));

        return response()->json($task);
    }

    public function decline(Request $request, Task $task)
    {
        $this->authorize('update', $task);
        
        $task = $this->stateMachine->declineTask(
            $task,
            $request->user(),
            $request->input('reason')
        );

        return response()->json($task);
    }

    public function watch(Request $request, Task $task)
    {
        $this->authorize('update', $task);
        
        $task = $this->stateMachine->watchTask(
            $task,
            $request->user(),
            $request->input('reason')
        );

        return response()->json($task);
    }

    public function timeline(Task $task)
    {
        $this->authorize('view', $task);
        
        $actions = $task->actions()
            ->with('user:id,name,email')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($action) {
                return [
                    'id' => $action->id,
                    'type' => $action->action_type,
                    'description' => $this->formatActionDescription($action),
                    'user' => $action->user ? [
                        'id' => $action->user->id,
                        'name' => $action->user->name,
                    ] : null,
                    'data' => $action->action_data,
                    'timestamp' => $action->created_at->toIso8601String(),
                    'relative_time' => $action->created_at->diffForHumans(),
                ];
            });

        return response()->json([
            'task_id' => $task->id,
            'timeline' => $actions,
        ]);
    }

    public function updateTimeline(Request $request, Task $task)
    {
        $this->authorize('update', $task);

        $validated = $request->validate([
            'start_date' => 'nullable|date',
            'due_date' => 'nullable|date|after_or_equal:start_date',
        ]);

        $changes = [];
        
        if (isset($validated['start_date']) && $task->start_date != $validated['start_date']) {
            $changes['start_date'] = [
                'from' => $task->start_date?->toIso8601String(),
                'to' => $validated['start_date'],
            ];
        }
        
        if (isset($validated['due_date']) && $task->due_date != $validated['due_date']) {
            $changes['due_date'] = [
                'from' => $task->due_date?->toIso8601String(),
                'to' => $validated['due_date'],
            ];
        }

        if (!empty($changes)) {
            $task->update($validated);

            // Log the timeline change
            TaskAction::create([
                'task_id' => $task->id,
                'user_id' => $request->user()->id,
                'action_type' => 'timeline_updated',
                'action_data' => $changes,
            ]);
        }

        return response()->json([
            'message' => 'Timeline updated',
            'task' => $task->fresh(),
        ]);
    }

    private function formatActionDescription(TaskAction $action): string
    {
        $data = $action->action_data ?? [];
        
        return match($action->action_type) {
            'status_change' => sprintf(
                'Status changed from %s to %s',
                $action->previous_value ?? 'unknown',
                $action->new_value ?? 'unknown'
            ),
            'assign' => sprintf(
                'Task assigned to %s',
                $data['assignee_type'] ?? 'someone'
            ),
            'timeline_updated' => 'Timeline was updated',
            'invitation_created' => 'Invitation created',
            'invitation_viewed' => 'Invitation viewed',
            default => ucfirst(str_replace('_', ' ', $action->action_type)),
        };
    }

    public function createInvitation(Request $request, Task $task)
    {
        $this->authorize('update', $task);

        $validated = $request->validate([
            'email' => 'nullable|email',
            'phone' => 'nullable|string',
            'name' => 'nullable|string|max:255',
            'role' => 'nullable|in:owner,watcher,collaborator',
        ]);

        if (empty($validated['email']) && empty($validated['phone'])) {
            return response()->json([
                'error' => 'Either email or phone is required'
            ], 422);
        }

        $invitation = $this->invitationService->createInvitation(
            $task,
            $request->user(),
            $validated['email'] ?? null,
            $validated['phone'] ?? null,
            $validated['name'] ?? null,
            $validated['role'] ?? 'owner'
        );

        return response()->json([
            'invitation' => $invitation,
            'invite_url' => $invitation->getInviteUrl(),
        ], 201);
    }

    public function getByInviteCode(string $taskId, string $inviteCode)
    {
        $invitation = $this->invitationService->getByInviteCode($taskId, $inviteCode);

        if (!$invitation) {
            return response()->json(['error' => 'Invalid or expired invitation'], 404);
        }

        if ($invitation->isExpired()) {
            return response()->json(['error' => 'Invitation has expired'], 410);
        }

        // Log invitation view
        TaskAction::create([
            'task_id' => $invitation->task_id,
            'user_id' => null, // Public access
            'action_type' => 'invitation_viewed',
            'action_data' => [
                'invitation_id' => $invitation->id,
                'invite_code' => $inviteCode,
                'ip_address' => request()->ip(),
            ],
        ]);

        return response()->json([
            'invitation' => $invitation,
            'task' => $invitation->task->only(['id', 'title', 'description', 'status', 'due_date']),
            'invited_by' => $invitation->invitedBy->only(['id', 'name']),
        ]);
    }

    public function acceptInvitation(Request $request, string $taskId, string $inviteCode)
    {
        $invitation = $this->invitationService->getByInviteCode($taskId, $inviteCode);

        if (!$invitation || !$invitation->isPending()) {
            return response()->json(['error' => 'Invalid or expired invitation'], 404);
        }

        $task = $this->invitationService->acceptInvitation($invitation, $request->user());

        return response()->json([
            'message' => 'Invitation accepted',
            'task' => $task,
        ]);
    }

    public function declineInvitation(Request $request, string $taskId, string $inviteCode)
    {
        $invitation = $this->invitationService->getByInviteCode($taskId, $inviteCode);

        if (!$invitation || !$invitation->isPending()) {
            return response()->json(['error' => 'Invalid or expired invitation'], 404);
        }

        $this->invitationService->declineInvitation($invitation, $request->user());

        return response()->json(['message' => 'Invitation declined']);
    }

    /**
     * Export task as TEF file (supports version parameter: ?version=1.0 or ?version=2.0.0)
     */
    public function exportTef(Request $request, Task $task)
    {
        $this->authorize('view', $task);

        $version = $request->input('version', TaskExchangeFormat::VERSION_2_0);
        $tefData = TaskExchangeFormat::fromTask($task, $request->user(), $version);
        $json = json_encode($tefData, JSON_PRETTY_PRINT);
        $filename = \Illuminate\Support\Str::slug($task->title) . '.' . TaskExchangeFormat::EXTENSION;

        return response($json)
            ->header('Content-Type', TaskExchangeFormat::MIME_TYPE)
            ->header('Content-Disposition', 'attachment; filename="' . $filename . '"');
    }

    /**
     * Export task as TEF JSON (for API consumption, supports version parameter)
     */
    public function toTef(Request $request, Task $task)
    {
        $this->authorize('view', $task);

        $version = $request->input('version', TaskExchangeFormat::VERSION_2_0);
        $tefData = TaskExchangeFormat::fromTask($task, $request->user(), $version);

        return response()->json(
            $tefData,
            200,
            ['Content-Type' => TaskExchangeFormat::MIME_TYPE]
        );
    }

    /**
     * Export task as TEF 2.0.0 envelope (with message wrapper)
     */
    public function exportTefEnvelope(Request $request, Task $task)
    {
        $this->authorize('view', $task);

        // Get or create actors
        $requestorActor = Actor::where('user_id', $task->requestor_id)
            ->where('actor_type', Actor::TYPE_HUMAN)
            ->first();
        
        if (!$requestorActor) {
            $requestorActor = Actor::create([
                'actor_type' => Actor::TYPE_HUMAN,
                'display_name' => $task->requestor->name,
                'user_id' => $task->requestor_id,
                'capabilities' => [],
                'contact_methods' => [
                    ['protocol' => 'email', 'endpoint' => $task->requestor->email],
                ],
                'status' => Actor::STATUS_ACTIVE,
            ]);
        }

        $targetActor = $requestorActor; // Default to requestor, can be overridden
        if ($task->owner_id) {
            $targetActor = Actor::where('user_id', $task->owner_id)
                ->where('actor_type', Actor::TYPE_HUMAN)
                ->first();
            
            if (!$targetActor) {
                $targetActor = Actor::create([
                    'actor_type' => Actor::TYPE_HUMAN,
                    'display_name' => $task->owner->name,
                    'user_id' => $task->owner_id,
                    'capabilities' => [],
                    'contact_methods' => [
                        ['protocol' => 'email', 'endpoint' => $task->owner->email],
                    ],
                    'status' => Actor::STATUS_ACTIVE,
                ]);
            }
        }

        // Create TEF 2.0.0 envelope with task
        $envelope = $this->tefMessageFactory->createTaskCreate(
            $task,
            $requestorActor,
            $targetActor
        );

        return response()->json($envelope, 200, [
            'Content-Type' => TaskExchangeFormat::MIME_TYPE,
        ]);
    }

    /**
     * Import task from TEF format (supports both 1.0 and 2.0.0)
     */
    public function importTef(Request $request)
    {
        $request->validate([
            'tef' => 'required|array',
        ]);

        $tef = $request->tef;
        // Default to TEF 2.0.0, but check if it's an envelope first
        if (isset($tef['message_type']) && isset($tef['task'])) {
            // TEF 2.0.0 envelope format
            $version = $tef['task']['tef_version'] ?? TaskExchangeFormat::VERSION_2_0;
        } else {
            // Direct TEF format
            $version = $tef['tef_version'] ?? TaskExchangeFormat::VERSION_2_0;
        }

        // Validate TEF format
        $errors = TaskExchangeFormat::validate($tef);
        
        if (!empty($errors)) {
            return response()->json(['errors' => $errors], 422);
        }

        // Extract task data based on version
        if ($version === TaskExchangeFormat::VERSION_2_0 && isset($tef['task'])) {
            // TEF 2.0.0 envelope format
            $taskData = TaskExchangeFormat::toTaskData($tef['task']);
            
            // Handle actor references for requestor
            if (isset($tef['task']['requestor']['actor_id'])) {
                $requestorActor = Actor::find($tef['task']['requestor']['actor_id']);
                if ($requestorActor && $requestorActor->user_id) {
                    $taskData['requestor_id'] = $requestorActor->user_id;
                } else {
                    $taskData['requestor_id'] = $request->user()->id;
                }
            } else {
                $taskData['requestor_id'] = $request->user()->id;
            }
            
            // Handle owner actor reference
            if (isset($tef['task']['owner']['actor_id'])) {
                $ownerActor = Actor::find($tef['task']['owner']['actor_id']);
                if ($ownerActor && $ownerActor->user_id) {
                    $taskData['owner_id'] = $ownerActor->user_id;
                }
            }
            
            $taskData['source_channel'] = 'api';
            $taskData['source_channel_ref'] = $tef['task']['task_id'] ?? $tef['message_id'] ?? null;
        } else {
            // TEF 1.0 format
            $taskData = TaskExchangeFormat::toTaskData($tef);
            $taskData['requestor_id'] = $request->user()->id;
            $taskData['source_channel'] = 'api';
            $taskData['source_channel_ref'] = $tef['uid'] ?? null;
        }

        $task = Task::create($taskData);

        // Create conversation if TEF 2.0.0
        if ($version === TaskExchangeFormat::VERSION_2_0 && isset($tef['task']['conversation_id'])) {
            \App\Models\Conversation::create([
                'id' => $tef['task']['conversation_id'],
                'task_id' => $task->id,
                'participants' => [
                    $taskData['requestor_id'],
                    ...($taskData['owner_id'] ? [$taskData['owner_id']] : []),
                ],
                'message_count' => 0,
            ]);
        }

        event(new TaskCreated($task));

        return response()->json([
            'message' => 'Task imported from TEF',
            'task' => $task,
        ], 201);
    }

    /**
     * Get messages for a task
     */
    public function messages(Request $request, Task $task)
    {
        $this->authorize('view', $task);

        $messages = $this->messageService->getMessages(
            $task,
            $request->input('limit', 50),
            $request->input('before')
        );

        // Mark as read
        $this->messageService->markAsRead($task, $request->user());

        return response()->json([
            'messages' => $messages,
            'task_id' => $task->id,
        ]);
    }

    /**
     * Send a message on a task
     */
    public function sendMessage(Request $request, Task $task)
    {
        $this->authorize('view', $task);  // Anyone who can view can message

        $validated = $request->validate([
            'content' => 'required|string|max:5000',
            'content_type' => 'nullable|in:text,file,image',
            'attachments' => 'nullable|array',
        ]);

        $message = $this->messageService->sendMessage(
            $task,
            $request->user(),
            $validated['content'],
            $validated['content_type'] ?? TaskMessage::CONTENT_TEXT,
            'in_app',
            $validated['attachments'] ?? null
        );

        return response()->json([
            'message' => $message->load('sender:id,name,avatar_url'),
        ], 201);
    }

    /**
     * Mark messages as read
     */
    public function markMessagesRead(Request $request, Task $task)
    {
        $this->authorize('view', $task);

        $this->messageService->markAsRead($task, $request->user());

        return response()->json(['success' => true]);
    }

    /**
     * Get unread count
     */
    public function unreadCount(Request $request, Task $task)
    {
        $this->authorize('view', $task);

        $count = $this->messageService->getUnreadCount($task, $request->user());

        return response()->json(['unread_count' => $count]);
    }

    public function assign(Request $request, Task $task)
    {
        $this->authorize('update', $task);

        $request->validate([
            'assignee_type' => 'required|in:user,team_member,vendor',
            'assignee_id' => 'required|uuid',
        ]);

        // Log assignment action
        TaskAction::create([
            'task_id' => $task->id,
            'user_id' => $request->user()->id,
            'action_type' => 'assign',
            'action_data' => [
                'assignee_type' => $request->assignee_type,
                'assignee_id' => $request->assignee_id,
            ],
            'previous_value' => json_encode([
                'owner_id' => $task->owner_id,
                'team_member_id' => $task->team_member_id,
                'marketplace_vendor_id' => $task->marketplace_vendor_id,
            ]),
        ]);

        match ($request->assignee_type) {
            'user' => $task->update(['owner_id' => $request->assignee_id]),
            'team_member' => $task->update(['team_member_id' => $request->assignee_id]),
            'vendor' => $task->update(['marketplace_vendor_id' => $request->assignee_id]),
        };

        // Use state machine to transition to accepted if not already
        if ($task->status !== Task::STATUS_ACCEPTED) {
            $task = $this->stateMachine->acceptTask($task, $request->user(), 'Assigned to ' . $request->assignee_type);
        }

        event(new TaskAssigned($task));

        return response()->json($task->fresh());
    }

    /**
     * Export a single task as iCal file
     */
    public function exportIcal(Task $task, CalendarService $calendarService)
    {
        $this->authorize('view', $task);
        
        $ical = $calendarService->generateIcalForTask($task, request()->user());
        
        $filename = 'task-' . $task->id . '.ics';
        
        return response($ical, 200)
            ->header('Content-Type', 'text/calendar; charset=utf-8')
            ->header('Content-Disposition', 'attachment; filename="' . $filename . '"');
    }

    /**
     * Export multiple tasks as iCal file
     */
    public function exportIcalMultiple(Request $request, CalendarService $calendarService)
    {
        $request->validate([
            'task_ids' => 'required|array',
            'task_ids.*' => 'required|uuid|exists:tasks,id',
        ]);

        $tasks = Task::whereIn('id', $request->task_ids)
            ->where(function ($query) use ($request) {
                $query->where('requestor_id', $request->user()->id)
                    ->orWhere('owner_id', $request->user()->id);
            })
            ->get();

        $ical = $calendarService->generateIcalForTasks($tasks, $request->user());
        
        $filename = 'tasks-' . now()->format('Y-m-d') . '.ics';
        
        return response($ical, 200)
            ->header('Content-Type', 'text/calendar; charset=utf-8')
            ->header('Content-Disposition', 'attachment; filename="' . $filename . '"');
    }

    /**
     * Get Google Calendar URL for a task
     */
    public function googleCalendarUrl(Task $task, CalendarService $calendarService)
    {
        $this->authorize('view', $task);
        
        $url = $calendarService->generateGoogleCalendarUrl($task);
        
        return response()->json(['url' => $url]);
    }

    /**
     * Get Outlook Calendar URL for a task
     */
    public function outlookCalendarUrl(Task $task, CalendarService $calendarService)
    {
        $this->authorize('view', $task);
        
        $url = $calendarService->generateOutlookCalendarUrl($task);
        
        return response()->json(['url' => $url]);
    }

    /**
     * Export tasks to CSV
     */
    public function exportCsv(Request $request, TaskExportService $exportService)
    {
        $request->validate([
            'task_ids' => 'nullable|array',
            'task_ids.*' => 'required|uuid|exists:tasks,id',
        ]);

        $query = $request->user()->tasks();
        
        if ($request->has('task_ids') && !empty($request->task_ids)) {
            $query->whereIn('id', $request->task_ids);
        }
        
        $tasks = $query->get();
        
        $csv = $exportService->exportToCsv($tasks);
        
        $filename = 'tasks-' . now()->format('Y-m-d') . '.csv';
        
        return response($csv, 200)
            ->header('Content-Type', 'text/csv; charset=utf-8')
            ->header('Content-Disposition', 'attachment; filename="' . $filename . '"');
    }

    /**
     * Export tasks to PDF
     */
    public function exportPdf(Request $request, TaskExportService $exportService)
    {
        $request->validate([
            'task_ids' => 'nullable|array',
            'task_ids.*' => 'required|uuid|exists:tasks,id',
        ]);

        $query = $request->user()->tasks();
        
        if ($request->has('task_ids') && !empty($request->task_ids)) {
            $query->whereIn('id', $request->task_ids);
        }
        
        $tasks = $query->get();
        
        $html = $exportService->exportToPdf($tasks);
        
        $filename = 'tasks-' . now()->format('Y-m-d') . '.html';
        
        // Note: For true PDF, you'd want to use a library like dompdf or wkhtmltopdf
        // For now, returning HTML that can be printed to PDF by the browser
        return response($html, 200)
            ->header('Content-Type', 'text/html; charset=utf-8')
            ->header('Content-Disposition', 'attachment; filename="' . $filename . '"');
    }
}
