<?php

namespace App\Enums;

enum ProjectStatus: string
{
    case PLANNING = 'planning';
    case ACTIVE = 'active';
    case ON_HOLD = 'on_hold';
    case COMPLETED = 'completed';
    case ARCHIVED = 'archived';

    public function label(): string
    {
        return match($this) {
            self::PLANNING => 'Planning',
            self::ACTIVE => 'Active',
            self::ON_HOLD => 'On Hold',
            self::COMPLETED => 'Completed',
            self::ARCHIVED => 'Archived',
        };
    }

    public function color(): string
    {
        return match($this) {
            self::PLANNING => 'purple',
            self::ACTIVE => 'green',
            self::ON_HOLD => 'yellow',
            self::COMPLETED => 'blue',
            self::ARCHIVED => 'gray',
        };
    }
}

