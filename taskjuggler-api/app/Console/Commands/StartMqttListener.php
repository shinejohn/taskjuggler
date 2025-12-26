<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Services\IoT\MqttBrokerService;

/**
 * Start MQTT Listener Command
 * 
 * Runs the MQTT event loop to listen for device messages
 * Usage: php artisan iot:start-mqtt-listener
 */
class StartMqttListener extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'iot:start-mqtt-listener';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Start MQTT listener for IoT device communication';

    /**
     * Execute the console command.
     */
    public function handle(MqttBrokerService $mqttService): int
    {
        $this->info('Starting MQTT listener...');
        $this->info('Press Ctrl+C to stop');

        try {
            $mqttService->startEventLoop();
        } catch (\Exception $e) {
            $this->error('MQTT listener error: ' . $e->getMessage());
            return Command::FAILURE;
        }

        return Command::SUCCESS;
    }
}
