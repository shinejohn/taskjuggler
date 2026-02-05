<?php

namespace App\Enums;

enum OrganizationPlan: string
{
    case FREE = 'free';
    case TEAM = 'team';
    case BUSINESS = 'business';
    case ENTERPRISE = 'enterprise';

    public function label(): string
    {
        return ucfirst($this->value);
    }

    public function maxUsers(): int
    {
        return match($this) {
            self::FREE => 5,
            self::TEAM => 25,
            self::BUSINESS => 100,
            self::ENTERPRISE => -1, // unlimited
        };
    }

    public function maxProjects(): int
    {
        return match($this) {
            self::FREE => 3,
            self::TEAM => 25,
            self::BUSINESS => 100,
            self::ENTERPRISE => -1, // unlimited
        };
    }

    public function price(): int
    {
        return match($this) {
            self::FREE => 0,
            self::TEAM => 12,
            self::BUSINESS => 25,
            self::ENTERPRISE => 0, // custom
        };
    }

    public function features(): array
    {
        return match($this) {
            self::FREE => ['web', 'mobile', 'basic_ai'],
            self::TEAM => ['web', 'mobile', 'email', 'slack', 'basic_ai', 'question_forum'],
            self::BUSINESS => ['web', 'mobile', 'email', 'sms', 'voice', 'slack', 'advanced_ai', 'question_forum', 'tef_export', 'sso'],
            self::ENTERPRISE => ['*'],
        };
    }
}

