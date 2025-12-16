<?php

namespace App\Http\Controllers\Webhooks;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Jobs\ProcessVoicemail;
use App\Jobs\ProcessSms;
use Illuminate\Http\Request;
use Twilio\TwiML\VoiceResponse;
use Twilio\TwiML\MessagingResponse;

class TwilioController extends Controller
{
    public function voice(Request $request, User $user)
    {
        $channel = $user->getPhoneChannel();
        $fromNumber = $request->input('From');
        $isFromUser = $fromNumber === $user->phone;

        $response = new VoiceResponse();

        if ($isFromUser) {
            // User calling their own assistant - command mode
            $response->say(
                "Hello! I'm ready to take your instructions. Please speak after the beep.",
                ['voice' => 'Polly.Joanna']
            );
        } else {
            // External caller - receptionist mode
            $greeting = $channel?->voicemail_greeting 
                ?? "Hi, you've reached {$user->name}'s assistant. Please leave a message with your name, number, and how I can help.";
            $response->say($greeting, ['voice' => 'Polly.Joanna']);
        }

        $response->record([
            'maxLength' => 180,
            'action' => route('webhooks.twilio.recording', ['user' => $user->id]),
            'transcribe' => true,
            'transcribeCallback' => route('webhooks.twilio.transcription', ['user' => $user->id]),
            'playBeep' => true,
        ]);

        $response->say("Thank you. Goodbye.");
        $response->hangup();

        return response($response)->header('Content-Type', 'text/xml');
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
