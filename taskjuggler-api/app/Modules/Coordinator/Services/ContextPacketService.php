<?php

namespace App\Modules\Coordinator\Services;

use App\Modules\Coordinator\Models\ContextPacket;
use App\Modules\Coordinator\Models\Organization;
use App\Modules\Coordinator\Models\AiAgent;
use App\Modules\Coordinator\Models\ContextInvalidation;
use App\Modules\Coordinator\Models\AppointmentType;
use App\Modules\Coordinator\Models\BusinessInformation;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

/**
 * Context Packet Delivery Service
 * Implements Protocol Part 2: Context Packet Delivery
 */
class ContextPacketService
{
    /**
     * Get or generate context packet for organization/agent
     * Implements Protocol Part 2.3
     */
    public function getContextPacket(
        string $organizationId,
        ?string $agentId = null,
        ?string $cachedVersion = null
    ): array {
        $organization = Organization::findOrFail($organizationId);

        // Check if cached version is still valid
        if ($cachedVersion) {
            $cachedPacket = ContextPacket::where('packet_id', $cachedVersion)
                ->where('organization_id', $organizationId)
                ->where('agent_id', $agentId)
                ->valid()
                ->first();

            if ($cachedPacket && !$cachedPacket->needsRefresh()) {
                return [
                    'packet' => $cachedPacket->getFullPacket(),
                    'cache_control' => [
                        'ttl_seconds' => $cachedPacket->ttl_seconds,
                        'refresh_after_seconds' => $cachedPacket->refresh_after_seconds,
                        'invalidation_events' => $cachedPacket->invalidation_events,
                    ],
                ];
            }
        }

        // Generate new context packet
        $packet = $this->generateContextPacket($organization, $agentId);

        return [
            'packet' => $packet->getFullPacket(),
            'cache_control' => [
                'ttl_seconds' => $packet->ttl_seconds,
                'refresh_after_seconds' => $packet->refresh_after_seconds,
                'invalidation_events' => $packet->invalidation_events,
            ],
        ];
    }

    /**
     * Generate context packet
     * Implements Protocol Part 2.2
     */
    private function generateContextPacket(Organization $organization, ?string $agentId = null): ContextPacket
    {
        $agent = $agentId ? AiAgent::find($agentId) : null;

        // Generate packet ID
        $packetId = 'ctx-' . now()->format('Y-m-d') . '-' . $organization->slug . '-' . Str::random(8);

        // Build context packet
        $platformKnowledge = $this->getPlatformKnowledge();
        $industryKnowledge = $this->getIndustryKnowledge($organization->industry);
        $businessProfile = $this->getBusinessProfile($organization);
        $businessFaqs = $this->getBusinessFaqs($organization);
        $team = $this->getTeamSummary($organization);
        $calendarSummary = $this->getCalendarSummary($organization);
        $rules = $this->getRules($organization);

        // Calculate checksum
        $packetData = json_encode([
            $platformKnowledge,
            $industryKnowledge,
            $businessProfile,
            $businessFaqs,
        ]);
        $checksum = 'sha256:' . hash('sha256', $packetData);

        // Create packet
        $packet = ContextPacket::create([
            'organization_id' => $organization->id,
            'agent_id' => $agent?->id,
            'packet_id' => $packetId,
            'version' => '1.0',
            'checksum' => $checksum,
            'platform_knowledge' => $platformKnowledge,
            'industry_id' => $organization->industry,
            'industry_knowledge' => $industryKnowledge,
            'business_profile' => $businessProfile,
            'business_faqs' => $businessFaqs,
            'team' => $team,
            'calendar_summary' => $calendarSummary,
            'rules' => $rules,
            'ttl_seconds' => 14400, // 4 hours
            'refresh_after_seconds' => 3600, // 1 hour
            'invalidation_events' => [
                'business_profile_updated',
                'faq_updated',
                'calendar_changed',
            ],
            'generated_at' => now(),
            'expires_at' => now()->addHours(4),
            'is_active' => true,
        ]);

        return $packet;
    }

    /**
     * Get Tier 1: Platform Knowledge (same for all businesses)
     */
    private function getPlatformKnowledge(): array
    {
        return [
            'capabilities' => [
                'I can answer questions about the business',
                'I can schedule appointments',
                'I can take messages',
                'I can transfer to a human',
            ],
            'limitations' => [
                'I cannot process payments',
                'I cannot access medical records',
                'I cannot provide legal advice',
                'I cannot share employee personal information',
            ],
            'escalation_phrases' => [
                'Let me connect you with a team member',
                "I'll have someone call you back",
                "That's a great question for [owner name]",
            ],
            'personality_guidelines' => [
                'tone' => 'friendly, professional, helpful',
                'formality' => 'conversational but respectful',
            ],
        ];
    }

    /**
     * Get Tier 2: Industry Knowledge (same for all businesses in industry)
     */
    private function getIndustryKnowledge(string $industry): array
    {
        // Industry-specific knowledge base
        $industryData = [
            'dental' => [
                'terminology' => ['patient' => 'patient', 'appointment' => 'appointment', 'cleaning' => 'cleaning', 'examination' => 'examination'],
                'common_services' => ['Cleaning', 'Examination', 'X-Ray', 'Filling', 'Crown', 'Root Canal'],
                'compliance_notes' => ['HIPAA compliance required', 'Patient privacy is critical'],
                'prohibited_advice' => ['Medical diagnosis', 'Prescription recommendations'],
            ],
            'plumbing' => [
                'terminology' => ['customer' => 'customer', 'service call' => 'service call', 'estimate' => 'estimate'],
                'common_services' => ['Emergency Repair', 'Installation', 'Maintenance', 'Drain Cleaning'],
                'compliance_notes' => ['Licensed plumber required for certain work'],
                'prohibited_advice' => ['DIY instructions for complex repairs'],
            ],
            'restaurant' => [
                'terminology' => ['guest' => 'guest', 'reservation' => 'reservation', 'table' => 'table'],
                'common_services' => ['Dine-in', 'Takeout', 'Delivery', 'Catering', 'Private Events'],
                'compliance_notes' => ['Food safety regulations', 'Allergy information available'],
                'prohibited_advice' => ['Nutritional claims without verification'],
            ],
            'legal' => [
                'terminology' => ['client' => 'client', 'consultation' => 'consultation', 'case' => 'case'],
                'common_services' => ['Consultation', 'Document Review', 'Representation'],
                'compliance_notes' => ['Attorney-client privilege', 'Confidentiality required'],
                'prohibited_advice' => ['Legal advice', 'Case outcome predictions'],
            ],
        ];

        $data = $industryData[$industry] ?? [
            'terminology' => ['customer' => 'customer', 'appointment' => 'appointment', 'service' => 'service'],
            'common_services' => [],
            'compliance_notes' => [],
            'prohibited_advice' => [],
        ];

        return [
            'industry_id' => $industry,
            'industry_name' => ucfirst($industry),
            'terminology' => $data['terminology'],
            'common_services' => $data['common_services'],
            'industry_faqs' => $this->getIndustryFaqs($industry),
            'compliance_notes' => $data['compliance_notes'],
            'prohibited_advice' => $data['prohibited_advice'],
        ];
    }

    /**
     * Get industry-specific FAQs
     */
    private function getIndustryFaqs(string $industry): array
    {
        // Would come from a shared industry knowledge base
        return [];
    }

    /**
     * Get Tier 3: Business Profile
     */
    private function getBusinessProfile(Organization $organization): array
    {
        return [
            'identity' => [
                'name' => $organization->name,
                'legal_name' => $organization->name,
                'tagline' => $organization->settings['tagline'] ?? null,
                'owner_name' => $organization->owner->name ?? null,
            ],
            'contact' => [
                'phone' => $organization->phone,
                'email' => $organization->email,
                'website' => $organization->website,
                'address' => $organization->address,
            ],
            'hours' => [
                'regular' => $organization->business_hours ?? [],
                'emergency' => [
                    'available' => $organization->settings['emergency_available'] ?? false,
                    'hours' => $organization->settings['emergency_hours'] ?? null,
                ],
            ],
            'service_area' => [
                'primary' => $organization->settings['service_area_primary'] ?? [],
                'extended' => $organization->settings['service_area_extended'] ?? [],
            ],
            'services' => $this->getServices($organization),
            'payment' => [
                'accepted' => $organization->settings['payment_methods'] ?? [],
                'financing' => $organization->settings['financing_available'] ?? null,
                'policy' => $organization->settings['payment_policy'] ?? null,
            ],
            'unique_selling_points' => $organization->settings['selling_points'] ?? [],
        ];
    }

    /**
     * Get business services
     */
    private function getServices(Organization $organization): array
    {
        $appointmentTypes = AppointmentType::where('organization_id', $organization->id)
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->get();

        return $appointmentTypes->map(function ($type) {
            return [
                'id' => $type->id,
                'name' => $type->name,
                'description' => $type->description,
                'duration_minutes' => $type->duration_minutes,
                'price' => $type->price,
            ];
        })->toArray();
    }

    /**
     * Get business FAQs
     */
    private function getBusinessFaqs(Organization $organization): array
    {
        $faqs = DB::table('coord_faq_items')
            ->where('organization_id', $organization->id)
            ->where('is_active', true)
            ->orderBy('priority', 'desc')
            ->orderBy('sort_order')
            ->limit(50) // Limit to top 50 FAQs
            ->get();

        return $faqs->map(function ($faq) {
            return [
                'id' => $faq->id,
                'question' => $faq->question,
                'answer' => $faq->answer,
                'keywords' => json_decode($faq->keywords ?? '[]', true),
                'priority' => $faq->priority,
            ];
        })->toArray();
    }

    /**
     * Get team summary
     */
    private function getTeamSummary(Organization $organization): array
    {
        $members = $organization->members()
            ->with('user')
            ->get();

        return $members->map(function ($member) {
            return [
                'id' => $member->id,
                'name' => $member->user->name ?? 'Unknown',
                'role' => $member->role,
                'available_for_transfer' => in_array($member->role, ['owner', 'admin']),
            ];
        })->toArray();
    }

    /**
     * Get calendar summary
     */
    private function getCalendarSummary(Organization $organization): array
    {
        $appointmentTypes = AppointmentType::where('organization_id', $organization->id)
            ->where('is_active', true)
            ->get();

        $defaultDuration = $appointmentTypes->first()?->duration_minutes ?? 60;
        $businessHours = $organization->business_hours ?? [];

        // Calculate next available slot
        $nextAvailable = $this->calculateNextAvailable($organization, $businessHours);

        return [
            'next_available' => [
                'regular' => $nextAvailable,
                'emergency' => 'now',
            ],
            'typical_lead_time' => $this->calculateTypicalLeadTime($organization),
            'same_day_possible' => $this->isSameDayPossible($organization),
            'booking_increment' => $defaultDuration,
            'business_hours' => $businessHours,
        ];
    }

    /**
     * Calculate next available appointment slot
     */
    private function calculateNextAvailable(Organization $organization, array $businessHours): ?string
    {
        // Simplified calculation - would use actual availability logic
        $now = now();
        $hour = $now->hour;
        
        // Check if currently within business hours
        $dayOfWeek = strtolower($now->format('l'));
        $todayHours = $businessHours[$dayOfWeek] ?? null;
        
        if ($todayHours && isset($todayHours['open']) && $todayHours['open']) {
            $endHour = (int) explode(':', $todayHours['end'] ?? '17:00')[0];
            if ($hour < $endHour) {
                return $now->addHours(1)->toIso8601String();
            }
        }

        // Next business day
        $nextDay = $now->copy()->addDay();
        while ($nextDay->dayOfWeek === 0 || $nextDay->dayOfWeek === 6) {
            $nextDay->addDay();
        }
        
        $nextDayName = strtolower($nextDay->format('l'));
        $nextDayHours = $businessHours[$nextDayName] ?? null;
        
        if ($nextDayHours && isset($nextDayHours['open']) && $nextDayHours['open']) {
            $startTime = $nextDayHours['start'] ?? '09:00';
            return $nextDay->setTimeFromTimeString($startTime)->toIso8601String();
        }

        return null;
    }

    /**
     * Calculate typical lead time
     */
    private function calculateTypicalLeadTime(Organization $organization): string
    {
        // Would calculate based on appointment density
        return '1-2 business days';
    }

    /**
     * Check if same-day appointments are possible
     */
    private function isSameDayPossible(Organization $organization): bool
    {
        $businessHours = $organization->business_hours ?? [];
        $today = strtolower(now()->format('l'));
        $todayHours = $businessHours[$today] ?? null;
        
        if (!$todayHours || !($todayHours['open'] ?? false)) {
            return false;
        }

        $endTime = $todayHours['end'] ?? '17:00';
        $endHour = (int) explode(':', $endTime)[0];
        
        return now()->hour < ($endHour - 2); // At least 2 hours before close
    }

    /**
     * Get rules and boundaries
     */
    private function getRules(Organization $organization): array
    {
        return [
            'prohibited_topics' => [
                'Employee personal information',
                'Other customers\' information',
                'Detailed financial information',
                'Complaints about other businesses',
                'Political opinions',
                'Legal advice',
                'Medical advice',
                'Discriminatory content',
            ],
            'escalation_triggers' => [
                'Customer is angry or upset',
                'Customer mentions lawyer or legal action',
                'Customer requests refund or disputes charge',
                'Question about employee misconduct',
                'Safety emergency',
                'Customer seems confused or vulnerable',
                'Complex technical question beyond FAQs',
            ],
            'privacy_rules' => [
                'Never confirm if someone is a customer unless they identify themselves',
                'Never share customer information with third parties',
                'Never read back full address or phone number unprompted',
                'Always verify identity before sharing appointment details',
            ],
            'unknown_handling' => [
                'acknowledge' => "That's a great question. Let me make sure you get the right answer.",
                'offer_callback' => "I can have someone from our team call you back with that information.",
                'create_ticket' => true,
                'suggest_faq' => true,
            ],
        ];
    }

    /**
     * Invalidate context packet cache
     * Implements Protocol Part 2.4
     */
    public function invalidateCache(
        string $organizationId,
        string $eventType,
        array $sectionsAffected = [],
        string $urgency = 'next_refresh'
    ): void {
        // Create invalidation record
        $invalidation = ContextInvalidation::create([
            'organization_id' => $organizationId,
            'event_type' => $eventType,
            'sections_affected' => $sectionsAffected,
            'urgency' => $urgency,
            'delivery_method' => 'websocket_push',
            'delivered' => false,
        ]);

        // Mark packets as inactive based on urgency
        if ($urgency === 'immediate') {
            // Immediately invalidate all active packets
            ContextPacket::where('organization_id', $organizationId)
                ->where('is_active', true)
                ->update(['is_active' => false]);
        } else {
            // Mark for refresh on next request
            ContextPacket::where('organization_id', $organizationId)
                ->where('is_active', true)
                ->whereHas('invalidations', function ($query) use ($invalidation) {
                    $query->where('id', $invalidation->id);
                })
                ->update(['is_active' => false]);
        }

        // Would send websocket notification to connected agents
        // broadcast(new ContextInvalidated($organizationId, $eventType, $sectionsAffected));
    }

    /**
     * Check if context needs refresh based on invalidation events
     */
    public function needsRefresh(ContextPacket $packet): bool
    {
        if ($packet->needsRefresh()) {
            return true;
        }

        // Check for invalidation events
        $invalidations = ContextInvalidation::where('organization_id', $packet->organization_id)
            ->where('delivered', false)
            ->where('created_at', '>', $packet->generated_at)
            ->get();

        return $invalidations->isNotEmpty();
    }
}

