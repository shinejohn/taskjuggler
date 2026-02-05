<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProcessRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['sometimes', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'status' => ['sometimes', 'string', 'in:draft,active,archived'],
            'trigger_type' => ['sometimes', 'string', 'in:manual,task_created,task_updated,schedule,webhook'],
            'trigger_config' => ['nullable', 'array'],
            'project_id' => ['nullable', 'uuid', 'exists:projects,id'],
        ];
    }
}
