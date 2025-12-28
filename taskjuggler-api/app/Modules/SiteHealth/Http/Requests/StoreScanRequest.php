<?php

namespace App\Modules\SiteHealth\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreScanRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'max_pages' => 'nullable|integer|min:1|max:1000',
            'checks' => 'nullable|array',
        ];
    }
}
