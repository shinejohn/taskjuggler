<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TaskResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'description' => $this->description,
            'state' => $this->state->value,
            'priority' => $this->priority->value,
            'source_channel' => $this->source_channel->value,
            'color_state' => $this->color_state,
            'due_date' => $this->due_date?->toIso8601String(),
            'started_at' => $this->started_at?->toIso8601String(),
            'completed_at' => $this->completed_at?->toIso8601String(),
            'estimated_hours' => $this->estimated_hours,
            'actual_hours' => $this->actual_hours,
            'is_overdue' => $this->is_overdue,
            'overdue_risk_score' => $this->overdue_risk_score,
            'tags' => $this->tags,
            'deliverables' => $this->deliverables,
            'contact_name' => $this->contact_name,
            'contact_phone' => $this->contact_phone,
            'contact_email' => $this->contact_email,
            'location' => $this->when($this->location_address, [
                'address' => $this->location_address,
                'unit' => $this->location_unit,
                'city' => $this->location_city,
                'state' => $this->location_state,
                'zip' => $this->location_zip,
                'coords' => $this->location_coords,
            ]),
            'requestor' => $this->whenLoaded('requestor', fn() => [
                'id' => $this->requestor->id,
                'name' => $this->requestor->name,
            ]),
            'owner' => $this->whenLoaded('owner', fn() => [
                'id' => $this->owner->id,
                'name' => $this->owner->name,
            ]),
            'project' => $this->whenLoaded('project', fn() => [
                'id' => $this->project->id,
                'name' => $this->project->name,
            ]),
            'team' => $this->whenLoaded('team', fn() => [
                'id' => $this->team->id,
                'name' => $this->team->name,
            ]),
            'routing_rule' => $this->whenLoaded('routingRule', fn() => [
                'id' => $this->routingRule->id,
                'name' => $this->routingRule->name,
            ]),
            'source_channel_detail' => $this->whenLoaded('sourceChannel', fn() => [
                'id' => $this->sourceChannel->id,
                'channel_type' => $this->sourceChannel->channel_type,
            ]),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}


