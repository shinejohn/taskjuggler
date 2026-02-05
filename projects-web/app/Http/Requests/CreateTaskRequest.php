<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreateTaskRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'priority' => ['nullable', 'string', 'in:low,medium,high,critical'],
            'owner_id' => ['nullable', 'uuid', 'exists:users,id'],
            'parent_id' => ['nullable', 'uuid', 'exists:tasks,id'],
            'due_date' => ['nullable', 'date'],
            'estimated_hours' => ['nullable', 'integer', 'min:0'],
            'tags' => ['nullable', 'array'],
            'source_channel' => ['nullable', 'string', 'in:web,mobile,email,sms,voice,slack'],
            'team_id' => ['nullable', 'uuid', 'exists:teams,id'],
            'contact_name' => ['nullable', 'string', 'max:255'],
            'contact_phone' => ['nullable', 'string', 'max:20'],
            'contact_email' => ['nullable', 'email', 'max:255'],
            'location_address' => ['nullable', 'string', 'max:500'],
            'location_city' => ['nullable', 'string', 'max:100'],
            'location_state' => ['nullable', 'string', 'max:50'],
            'location_zip' => ['nullable', 'string', 'max:20'],
        ];
    }
}


