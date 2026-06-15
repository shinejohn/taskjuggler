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
}
