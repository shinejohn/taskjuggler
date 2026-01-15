<?php

namespace App\Modules\Processes\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProcessResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'description' => $this->description,
            'status' => $this->status,
            'trigger_type' => $this->trigger_type,
            'trigger_config' => $this->trigger_config,
            'project_id' => $this->project_id,
            'team_id' => $this->team_id,
            'profile_id' => $this->profile_id,
            'steps' => $this->whenLoaded('steps', fn() => \App\Modules\Processes\Resources\ProcessStepResource::collection($this->steps)),
            'steps_count' => $this->whenCounted('steps'),
            'executions_count' => $this->whenCounted('executions'),
            'project' => $this->whenLoaded('project', fn() => [
                'id' => $this->project->id,
                'name' => $this->project->name,
            ]),
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}

