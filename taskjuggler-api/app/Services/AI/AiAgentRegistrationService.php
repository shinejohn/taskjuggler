<?php

namespace App\Services\AI;

use App\Models\Actor;
use App\Models\ClaimCode;
use App\Models\User;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

/**
 * AI Agent Registration Service
 * 
 * Handles AI agent registration, claiming, and management
 */
class AiAgentRegistrationService
{
    /**
     * Register a new AI agent
     */
    public function registerAgent(array $agentInfo, ?string $userId = null): Actor
    {
        $agentId = $agentInfo['agent_id'] ?? Str::uuid()->toString();
        
        $actor = Actor::create([
            'actor_type' => Actor::TYPE_AI_AGENT,
            'display_name' => $agentInfo['name'] ?? "AI Agent {$agentId}",
            'capabilities' => $agentInfo['capabilities'] ?? [],
            'contact_methods' => array_filter([
                $agentInfo['mcp_endpoint'] ? ['protocol' => 'mcp', 'endpoint' => $agentInfo['mcp_endpoint']] : null,
                $agentInfo['http_endpoint'] ? ['protocol' => 'http', 'endpoint' => $agentInfo['http_endpoint']] : null,
            ]) ?: [],
            'metadata' => array_merge($agentInfo['metadata'] ?? [], [
                'agent_type' => $agentInfo['agent_type'] ?? 'general',
                'model' => $agentInfo['model'] ?? null,
                'provider' => $agentInfo['provider'] ?? null,
                'version' => $agentInfo['version'] ?? null,
            ]),
            'authentication' => [
                'method' => 'api_key',
                'api_key' => $agentInfo['api_key'] ?? null,
            ],
            'status' => Actor::STATUS_PENDING_CLAIM,
            'user_id' => $userId,
        ]);

        // Generate claim code
        $claimCode = $this->generateClaimCode($actor);

        Log::info('AI agent registered', [
            'agent_id' => $agentId,
            'actor_id' => $actor->id,
            'claim_code' => $claimCode->code,
        ]);

        return $actor;
    }

    /**
     * Claim an AI agent with claim code
     */
    public function claimAgent(string $claimCode, User $user): Actor
    {
        $code = ClaimCode::where('code', $claimCode)
            ->where('expires_at', '>', now())
            ->whereNull('claimed_at')
            ->first();

        if (!$code) {
            throw new \Exception('Invalid or expired claim code');
        }

        $actor = Actor::find($code->actor_id);
        if (!$actor || $actor->actor_type !== Actor::TYPE_AI_AGENT) {
            throw new \Exception('Actor not found or not an AI agent');
        }

        // Claim the agent
        $actor->update([
            'user_id' => $user->id,
            'status' => Actor::STATUS_ACTIVE,
        ]);

        $code->update([
            'claimed_at' => now(),
            'claimed_by_user_id' => $user->id,
        ]);

        Log::info('AI agent claimed', [
            'agent_id' => $actor->id,
            'user_id' => $user->id,
            'claim_code' => $claimCode,
        ]);

        return $actor;
    }

    /**
     * Generate claim code for agent
     */
    public function generateClaimCode(Actor $actor): ClaimCode
    {
        // Invalidate any existing unclaimed codes
        ClaimCode::where('actor_id', $actor->id)
            ->whereNull('claimed_at')
            ->update(['expires_at' => now()]);

        return ClaimCode::create([
            'actor_id' => $actor->id,
            'code' => strtoupper(Str::random(8)),
            'expires_at' => now()->addHours(24),
        ]);
    }

    /**
     * Get agent registration info (for API responses)
     */
    public function getAgentRegistrationInfo(Actor $actor): array
    {
        $claimCode = ClaimCode::where('actor_id', $actor->id)
            ->whereNull('claimed_at')
            ->where('expires_at', '>', now())
            ->first();

        $mcpEndpoint = null;
        $httpEndpoint = null;
        
        foreach ($actor->contact_methods ?? [] as $method) {
            if ($method['protocol'] === 'mcp') {
                $mcpEndpoint = $method['endpoint'];
            }
            if ($method['protocol'] === 'http') {
                $httpEndpoint = $method['endpoint'];
            }
        }

        return [
            'id' => $actor->id,
            'actor_id' => $actor->id,
            'agent_id' => $actor->id,
            'display_name' => $actor->display_name,
            'status' => $actor->status,
            'capabilities' => $actor->capabilities,
            'claim_code' => $claimCode?->code,
            'claim_code_expires_at' => $claimCode?->expires_at?->toIso8601String(),
            'mcp_endpoint' => $mcpEndpoint,
            'http_endpoint' => $httpEndpoint,
            'metadata' => $actor->metadata,
        ];
    }

    /**
     * Update agent capabilities
     */
    public function updateAgentCapabilities(Actor $actor, array $capabilities): void
    {
        $actor->update(['capabilities' => $capabilities]);
        
        Log::info('Agent capabilities updated', [
            'agent_id' => $actor->id,
            'capabilities' => $capabilities,
        ]);
    }

    /**
     * Deactivate agent
     */
    public function deactivateAgent(Actor $actor): void
    {
        $actor->update(['status' => Actor::STATUS_SUSPENDED]);
        
        Log::info('Agent deactivated', ['agent_id' => $actor->id]);
    }
}
