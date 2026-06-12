<?php

declare(strict_types=1);

namespace App\Modules\Urpa\Services;

use Illuminate\Support\Facades\Log;

/**
 * Outbound content-request workflow toward the Multisite publishing platform.
 *
 * STATUS: the Multisite side exposes no server-to-server publishing-workflow
 * API yet (posts/news-articles routes require Sanctum user tokens, and the
 * bridge is read-only exports/audience). Until that contract exists, these
 * methods return inert placeholders and log a warning. Do not treat their
 * output as persisted. Coordinate with the publishing platform before
 * wiring any UI to this service.
 */
class FibonaccoPublishingService
{
    private ?string $baseUrl;

    public function __construct()
    {
        $this->baseUrl = config('services.publishing.base_url');
    }

    /**
     * Get publishing team. PENDING Multisite server-to-server contract.
     */
    public function getTeam(string $teamId): array
    {
        Log::warning('FibonaccoPublishingService::getTeam called but no Multisite API exists yet', [
            'team_id' => $teamId,
        ]);

        return [
            'id' => $teamId,
            'name' => null,
            'members' => [],
            'pending_integration' => true,
        ];
    }

    /**
     * Create content request. PENDING Multisite server-to-server contract.
     */
    public function createContentRequest(string $teamId, array $data): array
    {
        Log::warning('FibonaccoPublishingService::createContentRequest called but no Multisite API exists yet — request NOT persisted', [
            'team_id' => $teamId,
            'type' => $data['type'] ?? null,
        ]);

        return [
            'id' => null,
            'team_id' => $teamId,
            'type' => $data['type'] ?? null,
            'topic' => $data['topic'] ?? null,
            'status' => 'unavailable',
            'pending_integration' => true,
        ];
    }

    /**
     * Get content projects. PENDING Multisite server-to-server contract.
     */
    public function getProjects(string $teamId, ?string $status = null): array
    {
        Log::warning('FibonaccoPublishingService::getProjects called but no Multisite API exists yet', [
            'team_id' => $teamId,
            'status' => $status,
        ]);

        return [];
    }

    /**
     * Parse natural language request into structured content request
     */
    public function parseContentRequest(string $naturalLanguage): array
    {
        return [
            'type' => $this->detectContentType($naturalLanguage),
            'topic' => $naturalLanguage,
            'tone' => 'professional',
            'target_audience' => 'general',
        ];
    }

    /**
     * Detect content type from natural language
     */
    private function detectContentType(string $text): string
    {
        $textLower = strtolower($text);

        if (str_contains($textLower, 'blog') || str_contains($textLower, 'article')) {
            return 'blog';
        }

        if (str_contains($textLower, 'social') || str_contains($textLower, 'post')) {
            return 'social';
        }

        if (str_contains($textLower, 'email') || str_contains($textLower, 'newsletter')) {
            return 'email';
        }

        if (str_contains($textLower, 'ad') || str_contains($textLower, 'advertisement')) {
            return 'ad';
        }

        return 'blog'; // Default
    }
}
