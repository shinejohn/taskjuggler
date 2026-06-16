<?php

declare(strict_types=1);

namespace App\Modules\Communications\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Communications\Services\MatrixService;
use App\Modules\Core\Traits\ApiResponses;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

final class MatrixController extends Controller
{
    use ApiResponses;

    public function __construct(
        private MatrixService $matrix
    ) {}

    /**
     * GET /api/matrix/status
     */
    public function status(): JsonResponse
    {
        return $this->success([
            'enabled' => $this->matrix->isEnabled(),
            'homeserver_url' => config('matrix.homeserver_url'),
            'server_name' => config('matrix.server_name'),
        ]);
    }

    /**
     * GET /api/matrix/session — credentials for matrix-js-sdk
     */
    public function session(Request $request): JsonResponse
    {
        return $this->success(
            $this->matrix->clientSession($request->user()),
            'Matrix session'
        );
    }

    /**
     * GET /api/matrix/dm/{userId} — room for direct messages with another user
     */
    public function directRoom(Request $request, string $userId): JsonResponse
    {
        $other = \App\Models\User::findOrFail($userId);
        $roomId = $this->matrix->ensureDirectRoom($request->user(), $other);

        if (! $roomId) {
            return $this->error('Matrix DM room unavailable', 503);
        }

        return $this->success([
            'room_id' => $roomId,
            'session' => $this->matrix->clientSession($request->user()),
        ]);
    }

    /**
     * GET /api/matrix/conversations — DM list backed by MatrixDirectRoom
     */
    public function conversations(Request $request): JsonResponse
    {
        if (! $this->matrix->isEnabled()) {
            return $this->error('Matrix is not enabled', 503);
        }

        return $this->success(
            $this->matrix->listDirectConversations($request->user()),
            'Matrix conversations'
        );
    }

    /**
     * GET /api/matrix/task/{taskId} — room for task-scoped messaging
     */
    public function taskRoom(Request $request, string $taskId): JsonResponse
    {
        $task = \App\Models\Task::findOrFail($taskId);
        $user = $request->user();

        $isParticipant = in_array((string) $user->id, [
            (string) $task->requestor_id,
            (string) $task->owner_id,
        ], true);

        if (! $isParticipant) {
            return $this->error('Unauthorized', 403);
        }

        $roomId = $this->matrix->ensureTaskRoom($task);

        if (! $roomId) {
            return $this->error('Matrix task room unavailable', 503);
        }

        return $this->success([
            'room_id' => $roomId,
            'task_id' => $task->id,
            'session' => $this->matrix->clientSession($user),
        ]);
    }
}
