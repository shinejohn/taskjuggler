<?php

namespace App\Http\Controllers\Webhooks;

use App\Http\Controllers\Controller;
use App\Models\AssistantChannel;
use App\Jobs\ProcessEmail;
use Illuminate\Http\Request;

class SendGridController extends Controller
{
    public function inbound(Request $request)
    {
        $toEmail = $request->input('to');
        $fromEmail = $request->input('from');
        $subject = $request->input('subject');
        $text = $request->input('text');
        $html = $request->input('html');

        // Find user by assistant email
        $channel = AssistantChannel::where('email_address', $this->extractEmail($toEmail))
            ->where('channel_type', 'email')
            ->where('is_active', true)
            ->first();

        if (!$channel) {
            return response('Channel not found', 404);
        }

        $user = $channel->user;
        $isFromUser = $this->extractEmail($fromEmail) === $user->email;

        // Check if this is a forwarded email
        $originalSender = $this->parseForwardedSender($text ?? $html ?? '');

        ProcessEmail::dispatch(
            user: $user,
            subject: $subject ?? '',
            body: $text ?? strip_tags($html ?? ''),
            fromEmail: $originalSender ?? $this->extractEmail($fromEmail),
            fromName: $this->extractName($fromEmail),
            attachments: $this->parseAttachments($request),
            isCommand: $isFromUser && !$originalSender,
        );

        return response('OK', 200);
    }

    private function extractEmail(string $address): string
    {
        if (preg_match('/<([^>]+)>/', $address, $matches)) {
            return $matches[1];
        }
        return $address;
    }

    private function extractName(string $address): ?string
    {
        if (preg_match('/^([^<]+)</', $address, $matches)) {
            return trim($matches[1], ' "');
        }
        return null;
    }

    private function parseForwardedSender(string $content): ?string
    {
        // Look for common forwarded email patterns
        $patterns = [
            '/From:\s*([^\n<]+(?:<[^>]+>)?)/i',
            '/---------- Forwarded message ---------\s*From:\s*([^\n]+)/i',
        ];

        foreach ($patterns as $pattern) {
            if (preg_match($pattern, $content, $matches)) {
                return $this->extractEmail($matches[1]);
            }
        }

        return null;
    }

    private function parseAttachments(Request $request): array
    {
        // SendGrid sends attachments as attachment1, attachment2, etc.
        $attachments = [];
        $i = 1;
        
        while ($request->hasFile("attachment{$i}")) {
            $file = $request->file("attachment{$i}");
            $attachments[] = [
                'name' => $file->getClientOriginalName(),
                'type' => $file->getMimeType(),
                'size' => $file->getSize(),
            ];
            $i++;
        }

        return $attachments;
    }
}
