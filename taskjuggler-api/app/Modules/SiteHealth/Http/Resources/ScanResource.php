<?php

namespace App\Modules\SiteHealth\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class ScanResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'site_id' => $this->site_id,
            'status' => $this->status,
            'started_at' => $this->started_at->toISOString(),
            'completed_at' => $this->completed_at?->toISOString(),
            'pages_scanned' => $this->pages_scanned,
            'total_pages' => $this->total_pages,
            'health_score' => $this->health_score,
            'category_scores' => $this->category_scores,
            'issue_count' => $this->issue_count,
            'error' => $this->error,
            'created_at' => $this->created_at->toISOString(),
            'updated_at' => $this->updated_at->toISOString(),
            'site' => $this->whenLoaded('site'),
            'issues' => $this->whenLoaded('issues'),
        ];
    }
}
