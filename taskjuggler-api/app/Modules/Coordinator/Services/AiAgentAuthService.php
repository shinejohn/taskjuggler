<?php

namespace App\Modules\Coordinator\Services;

use App\Modules\Coordinator\Models\AiAgent;
use App\Modules\Coordinator\Models\AiAgentSession;
use App\Modules\Coordinator\Models\Organization;
use Illuminate\Support\Str;
use Carbon\Carbon;

/**
 * AI Agent Authentication & Authorization Service
 * Implements Protocol Part 1: Authentication & Authorization
 */
class AiAgentAuthService
{
    /**
     * Authenticate AI agent and create session
     * 
     * @param string $agentId
     * @param string $agentSecret
     * @param string $businessId
     * @param string $sessionType
     * @return array
     * @throws \Exception
     */
    public function authenticate(
        string $agentId,
        string $agentSecret,
        string $businessId,
        string $sessionType = 'customer_interaction'
    ): array {
        // Find agent
        $agent = AiAgent::where('agent_id', $agentId)
            ->whereHas('organization', function ($query) use ($businessId) {
                $query->where('id', $businessId)->orWhere('slug', $businessId);
            })
            ->first();

        if (!$agent) {
            throw new \Exception('Agent not found or not authorized for this business');
        }

        // Verify secret
        if (!$agent->verifySecret($agentSecret)) {
            throw new \Exception('Invalid agent secret');
        }

        // Check agent is active
        if (!$agent->isActive()) {
            throw new \Exception('Agent is not active');
        }

        // Check organization subscription
        $organization = $agent->organization;
        if ($organization->subscription_tier === 'inactive' || 
            ($organization->trial_ends_at && $organization->trial_ends_at->isPast())) {
            throw new \Exception('Organization subscription is not active');
        }

        // Determine permissions based on agent type and business tier
        $permissions = $this->determinePermissions($agent, $organization);
        $restrictions = $this->determineRestrictions($agent, $organization);

        // Create session token
        $sessionToken = $this->generateSessionToken();
        $expiresAt = Carbon::now()->addHours(8); // 8 hour session

        // Create session
        $session = AiAgentSession::create([
            'agent_id' => $agent->id,
            'organization_id' => $organization->id,
            'session_token' => $sessionToken,
            'session_type' => $sessionType,
            'permissions' => $permissions,
            'restrictions' => $restrictions,
            'expires_at' => $expiresAt,
        ]);

        // Update agent last authenticated
        $agent->update(['last_authenticated_at' => now()]);

        return [
            'session_token' => $sessionToken,
            'expires_at' => $expiresAt->toIso8601String(),
            'scope' => [
                'business_id' => $organization->id,
                'permissions' => $permissions,
                'restrictions' => $restrictions,
            ],
        ];
    }

    /**
     * Validate session token
     */
    public function validateSession(string $sessionToken): ?AiAgentSession
    {
        $session = AiAgentSession::where('session_token', $sessionToken)
            ->valid()
            ->first();

        if ($session) {
            $session->touchLastUsed();
        }

        return $session;
    }

    /**
     * Determine permissions based on agent type and business tier
     * Implements Protocol Part 1.3 & 1.4
     */
    private function determinePermissions(AiAgent $agent, Organization $organization): array
    {
        $permissions = [];

        // Base permissions by agent type (from protocol Part 1.4)
        $agentTypePermissions = [
            'receptionist' => [
                'read_profile',
                'read_faqs',
                'read_calendar',
                'read_crm_basic',
                'create_booking',
                'create_lead',
                'log_interaction',
                'suggest_faq',
            ],
            'scheduler' => [
                'read_profile',
                'read_faqs',
                'read_calendar',
                'read_team',
                'create_booking',
                'log_interaction',
            ],
            'dispatcher' => [
                'read_profile',
                'read_calendar',
                'read_team',
                'read_crm_basic',
                'create_task',
                'log_interaction',
            ],
            'relationship_manager' => [
                'read_profile',
                'read_faqs',
                'read_crm_basic',
                'read_crm_history',
                'create_task',
                'log_interaction',
                'suggest_faq',
            ],
            'business_strategist' => [
                'read_profile',
                'read_faqs',
                'read_crm_basic',
                'read_crm_history',
                'read_financial',
                'read_team',
                'create_task',
                'log_interaction',
            ],
        ];

        $permissions = $agentTypePermissions[$agent->agent_type] ?? [];

        // Apply business tier restrictions (from protocol Part 1.4)
        $tierRestrictions = [
            'starter' => ['read_crm_history', 'read_financial'],
            'growth' => ['read_financial'],
            'enterprise' => [],
        ];

        $restrictedFeatures = $tierRestrictions[$organization->subscription_tier] ?? [];
        $permissions = array_diff($permissions, $restrictedFeatures);

        // Apply compliance mode restrictions
        if ($organization->compliance_modes) {
            foreach ($organization->compliance_modes as $mode) {
                if ($mode === 'hipaa') {
                    // HIPAA adds audit requirements but doesn't remove permissions
                }
                if ($mode === 'legal_privilege') {
                    // Legal privilege adds conflict checks
                }
            }
        }

        return array_values($permissions);
    }

    /**
     * Determine restrictions based on agent type and compliance
     */
    private function determineRestrictions(AiAgent $agent, Organization $organization): array
    {
        $restrictions = [];

        // Base restrictions by agent type
        if (in_array($agent->agent_type, ['receptionist', 'scheduler', 'dispatcher'])) {
            $restrictions[] = 'no_financial';
            $restrictions[] = 'no_employee_personal';
        }

        if ($agent->agent_type !== 'relationship_manager') {
            $restrictions[] = 'no_crm_history';
        }

        if ($agent->agent_type !== 'business_strategist') {
            $restrictions[] = 'no_financial';
        }

        return $restrictions;
    }

    /**
     * Generate secure session token
     */
    private function generateSessionToken(): string
    {
        return 'coord_' . Str::random(64);
    }

    /**
     * Refresh session token
     */
    public function refreshSession(string $sessionToken): array
    {
        $session = $this->validateSession($sessionToken);
        
        if (!$session) {
            throw new \Exception('Invalid session token');
        }

        // Extend expiration
        $session->update([
            'expires_at' => Carbon::now()->addHours(8),
            'last_used_at' => now(),
        ]);

        return [
            'session_token' => $session->session_token,
            'expires_at' => $session->expires_at->toIso8601String(),
        ];
    }
}




