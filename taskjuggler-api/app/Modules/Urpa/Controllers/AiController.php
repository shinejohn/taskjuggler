<?php

namespace App\Modules\Urpa\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Urpa\Models\UrpaAiSession;
use App\Modules\Urpa\Models\UrpaAiMessage;
use App\Modules\Urpa\Models\UrpaArtifact;
use App\Modules\Urpa\Models\UrpaAiTask;
use App\Modules\Urpa\Models\UrpaUserProfile;
use App\Modules\Urpa\Services\AiService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;

class AiController extends Controller
{
    public function __construct(
        private AiService $aiService
    ) {}
    /**
     * Get AI sessions for user
     * GET /api/urpa/ai/sessions
     */
    public function sessions(Request $request): JsonResponse
    {
        $user = $request->user();
        
        $query = UrpaAiSession::where('user_id', $user->id);

        if ($request->has('type')) {
            $query->byType($request->query('type'));
        }

        if ($request->has('status')) {
            $query->where('status', $request->query('status'));
        }

        $perPage = $request->query('per_page', 20);
        $sessions = $query->orderBy('started_at', 'desc')
            ->paginate($perPage);

        return response()->json([
            'data' => $sessions->items(),
            'total' => $sessions->total(),
            'page' => $sessions->currentPage(),
            'per_page' => $sessions->perPage(),
        ]);
    }

    /**
     * Create AI session
     * POST /api/urpa/ai/sessions
     */
    public function createSession(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'session_type' => 'required|string|in:chat,voice,video',
            'persona_used' => 'nullable|string|max:20',
        ]);

        $user = $request->user();
        $profile = UrpaUserProfile::where('user_id', $user->id)->first();

        // Check AI request limit
        if ($profile && !$profile->canMakeAiRequest()) {
            return response()->json([
                'error' => 'AI request limit exceeded',
            ], 403);
        }

        $session = UrpaAiSession::create([
            'user_id' => $user->id,
            'session_type' => $validated['session_type'],
            'persona_used' => $validated['persona_used'] ?? $profile->default_persona ?? 'professional',
            'status' => 'active',
        ]);

        if ($profile) {
            $profile->incrementAiRequests();
        }

        return response()->json($session, 201);
    }

    /**
     * Get session messages
     * GET /api/urpa/ai/sessions/{id}/messages
     */
    public function getMessages(Request $request, string $id): JsonResponse
    {
        $session = UrpaAiSession::where('id', $id)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        $messages = UrpaAiMessage::where('session_id', $session->id)
            ->orderBy('created_at', 'asc')
            ->get();

        return response()->json(['data' => $messages]);
    }

    /**
     * Send message to AI
     * POST /api/urpa/ai/sessions/{id}/messages
     */
    public function sendMessage(Request $request, string $id): JsonResponse
    {
        $session = UrpaAiSession::where('id', $id)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        $validated = $request->validate([
            'content' => 'required|string',
            'is_voice' => 'sometimes|boolean',
            'audio_url' => 'nullable|url',
            'transcript' => 'nullable|string',
        ]);

        // Create user message
        $userMessage = UrpaAiMessage::create([
            'session_id' => $session->id,
            'role' => 'user',
            'content' => $validated['content'],
            'is_voice' => $validated['is_voice'] ?? false,
            'audio_url' => $validated['audio_url'] ?? null,
            'transcript' => $validated['transcript'] ?? null,
        ]);

        $session->incrementMessageCount();

        // Process AI response
        $aiResponse = $this->aiService->processMessage(
            $session,
            $validated['content'],
            $session->persona_used
        );

        // Get token usage from session metadata
        $metadata = $session->metadata ?? [];
        $inputTokens = $metadata['last_input_tokens'] ?? 0;
        $outputTokens = $metadata['last_output_tokens'] ?? 0;

        $aiMessage = UrpaAiMessage::create([
            'session_id' => $session->id,
            'role' => 'assistant',
            'content' => $aiResponse,
            'input_tokens' => $inputTokens,
            'output_tokens' => $outputTokens,
        ]);

        $session->incrementMessageCount();
        $session->incrementAiRequestCount();

        return response()->json([
            'user_message' => $userMessage,
            'ai_message' => $aiMessage,
        ], 201);
    }

    /**
     * Generate artifact
     * POST /api/urpa/ai/artifacts
     */
    public function generateArtifact(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'session_id' => 'nullable|uuid|exists:urpa_ai_sessions,id',
            'artifact_type' => 'required|string|in:code,document,image,file',
            'title' => 'required|string|max:255',
            'content' => 'nullable|string',
            'language' => 'nullable|string|max:50',
            'tags' => 'nullable|array',
        ]);

        $user = $request->user();
        $profile = UrpaUserProfile::where('user_id', $user->id)->first();

        // Check storage limit
        $estimatedSize = strlen($validated['content'] ?? '') / 1024 / 1024; // MB
        if ($profile && !$profile->hasStorageSpace($estimatedSize)) {
            return response()->json([
                'error' => 'Storage limit exceeded',
            ], 403);
        }

        // Generate artifact using AI service
        $session = null;
        if ($validated['session_id']) {
            $session = UrpaAiSession::where('id', $validated['session_id'])
                ->where('user_id', $user->id)
                ->first();
        }

        $prompt = $validated['content'] ?? "Create {$validated['artifact_type']} content titled: {$validated['title']}";
        
        $artifactContent = $this->aiService->generateArtifact(
            $session ?? UrpaAiSession::create([
                'user_id' => $user->id,
                'session_type' => 'chat',
                'status' => 'active',
            ]),
            $validated['artifact_type'],
            $validated['title'],
            $prompt,
            $validated['language'] ?? null
        );

        $artifact = UrpaArtifact::create([
            'user_id' => $user->id,
            'session_id' => $validated['session_id'] ?? null,
            'artifact_type' => $validated['artifact_type'],
            'title' => $validated['title'],
            'content' => $artifactContent,
            'language' => $validated['language'] ?? null,
            'tags' => $validated['tags'] ?? [],
            'storage_provider' => 'local',
            'file_size_bytes' => strlen($artifactContent),
        ]);

        if ($profile) {
            $profile->increment('storage_used_gb', $estimatedSize / 1024);
        }

        return response()->json($artifact, 201);
    }

    /**
     * Get artifacts
     * GET /api/urpa/ai/artifacts
     */
    public function artifacts(Request $request): JsonResponse
    {
        $user = $request->user();
        
        $query = UrpaArtifact::where('user_id', $user->id);

        if ($request->has('type')) {
            $query->byType($request->query('type'));
        }

        if ($request->has('language')) {
            $query->byLanguage($request->query('language'));
        }

        $perPage = $request->query('per_page', 20);
        $artifacts = $query->with('session')
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);

        return response()->json([
            'data' => $artifacts->items(),
            'total' => $artifacts->total(),
            'page' => $artifacts->currentPage(),
            'per_page' => $artifacts->perPage(),
        ]);
    }

    /**
     * Get AI tasks
     * GET /api/urpa/ai/tasks
     */
    public function tasks(Request $request): JsonResponse
    {
        $user = $request->user();
        
        $query = UrpaAiTask::where('user_id', $user->id);

        if ($request->has('status')) {
            $query->where('status', $request->query('status'));
        }

        if ($request->has('synced')) {
            if ($request->query('synced') === 'true') {
                $query->synced();
            } else {
                $query->notSynced();
            }
        }

        $perPage = $request->query('per_page', 20);
        $tasks = $query->with('session')
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);

        return response()->json([
            'data' => $tasks->items(),
            'total' => $tasks->total(),
            'page' => $tasks->currentPage(),
            'per_page' => $tasks->perPage(),
        ]);
    }

    /**
     * Complete session
     * PATCH /api/urpa/ai/sessions/{id}/complete
     */
    public function completeSession(Request $request, string $id): JsonResponse
    {
        $session = UrpaAiSession::where('id', $id)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        $session->markAsCompleted();

        return response()->json($session);
    }
}

