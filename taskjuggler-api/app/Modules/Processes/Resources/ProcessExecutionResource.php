<?php

namespace App\Modules\Processes\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProcessExecutionResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'process_id' => $this->process_id,
            'task_id' => $this->task_id,
            'project_id' => $this->project_id,
            'status' => $this->status,
            'started_at' => $this->started_at?->toIso8601String(),
            'completed_at' => $this->completed_at?->toIso8601String(),
            'error_message' => $this->error_message,
            'execution_data' => $this->execution_data,
            'step_results' => $this->step_results,
            'current_step_order' => $this->current_step_order,
            'process' => $this->whenLoaded('process', fn() => new ProcessResource($this->process)),
            'task' => $this->whenLoaded('task', fn() => [
                'id' => $this->task->id,
                'title' => $this->task->title,
            ]),
            'project' => $this->whenLoaded('project', fn() => [
                'id' => $this->project->id,
                'name' => $this->project->name,
            ]),
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}



