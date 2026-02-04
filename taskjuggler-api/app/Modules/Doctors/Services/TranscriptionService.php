<?php

namespace App\Modules\Doctors\Services;

use App\Modules\Doctors\Events\TranscriptUpdated;
use App\Modules\Doctors\Events\DashboardItemExtracted;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

/**
 * Service for processing audio transcription and AI extraction.
 * Receives audio chunks, sends to Whisper for transcription,
 * then processes transcript through Claude for clinical item extraction.
 */
class TranscriptionService
{
    private string $whisperEndpoint;
    private string $anthropicKey;

    public function __construct()
    {
        $this->whisperEndpoint = config('services.ai.whisper_endpoint', 'https://api.openai.com/v1/audio/transcriptions');
        $this->anthropicKey = config('services.ai.anthropic_key', env('ANTHROPIC_API_KEY', ''));
    }

    /**
     * Process an audio chunk from the live dashboard.
     * 
     * @param string $visitId The visit ID
     * @param \Illuminate\Http\UploadedFile $audioFile The audio chunk
     * @param float $timestamp Client timestamp
     * @return array Transcription result
     */
    public function processAudioChunk(string $visitId, $audioFile, float $timestamp): array
    {
        // 1. Send to Whisper for transcription
        $transcript = $this->transcribeAudio($audioFile);
        
        if (!$transcript) {
            return ['text' => '', 'is_final' => false];
        }

        // 2. Broadcast transcript update in real-time
        broadcast(new TranscriptUpdated($visitId, $transcript, $timestamp, true))->toOthers();

        // 3. Append to visit's full transcript
        $this->appendTranscript($visitId, $transcript, $timestamp);

        // 4. Process through Claude for clinical item extraction (async job in production)
        $this->extractClinicalItems($visitId, $transcript);

        return [
            'text' => $transcript,
            'is_final' => true,
            'timestamp' => $timestamp,
        ];
    }

    /**
     * Transcribe audio using Whisper API
     */
    private function transcribeAudio($audioFile): ?string
    {
        try {
            // For development/demo, return simulated transcript
            if (config('app.env') === 'local' && !env('OPENAI_API_KEY')) {
                return $this->simulateTranscript();
            }

            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . env('OPENAI_API_KEY'),
            ])->attach('file', file_get_contents($audioFile->getRealPath()), 'audio.webm')
            ->post($this->whisperEndpoint, [
                'model' => 'whisper-1',
                'language' => 'en',
            ]);

            if ($response->successful()) {
                return $response->json('text');
            }

            Log::error('Whisper API error', ['response' => $response->body()]);
            return null;

        } catch (\Exception $e) {
            Log::error('Transcription error', ['error' => $e->getMessage()]);
            return null;
        }
    }

    /**
     * Generate simulated transcript for local development
     */
    private function simulateTranscript(): string
    {
        $samples = [
            "Patient reports headache for the past three days.",
            "Taking ibuprofen 400mg twice daily with minimal relief.",
            "Blood pressure is 130 over 85.",
            "Heart sounds normal, no murmurs detected.",
            "Assessment is tension-type headache.",
            "Plan is to prescribe sumatriptan 50mg as needed.",
            "Follow up in two weeks if symptoms persist.",
            "Patient advised to reduce screen time.",
        ];
        
        return $samples[array_rand($samples)];
    }

    /**
     * Append transcript to the visit's full transcript
     */
    private function appendTranscript(string $visitId, string $text, float $timestamp): void
    {
        DB::table('scribemd_visits')
            ->where('id', $visitId)
            ->update([
                'full_transcript' => DB::raw("CONCAT(COALESCE(full_transcript, ''), ' ', " . DB::getPdo()->quote($text) . ")"),
                'updated_at' => now(),
            ]);
    }

    /**
     * Extract clinical items from transcript using Claude
     */
    private function extractClinicalItems(string $visitId, string $transcript): void
    {
        // For development/demo, simulate extraction
        if (config('app.env') === 'local' && !$this->anthropicKey) {
            $this->simulateExtraction($visitId, $transcript);
            return;
        }

        // Production: Call Claude API for extraction
        try {
            $response = Http::withHeaders([
                'x-api-key' => $this->anthropicKey,
                'anthropic-version' => '2023-06-01',
                'Content-Type' => 'application/json',
            ])->post('https://api.anthropic.com/v1/messages', [
                'model' => 'claude-sonnet-4-20250514',
                'max_tokens' => 1024,
                'messages' => [
                    [
                        'role' => 'user',
                        'content' => $this->buildExtractionPrompt($transcript),
                    ],
                ],
            ]);

            if ($response->successful()) {
                $this->processExtractionResults($visitId, $response->json());
            }
        } catch (\Exception $e) {
            Log::error('Claude extraction error', ['error' => $e->getMessage()]);
        }
    }

    /**
     * Build prompt for clinical item extraction
     */
    private function buildExtractionPrompt(string $transcript): string
    {
        return <<<PROMPT
You are a medical documentation assistant. Extract clinical items from this transcript segment.
Return a JSON array of items, each with:
- category: one of [symptom, finding, assessment, plan, prescription, order, prior_auth, diagnosis_code, procedure_code, follow_up, instruction]
- item_data: object with category-specific fields
- ai_confidence: 0.0 to 1.0

Transcript: "{$transcript}"

Only return valid JSON, no markdown or explanations.
PROMPT;
    }

    /**
     * Process extraction results and broadcast items
     */
    private function processExtractionResults(string $visitId, array $response): void
    {
        $content = $response['content'][0]['text'] ?? '';
        $items = json_decode($content, true);

        if (!is_array($items)) {
            return;
        }

        foreach ($items as $itemData) {
            $item = $this->createDashboardItem($visitId, $itemData);
            if ($item) {
                broadcast(new DashboardItemExtracted($visitId, $item))->toOthers();
            }
        }
    }

    /**
     * Create a dashboard item from extracted data
     */
    private function createDashboardItem(string $visitId, array $data): ?array
    {
        if (!isset($data['category']) || !isset($data['item_data'])) {
            return null;
        }

        $itemId = Str::uuid()->toString();
        $item = [
            'id' => $itemId,
            'visit_id' => $visitId,
            'category' => $data['category'],
            'item_data' => $data['item_data'],
            'source' => 'ai',
            'ai_confidence' => $data['ai_confidence'] ?? 0.8,
            'is_accepted' => true,
            'is_modified' => false,
            'display_order' => 0,
            'created_at' => now(),
            'updated_at' => now(),
        ];

        DB::table('scribemd_dashboard_items')->insert($item);

        return $item;
    }

    /**
     * Simulate extraction for local development
     */
    private function simulateExtraction(string $visitId, string $transcript): void
    {
        $lowerTranscript = strtolower($transcript);
        
        // Simple keyword matching for demo
        $item = null;
        
        if (str_contains($lowerTranscript, 'headache') || str_contains($lowerTranscript, 'pain')) {
            $item = [
                'category' => 'symptom',
                'item_data' => ['text' => $transcript],
                'ai_confidence' => 0.92,
            ];
        } elseif (str_contains($lowerTranscript, 'blood pressure') || str_contains($lowerTranscript, 'heart')) {
            $item = [
                'category' => 'finding',
                'item_data' => ['text' => $transcript],
                'ai_confidence' => 0.88,
            ];
        } elseif (str_contains($lowerTranscript, 'prescribe') || str_contains($lowerTranscript, 'mg')) {
            $item = [
                'category' => 'prescription',
                'item_data' => ['drug_name' => $this->extractDrugName($transcript)],
                'ai_confidence' => 0.85,
            ];
        } elseif (str_contains($lowerTranscript, 'assessment') || str_contains($lowerTranscript, 'diagnosis')) {
            $item = [
                'category' => 'assessment',
                'item_data' => ['text' => $transcript],
                'ai_confidence' => 0.90,
            ];
        } elseif (str_contains($lowerTranscript, 'follow up') || str_contains($lowerTranscript, 'weeks')) {
            $item = [
                'category' => 'follow_up',
                'item_data' => ['timeframe' => '2 weeks', 'reason' => $transcript],
                'ai_confidence' => 0.87,
            ];
        }

        if ($item) {
            $created = $this->createDashboardItem($visitId, $item);
            if ($created) {
                broadcast(new DashboardItemExtracted($visitId, $created))->toOthers();
            }
        }
    }

    /**
     * Extract drug name from transcript (simple implementation)
     */
    private function extractDrugName(string $transcript): string
    {
        // Look for common drug patterns
        preg_match('/\b(sumatriptan|ibuprofen|acetaminophen|amoxicillin|metformin|lisinopril|omeprazole|atorvastatin)\b/i', $transcript, $matches);
        return $matches[0] ?? 'Unspecified medication';
    }
}
