<?php

declare(strict_types=1);

namespace App\Modules\Urpa\Jobs;

use App\Modules\Urpa\Models\UrpaSocialPost;
use App\Modules\Urpa\Services\SocialPublisherService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

/**
 * Publishes any social posts whose scheduled time has arrived. Runs on the
 * scheduler (every minute).
 */
final class PublishScheduledPostsJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function handle(SocialPublisherService $publisher): void
    {
        UrpaSocialPost::due()
            ->with('account')
            ->orderBy('scheduled_at')
            ->limit(50)
            ->get()
            ->each(fn (UrpaSocialPost $post) => $publisher->publish($post));
    }
}
