<?php

namespace App\Services\MessageRouter;

class InboundMessage
{
    public function __construct(
        public string $channel,           // 'email', 'sms', 'slack', 'voice', etc.
        public array $sender,             // ['email' => '', 'phone' => '', 'external_id' => '']
        public string $content,           // The message body
        public ?string $subject = null,   // Email subject or thread title
        public ?string $threadId = null,  // Thread/conversation ID
        public array $attachments = [],   // File attachments
        public array $metadata = [],      // Channel-specific metadata
        public ?\DateTime $timestamp = null,
    ) {
        $this->timestamp = $timestamp ?? new \DateTime();
    }

    /**
     * Create from email webhook payload
     */
    public static function fromEmail(array $payload): self
    {
        return new self(
            channel: 'email',
            sender: [
                'email' => $payload['from'] ?? $payload['sender'] ?? '',
                'name' => $payload['from_name'] ?? '',
            ],
            content: $payload['text'] ?? $payload['body'] ?? '',
            subject: $payload['subject'] ?? null,
            threadId: $payload['message_id'] ?? $payload['in_reply_to'] ?? null,
            attachments: $payload['attachments'] ?? [],
            metadata: $payload,
        );
    }

    /**
     * Create from SMS webhook payload (Twilio)
     */
    public static function fromSms(array $payload): self
    {
        return new self(
            channel: 'sms',
            sender: [
                'phone' => $payload['From'] ?? '',
            ],
            content: $payload['Body'] ?? '',
            threadId: $payload['MessageSid'] ?? null,
            metadata: $payload,
        );
    }

    /**
     * Create from Slack webhook payload
     */
    public static function fromSlack(array $payload): self
    {
        $event = $payload['event'] ?? $payload;
        
        return new self(
            channel: 'slack',
            sender: [
                'external_id' => $event['user'] ?? '',
            ],
            content: $event['text'] ?? '',
            threadId: $event['thread_ts'] ?? $event['ts'] ?? null,
            metadata: $payload,
        );
    }

    /**
     * Create from voice transcription
     */
    public static function fromVoice(array $payload): self
    {
        return new self(
            channel: 'voice',
            sender: [
                'phone' => $payload['From'] ?? '',
            ],
            content: $payload['TranscriptionText'] ?? $payload['transcript'] ?? '',
            metadata: $payload,
        );
    }
}
