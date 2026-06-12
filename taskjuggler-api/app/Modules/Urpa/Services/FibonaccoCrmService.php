<?php

declare(strict_types=1);

namespace App\Modules\Urpa\Services;

use App\Modules\Urpa\Models\UrpaVoiceResponse;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

/**
 * Read access to Fibonacco business data on the Multisite publishing platform.
 *
 * Uses the Multisite inbound bridge (Bearer PUBLISHING_BRIDGE_API_KEY,
 * routes/api/v1/bridge-inbound.php on the Multisite side). The bridge
 * currently exposes bulk exports and audience/ROI reads; per-business FAQ
 * and poll endpoints do not exist yet (see getFAQs / getActivePolls).
 */
class FibonaccoCrmService
{
    private ?string $baseUrl;

    private ?string $bridgeKey;

    public function __construct()
    {
        $this->baseUrl = config('services.publishing.base_url');
        $this->bridgeKey = config('services.publishing.bridge_key');
    }

    public function isConfigured(): bool
    {
        return ! empty($this->baseUrl) && ! empty($this->bridgeKey);
    }

    /**
     * Get a business profile from the publishing platform.
     *
     * The bridge has no single-business endpoint yet, so this searches the
     * paginated /bridge/export/businesses feed and caches the hit.
     */
    public function getBusinessProfile(string $businessId): array
    {
        if (! $this->isConfigured()) {
            Log::warning('FibonaccoCrmService not configured (services.publishing)', [
                'business_id' => $businessId,
            ]);

            return [];
        }

        return Cache::remember(
            "fibonacco_business_profile:{$businessId}",
            now()->addHour(),
            fn () => $this->findBusinessInExport($businessId)
        );
    }

    /**
     * Get FAQs for a business.
     *
     * NOT YET AVAILABLE: the Multisite bridge does not expose business FAQs
     * (they exist only behind alphasite web routes). Coordinate with the
     * publishing platform to add GET /bridge/business/{id}/faqs.
     */
    public function getFAQs(string $businessId): array
    {
        Log::info('Fibonacco FAQs requested but no bridge endpoint exists yet', [
            'business_id' => $businessId,
        ]);

        return [];
    }

    /**
     * Sync FAQs to voice responses
     */
    public function syncFAQsToVoice(string $businessId): array
    {
        $faqs = $this->getFAQs($businessId);
        $synced = 0;

        foreach ($faqs as $faq) {
            UrpaVoiceResponse::updateOrCreate(
                [
                    'category' => 'faq',
                    'intent' => 'faq_'.($faq['id'] ?? uniqid()),
                ],
                [
                    'text_content' => $faq['answer'] ?? '',
                    'trigger_phrases' => $faq['questions'] ?? [],
                    'context_requirements' => [
                        'business_id' => $businessId,
                    ],
                    'is_active' => true,
                ]
            );
            $synced++;
        }

        return ['synced' => $synced];
    }

    /**
     * Get active polls for a business.
     *
     * NOT YET AVAILABLE: the Multisite bridge does not expose polls.
     * Coordinate with the publishing platform to add a bridge endpoint.
     */
    public function getActivePolls(string $businessId): array
    {
        Log::info('Fibonacco polls requested but no bridge endpoint exists yet', [
            'business_id' => $businessId,
        ]);

        return [];
    }

    /**
     * Get business data (hours, contact info, etc.)
     */
    public function getBusinessData(string $businessId): array
    {
        $profile = $this->getBusinessProfile($businessId);

        return [
            'name' => $profile['name'] ?? '',
            'phone' => $profile['phone'] ?? '',
            'email' => $profile['email'] ?? '',
            'hours' => $profile['hours'] ?? [],
            'industry' => $profile['industry'] ?? '',
        ];
    }

    /**
     * Page through GET /bridge/export/businesses looking for one id.
     */
    private function findBusinessInExport(string $businessId): array
    {
        $page = 1;
        $maxPages = 50; // safety cap (200 rows/page on the Multisite side)

        do {
            $response = Http::withToken($this->bridgeKey)
                ->acceptJson()
                ->timeout(15)
                ->get("{$this->baseUrl}/bridge/export/businesses", ['page' => $page]);

            if ($response->failed()) {
                Log::error('Fibonacco bridge businesses export failed', [
                    'status' => $response->status(),
                    'page' => $page,
                ]);

                return [];
            }

            $payload = $response->json();

            foreach ($payload['data'] ?? [] as $business) {
                $business = (array) $business;
                if (($business['id'] ?? null) === $businessId) {
                    return $business;
                }
            }

            $lastPage = (int) ($payload['meta']['last_page'] ?? $page);
            $page++;
        } while ($page <= $lastPage && $page <= $maxPages);

        Log::info('Fibonacco business not found in bridge export', [
            'business_id' => $businessId,
        ]);

        return [];
    }
}
