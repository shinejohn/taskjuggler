<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreateProcessStepRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'order' => ['required', 'integer', 'min:1'],
            'step_type' => ['required', 'string', 'in:action,condition,delay,notification,webhook,create_task,update_task'],
            'config' => ['nullable', 'array'],
            'config.action' => ['required_if:step_type,action', 'string'],
            'config.condition' => ['required_if:step_type,condition', 'array'],
            'config.delay_seconds' => ['required_if:step_type,delay', 'integer', 'min:0', 'max:3600'],
            'config.recipients' => ['required_if:step_type,notification', 'array'],
            'config.url' => ['required_if:step_type,webhook', 'url'],
            'config.title' => ['required_if:step_type,create_task', 'string', 'max:255'],
            'config.task_id' => ['required_if:step_type,update_task', 'uuid', 'exists:tasks,id'],
            'config.updates' => ['required_if:step_type,update_task', 'array'],
            'description' => ['nullable', 'string'],
        ];
    }
}
