<?php

namespace App\Services\Workflow;

use App\Services\Workflow\Executors\ApiNodeExecutor;
use App\Services\Workflow\Executors\DatabaseNodeExecutor;
use App\Services\Workflow\Executors\AiNodeExecutor;
use App\Services\Workflow\Executors\NodeExecutorInterface;
use App\Services\AI\OpenRouterService;
use GuzzleHttp\Client;

class NodeExecutorFactory
{
    public function make(string $type): NodeExecutorInterface
    {
        return match ($type) {
            'api' => new ApiNodeExecutor(new Client()),
            'database' => new DatabaseNodeExecutor(),
            'ai' => new AiNodeExecutor(app(OpenRouterService::class)),
            'notification' => new NotificationNodeExecutor(app(\App\Services\Twilio\SmsService::class)),
            'human_review' => new HumanReviewNodeExecutor(),
            default => throw new \Exception("Unknown Node Type: {$type}"),
        };
    }
}
