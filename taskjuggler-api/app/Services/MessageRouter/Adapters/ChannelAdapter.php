<?php

namespace App\Services\MessageRouter\Adapters;

use App\Models\Task;
use App\Models\User;

interface ChannelAdapter
{
    /**
     * Get the channel identifier
     */
    public function getChannel(): string;

    /**
     * Check if adapter can send to this recipient
     */
    public function canSend(string $recipient): bool;

    /**
     * Send a task (as TEF) to a recipient
     */
    public function sendTask(array $tef, string $recipient): bool;

    /**
     * Send a notification to a user
     */
    public function sendNotification(User $user, Task $task, string $type): bool;

    /**
     * Format task for this channel
     */
    public function formatTask(array $tef): string;
}
