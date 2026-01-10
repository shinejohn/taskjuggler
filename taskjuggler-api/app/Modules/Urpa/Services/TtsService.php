<?php

namespace App\Modules\Urpa\Services;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class TtsService
{
    private string $elevenlabsApiKey;
    private string $elevenlabsBaseUrl;
    private string $elevenlabsVoiceId;
    private string $elevenlabsModelId;
    private const CACHE_STATS_KEY = 'tts:cache_stats';

    public function __construct()
    {
        $this->elevenlabsApiKey = config('services.elevenlabs.api_key', env('ELEVENLABS_API_KEY'));
        $this->elevenlabsBaseUrl = config('services.elevenlabs.base_url', 'https://api.elevenlabs.io/v1');
        $this->elevenlabsVoiceId = config('services.elevenlabs.default_voice_id', '21m00Tcm4TlvDq8ikWAM');
        $this->elevenlabsModelId = config('services.elevenlabs.model_id', 'eleven_multilingual_v2');
    }

    /**
     * Increment cache hit counter
     */
    private function incrementCacheHit(): void
    {
        $stats = Cache::get(self::CACHE_STATS_KEY, ['hits' => 0, 'misses' => 0, 'cached_items' => 0]);
        $stats['hits'] = ($stats['hits'] ?? 0) + 1;
        Cache::forever(self::CACHE_STATS_KEY, $stats);
    }

    /**
     * Increment cache miss counter
     */
    private function incrementCacheMiss(): void
    {
        $stats = Cache::get(self::CACHE_STATS_KEY, ['hits' => 0, 'misses' => 0, 'cached_items' => 0]);
        $stats['misses'] = ($stats['misses'] ?? 0) + 1;
        Cache::forever(self::CACHE_STATS_KEY, $stats);
    }

    /**
     * Update cached items count (approximate)
     */
    private function updateCachedItemsCount(): void
    {
        // This is an approximation - we count cache keys with 'tts:' prefix
        // In production, you might want a more accurate count
        $stats = Cache::get(self::CACHE_STATS_KEY, ['hits' => 0, 'misses' => 0, 'cached_items' => 0]);
        // Note: Getting exact count would require iterating all cache keys or using a counter
        // For now, we'll increment on each new cache entry
        $stats['cached_items'] = ($stats['cached_items'] ?? 0) + 1;
        Cache::forever(self::CACHE_STATS_KEY, $stats);
    }

    /**
     * Generate audio URL from text using TTS
     * Uses caching to avoid redundant API calls
     * 
     * @param string $text Text to convert to speech
     * @param string $voice Voice ID (default uses configured default voice, or pass ElevenLabs voice ID)
     * @return string Audio URL
     */
    public function generateAudio(string $text, string $voice = 'default'): string
    {
        // Normalize text for cache key
        $normalizedText = trim($text);
        
        // Map 'default' to configured default voice ID
        $voiceId = $voice === 'default' ? $this->elevenlabsVoiceId : $voice;
        
        $cacheKey = md5($normalizedText . $voiceId);
        
        // Check cache first
        $cachedUrl = Cache::get("tts:{$cacheKey}");
        if ($cachedUrl) {
            $this->incrementCacheHit();
            return $cachedUrl;
        }
        
        $this->incrementCacheMiss();
        
        try {
            // Generate audio via ElevenLabs API
            $audioUrl = $this->callTtsApi($normalizedText, $voiceId);
            
            if (empty($audioUrl)) {
                return '';
            }
            
            // Cache for 1 year (TTS results don't change)
            Cache::put("tts:{$cacheKey}", $audioUrl, now()->addYear());
            $this->updateCachedItemsCount();
            
            return $audioUrl;
        } catch (\Exception $e) {
            Log::error('TTS generation failed', [
                'error' => $e->getMessage(),
                'text_length' => strlen($normalizedText),
                'voice_id' => $voiceId,
            ]);
            
            // Return empty string on failure - caller should handle fallback
            return '';
        }
    }

    /**
     * Call TTS API to generate audio
     */
    private function callTtsApi(string $text, string $voiceId): string
    {
        // Use ElevenLabs API (primary TTS provider)
        if ($this->elevenlabsApiKey) {
            try {
                return $this->generateViaElevenLabs($text, $voiceId);
            } catch (\Exception $e) {
                Log::error('ElevenLabs TTS failed', [
                    'error' => $e->getMessage(),
                    'text_length' => strlen($text),
                    'voice_id' => $voiceId,
                ]);
                // Fallback to empty string - caller should handle fallback
                return '';
            }
        }
        
        Log::warning('No TTS provider configured - ElevenLabs API key missing');
        return '';
    }

    /**
     * Generate audio via ElevenLabs API
     */
    private function generateViaElevenLabs(string $text, string $voiceId = null): string
    {
        if (!$this->elevenlabsApiKey) {
            throw new \Exception('ElevenLabs API key not configured');
        }

        $voiceId = $voiceId ?? $this->elevenlabsVoiceId;
        
        try {
            // Call ElevenLabs text-to-speech API
            // ElevenLabs returns binary audio data (MP3), not JSON
            $response = Http::withHeaders([
                'xi-api-key' => $this->elevenlabsApiKey,
                'Accept' => 'audio/mpeg',
            ])->asJson()->post("{$this->elevenlabsBaseUrl}/text-to-speech/{$voiceId}", [
                'text' => $text,
                'model_id' => $this->elevenlabsModelId,
                'voice_settings' => [
                    'stability' => 0.5,
                    'similarity_boost' => 0.75,
                    'style' => 0.0,
                    'use_speaker_boost' => true,
                ],
            ]);

            if ($response->failed()) {
                Log::error('ElevenLabs API error', [
                    'status' => $response->status(),
                    'body' => $response->body(),
                ]);
                throw new \Exception('ElevenLabs API request failed: ' . $response->body());
            }

            // ElevenLabs returns audio directly, we need to store it
            // For now, we'll return a data URL or store it and return the URL
            // In production, you'd want to store the audio file and return a CDN URL
            
            // Store audio file and return URL
            // Store in storage/app/public/tts (make sure this directory exists)
            $audioData = $response->body();
            $filename = 'tts_' . md5($text . $voiceId) . '.mp3';
            
            $storagePath = storage_path('app/public/tts');
            if (!is_dir($storagePath)) {
                mkdir($storagePath, 0755, true);
            }
            
            $filePath = $storagePath . '/' . $filename;
            file_put_contents($filePath, $audioData);
            
            // Return public URL (requires php artisan storage:link to be run)
            // In production, consider using S3/CDN for better performance
            return url('storage/tts/' . $filename);
            
        } catch (\Exception $e) {
            Log::error('ElevenLabs TTS generation error', [
                'error' => $e->getMessage(),
                'voice_id' => $voiceId,
            ]);
            throw $e;
        }
    }

    /**
     * Batch generate audio for multiple texts
     */
    public function generateBatch(array $texts, string $voice = 'default'): array
    {
        $results = [];
        
        foreach ($texts as $text) {
            $results[] = [
                'text' => $text,
                'audio_url' => $this->generateAudio($text, $voice),
            ];
        }
        
        return $results;
    }

    /**
     * Clear TTS cache for a specific text
     */
    public function clearCache(string $text, string $voice = 'default'): void
    {
        $voiceId = $voice === 'default' ? $this->elevenlabsVoiceId : $voice;
        $cacheKey = md5(trim($text) . $voiceId);
        Cache::forget("tts:{$cacheKey}");
    }

    /**
     * Get cache statistics
     */
    public function getCacheStats(): array
    {
        $stats = Cache::get(self::CACHE_STATS_KEY, [
            'hits' => 0,
            'misses' => 0,
            'cached_items' => 0,
        ]);

        $totalRequests = ($stats['hits'] ?? 0) + ($stats['misses'] ?? 0);
        $hitRate = $totalRequests > 0 
            ? round((($stats['hits'] ?? 0) / $totalRequests) * 100, 2) 
            : 0;

        return [
            'cached_items' => $stats['cached_items'] ?? 0,
            'cache_hits' => $stats['hits'] ?? 0,
            'cache_misses' => $stats['misses'] ?? 0,
            'total_requests' => $totalRequests,
            'hit_rate_percent' => $hitRate,
        ];
    }
}

