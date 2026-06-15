<?php

declare(strict_types=1);

namespace App\Modules\Communications\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

final class MatrixDirectRoom extends Model
{
    use HasUuids;

    protected $fillable = [
        'user_low_id',
        'user_high_id',
        'matrix_room_id',
    ];

    public function userLow(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_low_id');
    }

    public function userHigh(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_high_id');
    }
}
