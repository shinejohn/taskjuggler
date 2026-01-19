<?php

namespace App\Modules\Projects\Requests;

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
            'methodology' => ['nullable', 'string', 'in:hybrid,agile,waterfall,kanban,scrum'],
            'status' => ['nullable', 'string', 'in:planning,active,on_hold,completed,cancelled'],
            'priority' => ['nullable', 'string', 'in:low,medium,high,urgent'],
            'start_date' => ['nullable', 'date'],
            'target_end_date' => ['nullable', 'date', 'after:start_date'],
            'budget' => ['nullable', 'numeric', 'min:0'],
            'tags' => ['nullable', 'array'],
        ];
    }
}



