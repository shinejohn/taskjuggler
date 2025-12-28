<?php

namespace App\Modules\SiteHealth\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class SiteResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'url' => $this->url,
            'auth_type' => $this->auth_type,
            'auth_config' => $this->auth_config,
            'max_pages' => $this->max_pages,
            'checks' => $this->checks,
            'last_scan_at' => $this->last_scan_at?->toISOString(),
            'health_score' => $this->latestScan?->health_score,
            'issue_count' => $this->issues()->where('status', 'open')->count(),
            'created_at' => $this->created_at->toISOString(),
            'updated_at' => $this->updated_at->toISOString(),
        ];
    }
}
