<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Services\AI\DelegationEngine;

/**
 * Auto-Delegate Tasks Command
 * 
 * Automatically delegates pending tasks to AI agents based on delegation rules
 * Usage: php artisan ai:auto-delegate
 */
class AutoDelegateTasks extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'ai:auto-delegate';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Automatically delegate pending tasks to AI agents based on delegation rules';

    /**
     * Execute the console command.
     */
    public function handle(DelegationEngine $delegationEngine): int
    {
        $this->info('Starting auto-delegation...');

        $delegatedCount = $delegationEngine->autoDelegatePendingTasks();

        $this->info("Delegated {$delegatedCount} tasks to AI agents");

        return Command::SUCCESS;
    }
}
