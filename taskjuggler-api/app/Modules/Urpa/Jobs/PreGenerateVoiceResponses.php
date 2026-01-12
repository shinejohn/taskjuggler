<?php

namespace App\Modules\Urpa\Jobs;

use App\Modules\Urpa\Models\UrpaVoiceResponse;
use App\Modules\Urpa\Services\TtsService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class PreGenerateVoiceResponses implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Execute the job
     */
    public function handle(TtsService $ttsService): void
    {
        Log::info('Starting pre-generation of voice response audio');

        $responses = UrpaVoiceResponse::active()->get();
        $generated = 0;
        $skipped = 0;
        $failed = 0;

        foreach ($responses as $response) {
            try {
                // Skip if audio URL already exists
                if ($response->audio_url) {
                    $skipped++;
                    continue;
                }

                // Generate audio URL
                $audioUrl = $ttsService->generateAudio($response->text_content);

                if ($audioUrl) {
                    // Calculate duration (placeholder - would need actual audio analysis)
                    $durationMs = $this->estimateDuration($response->text_content);

                    $response->update([
                        'audio_url' => $audioUrl,
                        'audio_duration_ms' => $durationMs,
                    ]);

                    $generated++;
                    Log::info("Generated audio for response {$response->id}", [
                        'category' => $response->category,
                        'intent' => $response->intent,
                    ]);
                } else {
                    $failed++;
                    Log::warning("Failed to generate audio for response {$response->id}");
                }
            } catch (\Exception $e) {
                $failed++;
                Log::error("Error generating audio for response {$response->id}", [
                    'error' => $e->getMessage(),
                ]);
            }
        }

        Log::info('Pre-generation complete', [
            'total' => $responses->count(),
            'generated' => $generated,
            'skipped' => $skipped,
            'failed' => $failed,
        ]);
    }

    /**
     * Estimate audio duration based on text length
     * Rough estimate: ~150 words per minute = ~2.5 words per second
     */
    private function estimateDuration(string $text): int
    {
        $wordCount = str_word_count($text);
        $seconds = ceil($wordCount / 2.5); // Words per second
        return $seconds * 1000; // Convert to milliseconds
    }
}

