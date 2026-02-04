<?php

namespace App\Modules\Urpa\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Modules\Urpa\Services\ModeAwareDataService;

class DashboardDataController extends Controller
{
    /**
     * Get all dashboard widgets data for current mode
     */
    public function index(Request $request): JsonResponse
    {
        $service = new ModeAwareDataService($request->user()->id);
        
        return response()->json([
            'emails' => $service->getEmails(5),
            'calendar' => $service->getCalendarEvents(5),
            'tasks' => $service->getTasks(10),
            'voicemails' => $service->getVoicemails(3),
            'messages' => $service->getMessages(5),
            'stats' => $service->getDashboardStats(),
        ]);
    }
    
    /**
     * Get mode-filtered emails
     */
    public function emails(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'limit' => 'sometimes|integer|min:1|max:50',
        ]);
        
        $service = new ModeAwareDataService($request->user()->id);
        return response()->json($service->getEmails($validated['limit'] ?? 10));
    }
    
    /**
     * Get mode-filtered calendar events
     */
    public function calendar(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'limit' => 'sometimes|integer|min:1|max:20',
            'date' => 'sometimes|date',
        ]);
        
        $service = new ModeAwareDataService($request->user()->id);
        return response()->json($service->getCalendarEvents($validated['limit'] ?? 5));
    }
    
    /**
     * Get mode-filtered tasks
     */
    public function tasks(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'limit' => 'sometimes|integer|min:1|max:50',
            'completed' => 'sometimes|boolean',
        ]);
        
        $service = new ModeAwareDataService($request->user()->id);
        return response()->json($service->getTasks($validated['limit'] ?? 10));
    }
    
    /**
     * Get mode-filtered voicemails
     */
    public function voicemails(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'limit' => 'sometimes|integer|min:1|max:20',
        ]);
        
        $service = new ModeAwareDataService($request->user()->id);
        return response()->json($service->getVoicemails($validated['limit'] ?? 5));
    }
    
    /**
     * Get mode-filtered messages
     */
    public function messages(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'limit' => 'sometimes|integer|min:1|max:50',
        ]);
        
        $service = new ModeAwareDataService($request->user()->id);
        return response()->json($service->getMessages($validated['limit'] ?? 10));
    }
    
    /**
     * Get dashboard stats for current mode
     */
    public function stats(Request $request): JsonResponse
    {
        $service = new ModeAwareDataService($request->user()->id);
        return response()->json($service->getDashboardStats());
    }
}
