<?php

namespace App\Http\Resources;

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
            'process' => $this->whenLoaded('process', fn() => [
                'id' => $this->process->id,
                'name' => $this->process->name,
            ]),
            'task' => $this->whenLoaded('task', fn() => [
                'id' => $this->task->id,
                'title' => $this->task->title,
            ]),
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
