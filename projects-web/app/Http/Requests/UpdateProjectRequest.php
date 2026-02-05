<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProjectRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'code' => ['nullable', 'string', 'max:10'],
            'description' => ['nullable', 'string'],
            'methodology' => ['nullable', 'string', 'in:agile,waterfall,hybrid'],
            'status' => ['nullable', 'string'],
            'start_date' => ['nullable', 'date'],
            'target_end_date' => ['nullable', 'date', 'after:start_date'],
            'budget' => ['nullable', 'numeric', 'min:0'],
        ];
    }
}


