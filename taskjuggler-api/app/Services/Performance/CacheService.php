<?php

namespace App\Services\Performance;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Redis;

/**
 * Performance Cache Service
 * 
 * Provides caching layer for frequently accessed data
 */
class CacheService
{
    /**
     * Cache TTL constants (in seconds)
     */
    const TTL_SHORT = 60; // 1 minute
    const TTL_MEDIUM = 300; // 5 minutes
    const TTL_LONG = 3600; // 1 hour
    const TTL_VERY_LONG = 86400; // 24 hours

    /**
     * Get actor with caching
     */
    public function getActor(string $actorId): ?\App\Models\Actor
    {
        return Cache::remember(
            "actor:{$actorId}",
            self::TTL_MEDIUM,
            fn() => \App\Models\Actor::find($actorId)
        );
    }

    /**
     * Get relationship with caching
     */
    public function getRelationship(string $relationshipId): ?\App\Models\Relationship
    {
        return Cache::remember(
            "relationship:{$relationshipId}",
            self::TTL_MEDIUM,
            fn() => \App\Models\Relationship::find($relationshipId)
        );
    }

    /**
     * Get user's actors with caching
     */
    public function getUserActors(string $userId): \Illuminate\Database\Eloquent\Collection
    {
        return Cache::remember(
            "user:{$userId}:actors",
            self::TTL_MEDIUM,
            fn() => \App\Models\Actor::where('user_id', $userId)->get()
        );
    }

    /**
     * Get task with caching
     */
    public function getTask(string $taskId): ?\App\Models\Task
    {
        return Cache::remember(
            "task:{$taskId}",
            self::TTL_SHORT,
            fn() => \App\Models\Task::find($taskId)
        );
    }

    /**
     * Invalidate actor cache
     */
    public function invalidateActor(string $actorId): void
    {
        Cache::forget("actor:{$actorId}");
    }

    /**
     * Invalidate user actors cache
     */
    public function invalidateUserActors(string $userId): void
    {
        Cache::forget("user:{$userId}:actors");
    }

    /**
     * Invalidate task cache
     */
    public function invalidateTask(string $taskId): void
    {
        Cache::forget("task:{$taskId}");
    }

    /**
     * Warm up cache for user
     */
    public function warmUpUserCache(string $userId): void
    {
        // Pre-load user's actors
        $this->getUserActors($userId);
        
        // Pre-load user's tasks
        \App\Models\Task::where('requestor_id', $userId)
            ->orWhere('owner_id', $userId)
            ->limit(50)
            ->get()
            ->each(fn($task) => Cache::put("task:{$task->id}", $task, self::TTL_SHORT));
    }

    /**
     * Get cache statistics
     */
    public function getCacheStats(): array
    {
        try {
            $redis = Redis::connection();
            $info = $redis->info('stats');
            
            return [
                'hits' => $info['keyspace_hits'] ?? 0,
                'misses' => $info['keyspace_misses'] ?? 0,
                'hit_rate' => $this->calculateHitRate($info),
            ];
        } catch (\Exception $e) {
            return [
                'hits' => 0,
                'misses' => 0,
                'hit_rate' => 0,
            ];
        }
    }

    /**
     * Calculate cache hit rate
     */
    private function calculateHitRate(array $info): float
    {
        $hits = $info['keyspace_hits'] ?? 0;
        $misses = $info['keyspace_misses'] ?? 0;
        $total = $hits + $misses;

        if ($total === 0) {
            return 0.0;
        }

        return ($hits / $total) * 100;
    }
}
