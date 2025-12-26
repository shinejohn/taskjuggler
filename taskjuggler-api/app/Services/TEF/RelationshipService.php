<?php

namespace App\Services\TEF;

use App\Models\Relationship;
use App\Models\RelationshipHistory;
use Illuminate\Support\Str;

class RelationshipService
{
    /**
     * Create a relationship between two actors
     */
    public function createRelationship(
        string $actorAId,
        string $actorBId,
        string $type,
        array $permissions,
        string $establishedVia
    ): Relationship {
        $relationship = Relationship::create([
            'actor_a_id' => $actorAId,
            'actor_b_id' => $actorBId,
            'relationship_type' => $type,
            'permissions' => $permissions,
            'established_via' => $establishedVia,
            'trust_score' => 50.00,
            'task_count' => 0,
        ]);
        
        // Create bidirectional entry if needed
        if ($this->isBidirectional($type)) {
            Relationship::create([
                'actor_a_id' => $actorBId,
                'actor_b_id' => $actorAId,
                'relationship_type' => $this->getInverseType($type),
                'permissions' => $this->getInversePermissions($permissions),
                'established_via' => $establishedVia,
                'trust_score' => 50.00,
                'task_count' => 0,
            ]);
        }
        
        return $relationship;
    }

    /**
     * Record relationship history event
     */
    public function recordHistory(
        string $relationshipId,
        string $actorAId,
        string $actorBId,
        ?string $taskId,
        string $eventType,
        ?string $outcome = null,
        ?int $responseTimeMs = null,
        ?int $completionTimeMs = null,
        array $metadata = []
    ): RelationshipHistory {
        return RelationshipHistory::create([
            'id' => Str::uuid()->toString(),
            'relationship_id' => $relationshipId,
            'actor_a_id' => $actorAId,
            'actor_b_id' => $actorBId,
            'task_id' => $taskId,
            'event_type' => $eventType,
            'outcome' => $outcome,
            'response_time_ms' => $responseTimeMs,
            'completion_time_ms' => $completionTimeMs,
            'metadata' => $metadata,
        ]);
    }

    /**
     * Update trust score based on outcome
     */
    public function updateTrustScore(string $relationshipId, string $outcome): void
    {
        $relationship = Relationship::find($relationshipId);
        
        if (!$relationship) {
            return;
        }
        
        $currentScore = (float) $relationship->trust_score;
        
        // Adjust trust score based on outcome
        $adjustment = match($outcome) {
            RelationshipHistory::OUTCOME_SUCCESS => 2.0,
            RelationshipHistory::OUTCOME_FAILURE => -5.0,
            RelationshipHistory::OUTCOME_CANCELLED => -1.0,
            RelationshipHistory::OUTCOME_DISPUTED => -10.0,
            default => 0.0,
        };
        
        $newScore = max(0, min(100, $currentScore + $adjustment));
        $relationship->updateTrustScore($newScore);
    }

    /**
     * Check if relationship type is bidirectional
     */
    private function isBidirectional(string $type): bool
    {
        return in_array($type, [
            Relationship::TYPE_PEER,
            Relationship::TYPE_DELEGATE,
        ]);
    }

    /**
     * Get inverse relationship type
     */
    private function getInverseType(string $type): string
    {
        return match($type) {
            Relationship::TYPE_OWNER => Relationship::TYPE_PEER,
            Relationship::TYPE_PEER => Relationship::TYPE_PEER,
            Relationship::TYPE_DELEGATE => Relationship::TYPE_DELEGATE,
            Relationship::TYPE_WATCHER => Relationship::TYPE_PEER,
            Relationship::TYPE_VENDOR => Relationship::TYPE_PEER,
            default => Relationship::TYPE_PEER,
        };
    }

    /**
     * Get inverse permissions
     */
    private function getInversePermissions(array $permissions): array
    {
        // For bidirectional relationships, permissions might be symmetric
        // This is a simplified version - could be enhanced
        return $permissions;
    }
}

