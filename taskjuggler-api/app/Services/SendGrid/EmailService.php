<?php

namespace App\Services\SendGrid;

use Illuminate\Support\Facades\Mail;
use SendGrid\Mail\Mail as SendGridMail;
use SendGrid\Mail\TypeException;
use App\Models\AssistantChannel;

class EmailService
{
    private string $apiKey;

    public function __construct()
    {
        $this->apiKey = config('services.sendgrid.api_key');
    }

    public function sendEmail(
        AssistantChannel $channel,
        string $to,
        string $subject,
        string $htmlContent,
        string $textContent = null,
        array $attachments = []
    ): bool {
        $email = new SendGridMail();
        $email->setFrom($channel->email_address, config('app.name'));
        $email->setSubject($subject);
        $email->addTo($to);

        if ($textContent) {
            $email->addContent('text/plain', $textContent);
        }
        $email->addContent('text/html', $htmlContent);

        foreach ($attachments as $attachment) {
            $email->addAttachment(
                $attachment['content'],
                $attachment['type'],
                $attachment['filename'],
                $attachment['disposition'] ?? 'attachment'
            );
        }

        $sendgrid = new \SendGrid($this->apiKey);

        try {
            $response = $sendgrid->send($email);
            return $response->statusCode() >= 200 && $response->statusCode() < 300;
        } catch (TypeException $e) {
            \Log::error('SendGrid email error: ' . $e->getMessage());
            return false;
        }
    }

    public function sendAutoResponse(
        AssistantChannel $channel,
        string $to,
        string $subject,
        string $message
    ): bool {
        return $this->sendEmail($channel, $to, $subject, $message);
    }
}
