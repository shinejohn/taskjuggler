<?php

namespace App\Http\Controllers\Api\Performance;

use App\Http\Controllers\Controller;
use App\Services\Performance\CacheService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Cache Management Controller
 * 
 * Provides endpoints for cache management and statistics
 */
class CacheController extends Controller
{
    public function __construct(
        private CacheService $cacheService
    ) {}

    /**
     * Get cache statistics
     * GET /api/performance/cache/stats
     */
    public function stats(): JsonResponse
    {
        $stats = $this->cacheService->getCacheStats();

        return response()->json([
            'cache_stats' => $stats,
        ]);
    }

    /**
     * Warm up cache for user
     * POST /api/performance/cache/warm-up
     */
    public function warmUp(Request $request): JsonResponse
    {
        $this->cacheService->warmUpUserCache($request->user()->id);

        return response()->json([
            'message' => 'Cache warmed up successfully',
        ]);
    }

    /**
     * Clear user cache
     * DELETE /api/performance/cache/user
     */
    public function clearUserCache(Request $request): JsonResponse
    {
        $this->cacheService->invalidateUserActors($request->user()->id);

        return response()->json([
            'message' => 'User cache cleared',
        ]);
    }
}
