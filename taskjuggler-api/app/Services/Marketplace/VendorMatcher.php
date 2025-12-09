<?php

namespace App\Services\Marketplace;

use App\Models\Task;
use App\Models\MarketplaceVendor;
use Illuminate\Support\Collection;

class VendorMatcher
{
    public function findMatches(Task $task, array $criteria = []): Collection
    {
        $query = MarketplaceVendor::query()
            ->where('is_active', true)
            ->where('is_verified', true);

        // Match by category
        if ($category = $task->extracted_data['category'] ?? null) {
            $query->whereJsonContains('categories', $category);
        }

        // Match by location if required
        if ($task->location_address && isset($criteria['location_required'])) {
            // TODO: Implement geographic matching using PostGIS
            // For now, just filter by active vendors
        }

        // Match by budget if specified
        if (isset($criteria['budget_min']) || isset($criteria['budget_max'])) {
            // TODO: Implement budget matching logic
        }

        $vendors = $query->get();

        // Score and sort vendors
        return $vendors->map(function ($vendor) use ($task) {
            return [
                'vendor' => $vendor,
                'score' => $this->calculateScore($vendor, $task),
            ];
        })->sortByDesc('score')->pluck('vendor');
    }

    private function calculateScore(MarketplaceVendor $vendor, Task $task): float
    {
        $score = 0.0;

        // Category match
        if ($category = $task->extracted_data['category'] ?? null) {
            if (in_array($category, $vendor->categories ?? [])) {
                $score += 10;
            }
        }

        // Rating boost
        if ($vendor->average_rating) {
            $score += $vendor->average_rating * 2;
        }

        // Completion rate boost
        if ($vendor->total_jobs > 0) {
            $completionRate = $vendor->completed_jobs / $vendor->total_jobs;
            $score += $completionRate * 5;
        }

        return $score;
    }
}
