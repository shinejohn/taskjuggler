<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Task;
use App\Models\Project;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        $organizationId = $user->organization_id;

        // My active tasks
        $myTasks = Task::ownedBy($user)
            ->whereIn('state', ['pending', 'accepted', 'in_progress', 'overdue'])
            ->count();

        // My overdue tasks
        $myOverdue = Task::ownedBy($user)->overdue()->count();

        // Projects I'm in
        $projects = Project::where('organization_id', $organizationId)
            ->forUser($user)
            ->count();

        // Recent activity (simplified)
        $recentTasks = Task::where('organization_id', $organizationId)
            ->where(function ($q) use ($user) {
                $q->where('owner_id', $user->id)
                  ->orWhere('requestor_id', $user->id);
            })
            ->orderByDesc('updated_at')
            ->limit(10)
            ->get(['id', 'title', 'state', 'updated_at']);

        return response()->json([
            'stats' => [
                'my_tasks' => $myTasks,
                'my_overdue' => $myOverdue,
                'projects' => $projects,
            ],
            'recent_tasks' => $recentTasks,
        ]);
    }

    public function activity(Request $request): JsonResponse
    {
        $user = $request->user();
        $organizationId = $user->organization_id;

        // Get recent tasks across organization
        $tasks = Task::where('organization_id', $organizationId)
            ->with(['requestor', 'owner', 'project'])
            ->orderByDesc('updated_at')
            ->limit(50)
            ->get();

        return response()->json([
            'data' => $tasks,
        ]);
    }
}


