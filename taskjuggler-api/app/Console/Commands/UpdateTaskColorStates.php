<?php

namespace App\Console\Commands;

use App\Models\Task;
use Illuminate\Console\Command;

class UpdateTaskColorStates extends Command
{
    protected $signature = 'tasks:update-colors';
    protected $description = 'Update color states for all active tasks';

    public function handle()
    {
        $tasks = Task::whereNotIn('status', [Task::STATUS_COMPLETED, Task::STATUS_CANCELLED])
            ->whereNotNull('due_date')
            ->get();

        $updated = 0;
        foreach ($tasks as $task) {
            $oldColor = $task->color_state;
            $task->updateColorState();
            
            if ($oldColor !== $task->color_state) {
                $updated++;
            }
        }

        $this->info("Updated color state for {$updated} tasks");
        return 0;
    }
}
