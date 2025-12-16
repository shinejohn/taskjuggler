<?php

namespace App\Modules\Core\Traits;

use Illuminate\Http\JsonResponse;

trait ApiResponses
{
    protected function success($data = null, string $message = null, int $code = 200): JsonResponse
    {
        $response = ['success' => true];
        if ($message) $response['message'] = $message;
        if ($data !== null) $response['data'] = $data;
        return response()->json($response, $code);
    }

    protected function created($data = null, string $message = 'Created'): JsonResponse
    {
        return $this->success($data, $message, 201);
    }

    protected function error(string $message, int $code = 400, array $errors = []): JsonResponse
    {
        $response = ['success' => false, 'message' => $message];
        if ($errors) $response['errors'] = $errors;
        return response()->json($response, $code);
    }

    protected function notFound(string $message = 'Not found'): JsonResponse
    {
        return $this->error($message, 404);
    }

    protected function forbidden(string $message = 'Forbidden'): JsonResponse
    {
        return $this->error($message, 403);
    }

    protected function unauthorized(string $message = 'Unauthorized'): JsonResponse
    {
        return $this->error($message, 401);
    }
}

