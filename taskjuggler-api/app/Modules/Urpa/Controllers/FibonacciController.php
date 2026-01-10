<?php

namespace App\Modules\Urpa\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Urpa\Models\UrpaFibonacciLink;
use App\Modules\Urpa\Services\FibonacciCrmService;
use App\Modules\Urpa\Services\FibonacciPublishingService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class FibonacciController extends Controller
{
    public function __construct(
        private FibonacciCrmService $crmService,
        private FibonacciPublishingService $publishingService
    ) {}

    /**
     * Get Fibonacci link status
     * GET /api/urpa/integrations/fibonacci/status
     */
    public function status(Request $request): JsonResponse
    {
        $user = $request->user();
        
        $link = UrpaFibonacciLink::where('urpa_user_id', $user->id)->first();

        return response()->json([
            'linked' => $link !== null && $link->isLinked(),
            'link' => $link,
        ]);
    }

    /**
     * Link Fibonacci CRM
     * POST /api/urpa/integrations/fibonacci/crm/link
     */
    public function linkCrm(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'fibonacci_business_id' => 'required|uuid',
            'sync_faqs' => 'sometimes|boolean',
            'sync_polls' => 'sometimes|boolean',
            'sync_business_info' => 'sometimes|boolean',
        ]);

        $user = $request->user();

        $link = UrpaFibonacciLink::updateOrCreate(
            ['urpa_user_id' => $user->id],
            [
                'fibonacci_business_id' => $validated['fibonacci_business_id'],
                'sync_faqs' => $validated['sync_faqs'] ?? true,
                'sync_polls' => $validated['sync_polls'] ?? true,
                'sync_business_info' => $validated['sync_business_info'] ?? true,
            ]
        );

        return response()->json($link, 201);
    }

    /**
     * Get business profile
     * GET /api/urpa/integrations/fibonacci/crm/business/{businessId}
     */
    public function getBusinessProfile(Request $request, string $businessId): JsonResponse
    {
        $user = $request->user();
        
        $link = UrpaFibonacciLink::where('urpa_user_id', $user->id)
            ->where('fibonacci_business_id', $businessId)
            ->firstOrFail();

        $profile = $this->crmService->getBusinessProfile($businessId);

        return response()->json($profile);
    }

    /**
     * Get FAQs
     * GET /api/urpa/integrations/fibonacci/crm/business/{businessId}/faqs
     */
    public function getFAQs(Request $request, string $businessId): JsonResponse
    {
        $user = $request->user();
        
        $link = UrpaFibonacciLink::where('urpa_user_id', $user->id)
            ->where('fibonacci_business_id', $businessId)
            ->firstOrFail();

        $faqs = $this->crmService->getFAQs($businessId);

        return response()->json(['data' => $faqs]);
    }

    /**
     * Sync FAQs to voice responses
     * POST /api/urpa/integrations/fibonacci/crm/business/{businessId}/sync-faqs
     */
    public function syncFAQs(Request $request, string $businessId): JsonResponse
    {
        $user = $request->user();
        
        $link = UrpaFibonacciLink::where('urpa_user_id', $user->id)
            ->where('fibonacci_business_id', $businessId)
            ->firstOrFail();

        $result = $this->crmService->syncFAQsToVoice($businessId);

        return response()->json($result);
    }

    /**
     * Get active polls
     * GET /api/urpa/integrations/fibonacci/crm/business/{businessId}/polls
     */
    public function getPolls(Request $request, string $businessId): JsonResponse
    {
        $user = $request->user();
        
        $link = UrpaFibonacciLink::where('urpa_user_id', $user->id)
            ->where('fibonacci_business_id', $businessId)
            ->firstOrFail();

        $polls = $this->crmService->getActivePolls($businessId);

        return response()->json(['data' => $polls]);
    }

    /**
     * Link Fibonacci Publishing
     * POST /api/urpa/integrations/fibonacci/publishing/link
     */
    public function linkPublishing(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'publishing_team_id' => 'required|uuid',
        ]);

        $user = $request->user();

        $link = UrpaFibonacciLink::where('urpa_user_id', $user->id)->first();

        if (!$link) {
            return response()->json([
                'error' => 'Fibonacci CRM must be linked first',
            ], 400);
        }

        $link->update([
            'publishing_enabled' => true,
            'publishing_team_id' => $validated['publishing_team_id'],
        ]);

        return response()->json($link);
    }

    /**
     * Get publishing team
     * GET /api/urpa/integrations/fibonacci/publishing/team/{teamId}
     */
    public function getPublishingTeam(Request $request, string $teamId): JsonResponse
    {
        $user = $request->user();
        
        $link = UrpaFibonacciLink::where('urpa_user_id', $user->id)
            ->where('publishing_team_id', $teamId)
            ->firstOrFail();

        $team = $this->publishingService->getTeam($teamId);

        return response()->json($team);
    }

    /**
     * Create content request
     * POST /api/urpa/integrations/fibonacci/publishing/teams/{teamId}/projects
     */
    public function createContentRequest(Request $request, string $teamId): JsonResponse
    {
        $validated = $request->validate([
            'type' => 'required|string|in:blog,social,email,ad',
            'topic' => 'required|string',
            'tone' => 'nullable|string',
            'target_audience' => 'nullable|string',
            'keywords' => 'nullable|array',
            'deadline' => 'nullable|date',
            'assign_to' => 'nullable|array',
            'additional_notes' => 'nullable|string',
        ]);

        $user = $request->user();
        
        $link = UrpaFibonacciLink::where('urpa_user_id', $user->id)
            ->where('publishing_team_id', $teamId)
            ->firstOrFail();

        $project = $this->publishingService->createContentRequest($teamId, $validated);

        return response()->json($project, 201);
    }

    /**
     * Get content projects
     * GET /api/urpa/integrations/fibonacci/publishing/teams/{teamId}/projects
     */
    public function getProjects(Request $request, string $teamId): JsonResponse
    {
        $user = $request->user();
        
        $link = UrpaFibonacciLink::where('urpa_user_id', $user->id)
            ->where('publishing_team_id', $teamId)
            ->firstOrFail();

        $status = $request->query('status');
        $projects = $this->publishingService->getProjects($teamId, $status);

        return response()->json(['data' => $projects]);
    }
}

