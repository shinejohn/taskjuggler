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
        $this->whisperEndpoint = (string) config('services.ai.whisper_endpoint');
        $this->anthropicKey = (string) config('services.ai.anthropic_key', '');
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
            if (config('app.env') === 'local' && !config('services.openai.api_key')) {
                return $this->simulateTranscript();
            }

            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . config('services.openai.api_key'),
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
You are a ScribeMD clinical documentation assistant. Extract clinical items from this patient-doctor conversation transcript.

EXTRACT THE FOLLOWING CATEGORIES AND FIELDS:

1. Category: "symptom" or "finding"
   Fields: { "text": "Short summary", "details": "Detailed context from transcript" }

2. Category: "assessment"
   Fields: { "text": "Diagnosis name", "details": "Reasoning if provided" }

3. Category: "plan"
   Fields: { "text": "Action item", "details": "Instructions or notes" }

4. Category: "prescription"
   Fields: { "drug_name": "Name", "strength": "e.g. 50mg", "sig": "Instruction string", "quantity": number, "refills": number, "form": "tablet/capsule", "pharmacy": "Name if mentioned" }

5. Category: "order"
   Fields: { "procedure_name": "Name", "icd_code": "Associated ICD-10", "facility": "Lab name if mentioned", "pa_required": boolean, "order_type": "lab/imaging/referral" }

6. Category: "follow_up"
   Fields: { "timeframe": "e.g. 2 weeks", "reason": "Reason for follow-up" }

Transcript: "{$transcript}"

Return ONLY a JSON array of items: [{ "category": string, "item_data": object, "ai_confidence": float }].
PROMPT;
    }

    /**
     * Process extraction results and broadcast items
     */
    private function processExtractionResults(string $visitId, array $response): void
    {
        $content = $response['content'][0]['text'] ?? '';
        
        // Clean markdown if Claude returned it
        if (str_contains($content, '```json')) {
            $content = Str::between($content, '```json', '```');
        } elseif (str_contains($content, '```')) {
            $content = Str::between($content, '```', '```');
        }

        $items = json_decode(trim($content), true);

        if (!is_array($items)) {
            Log::error('Failed to parse Claude extraction results', ['content' => $content]);
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
            'item_data' => json_encode($data['item_data']),
            'source' => 'ai',
            'ai_confidence' => $data['ai_confidence'] ?? 0.8,
            'is_accepted' => true,
            'is_modified' => false,
            'display_order' => 0,
            'created_at' => now(),
            'updated_at' => now(),
        ];

        DB::table('scribemd_dashboard_items')->insert($item);
        
        // Decode for return
        $item['item_data'] = $data['item_data'];

        return $item;
    }

    /**
     * Simulate extraction for local development
     */
    private function simulateExtraction(string $visitId, string $transcript): void
    {
        $lowerTranscript = strtolower($transcript);
        
        $items = [];
        
        if (str_contains($lowerTranscript, 'headache') || str_contains($lowerTranscript, 'pain')) {
            $items[] = [
                'category' => 'symptom',
                'item_data' => [
                    'text' => str_contains($lowerTranscript, 'headache') ? 'Headache' : 'Chest pain',
                    'details' => $transcript
                ],
                'ai_confidence' => 0.95,
            ];
        } 
        
        if (str_contains($lowerTranscript, 'blood pressure') || str_contains($lowerTranscript, 'heart')) {
            $items[] = [
                'category' => 'finding',
                'item_data' => [
                    'text' => str_contains($lowerTranscript, 'blood pressure') ? 'Elevated BP' : 'Regular heart rhythm',
                    'details' => $transcript
                ],
                'ai_confidence' => 0.92,
            ];
        } 
        
        if (str_contains($lowerTranscript, 'prescribe') || str_contains($lowerTranscript, 'tablet') || str_contains($lowerTranscript, 'mg')) {
            $drug = $this->extractDrugName($transcript);
            $items[] = [
                'category' => 'prescription',
                'item_data' => [
                    'drug_name' => $drug,
                    'strength' => str_contains($lowerTranscript, '50') ? '50mg' : '81mg',
                    'sig' => 'Take 1 tablet daily',
                    'quantity' => 30,
                    'refills' => 3,
                    'form' => 'tablet',
                    'pharmacy' => 'CVS Pharmacy #4521'
                ],
                'ai_confidence' => 0.98,
            ];
        }

        if (str_contains($lowerTranscript, 'echo') || str_contains($lowerTranscript, 'test')) {
            $items[] = [
                'category' => 'order',
                'item_data' => [
                    'procedure_name' => str_contains($lowerTranscript, 'echo') ? 'Stress Echocardiogram' : 'Lipid Panel',
                    'icd_code' => 'R07.9',
                    'facility' => 'Quest Diagnostics',
                    'pa_required' => str_contains($lowerTranscript, 'echo'),
                    'pa_status' => str_contains($lowerTranscript, 'echo') ? 'auto_created' : 'none',
                    'order_type' => 'lab'
                ],
                'ai_confidence' => 0.94,
            ];
        }

        if (str_contains($lowerTranscript, 'assessment') || str_contains($lowerTranscript, 'diagnosis')) {
            $items[] = [
                'category' => 'assessment',
                'item_data' => [
                    'text' => 'Tension-type headache',
                    'details' => 'Clinical presentation suggests stress-related tension headache.'
                ],
                'ai_confidence' => 0.90,
            ];
        } 
        
        if (str_contains($lowerTranscript, 'follow up') || str_contains($lowerTranscript, 'weeks')) {
            $items[] = [
                'category' => 'follow_up',
                'item_data' => [
                    'timeframe' => '2 weeks', 
                    'reason' => 'Review treatment progress and test results'
                ],
                'ai_confidence' => 0.87,
            ];
        }

        foreach ($items as $itemData) {
            $created = $this->createDashboardItem($visitId, $itemData);
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
