<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class CriticalDateReminderNotification extends Notification
{
    use Queueable;

    protected $date;

    public function __construct($date)
    {
        $this->date = $date;
    }

    public function via($notifiable)
    {
        return ['mail'];
    }

    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->subject('Official Notice: Critical Date Reminder - ' . $this->date->title)
            ->line('This is a reminder for an upcoming critical date in your document area.')
            ->line('Document: ' . ($this->date->document->title ?? 'Untitled'))
            ->line('Event: ' . $this->date->title)
            ->line('Due Date: ' . $this->date->due_date)
            ->action('View Document', url('/documents/' . ($this->date->document_id ?? '')))
            ->line('Thank you for using Official Notice.');
    }
}
