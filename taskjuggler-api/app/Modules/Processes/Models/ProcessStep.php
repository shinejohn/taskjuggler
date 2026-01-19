<?php

namespace App\Modules\Processes\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProcessStep extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'process_id',
        'name',
        'order',
        'step_type',
        'config',
        'description',
    ];

    protected $casts = [
        'config' => 'array',
    ];

    // Relationships
    public function process(): BelongsTo
    {
        return $this->belongsTo(Process::class);
    }
}



