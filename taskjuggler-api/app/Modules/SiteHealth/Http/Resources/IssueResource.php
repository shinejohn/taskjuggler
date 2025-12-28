<?php

namespace App\Modules\SiteHealth\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class IssueResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'scan_id' => $this->scan_id,
            'site_id' => $this->site_id,
            'category' => $this->category,
            'severity' => $this->severity,
            'status' => $this->status,
            'title' => $this->title,
            'message' => $this->message,
            'page_url' => $this->page_url,
            'selector' => $this->selector,
            'html_context' => $this->html_context,
            'wcag_criteria' => $this->wcag_criteria,
            'fix_code' => $this->fix_code,
            'fix_explanation' => $this->fix_explanation,
            'fix_confidence' => $this->fix_confidence,
            'screenshot_url' => $this->screenshot_url,
            'created_at' => $this->created_at->toISOString(),
            'updated_at' => $this->updated_at->toISOString(),
            'scan' => $this->whenLoaded('scan'),
            'site' => $this->whenLoaded('site'),
        ];
    }
}
