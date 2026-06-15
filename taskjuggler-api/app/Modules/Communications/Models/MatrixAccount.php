<?php

declare(strict_types=1);

namespace App\Modules\Communications\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

final class MatrixAccount extends Model
{
    use HasUuids;

    protected $fillable = [
        'user_id',
        'matrix_user_id',
        'access_token',
        'device_id',
        'provisioned_at',
    ];

    protected $hidden = [
        'access_token',
    ];

    protected function casts(): array
    {
        return [
            'provisioned_at' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
