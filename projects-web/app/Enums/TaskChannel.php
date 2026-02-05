<?php

namespace App\Enums;

enum TaskChannel: string
{
    case WEB = 'web';
    case MOBILE = 'mobile';
    case EMAIL = 'email';
    case SMS = 'sms';
    case VOICE = 'voice';
    case SLACK = 'slack';

    public function label(): string
    {
        return match($this) {
            self::WEB => 'Web',
            self::MOBILE => 'Mobile',
            self::EMAIL => 'Email',
            self::SMS => 'SMS',
            self::VOICE => 'Voice',
            self::SLACK => 'Slack',
        };
    }

    public function icon(): string
    {
        return match($this) {
            self::WEB => 'globe-alt',
            self::MOBILE => 'device-phone-mobile',
            self::EMAIL => 'envelope',
            self::SMS => 'chat-bubble-left',
            self::VOICE => 'microphone',
            self::SLACK => 'hashtag',
        };
    }
}

