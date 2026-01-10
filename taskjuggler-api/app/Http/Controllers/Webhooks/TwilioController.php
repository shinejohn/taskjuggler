<?php

namespace App\Http\Controllers\Webhooks;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Jobs\ProcessVoicemail;
use App\Jobs\ProcessSms;
use App\Modules\Urpa\Services\VoiceResponseService;
use App\Modules\Urpa\Services\AiService;
use App\Modules\Urpa\Services\ContextBuilderService;
use App\Modules\Urpa\Services\TtsService;
use App\Modules\Urpa\Models\UrpaContact;
use Illuminate\Http\Request;
use Twilio\TwiML\VoiceResponse;
use Twilio\TwiML\MessagingResponse;
use Illuminate\Support\Facades\Log;

class TwilioController extends Controller
{
    public function __construct(
        private VoiceResponseService $voiceResponseService,
        private AiService $aiService,
        private ContextBuilderService $contextBuilder,
        private TtsService $ttsService
    ) {}
    public function voice(Request $request, User $user)
    {
        $channel = $user->getPhoneChannel();
        $fromNumber = $request->input('From');
        $isFromUser = $fromNumber === $user->phone;
        $speechResult = $request->input('SpeechResult'); // From Gather
        $callSid = $request->input('CallSid');

        $response = new VoiceResponse();

        // Find or create contact
        $contact = UrpaContact::where('user_id', $user->id)
            ->where('phone', $fromNumber)
            ->first();

        // Build context
        $context = $this->contextBuilder->buildCallContext($user, $contact);

        // If we have speech input, process it
        if ($speechResult) {
            return $this->handleSpeechInput($user, $contact, $speechResult, $context, $callSid);
        }

        // Initial greeting - try pre-recorded first
        $greetingContext = [
            'userInput' => '',
            'callState' => 'greeting',
            'timeOfDay' => $this->getTimeOfDay(),
            'callerName' => $contact?->first_name,
        ];

        $prerecordedGreeting = $this->voiceResponseService->selectResponse($greetingContext);

        if ($prerecordedGreeting && $prerecordedGreeting->audio_url) {
            // Use pre-recorded audio
            $response->play($prerecordedGreeting->audio_url);
            $prerecordedGreeting->incrementUsage();
        } else {
            // Generate greeting via TTS
            if ($isFromUser) {
                $greetingText = "Hello! I'm ready to take your instructions. How can I help you?";
            } else {
                $greetingText = $channel?->greeting_message 
                    ?? "Hi, you've reached {$user->name}'s assistant. How can I help you today?";
            }
            $response->say($greetingText, ['voice' => 'Polly.Joanna']);
        }

        // Use Gather for speech recognition
        $gather = $response->gather([
            'input' => 'speech',
            'action' => route('webhooks.twilio.voice', ['user' => $user->id]),
            'method' => 'POST',
            'speechTimeout' => 'auto',
            'language' => 'en-US',
            'hints' => 'schedule, appointment, task, email, contact, calendar',
        ]);

        // Fallback if no speech detected
        $response->say("I didn't catch that. Please try again.", ['voice' => 'Polly.Joanna']);
        $response->redirect(route('webhooks.twilio.voice', ['user' => $user->id]), ['method' => 'POST']);

        return response($response)->header('Content-Type', 'text/xml');
    }

    /**
     * Handle speech input from Twilio Gather
     */
    private function handleSpeechInput(User $user, ?UrpaContact $contact, string $transcript, array $context, string $callSid): \Illuminate\Http\Response
    {
        $response = new VoiceResponse();

        // Try pre-recorded response first
        $prerecordedResult = $this->voiceResponseService->selectResponseWithConfidence([
            'userInput' => $transcript,
            'callState' => 'conversation',
            'timeOfDay' => $this->getTimeOfDay(),
            'callerName' => $contact?->first_name,
        ]);

        if ($prerecordedResult['response'] && !$prerecordedResult['should_use_tts']) {
            // Use pre-recorded audio
            $prerecorded = $prerecordedResult['response'];
            if ($prerecorded->audio_url) {
                $response->play($prerecorded->audio_url);
            } else {
                // Fallback to TTS if no audio URL
                $personalizedText = $this->voiceResponseService->personalizeResponse($prerecorded, [
                    'callerName' => $contact?->first_name ?? 'there',
                ]);
                $response->say($personalizedText, ['voice' => 'Polly.Joanna']);
            }
            $prerecorded->incrementUsage();
        } else {
            // Fallback to AI-generated response
            $aiResponse = $this->aiService->processCallMessage($user, $transcript, $context);
            
            // Generate TTS (with caching)
            $audioUrl = $this->ttsService->generateAudio($aiResponse);
            
            if ($audioUrl) {
                $response->play($audioUrl);
            } else {
                // Fallback to Twilio TTS
                $response->say($aiResponse, ['voice' => 'Polly.Joanna']);
            }
        }

        // Continue conversation with another Gather
        $gather = $response->gather([
            'input' => 'speech',
            'action' => route('webhooks.twilio.voice', ['user' => $user->id]),
            'method' => 'POST',
            'speechTimeout' => 'auto',
            'language' => 'en-US',
        ]);

        // If no input, say goodbye
        $response->say("Thank you for calling. Goodbye!", ['voice' => 'Polly.Joanna']);
        $response->hangup();

        return response($response)->header('Content-Type', 'text/xml');
    }

    /**
     * Get time of day
     */
    private function getTimeOfDay(): string
    {
        $hour = (int) now()->format('H');
        
        if ($hour >= 5 && $hour < 12) {
            return 'morning';
        } elseif ($hour >= 12 && $hour < 17) {
            return 'afternoon';
        } elseif ($hour >= 17 && $hour < 21) {
            return 'evening';
        } else {
            return 'night';
        }
    }

    public function recording(Request $request, User $user)
    {
        // Recording saved, waiting for transcription
        $response = new VoiceResponse();
        $response->say("Thank you. Goodbye.");
        $response->hangup();

        return response($response)->header('Content-Type', 'text/xml');
    }

    public function transcription(Request $request, User $user)
    {
        ProcessVoicemail::dispatch(
            user: $user,
            transcript: $request->input('TranscriptionText', ''),
            recordingUrl: $request->input('RecordingUrl', ''),
            fromNumber: $request->input('From', ''),
            callSid: $request->input('CallSid', ''),
        );

        return response('OK', 200);
    }

    public function sms(Request $request, User $user)
    {
        $fromNumber = $request->input('From');
        $body = $request->input('Body');
        $isFromUser = $fromNumber === $user->phone;

        ProcessSms::dispatch(
            user: $user,
            body: $body,
            fromNumber: $fromNumber,
            messageSid: $request->input('MessageSid'),
            isCommand: $isFromUser,
        );

        // Immediate acknowledgment
        $response = new MessagingResponse();
        $response->message("Got it! I'll process this right away.");

        return response($response)->header('Content-Type', 'text/xml');
    }
}
