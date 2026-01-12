# ElevenLabs TTS Setup

## API Key Configuration

The ElevenLabs API key has been securely configured in the system. To use it:

1. **Add to your `.env` file:**
   ```bash
   ELEVENLABS_API_KEY=63b120775d461f5b7b1c36cd7b46834aaf59cf860520d742c0d18508b6019616
   ELEVENLABS_DEFAULT_VOICE_ID=21m00Tcm4TlvDq8ikWAM
   ELEVENLABS_MODEL_ID=eleven_multilingual_v2
   ```

2. **Create storage link** (if not already done):
   ```bash
   php artisan storage:link
   ```

3. **Ensure storage directory exists:**
   ```bash
   mkdir -p storage/app/public/tts
   chmod 755 storage/app/public/tts
   ```

## Configuration

The ElevenLabs service is configured in `config/services.php`:

- **API Key**: Stored securely via environment variable
- **Base URL**: `https://api.elevenlabs.io/v1` (default)
- **Default Voice**: Rachel (`21m00Tcm4TlvDq8ikWAM`)
- **Model**: `eleven_multilingual_v2` (supports multiple languages)

## Usage

The `TtsService` automatically uses ElevenLabs when generating audio:

```php
use App\Modules\Urpa\Services\TtsService;

$ttsService = app(TtsService::class);
$audioUrl = $ttsService->generateAudio('Hello, how can I help you?');
```

## Security Notes

- ✅ API key is stored in `.env` file (not committed to git)
- ✅ API key is accessed via Laravel config system
- ✅ Audio files are cached to reduce API calls
- ⚠️ Make sure `.env` is in `.gitignore`
- ⚠️ Never commit API keys to version control

## Storage

Audio files are stored in `storage/app/public/tts/` and served via public URL.
For production, consider:
- Using S3 or similar cloud storage
- Setting up CDN for faster delivery
- Implementing automatic cleanup of old files

## Voice Options

You can use different ElevenLabs voices by passing a voice ID:

```php
$audioUrl = $ttsService->generateAudio('Text here', 'voice-id-here');
```

Popular voice IDs:
- `21m00Tcm4TlvDq8ikWAM` - Rachel (default)
- `AZnzlk1XvdvUeBnXmlld` - Domi
- `EXAVITQu4vr4xnSDxMaL` - Bella
- `ErXwobaYiN019PkySvjV` - Antoni

See ElevenLabs documentation for full voice list.

