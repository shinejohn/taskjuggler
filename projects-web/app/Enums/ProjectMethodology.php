<?php

namespace App\Enums;

enum ProjectMethodology: string
{
    case AGILE = 'agile';
    case WATERFALL = 'waterfall';
    case HYBRID = 'hybrid';

    public function label(): string
    {
        return match($this) {
            self::AGILE => 'Agile',
            self::WATERFALL => 'Waterfall',
            self::HYBRID => 'Hybrid',
        };
    }
}

