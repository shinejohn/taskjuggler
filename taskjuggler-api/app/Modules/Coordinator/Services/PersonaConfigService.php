<?php

namespace App\Modules\Coordinator\Services;

use App\Modules\Coordinator\Models\PersonaConfiguration;
use App\Modules\Coordinator\Models\Coordinator;
use App\Modules\Coordinator\Models\ConsensusRequest;
use App\Modules\Coordinator\Models\ConfigurationSuggestion;
use App\Models\User;
use Illuminate\Support\Str;

/**
 * Persona Configuration Service
 * Implements Protocol Part 8: Persona Configuration & Entity Consensus
 */
class PersonaConfigService
{
    /**
     * Get active persona configuration for coordinator
     */
    public function getActiveConfiguration(string $coordinatorId): ?PersonaConfiguration
    {
        return PersonaConfiguration::where('coordinator_id', $coordinatorId)
            ->active()
            ->first();
    }

    /**
     * Create persona configuration from AI agent registration
     * Implements Protocol Part 8.2
     */
    public function createFromAiRegistration(
        Coordinator $coordinator,
        array $aiAgentData,
        array $commandCenterData
    ): PersonaConfiguration {
        // Merge AI agent defaults with command center preferences
        $mergedConfig = $this->mergeConfigurations($aiAgentData, $commandCenterData);

        $versionId = 'config-v' . now()->format('YmdHis');

        return PersonaConfiguration::create([
            'organization_id' => $coordinator->organization_id,
            'coordinator_id' => $coordinator->id,
            'version_id' => $versionId,
            'identity' => $mergedConfig['identity'] ?? null,
            'personality' => $mergedConfig['personality'] ?? null,
            'communication' => $mergedConfig['communication'] ?? null,
            'voice' => $mergedConfig['voice'] ?? null,
            'behavior' => $mergedConfig['behavior'] ?? null,
            'prompts' => $mergedConfig['prompts'] ?? null,
            'approval_status' => 'pending',
            'is_active' => false,
        ]);
    }

    /**
     * Merge AI agent and Command Center configurations
     * Implements Protocol Part 8.5 (Consensus)
     */
    private function mergeConfigurations(array $aiAgentConfig, array $commandCenterConfig): array
    {
        $merged = [];

        // Identity - prefer command center if provided
        $merged['identity'] = $commandCenterConfig['identity'] ?? $aiAgentConfig['identity'] ?? null;

        // Personality - merge traits
        $merged['personality'] = [
            'core_traits' => array_merge(
                $aiAgentConfig['personality']['core_traits'] ?? [],
                $commandCenterConfig['personality']['core_traits'] ?? []
            ),
            'emotional_range' => $commandCenterConfig['personality']['emotional_range'] ?? 
                                $aiAgentConfig['personality']['emotional_range'] ?? null,
        ];

        // Communication - prefer command center preferences
        $merged['communication'] = $commandCenterConfig['communication'] ?? 
                                  $aiAgentConfig['communication'] ?? null;

        // Prompts - merge, command center overrides
        $merged['prompts'] = array_merge(
            $aiAgentConfig['prompts'] ?? [],
            $commandCenterConfig['prompts'] ?? []
        );

        return $merged;
    }

    /**
     * Create consensus request
     * Implements Protocol Part 8.5
     */
    public function createConsensusRequest(
        string $coordinatorId,
        string $initiatedBy,
        string $category,
        array $aiAgentPosition,
        array $commandCenterPosition
    ): ConsensusRequest {
        $coordinator = Coordinator::findOrFail($coordinatorId);

        // Determine conflict type
        $conflictType = $this->determineConflictType($aiAgentPosition, $commandCenterPosition);

        // Generate consensus ID
        $consensusId = 'consensus-' . now()->format('Y-m-d') . '-' . Str::random(8);

        return ConsensusRequest::create([
            'organization_id' => $coordinator->organization_id,
            'coordinator_id' => $coordinatorId,
            'consensus_id' => $consensusId,
            'initiated_by' => $initiatedBy,
            'category' => $category,
            'ai_agent_position' => $aiAgentPosition,
            'command_center_position' => $commandCenterPosition,
            'conflict_type' => $conflictType,
            'status' => 'pending',
            'requires_smb_approval' => $conflictType !== 'no_conflict',
        ]);
    }

    /**
     * Determine conflict type
     */
    private function determineConflictType(array $aiPosition, array $ccPosition): string
    {
        // Check for hard conflicts (incompatible values)
        if (isset($aiPosition['proposal']) && isset($ccPosition['current'])) {
            // Simple check - in production would be more sophisticated
            if ($aiPosition['proposal'] !== $ccPosition['current']) {
                // Check if can be merged
                if (isset($ccPosition['flexibility']) && $ccPosition['flexibility'] === 'can_modify_within_requirements') {
                    return 'soft_conflict';
                }
                return 'hard_conflict';
            }
        }

        return 'no_conflict';
    }

    /**
     * Approve persona configuration
     * Implements Protocol Part 8.6
     */
    public function approveConfiguration(PersonaConfiguration $config, User $user, ?string $notes = null): void
    {
        $config->approve($user, $notes);
    }
}




