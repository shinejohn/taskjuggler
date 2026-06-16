<?php

declare(strict_types=1);

namespace App\Modules\Urpa\Services;

use App\Modules\Urpa\Models\UrpaPhoneCall;
use Illuminate\Support\Facades\Log;

final class PipecatVoiceService
{
    public function __construct(
        private AiService $aiService
    ) {}

    public function handle(string $sessionId, string $event, array $payload): void
    {
        $call = $this->findCall($sessionId);
        if (! $call) {
            return;
        }

        $actions = $call->actions_taken ?? [];
        $actions['pipecat_events'] = array_merge($actions['pipecat_events'] ?? [], [
            ['event' => $event, 'payload' => $payload, 'at' => now()->toIso8601String()],
        ]);

        match ($event) {
            'session.connected' => $call->update([
                'status' => 'in_progress',
                'actions_taken' => $actions,
            ]),
            'session.error' => $this->handleSessionError($call, $actions, $payload),
            'transcript.turn' => $this->handleTranscriptTurn($call, $actions, $payload),
            'session.ended' => $this->handleSessionEnded($call, $actions, $payload),
            default => $call->update(['actions_taken' => $actions]),
        };
    }

    private function findCall(string $sessionId): ?UrpaPhoneCall
    {
        return UrpaPhoneCall::query()
            ->where(function ($query) use ($sessionId): void {
                $query->where('actions_taken->session->session_id', $sessionId)
                    ->orWhere('actions_taken->session_id', $sessionId);
            })
            ->first();
    }

    /**
     * @param  array<string, mixed>  $actions
     * @param  array<string, mixed>  $payload
     */
    private function handleSessionError(UrpaPhoneCall $call, array $actions, array $payload): void
    {
        Log::warning('Pipecat session error', [
            'call_id' => $call->id,
            'payload' => $payload,
        ]);

        $call->update(['actions_taken' => $actions]);
    }

    /**
     * @param  array<string, mixed>  $actions
     * @param  array<string, mixed>  $payload
     */
    private function handleTranscriptTurn(UrpaPhoneCall $call, array $actions, array $payload): void
    {
        $role = is_string($payload['role'] ?? null) ? $payload['role'] : 'unknown';
        $text = is_string($payload['text'] ?? null) ? $payload['text'] : '';

        if ($text !== '') {
            $turns = $actions['turns'] ?? [];
            $turns[] = ['role' => $role, 'text' => $text];
            $actions['turns'] = $turns;
        }

        $call->update(['actions_taken' => $actions]);
    }

    /**
     * @param  array<string, mixed>  $actions
     * @param  array<string, mixed>  $payload
     */
    private function handleSessionEnded(UrpaPhoneCall $call, array $actions, array $payload): void
    {
        $transcript = is_string($payload['transcript'] ?? null) ? $payload['transcript'] : '';

        if ($transcript === '' && ! empty($actions['turns'])) {
            $transcript = collect($actions['turns'])
                ->map(function (array $turn): string {
                    $role = $turn['role'] ?? 'unknown';
                    $text = $turn['text'] ?? '';

                    return "[{$role}]: {$text}";
                })
                ->join("\n");
        }

        $updates = [
            'status' => 'completed',
            'ended_at' => now(),
            'actions_taken' => $actions,
        ];

        if ($transcript !== '') {
            $updates['transcript'] = $transcript;
            $updates['ai_summary'] = $this->aiService->generateCallSummary($transcript);

            $tasks = $this->aiService->extractTasksFromTranscript(
                $call->user_id,
                $transcript,
                null
            );

            if ($tasks !== []) {
                foreach ($tasks as $task) {
                    $actions[] = "Created task: {$task->title}";
                }
                $updates['actions_taken'] = $actions;
            }
        }

        $call->update($updates);
    }
}
