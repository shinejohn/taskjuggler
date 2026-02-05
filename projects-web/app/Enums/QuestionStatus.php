<?php

namespace App\Enums;

enum QuestionStatus: string
{
    case OPEN = 'open';
    case ANSWERED = 'answered';
    case RESOLVED = 'resolved';
    case CLOSED = 'closed';

    public function label(): string
    {
        return match($this) {
            self::OPEN => 'Open',
            self::ANSWERED => 'Answered',
            self::RESOLVED => 'Resolved',
            self::CLOSED => 'Closed',
        };
    }

    public function color(): string
    {
        return match($this) {
            self::OPEN => 'blue',
            self::ANSWERED => 'yellow',
            self::RESOLVED => 'green',
            self::CLOSED => 'gray',
        };
    }
}

