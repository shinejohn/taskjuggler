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
            $this->applyGeographicFilter($query, $task, $criteria);
        }

        // Match by budget if specified
        if (isset($criteria['budget_min']) || isset($criteria['budget_max'])) {
            $this->applyBudgetFilter($query, $criteria);
        }

        $vendors = $query->get();

        // Apply geographic filter in memory if needed
        if ($task->location_address && isset($criteria['location_required'])) {
            $vendors = $this->filterByGeographicDistance($vendors, $task, $criteria);
        }

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

        // Geographic proximity boost (if location available)
        if ($task->location_coords && $vendor->service_area) {
            $distance = $this->calculateDistance($task->location_coords, $vendor->service_area);
            if ($distance !== null) {
                // Boost score for closer vendors (max 10 points, decreases with distance)
                // 0-10km = 10 points, 10-50km = 5 points, 50-100km = 2 points, >100km = 0
                if ($distance <= 10) {
                    $score += 10;
                } elseif ($distance <= 50) {
                    $score += 5;
                } elseif ($distance <= 100) {
                    $score += 2;
                }
            }
        }

        // Budget match boost
        $taskBudget = $task->extracted_data['budget'] ?? null;
        if ($taskBudget && $vendor->base_rate) {
            $budgetMax = is_array($taskBudget) ? ($taskBudget['max'] ?? null) : $taskBudget;
            if ($budgetMax && $vendor->base_rate <= $budgetMax) {
                // Boost score if vendor fits within budget
                $score += 5;
            }
        }

        return $score;
    }

    /**
     * Apply geographic filtering to query
     * 
     * Note: Since PostGIS isn't set up, geographic filtering is done in-memory
     * after fetching vendors. This method is a placeholder for future PostGIS implementation.
     * 
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @param Task $task
     * @param array $criteria
     */
    private function applyGeographicFilter($query, Task $task, array $criteria): void
    {
        // For now, we'll filter in memory after fetching
        // In production with PostGIS, you'd use:
        // $taskCoords = $task->location_coords;
        // $maxDistance = $criteria['max_distance_km'] ?? 100;
        // $query->whereRaw("ST_DWithin(
        //     service_area::geography,
        //     ST_MakePoint(?, ?)::geography,
        //     ?
        // )", [$taskCoords['lng'], $taskCoords['lat'], $maxDistance * 1000]);
        
        // For now, just ensure we have vendors with service_area data
        // Actual filtering happens in filterByGeographicDistance()
    }

    /**
     * Apply budget filtering to query
     * 
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @param array $criteria
     */
    private function applyBudgetFilter($query, array $criteria): void
    {
        $budgetMin = $criteria['budget_min'] ?? null;
        $budgetMax = $criteria['budget_max'] ?? null;

        if ($budgetMin !== null) {
            $query->where(function ($q) use ($budgetMin, $budgetMax) {
                // Vendor must have a base_rate
                $q->whereNotNull('base_rate');
                
                // If budget_max is specified, vendor rate must be <= max
                if ($budgetMax !== null) {
                    $q->where('base_rate', '<=', $budgetMax);
                }
                
                // If budget_min is specified, vendor rate should ideally be >= min
                // But we allow vendors with lower rates (they're cheaper, which is good)
                // So we don't filter them out, just score them lower
            });
        } elseif ($budgetMax !== null) {
            // Only max budget specified - filter vendors that are too expensive
            $query->where(function ($q) use ($budgetMax) {
                $q->whereNull('base_rate') // No rate specified (quote-based)
                    ->orWhere('base_rate', '<=', $budgetMax);
            });
        }
    }

    /**
     * Calculate distance between task location and vendor service area
     * 
     * @param array|null $taskCoords Task coordinates ['lat' => X, 'lng' => Y]
     * @param array|null $vendorServiceArea Vendor service area (can be point or polygon)
     * @return float|null Distance in kilometers, or null if cannot calculate
     */
    private function calculateDistance(?array $taskCoords, ?array $vendorServiceArea): ?float
    {
        if (!$taskCoords || !isset($taskCoords['lat']) || !isset($taskCoords['lng'])) {
            return null;
        }

        if (!$vendorServiceArea) {
            return null;
        }

        // If service_area is a point
        if (isset($vendorServiceArea['lat']) && isset($vendorServiceArea['lng'])) {
            return $this->haversineDistance(
                $taskCoords['lat'],
                $taskCoords['lng'],
                $vendorServiceArea['lat'],
                $vendorServiceArea['lng']
            );
        }

        // If service_area is a polygon with center point
        if (isset($vendorServiceArea['center'])) {
            $center = $vendorServiceArea['center'];
            if (isset($center['lat']) && isset($center['lng'])) {
                return $this->haversineDistance(
                    $taskCoords['lat'],
                    $taskCoords['lng'],
                    $center['lat'],
                    $center['lng']
                );
            }
        }

        // If service_area is an array of coordinates, use first one
        if (is_array($vendorServiceArea) && isset($vendorServiceArea[0])) {
            $firstPoint = $vendorServiceArea[0];
            if (isset($firstPoint['lat']) && isset($firstPoint['lng'])) {
                return $this->haversineDistance(
                    $taskCoords['lat'],
                    $taskCoords['lng'],
                    $firstPoint['lat'],
                    $firstPoint['lng']
                );
            }
        }

        return null;
    }

    /**
     * Calculate distance between two points using Haversine formula
     * 
     * @param float $lat1 Latitude of first point
     * @param float $lon1 Longitude of first point
     * @param float $lat2 Latitude of second point
     * @param float $lon2 Longitude of second point
     * @return float Distance in kilometers
     */
    private function haversineDistance(float $lat1, float $lon1, float $lat2, float $lon2): float
    {
        $earthRadius = 6371; // Earth's radius in kilometers

        $dLat = deg2rad($lat2 - $lat1);
        $dLon = deg2rad($lon2 - $lon1);

        $a = sin($dLat / 2) * sin($dLat / 2) +
             cos(deg2rad($lat1)) * cos(deg2rad($lat2)) *
             sin($dLon / 2) * sin($dLon / 2);

        $c = 2 * atan2(sqrt($a), sqrt(1 - $a));

        return $earthRadius * $c;
    }

    /**
     * Filter vendors by geographic distance (in-memory filtering)
     * 
     * @param Collection $vendors
     * @param Task $task
     * @param array $criteria
     * @return Collection Filtered vendors
     */
    private function filterByGeographicDistance(Collection $vendors, Task $task, array $criteria): Collection
    {
        $taskCoords = $task->location_coords;
        $maxDistance = $criteria['max_distance_km'] ?? 100;

        if (!$taskCoords || !isset($taskCoords['lat']) || !isset($taskCoords['lng'])) {
            return $vendors;
        }

        return $vendors->filter(function ($vendor) use ($taskCoords, $maxDistance) {
            // If vendor has no service area, include them (they serve everywhere)
            if (!$vendor->service_area) {
                return true;
            }

            $distance = $this->calculateDistance($taskCoords, $vendor->service_area);
            
            // Include if distance is within max, or if distance couldn't be calculated (include to be safe)
            return $distance === null || $distance <= $maxDistance;
        });
    }
}
