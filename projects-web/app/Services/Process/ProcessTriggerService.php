<?php

namespace App\Services\Process;

use App\Models\Process;
use App\Models\Task;
use Illuminate\Support\Facades\Log;

class ProcessTriggerService
{
    protected ProcessExecutionService $executionService;

    public function __construct(ProcessExecutionService $executionService)
    {
        $this->executionService = $executionService;
    }

    /**
     * Handle task created trigger
     */
    public function handleTaskCreated(Task $task): void
    {
        $processes = Process::where('organization_id', $task->organization_id)
            ->where('status', 'active')
            ->where('trigger_type', 'task_created')
            ->get();

        foreach ($processes as $process) {
            try {
                $this->executionService->execute($process, [
                    'task_id' => $task->id,
                    'project_id' => $task->project_id,
                    'user_id' => $task->requestor_id,
                    'trigger' => 'task_created',
                ]);
            } catch (\Exception $e) {
                Log::error('Failed to execute process on task_created trigger', [
                    'process_id' => $process->id,
                    'task_id' => $task->id,
                    'error' => $e->getMessage(),
                ]);
            }
        }
    }

    /**
     * Handle task updated trigger
     */
    public function handleTaskUpdated(Task $task): void
    {
        $processes = Process::where('organization_id', $task->organization_id)
            ->where('status', 'active')
            ->where('trigger_type', 'task_updated')
            ->get();

        foreach ($processes as $process) {
            try {
                $this->executionService->execute($process, [
                    'task_id' => $task->id,
                    'project_id' => $task->project_id,
                    'user_id' => $task->requestor_id,
                    'trigger' => 'task_updated',
                ]);
            } catch (\Exception $e) {
                Log::error('Failed to execute process on task_updated trigger', [
                    'process_id' => $process->id,
                    'task_id' => $task->id,
                    'error' => $e->getMessage(),
                ]);
            }
        }
    }

    /**
     * Handle scheduled triggers
     */
    public function handleScheduled(): void
    {
        $processes = Process::where('status', 'active')
            ->where('trigger_type', 'schedule')
            ->get();

        foreach ($processes as $process) {
            $config = $process->trigger_config ?? [];
            $schedule = $config['schedule'] ?? null;

            if (!$schedule) {
                continue;
            }

            // Check if schedule should run now
            if ($this->shouldRunSchedule($schedule, $process)) {
                try {
                    $this->executionService->execute($process, [
                        'trigger' => 'schedule',
                    ]);
                } catch (\Exception $e) {
                    Log::error('Failed to execute scheduled process', [
                        'process_id' => $process->id,
                        'error' => $e->getMessage(),
                    ]);
                }
            }
        }
    }

    /**
     * Check if a schedule should run now
     */
    protected function shouldRunSchedule(array $schedule, Process $process): bool
    {
        $now = now();
        $lastExecution = $process->executions()
            ->where('status', 'completed')
            ->where('execution_data->trigger', 'schedule')
            ->orderBy('created_at', 'desc')
            ->first();

        // Check schedule type
        $type = $schedule['type'] ?? 'interval';

        return match ($type) {
            'interval' => $this->checkIntervalSchedule($schedule, $lastExecution, $now),
            'cron' => $this->checkCronSchedule($schedule, $now),
            'daily' => $this->checkDailySchedule($schedule, $lastExecution, $now),
            'weekly' => $this->checkWeeklySchedule($schedule, $lastExecution, $now),
            default => false,
        };
    }

    protected function checkIntervalSchedule(array $schedule, ?ProcessExecution $lastExecution, $now): bool
    {
        $interval = $schedule['interval_minutes'] ?? 60;
        if (!$lastExecution) {
            return true; // First run
        }
        return $lastExecution->created_at->addMinutes($interval)->isPast();
    }

    protected function checkCronSchedule(array $schedule, $now): bool
    {
        $cron = $schedule['cron'] ?? null;
        if (!$cron) {
            return false;
        }

        // Simple cron parsing (minute hour day month weekday)
        // For full implementation, use a cron library
        $parts = explode(' ', $cron);
        if (count($parts) !== 5) {
            return false;
        }

        [$minute, $hour, $day, $month, $weekday] = $parts;

        $matches = function ($pattern, $value) {
            if ($pattern === '*') return true;
            if (str_contains($pattern, ',')) {
                return in_array($value, explode(',', $pattern));
            }
            return $pattern == $value;
        };

        return $matches($minute, $now->minute)
            && $matches($hour, $now->hour)
            && $matches($day, $now->day)
            && $matches($month, $now->month)
            && $matches($weekday, $now->dayOfWeek);
    }

    protected function checkDailySchedule(array $schedule, ?ProcessExecution $lastExecution, $now): bool
    {
        $time = $schedule['time'] ?? '00:00';
        [$hour, $minute] = explode(':', $time);

        if (!$lastExecution) {
            // Check if current time matches
            return $now->hour == $hour && $now->minute == $minute;
        }

        // Check if we've passed the scheduled time today and haven't run yet
        $today = $now->copy()->setTime($hour, $minute);
        return $now->isAfter($today) && $lastExecution->created_at->isBefore($today);
    }

    protected function checkWeeklySchedule(array $schedule, ?ProcessExecution $lastExecution, $now): bool
    {
        $dayOfWeek = $schedule['day_of_week'] ?? 0; // 0 = Sunday
        $time = $schedule['time'] ?? '00:00';
        [$hour, $minute] = explode(':', $time);

        if ($now->dayOfWeek != $dayOfWeek) {
            return false;
        }

        if (!$lastExecution) {
            return $now->hour == $hour && $now->minute == $minute;
        }

        // Check if we've passed the scheduled time this week
        $thisWeek = $now->copy()->startOfWeek()->addDays($dayOfWeek)->setTime($hour, $minute);
        return $now->isAfter($thisWeek) && $lastExecution->created_at->isBefore($thisWeek);
    }

    /**
     * Handle webhook trigger
     */
    public function handleWebhook(string $webhookId, array $data): void
    {
        $processes = Process::where('status', 'active')
            ->where('trigger_type', 'webhook')
            ->whereJsonContains('trigger_config->webhook_id', $webhookId)
            ->get();

        foreach ($processes as $process) {
            try {
                $this->executionService->execute($process, [
                    'trigger' => 'webhook',
                    'webhook_data' => $data,
                ]);
            } catch (\Exception $e) {
                Log::error('Failed to execute process on webhook trigger', [
                    'process_id' => $process->id,
                    'webhook_id' => $webhookId,
                    'error' => $e->getMessage(),
                ]);
            }
        }
    }
}
