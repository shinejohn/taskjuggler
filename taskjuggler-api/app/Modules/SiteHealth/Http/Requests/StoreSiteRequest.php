<?php

namespace App\Modules\SiteHealth\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreSiteRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'url' => 'required|url|max:2048',
            'auth_type' => 'nullable|in:none,basic,cookie,header',
            'auth_config' => 'nullable|array',
            'max_pages' => 'nullable|integer|min:1|max:1000',
            'checks' => 'nullable|array',
        ];
    }
}
