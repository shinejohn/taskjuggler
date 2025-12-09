<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class AiToolConfig extends Model
{
    use HasUuids;

    protected $fillable = [
        'vendor_id',
        'provider',
        'model',
        'api_endpoint',
        'api_key_encrypted',
        'input_schema',
        'output_schema',
        'prompt_template',
        'max_execution_time',
        'max_tokens',
        'retry_count',
        'auto_execute',
        'requires_approval',
    ];

    protected $casts = [
        'input_schema' => 'array',
        'output_schema' => 'array',
        'auto_execute' => 'boolean',
        'requires_approval' => 'boolean',
    ];

    protected $hidden = ['api_key_encrypted'];

    public function vendor()
    {
        return $this->belongsTo(MarketplaceVendor::class, 'vendor_id');
    }

    public function executions()
    {
        return $this->hasMany(AiToolExecution::class, 'config_id');
    }

    public function getApiKeyAttribute(): ?string
    {
        if (!$this->api_key_encrypted) {
            return null;
        }
        return decrypt($this->api_key_encrypted);
    }

    public function setApiKeyAttribute(?string $value): void
    {
        $this->attributes['api_key_encrypted'] = $value ? encrypt($value) : null;
    }
}
