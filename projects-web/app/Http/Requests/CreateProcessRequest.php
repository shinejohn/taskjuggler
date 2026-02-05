<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreateProcessRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'trigger_type' => ['required', 'string', 'in:manual,task_created,task_updated,schedule,webhook'],
            'trigger_config' => ['nullable', 'array'],
            'trigger_config.schedule' => ['required_if:trigger_type,schedule', 'array'],
            'trigger_config.schedule.type' => ['required_with:trigger_config.schedule', 'string', 'in:interval,cron,daily,weekly'],
            'trigger_config.schedule.interval_minutes' => ['required_if:trigger_config.schedule.type,interval', 'integer', 'min:1'],
            'trigger_config.schedule.cron' => ['required_if:trigger_config.schedule.type,cron', 'string'],
            'trigger_config.schedule.time' => ['required_if:trigger_config.schedule.type,daily,weekly', 'string', 'regex:/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/'],
            'trigger_config.schedule.day_of_week' => ['required_if:trigger_config.schedule.type,weekly', 'integer', 'min:0', 'max:6'],
            'trigger_config.webhook_id' => ['required_if:trigger_type,webhook', 'string'],
            'project_id' => ['nullable', 'uuid', 'exists:projects,id'],
        ];
    }
}
