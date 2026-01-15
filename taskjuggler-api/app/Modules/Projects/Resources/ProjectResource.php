<?php

namespace App\Modules\Projects\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProjectResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'code' => $this->code,
            'description' => $this->description,
            'methodology' => $this->methodology,
            'status' => $this->status,
            'priority' => $this->priority,
            'start_date' => $this->start_date?->format('Y-m-d'),
            'target_end_date' => $this->target_end_date?->format('Y-m-d'),
            'actual_end_date' => $this->actual_end_date?->format('Y-m-d'),
            'budget' => $this->budget,
            'budget_spent' => $this->budget_spent,
            'health_score' => $this->health_score,
            'tags' => $this->tags,
            'team_id' => $this->team_id,
            'profile_id' => $this->profile_id,
            'owner' => $this->whenLoaded('owner', fn() => [
                'id' => $this->owner->id,
                'name' => $this->owner->name ?? $this->owner->email,
            ]),
            'members' => $this->whenLoaded('members', fn() => $this->members->map(fn($member) => [
                'id' => $member->id,
                'name' => $member->name ?? $member->email,
                'role' => $member->pivot->role,
                'allocation_percentage' => $member->pivot->allocation_percentage,
            ])),
            'tasks_count' => $this->whenCounted('tasks'),
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}

