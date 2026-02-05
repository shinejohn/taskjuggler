<?php

namespace App\Enums;

enum ProblemType: string
{
    case BUG = 'bug';
    case RISK = 'risk';
    case IMPEDIMENT = 'impediment';
    case DEPENDENCY = 'dependency';

    public function label(): string
    {
        return match($this) {
            self::BUG => 'Bug',
            self::RISK => 'Risk',
            self::IMPEDIMENT => 'Impediment',
            self::DEPENDENCY => 'Dependency',
        };
    }

    public function color(): string
    {
        return match($this) {
            self::BUG => 'red',
            self::RISK => 'orange',
            self::IMPEDIMENT => 'yellow',
            self::DEPENDENCY => 'blue',
        };
    }
}

