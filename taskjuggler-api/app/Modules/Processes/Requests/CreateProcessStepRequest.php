<?php

namespace App\Modules\Processes\Requests;

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
            'description' => ['nullable', 'string'],
        ];
    }
}

