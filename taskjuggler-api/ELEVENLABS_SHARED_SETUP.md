# ElevenLabs TTS Setup - Shared for URPA.ai and 4calls.ai (Coordinator)

## Overview

ElevenLabs Text-to-Speech is now configured for both:
- **URPA.ai** (`app/Modules/Urpa/Services/TtsService.php`)
- **4calls.ai / Coordinator** (`app/Modules/Coordinator/Services/TtsService.php`)

Both modules use the same ElevenLabs API key and configuration, ensuring consistent voice quality across the platform.

## API Key Configuration

Add the following to your `.env` file:

```bash
ELEVENLABS_API_KEY=63b120775d461f5b7b1c36cd7b46834aaf59cf860520d742c0d18508b6019616
ELEVENLABS_DEFAULT_VOICE_ID=21m00Tcm4TlvDq8ikWAM
ELEVENLABS_MODEL_ID=eleven_multilingual_v2
```

## Usage

### URPA.ai Module

```php
use App\Modules\Urpa\Services\TtsService;

$ttsService = app(TtsService::class);
$audioUrl = $ttsService->generateAudio('Hello, how can I help you?');

// With custom voice
$audioUrl = $ttsService->generateAudio('Hello!', 'voice-id-here');
```

### Coordinator (4calls.ai) Module

```php
use App\Modules\Coordinator\Services\TtsService;

$ttsService = app(\App\Modules\Coordinator\Services\TtsService::class);
$audioUrl = $ttsService->generateAudio('Welcome to our business!');

// For a specific coordinator's voice
$coordinator = Coordinator::find($id);
$audioUrl = $ttsService->generateForCoordinator(
    'Hello, this is our AI assistant.',
    $coordinator->voice_id
);
```

## Architecture

- **URPA TtsService**: Core implementation with ElevenLabs integration
- **Coordinator TtsService**: Wrapper service that uses URPA's TtsService internally
- **Shared Configuration**: Both use the same `config/services.php` settings
- **Shared Cache**: Both use the same cache keys, preventing duplicate API calls

## Features

### ✅ Caching
- Audio files are cached for 1 year (TTS results don't change)
- Cache key includes text + voice ID
- Prevents redundant API calls

### ✅ Voice Support
- Default voice: Rachel (`21m00Tcm4TlvDq8ikWAM`)
- Supports any ElevenLabs voice ID
- Coordinator module can use per-coordinator voice IDs

### ✅ Error Handling
- Returns empty string on failure (caller should handle fallback)
- Logs errors for debugging
- Graceful degradation

### ✅ Batch Generation
```php
$texts = ['Hello', 'How can I help?', 'Thank you'];
$results = $ttsService->generateBatch($texts);
```

## Storage

Audio files are stored in `storage/app/public/tts/` and served via public URL.

**Important**: Run `php artisan storage:link` to create the symbolic link.

For production, consider:
- Using S3 or similar cloud storage
- Setting up CDN for faster delivery
- Implementing automatic cleanup of old files

## Voice Options

Popular ElevenLabs voice IDs:
- `21m00Tcm4TlvDq8ikWAM` - Rachel (default, female, professional)
- `AZnzlk1XvdvUeBnXmlld` - Domi (female, energetic)
- `EXAVITQu4vr4xnSDxMaL` - Bella (female, calm)
- `ErXwobaYiN019PkySvjV` - Antoni (male, friendly)
- `MF3mGyEYCl7XYWbV9V6O` - Elli (female, young)
- `TxGEqnHWrfWFTfGW9XjX` - Josh (male, deep)

See [ElevenLabs Voice Library](https://elevenlabs.io/app/voice-library) for full list.

## Security

- ✅ API key stored in `.env` (not committed to git)
- ✅ Configuration uses Laravel config system
- ✅ No hardcoded keys in source code
- ⚠️ Make sure `.env` is in `.gitignore`
- ⚠️ Never commit API keys to version control

## Integration Points

### URPA.ai
- Used in `VoiceController` for phone call responses
- Used in `TwilioController` for SMS-to-voice conversion
- Used in `VapiController` for Vapi.ai integration

### Coordinator (4calls.ai)
- Can be used in `CampaignService` for outbound call greetings
- Can be used in `CallLogController` for call summaries
- Can be used in `PersonaConfigService` for persona voice configuration

## Testing

```php
// Test TTS generation
$ttsService = app(\App\Modules\Urpa\Services\TtsService::class);
$audioUrl = $ttsService->generateAudio('Test message');
echo "Audio URL: {$audioUrl}\n";

// Test cache
$ttsService->clearCache('Test message');
```

## Troubleshooting

### No audio generated
1. Check `.env` has `ELEVENLABS_API_KEY` set
2. Check API key is valid
3. Check storage directory exists: `storage/app/public/tts/`
4. Check storage link: `php artisan storage:link`
5. Check logs: `storage/logs/laravel.log`

### Cache not working
- Clear cache: `php artisan cache:clear`
- Check cache driver is configured correctly

### Storage issues
- Ensure `storage/app/public/tts/` directory exists and is writable
- Run `php artisan storage:link` to create public link
- Check file permissions: `chmod -R 755 storage/app/public/tts/`

