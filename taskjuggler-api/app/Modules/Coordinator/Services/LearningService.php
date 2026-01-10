<?php

namespace App\Modules\Coordinator\Services;

use App\Modules\Coordinator\Models\AiInteraction;
use App\Modules\Coordinator\Models\FaqSuggestion;
use App\Modules\Coordinator\Models\BusinessExperience;
use App\Modules\Coordinator\Models\Organization;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

/**
 * Learning & Experience Capture Service
 * Implements Protocol Part 4: Learning & Experience Capture
 */
class LearningService
{
    /**
     * Analyze interactions for learning
     * Implements Protocol Part 4.2
     */
    public function analyzeInteractions(string $organizationId, Carbon $fromDate, Carbon $toDate): void
    {
        $interactions = AiInteraction::where('organization_id', $organizationId)
            ->where('started_at', '>=', $fromDate)
            ->where('started_at', '<=', $toDate)
            ->where('analyzed_for_learning', false)
            ->get();

        // Group unknown questions
        $unknownQuestions = [];
        foreach ($interactions as $interaction) {
            if ($interaction->unknown_questions) {
                foreach ($interaction->unknown_questions as $question) {
                    $questionText = $question['question'] ?? '';
                    if ($questionText) {
                        if (!isset($unknownQuestions[$questionText])) {
                            $unknownQuestions[$questionText] = [
                                'question' => $questionText,
                                'frequency' => 0,
                                'first_asked_at' => $interaction->started_at,
                                'last_asked_at' => $interaction->started_at,
                                'contexts' => [],
                            ];
                        }
                        $unknownQuestions[$questionText]['frequency']++;
                        if ($interaction->started_at->gt($unknownQuestions[$questionText]['last_asked_at'])) {
                            $unknownQuestions[$questionText]['last_asked_at'] = $interaction->started_at;
                        }
                        $unknownQuestions[$questionText]['contexts'][] = $question['context'] ?? null;
                    }
                }
            }
        }

        // Create FAQ suggestions
        foreach ($unknownQuestions as $questionData) {
            if ($questionData['frequency'] >= 2) {
                $this->createFaqSuggestion($organizationId, $questionData);
            }
        }

        // Mark interactions as analyzed
        AiInteraction::whereIn('id', $interactions->pluck('id'))
            ->update(['analyzed_for_learning' => true, 'analyzed_at' => now()]);

        // Update business experience
        $this->updateBusinessExperience($organizationId, $fromDate, $toDate);
    }

    /**
     * Create FAQ suggestion with improved logic
     */
    private function createFaqSuggestion(string $organizationId, array $questionData): void
    {
        // Check for similar questions (fuzzy matching)
        $similar = FaqSuggestion::where('organization_id', $organizationId)
            ->whereIn('status', ['pending_review', 'approved'])
            ->get()
            ->filter(function ($suggestion) use ($questionData) {
                $similarity = $this->calculateSimilarity($suggestion->question, $questionData['question']);
                return $similarity > 0.7; // 70% similarity threshold
            })
            ->first();

        if ($similar) {
            // Update frequency and merge contexts
            $similar->update([
                'frequency' => $similar->frequency + $questionData['frequency'],
                'last_asked_at' => max($similar->last_asked_at, $questionData['last_asked_at']),
                'context' => array_merge(
                    $similar->context['conversations'] ?? [],
                    $questionData['contexts']
                ),
            ]);
            return;
        }

        // Check exact match
        $existing = FaqSuggestion::where('organization_id', $organizationId)
            ->where('question', $questionData['question'])
            ->whereIn('status', ['pending_review', 'approved'])
            ->first();

        if ($existing) {
            $existing->update([
                'frequency' => $existing->frequency + $questionData['frequency'],
                'last_asked_at' => $questionData['last_asked_at'],
            ]);
            return;
        }

        // Determine priority based on frequency and recency
        $priority = $this->calculatePriority($questionData);

        // Generate proposed answer from context if available
        $proposedAnswer = $this->generateProposedAnswer($questionData);

        FaqSuggestion::create([
            'organization_id' => $organizationId,
            'question' => $questionData['question'],
            'proposed_answer' => $proposedAnswer,
            'context' => [
                'conversations' => $questionData['contexts'],
                'frequency' => $questionData['frequency'],
            ],
            'frequency' => $questionData['frequency'],
            'priority' => $priority,
            'first_asked_at' => $questionData['first_asked_at'],
            'last_asked_at' => $questionData['last_asked_at'],
            'status' => 'pending_review',
        ]);
    }

    /**
     * Calculate similarity between two questions
     */
    private function calculateSimilarity(string $question1, string $question2): float
    {
        // Simple word-based similarity
        $words1 = array_map('strtolower', str_word_count($question1, 1));
        $words2 = array_map('strtolower', str_word_count($question2, 1));
        
        $intersection = count(array_intersect($words1, $words2));
        $union = count(array_unique(array_merge($words1, $words2)));
        
        return $union > 0 ? $intersection / $union : 0;
    }

    /**
     * Calculate priority for FAQ suggestion
     */
    private function calculatePriority(array $questionData): string
    {
        $frequency = $questionData['frequency'];
        $daysSinceFirst = Carbon::parse($questionData['first_asked_at'])->diffInDays(now());
        
        // High priority: frequent questions or recent spike
        if ($frequency >= 5 || ($frequency >= 3 && $daysSinceFirst <= 7)) {
            return 'high';
        }
        
        // Medium priority: moderate frequency
        if ($frequency >= 2) {
            return 'medium';
        }
        
        return 'low';
    }

    /**
     * Generate proposed answer from context
     */
    private function generateProposedAnswer(array $questionData): ?string
    {
        // Extract answer patterns from contexts
        $contexts = $questionData['contexts'] ?? [];
        
        if (empty($contexts)) {
            return null;
        }

        // Look for common answer patterns in contexts
        // This would ideally use AI to generate, but for now return null
        // The business owner can fill it in during review
        
        return null;
    }

    /**
     * Update business experience data
     * Implements Protocol Part 4.3
     */
    private function updateBusinessExperience(string $organizationId, Carbon $fromDate, Carbon $toDate): void
    {
        $interactions = AiInteraction::where('organization_id', $organizationId)
            ->where('started_at', '>=', $fromDate)
            ->where('started_at', '<=', $toDate)
            ->get();

        // Calculate patterns
        $customerPatterns = $this->calculateCustomerPatterns($interactions);
        $conversationPatterns = $this->calculateConversationPatterns($interactions);
        $faqEffectiveness = $this->calculateFaqEffectiveness($interactions);

        BusinessExperience::updateOrCreate(
            [
                'organization_id' => $organizationId,
                'period_start' => $fromDate->toDateString(),
                'period_end' => $toDate->toDateString(),
            ],
            [
                'customer_patterns' => $customerPatterns,
                'conversation_patterns' => $conversationPatterns,
                'faq_effectiveness' => $faqEffectiveness,
                'interaction_count' => $interactions->count(),
                'last_analyzed_at' => now(),
            ]
        );
    }

    /**
     * Calculate customer patterns
     */
    private function calculateCustomerPatterns($interactions): array
    {
        // Analyze busy times
        $hourlyDistribution = [];
        foreach ($interactions as $interaction) {
            $hour = Carbon::parse($interaction->started_at)->hour;
            $hourlyDistribution[$hour] = ($hourlyDistribution[$hour] ?? 0) + 1;
        }
        arsort($hourlyDistribution);
        $busyHours = array_slice(array_keys($hourlyDistribution), 0, 3);

        // Analyze common services requested
        $serviceRequests = [];
        foreach ($interactions as $interaction) {
            if ($interaction->extracted_data && isset($interaction->extracted_data['service'])) {
                $service = $interaction->extracted_data['service'];
                $serviceRequests[$service] = ($serviceRequests[$service] ?? 0) + 1;
            }
        }
        arsort($serviceRequests);
        $commonServices = array_slice(array_keys($serviceRequests), 0, 5);

        // Analyze day of week patterns
        $dayDistribution = [];
        foreach ($interactions as $interaction) {
            $day = Carbon::parse($interaction->started_at)->dayOfWeek;
            $dayDistribution[$day] = ($dayDistribution[$day] ?? 0) + 1;
        }

        return [
            'busy_times' => $busyHours,
            'common_services_requested' => $commonServices,
            'day_of_week_distribution' => $dayDistribution,
            'peak_hours' => $busyHours,
        ];
    }

    /**
     * Calculate conversation patterns
     */
    private function calculateConversationPatterns($interactions): array
    {
        $totalDuration = $interactions->sum('duration_seconds');
        $count = $interactions->count();
        $avgDuration = $count > 0 ? round($totalDuration / $count) : 0;

        // Calculate booking conversion rate
        $bookings = $interactions->filter(function ($interaction) {
            return in_array($interaction->outcome ?? '', ['Appointment Booked', 'Appointment Scheduled']);
        })->count();
        $bookingRate = $count > 0 ? round(($bookings / $count) * 100, 2) : 0;

        // Extract common objections from transcripts
        $objections = [];
        foreach ($interactions as $interaction) {
            if ($interaction->transcript) {
                // Look for objection patterns (would use NLP in production)
                if (stripos($interaction->transcript, 'too expensive') !== false) {
                    $objections['price'] = ($objections['price'] ?? 0) + 1;
                }
                if (stripos($interaction->transcript, 'not interested') !== false) {
                    $objections['not_interested'] = ($objections['not_interested'] ?? 0) + 1;
                }
                if (stripos($interaction->transcript, 'think about it') !== false) {
                    $objections['needs_time'] = ($objections['needs_time'] ?? 0) + 1;
                }
            }
        }

        // Track successful responses (led to booking)
        $successfulResponses = [];
        foreach ($interactions as $interaction) {
            if (in_array($interaction->outcome ?? '', ['Appointment Booked', 'Appointment Scheduled'])) {
                // Extract key phrases from successful interactions
                if ($interaction->transcript) {
                    // Would use NLP to extract successful response patterns
                }
            }
        }

        return [
            'average_call_duration' => $avgDuration,
            'booking_conversion_rate' => $bookingRate,
            'common_objections' => $objections,
            'successful_responses' => $successfulResponses,
            'total_interactions' => $count,
            'successful_bookings' => $bookings,
        ];
    }

    /**
     * Calculate FAQ effectiveness
     */
    private function calculateFaqEffectiveness($interactions): array
    {
        // Get FAQ items for organization
        $faqItems = DB::table('coord_faq_items')
            ->where('organization_id', $interactions->first()->organization_id ?? null)
            ->where('is_active', true)
            ->get();

        $faqUsage = [];
        foreach ($interactions as $interaction) {
            if ($interaction->faqs_used) {
                foreach ($interaction->faqs_used as $faqId) {
                    $faqUsage[$faqId] = ($faqUsage[$faqId] ?? 0) + 1;
                }
            }
        }

        arsort($faqUsage);
        $mostUsed = array_slice(array_keys($faqUsage), 0, 5);

        // Identify FAQs that need improvement (high frequency but low success rate)
        $needsImprovement = [];
        foreach ($faqItems as $faq) {
            $usageCount = $faqUsage[$faq->id] ?? 0;
            if ($usageCount > 0) {
                // Check if FAQ led to successful outcomes
                $successfulUses = $interactions->filter(function ($interaction) use ($faq) {
                    return in_array($faq->id, $interaction->faqs_used ?? []) &&
                           in_array($interaction->outcome ?? '', ['Appointment Booked', 'Appointment Scheduled']);
                })->count();
                
                $successRate = $usageCount > 0 ? ($successfulUses / $usageCount) * 100 : 0;
                
                if ($usageCount >= 3 && $successRate < 30) {
                    $needsImprovement[] = [
                        'faq_id' => $faq->id,
                        'question' => $faq->question,
                        'usage_count' => $usageCount,
                        'success_rate' => round($successRate, 2),
                    ];
                }
            }
        }

        return [
            'most_used' => $mostUsed,
            'needs_improvement' => $needsImprovement,
            'total_faqs' => $faqItems->count(),
            'active_faqs' => count($faqUsage),
        ];
    }

    /**
     * Process feedback from interactions
     */
    public function processFeedback(string $organizationId, array $feedback): void
    {
        // Update FAQ effectiveness based on user feedback
        if (isset($feedback['faq_id']) && isset($feedback['helpful'])) {
            $faqId = $feedback['faq_id'];
            $helpful = $feedback['helpful'];
            
            // Update FAQ item use count
            DB::table('coord_faq_items')
                ->where('id', $faqId)
                ->increment('use_count');
            
            // Would store feedback in a feedback table for analysis
        }
    }

    /**
     * Log interaction for learning
     */
    public function logInteraction(array $data): AiInteraction
    {
        return AiInteraction::create($data);
    }
}

