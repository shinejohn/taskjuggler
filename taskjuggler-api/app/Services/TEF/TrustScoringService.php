<?php

namespace App\Services\TEF;

use App\Models\Relationship;
use App\Models\RelationshipHistory;
use App\Models\Task;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

/**
 * Enhanced Trust Scoring Service
 * 
 * Calculates and updates trust scores based on relationship history
 */
class TrustScoringService
{
    /**
     * Calculate trust score for a relationship
     */
    public function calculateTrustScore(Relationship $relationship): float
    {
        $history = $relationship->history()
            ->orderBy('created_at', 'desc')
            ->limit(100) // Last 100 interactions
            ->get();

        if ($history->isEmpty()) {
            return 50.0; // Default neutral score
        }

        $scores = [];
        $totalWeight = 0;

        foreach ($history as $event) {
            $weight = $this->calculateEventWeight($event);
            $score = $this->calculateEventScore($event);
            
            $scores[] = $score * $weight;
            $totalWeight += $weight;
        }

        if ($totalWeight === 0) {
            return 50.0;
        }

        $trustScore = array_sum($scores) / $totalWeight;

        // Normalize to 0-100 range
        return max(0, min(100, $trustScore));
    }

    /**
     * Update trust score for relationship
     */
    public function updateTrustScore(Relationship $relationship): void
    {
        $newScore = $this->calculateTrustScore($relationship);
        $relationship->updateTrustScore($newScore);

        Log::info('Trust score updated', [
            'relationship_id' => $relationship->id,
            'old_score' => $relationship->getOriginal('trust_score'),
            'new_score' => $newScore,
        ]);
    }

    /**
     * Record task outcome and update trust score
     */
    public function recordTaskOutcome(Task $task, Relationship $relationship, string $outcome): void
    {
        $eventType = $this->mapTaskStatusToEventType($task->status);
        
        RelationshipHistory::create([
            'relationship_id' => $relationship->id,
            'actor_a_id' => $relationship->actor_a_id,
            'actor_b_id' => $relationship->actor_b_id,
            'task_id' => $task->id,
            'event_type' => $eventType,
            'outcome' => $outcome,
            'response_time_ms' => $this->calculateResponseTime($task),
            'completion_time_ms' => $this->calculateCompletionTime($task),
            'metadata' => [
                'task_priority' => $task->priority,
                'task_complexity' => $this->estimateTaskComplexity($task),
            ],
        ]);

        // Update trust score
        $this->updateTrustScore($relationship);
    }

    /**
     * Calculate event weight (more recent events weigh more)
     */
    private function calculateEventWeight(RelationshipHistory $event): float
    {
        $ageInDays = now()->diffInDays($event->created_at);
        
        // Exponential decay: weight = e^(-age/30)
        return exp(-$ageInDays / 30);
    }

    /**
     * Calculate score for an event
     */
    private function calculateEventScore(RelationshipHistory $event): float
    {
        $baseScore = match ($event->outcome) {
            RelationshipHistory::OUTCOME_SUCCESS => 80.0,
            RelationshipHistory::OUTCOME_FAILURE => 20.0,
            RelationshipHistory::OUTCOME_CANCELLED => 50.0,
            RelationshipHistory::OUTCOME_DISPUTED => 30.0,
            default => 50.0,
        };

        // Adjust based on response time
        if ($event->response_time_ms) {
            $responseBonus = $this->calculateResponseTimeBonus($event->response_time_ms);
            $baseScore += $responseBonus;
        }

        // Adjust based on completion time
        if ($event->completion_time_ms) {
            $completionBonus = $this->calculateCompletionTimeBonus($event->completion_time_ms);
            $baseScore += $completionBonus;
        }

        return max(0, min(100, $baseScore));
    }

    /**
     * Calculate decay factor for older events
     */
    private function calculateDecayFactor($history): float
    {
        if ($history->isEmpty()) {
            return 1.0;
        }

        $oldestEvent = $history->last();
        $ageInDays = now()->diffInDays($oldestEvent->created_at);

        // Decay factor: 1.0 for recent, 0.8 for 30 days old, 0.5 for 90 days old
        // Return 1.0 (no decay) as events are already weighted by age
        return 1.0;
    }

    /**
     * Calculate response time bonus
     */
    private function calculateResponseTimeBonus(int $responseTimeMs): float
    {
        // Faster response = higher bonus
        // < 1 hour: +10, < 1 day: +5, < 3 days: +0, > 3 days: -5
        $hours = $responseTimeMs / (1000 * 60 * 60);
        
        return match (true) {
            $hours < 1 => 10.0,
            $hours < 24 => 5.0,
            $hours < 72 => 0.0,
            default => -5.0,
        };
    }

    /**
     * Calculate completion time bonus
     */
    private function calculateCompletionTimeBonus(int $completionTimeMs): float
    {
        // Faster completion = higher bonus
        $days = $completionTimeMs / (1000 * 60 * 60 * 24);
        
        return match (true) {
            $days < 1 => 10.0,
            $days < 3 => 5.0,
            $days < 7 => 0.0,
            default => -5.0,
        };
    }

    /**
     * Map task status to event type
     */
    private function mapTaskStatusToEventType(string $status): string
    {
        return match ($status) {
            'accepted' => RelationshipHistory::EVENT_TASK_ACCEPTED,
            'completed' => RelationshipHistory::EVENT_TASK_COMPLETED,
            'cancelled' => RelationshipHistory::EVENT_TASK_CANCELLED,
            'declined' => RelationshipHistory::EVENT_TASK_REJECTED,
            default => RelationshipHistory::EVENT_TASK_SENT,
        };
    }

    /**
     * Calculate response time for task
     */
    private function calculateResponseTime(Task $task): ?int
    {
        $acceptedAt = $task->actions()
            ->where('action_type', 'status_change')
            ->where('new_value', 'accepted')
            ->first()?->created_at;

        if (!$acceptedAt) {
            return null;
        }

        return $task->created_at->diffInMilliseconds($acceptedAt);
    }

    /**
     * Calculate completion time for task
     */
    private function calculateCompletionTime(Task $task): ?int
    {
        $completedAt = $task->actions()
            ->where('action_type', 'status_change')
            ->where('new_value', 'completed')
            ->first()?->created_at;

        if (!$completedAt) {
            return null;
        }

        return $task->created_at->diffInMilliseconds($completedAt);
    }

    /**
     * Estimate task complexity
     */
    private function estimateTaskComplexity(Task $task): string
    {
        $descriptionLength = strlen($task->description ?? '');
        $hasLocation = !empty($task->location_address);
        $hasDueDate = !empty($task->due_date);
        $tagCount = count($task->tags ?? []);

        $complexityScore = 0;
        $complexityScore += min(3, $descriptionLength / 100);
        $complexityScore += $hasLocation ? 1 : 0;
        $complexityScore += $hasDueDate ? 1 : 0;
        $complexityScore += min(2, $tagCount);

        return match (true) {
            $complexityScore < 2 => 'low',
            $complexityScore < 4 => 'medium',
            default => 'high',
        };
    }

    /**
     * Get trust score recommendations
     */
    public function getTrustRecommendations(Relationship $relationship): array
    {
        $score = $relationship->trust_score ?? 50.0;
        $recommendations = [];

        if ($score < 30) {
            $recommendations[] = 'Low trust score. Consider reviewing recent interactions.';
        }

        if ($score > 80) {
            $recommendations[] = 'High trust score. This relationship is performing well.';
        }

        $recentFailures = $relationship->history()
            ->where('outcome', RelationshipHistory::OUTCOME_FAILURE)
            ->where('created_at', '>', now()->subDays(7))
            ->count();

        if ($recentFailures > 2) {
            $recommendations[] = 'Multiple recent failures detected. Consider pausing delegation.';
        }

        return $recommendations;
    }
}
