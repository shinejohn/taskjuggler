<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProcessStepRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['sometimes', 'string', 'max:255'],
            'order' => ['sometimes', 'integer', 'min:1'],
            'step_type' => ['sometimes', 'string', 'in:action,condition,delay,notification,webhook,create_task,update_task'],
            'config' => ['nullable', 'array'],
            'description' => ['nullable', 'string'],
        ];
    }
}
