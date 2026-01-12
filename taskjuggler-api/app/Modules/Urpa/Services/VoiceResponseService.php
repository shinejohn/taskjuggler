<?php

namespace App\Modules\Urpa\Services;

use App\Modules\Urpa\Models\UrpaVoiceResponse;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Log;

class VoiceResponseService
{
    /**
     * Select response with confidence scoring
     */
    public function selectResponseWithConfidence(array $context): array
    {
        $response = $this->selectResponse($context);
        
        if (!$response) {
            return [
                'response' => null,
                'confidence' => 0,
                'should_use_tts' => true,
            ];
        }
        
        $confidence = $this->calculateConfidence($response, $context);
        
        return [
            'response' => $response,
            'confidence' => $confidence,
            'should_use_tts' => $confidence < 0.7, // Use TTS if confidence < 70%
        ];
    }
    /**
     * Select the best pre-recorded response for given context
     * Implements the selection algorithm from URPA_CROSS_SELL_VOICE_STRATEGY.md
     * Enhanced with fuzzy matching and improved fallback chain
     */
    public function selectResponse(array $context): ?UrpaVoiceResponse
    {
        $userInput = strtolower($context['userInput'] ?? '');
        $detectedIntent = $context['detectedIntent'] ?? null;
        $businessId = $context['businessId'] ?? null;
        $industry = $context['industry'] ?? null;
        $timeOfDay = $context['timeOfDay'] ?? $this->getTimeOfDay();
        $callState = $context['callState'] ?? 'conversation';
        $previousResponses = $context['previousResponses'] ?? [];

        // Step 1: Try exact intent match (highest priority)
        if ($detectedIntent) {
            $exactMatch = UrpaVoiceResponse::active()
                ->byIntent($detectedIntent)
                ->first();

            if ($exactMatch && $this->matchesContext($exactMatch, $context)) {
                return $exactMatch;
            }
        }

        // Step 2: Filter by context requirements
        $query = UrpaVoiceResponse::active();

        // Filter by category based on call state
        $category = $this->getCategoryFromCallState($callState);
        if ($category) {
            $query->byCategory($category);
        }

        // Step 3: Filter by trigger phrases (exact match)
        $candidates = $query->get()->filter(function ($response) use ($userInput) {
            return $response->matchesTrigger($userInput);
        });

        // Step 4: If no exact trigger match, try fuzzy matching
        if ($candidates->isEmpty() && !empty($userInput)) {
            $candidates = $this->fuzzyMatch($query->get(), $userInput);
        }

        // Step 5: Fallback to category-based selection
        if ($candidates->isEmpty()) {
            $candidates = UrpaVoiceResponse::active()
                ->byCategory($category ?? 'greeting')
                ->get();
        }

        // Step 6: Avoid recently used responses
        if (!empty($previousResponses)) {
            $candidates = $candidates->reject(function ($response) use ($previousResponses) {
                return in_array($response->id, $previousResponses);
            });
        }

        // Step 7: Prefer business-specific over universal
        // (This would require a business_id field on responses - for now, use universal)
        
        // Step 8: Select by variation weight (usage count - prefer less used for variety)
        $selected = $candidates->sortBy('usage_count')->first();

        return $selected;
    }

    /**
     * Fuzzy match responses based on user input
     */
    private function fuzzyMatch(Collection $responses, string $userInput): Collection
    {
        $words = explode(' ', $userInput);
        $minWordLength = 3;
        $filteredWords = array_filter($words, fn($w) => strlen($w) >= $minWordLength);
        
        if (empty($filteredWords)) {
            return collect([]);
        }
        
        return $responses->filter(function ($response) use ($filteredWords) {
            $textContent = strtolower($response->text_content ?? '');
            $triggerPhrases = array_map('strtolower', $response->trigger_phrases ?? []);
            
            // Check if any word appears in text content or trigger phrases
            foreach ($filteredWords as $word) {
                if (str_contains($textContent, $word)) {
                    return true;
                }
                foreach ($triggerPhrases as $phrase) {
                    if (str_contains($phrase, $word)) {
                        return true;
                    }
                }
            }
            
            return false;
        });
    }

    /**
     * Calculate confidence score for a response match
     */
    private function calculateConfidence(UrpaVoiceResponse $response, array $context): float
    {
        $confidence = 0.5; // Base confidence
        
        $userInput = strtolower($context['userInput'] ?? '');
        $detectedIntent = $context['detectedIntent'] ?? null;
        
        // Intent match adds 0.3
        if ($detectedIntent && $response->intent === $detectedIntent) {
            $confidence += 0.3;
        }
        
        // Trigger phrase match adds 0.2
        if ($response->matchesTrigger($userInput)) {
            $confidence += 0.2;
        }
        
        // Context match adds 0.1
        if ($this->matchesContext($response, $context)) {
            $confidence += 0.1;
        }
        
        // Lower usage count adds 0.1 (prefer variety)
        if ($response->usage_count < 10) {
            $confidence += 0.1;
        }
        
        return min(1.0, $confidence);
    }

    /**
     * Get time of day
     */
    private function getTimeOfDay(): string
    {
        $hour = (int) now()->format('H');
        
        if ($hour >= 5 && $hour < 12) {
            return 'morning';
        } elseif ($hour >= 12 && $hour < 17) {
            return 'afternoon';
        } elseif ($hour >= 17 && $hour < 21) {
            return 'evening';
        } else {
            return 'night';
        }
    }

    /**
     * Check if response matches context requirements
     */
    private function matchesContext(UrpaVoiceResponse $response, array $context): bool
    {
        $requirements = $response->context_requirements ?? [];

        if (empty($requirements)) {
            return true; // No requirements = universal
        }

        // Check time of day requirement
        if (isset($requirements['time_of_day']) && !empty($context['timeOfDay'])) {
            if ($requirements['time_of_day'] !== $context['timeOfDay']) {
                return false;
            }
        }

        // Check call state requirement
        if (isset($requirements['call_state']) && !empty($context['callState'])) {
            if ($requirements['call_state'] !== $context['callState']) {
                return false;
            }
        }

        return true;
    }

    /**
     * Get category from call state
     */
    private function getCategoryFromCallState(string $callState): ?string
    {
        return match($callState) {
            'greeting' => 'greeting',
            'closing' => 'goodbye',
            'conversation' => null, // Can be any category
            default => null,
        };
    }

    /**
     * Personalize response text with context data
     */
    public function personalizeResponse(UrpaVoiceResponse $response, array $context): string
    {
        $personalizationData = [
            'name' => $context['callerName'] ?? 'there',
            'business' => $context['businessName'] ?? '',
            'time' => $this->getTimeGreeting($context['timeOfDay'] ?? null),
        ];

        return $response->personalize($personalizationData);
    }

    /**
     * Get time-based greeting
     */
    private function getTimeGreeting(?string $timeOfDay): string
    {
        return match($timeOfDay) {
            'morning' => 'morning',
            'afternoon' => 'afternoon',
            'evening' => 'evening',
            default => 'day',
        };
    }

    /**
     * Get available responses for a scenario
     */
    public function getAvailableResponses(string $scenario): array
    {
        $category = match($scenario) {
            'phone_call' => null, // All categories
            'greeting' => 'greeting',
            'closing' => 'goodbye',
            default => null,
        };
        
        $query = UrpaVoiceResponse::active();
        if ($category) {
            $query->byCategory($category);
        }
        
        return $query->get()
            ->map(fn($response) => [
                'id' => $response->id,
                'category' => $response->category,
                'intent' => $response->intent,
                'text_content' => $response->text_content,
                'audio_url' => $response->audio_url,
            ])
            ->toArray();
    }
}

