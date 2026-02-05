<?php

namespace App\Enums;

enum TaskState: string
{
    case PENDING = 'pending';
    case ACCEPTED = 'accepted';
    case DECLINED = 'declined';
    case IN_PROGRESS = 'in_progress';
    case COMPLETED = 'completed';
    case CANCELLED = 'cancelled';
    case OVERDUE = 'overdue';

    public function label(): string
    {
        return match($this) {
            self::PENDING => 'Pending',
            self::ACCEPTED => 'Accepted',
            self::DECLINED => 'Declined',
            self::IN_PROGRESS => 'In Progress',
            self::COMPLETED => 'Completed',
            self::CANCELLED => 'Cancelled',
            self::OVERDUE => 'Overdue',
        };
    }

    public function color(): string
    {
        return match($this) {
            self::PENDING => 'gray',
            self::ACCEPTED => 'blue',
            self::DECLINED => 'red',
            self::IN_PROGRESS => 'yellow',
            self::COMPLETED => 'green',
            self::CANCELLED => 'gray',
            self::OVERDUE => 'red',
        };
    }

    public function canTransitionTo(): array
    {
        return match($this) {
            self::PENDING => [self::ACCEPTED, self::DECLINED],
            self::ACCEPTED => [self::IN_PROGRESS, self::CANCELLED],
            self::IN_PROGRESS => [self::COMPLETED, self::CANCELLED, self::OVERDUE],
            self::OVERDUE => [self::IN_PROGRESS, self::COMPLETED, self::CANCELLED],
            self::COMPLETED, self::DECLINED, self::CANCELLED => [],
        };
    }

    public function isTerminal(): bool
    {
        return in_array($this, [self::COMPLETED, self::DECLINED, self::CANCELLED]);
    }
}

