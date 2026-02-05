<?php

namespace App\Http\Resources;

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
            'methodology' => $this->methodology->value,
            'status' => $this->status->value,
            'priority' => $this->priority ?? null,
            'start_date' => $this->start_date?->format('Y-m-d'),
            'target_end_date' => $this->target_end_date?->format('Y-m-d'),
            'actual_end_date' => $this->actual_end_date?->format('Y-m-d'),
            'health_score' => $this->health_score,
            'owner' => $this->whenLoaded('owner', fn() => [
                'id' => $this->owner->id,
                'name' => $this->owner->name,
            ]),
            'members' => $this->whenLoaded('members', fn() => $this->members->map(fn($member) => [
                'id' => $member->id,
                'name' => $member->name,
                'role' => $member->pivot->role,
            ])),
            'tasks_count' => $this->whenCounted('tasks'),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}


