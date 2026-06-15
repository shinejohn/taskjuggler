<?php

declare(strict_types=1);

namespace App\Jobs;

use App\Models\User;
use App\Modules\Communications\Services\MatrixService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

final class RegisterMatrixUser implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(
        public string $userId
    ) {}

    public function handle(MatrixService $matrix): void
    {
        $user = User::find($this->userId);
        if ($user) {
            $matrix->ensureUserRegistered($user);
        }
    }
}
