<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;
use App\Models\Actor;

class CreateActorsForUsers extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'tef:create-actors-for-users {--chunk=100 : Number of users to process at a time}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Create Actor records for all existing users (TEF 2.0.0 migration)';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $this->info('Creating Actor records for existing users...');

        $chunkSize = (int) $this->option('chunk');
        $totalProcessed = 0;
        $totalCreated = 0;
        $totalSkipped = 0;

        User::chunk($chunkSize, function ($users) use (&$totalProcessed, &$totalCreated, &$totalSkipped) {
            foreach ($users as $user) {
                $totalProcessed++;

                // Check if actor already exists
                $existingActor = Actor::where('user_id', $user->id)
                    ->where('actor_type', Actor::TYPE_HUMAN)
                    ->first();

                if ($existingActor) {
                    $totalSkipped++;
                    continue;
                }

                // Create actor for user
                try {
                    Actor::create([
                        'actor_type' => Actor::TYPE_HUMAN,
                        'display_name' => $user->name,
                        'user_id' => $user->id,
                        'capabilities' => [],
                        'contact_methods' => array_filter([
                            $user->email ? ['protocol' => 'email', 'endpoint' => $user->email] : null,
                            $user->phone ? ['protocol' => 'sms', 'endpoint' => $user->phone] : null,
                        ]),
                        'metadata' => [],
                        'authentication' => [],
                        'status' => Actor::STATUS_ACTIVE,
                    ]);

                    $totalCreated++;
                } catch (\Exception $e) {
                    $this->error("Failed to create actor for user {$user->id}: {$e->getMessage()}");
                }
            }
        });

        $this->info("Migration complete!");
        $this->info("Total users processed: {$totalProcessed}");
        $this->info("Actors created: {$totalCreated}");
        $this->info("Actors skipped (already exist): {$totalSkipped}");

        return Command::SUCCESS;
    }
}

