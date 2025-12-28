<?php

namespace App\Modules\SiteHealth\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateSiteRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'sometimes|string|max:255',
            'url' => 'sometimes|url|max:2048',
            'auth_type' => 'nullable|in:none,basic,cookie,header',
            'auth_config' => 'nullable|array',
            'max_pages' => 'nullable|integer|min:1|max:1000',
            'checks' => 'nullable|array',
        ];
    }
}
