<?php

namespace App\Enums;

enum ProblemStatus: string
{
    case OPEN = 'open';
    case INVESTIGATING = 'investigating';
    case RESOLVED = 'resolved';
    case CLOSED = 'closed';
    case WONT_FIX = 'wont_fix';

    public function label(): string
    {
        return match($this) {
            self::OPEN => 'Open',
            self::INVESTIGATING => 'Investigating',
            self::RESOLVED => 'Resolved',
            self::CLOSED => 'Closed',
            self::WONT_FIX => "Won't Fix",
        };
    }

    public function color(): string
    {
        return match($this) {
            self::OPEN => 'red',
            self::INVESTIGATING => 'yellow',
            self::RESOLVED => 'green',
            self::CLOSED => 'gray',
            self::WONT_FIX => 'gray',
        };
    }
}

