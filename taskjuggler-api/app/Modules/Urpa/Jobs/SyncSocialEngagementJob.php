<?php

declare(strict_types=1);

namespace App\Modules\Urpa\Jobs;

use App\Modules\Urpa\Models\UrpaSocialAccount;
use App\Modules\Urpa\Services\SocialReaderService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

/**
 * Pulls recent engagement (comments, mentions) from every active social account
 * into the URPA activity feed. Runs on the scheduler.
 */
final class SyncSocialEngagementJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(
        public ?string $accountId = null
    ) {}

    public function handle(SocialReaderService $reader): void
    {
        $query = UrpaSocialAccount::query()->active();

        if ($this->accountId !== null) {
            $query->where('id', $this->accountId);
        }

        $query->get()->each(fn (UrpaSocialAccount $account) => $reader->fetchEngagement($account));
    }
}
