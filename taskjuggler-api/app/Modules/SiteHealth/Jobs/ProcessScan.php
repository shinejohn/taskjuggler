<?php

namespace App\Modules\SiteHealth\Jobs;

use App\Modules\SiteHealth\Models\Scan;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Aws\Sqs\SqsClient;
use Aws\Exception\AwsException;

class ProcessScan implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(
        public int $scanId
    ) {}

    public function handle(): void
    {
        $scan = Scan::findOrFail($this->scanId);
        
        $scan->update(['status' => 'running']);

        try {
            $sqs = new SqsClient([
                'version' => 'latest',
                'region' => config('aws.region', 'us-east-1'),
            ]);

            $queueUrl = config('aws.sqs.scan_queue_url');

            $sqs->sendMessage([
                'QueueUrl' => $queueUrl,
                'MessageBody' => json_encode([
                    'scan_id' => $scan->id,
                    'site_id' => $scan->site_id,
                    'url' => $scan->site->url,
                    'auth_config' => $scan->site->auth_config,
                    'max_pages' => $scan->site->max_pages,
                ]),
            ]);

            Log::info("Scan {$scan->id} queued for processing");
        } catch (\Exception $e) {
            $scan->update([
                'status' => 'failed',
                'error' => $e->getMessage(),
            ]);
            
            Log::error("Failed to queue scan {$scan->id}: " . $e->getMessage());
            throw $e;
        }
    }
}
