<?php

declare(strict_types=1);

namespace App\Modules\Communications\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

final class MatrixChannelRoom extends Model
{
    use HasUuids;

    protected $fillable = [
        'user_id',
        'channel',
        'external_chat_id',
        'matrix_room_id',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
