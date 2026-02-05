<?php

namespace App\Enums;

enum MemberRole: string
{
    case OWNER = 'owner';
    case ADMIN = 'admin';
    case MEMBER = 'member';
    case VIEWER = 'viewer';

    public function label(): string
    {
        return ucfirst($this->value);
    }

    public function permissions(): array
    {
        return match($this) {
            self::OWNER => ['*'],
            self::ADMIN => ['create', 'read', 'update', 'delete', 'manage_members'],
            self::MEMBER => ['create', 'read', 'update'],
            self::VIEWER => ['read'],
        };
    }

    public function canManage(): bool
    {
        return in_array($this, [self::OWNER, self::ADMIN]);
    }
}

