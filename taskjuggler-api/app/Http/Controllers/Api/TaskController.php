<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Task;
use App\Events\TaskCreated;
use App\Events\TaskAssigned;
use App\Events\TaskCompleted;
use App\Services\Calendar\CalendarService;
use App\Services\Export\TaskExportService;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    public function index(Request $request)
    {
        $tasks = $request->user()
            ->tasks()
            ->with(['owner', 'teamMember', 'marketplaceVendor'])
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
            'status' => 'sometimes|in:pending,accepted,in_progress,completed,cancelled',
            'priority' => 'sometimes|in:low,normal,high,urgent',
            'due_date' => 'nullable|date',
            'contact_name' => 'nullable|string|max:255',
            'contact_phone' => 'nullable|string|max:20',
            'contact_email' => 'nullable|email|max:255',
            'location_address' => 'nullable|string|max:500',
            'tags' => 'nullable|array',
        ]);
        
        $task->update($validated);

        return response()->json($task);
    }

    public function destroy(Task $task)
    {
        $this->authorize('delete', $task);
        
        $task->delete();

        return response()->json(null, 204);
    }

    public function complete(Task $task)
    {
        $this->authorize('update', $task);
        
        $task->markCompleted();
        
        event(new TaskCompleted($task));

        return response()->json($task);
    }

    public function assign(Request $request, Task $task)
    {
        $this->authorize('update', $task);

        $request->validate([
            'assignee_type' => 'required|in:user,team_member,vendor',
            'assignee_id' => 'required|uuid',
        ]);

        match ($request->assignee_type) {
            'user' => $task->update(['owner_id' => $request->assignee_id]),
            'team_member' => $task->update(['team_member_id' => $request->assignee_id]),
            'vendor' => $task->update(['marketplace_vendor_id' => $request->assignee_id]),
        };

        $task->update(['status' => Task::STATUS_ACCEPTED]);

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
