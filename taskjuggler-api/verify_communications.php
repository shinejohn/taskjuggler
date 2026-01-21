<?php

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

echo "=== COMMUNICATIONS MODULE VERIFICATION ===\n\n";

echo "Services:\n";
$services = [
    'AwsConnectService' => 'App\Modules\Communications\Services\AwsConnectService',
    'AwsSmsService' => 'App\Modules\Communications\Services\AwsSmsService',
    'AwsTranscribeService' => 'App\Modules\Communications\Services\AwsTranscribeService',
    'AwsS3Service' => 'App\Modules\Communications\Services\AwsS3Service',
    'UrpaCommunicationService' => 'App\Modules\Urpa\Services\UrpaCommunicationService',
    'CoordinatorCommunicationService' => 'App\Modules\Coordinator\Services\CoordinatorCommunicationService',
];

foreach ($services as $name => $class) {
    echo '  ' . (class_exists($class) ? '✓' : '✗') . ' ' . $name . "\n";
}

echo "\nDatabase Tables:\n";
$tables = ['communication_calls', 'communication_sms', 'communication_recordings'];
foreach ($tables as $table) {
    $exists = \Illuminate\Support\Facades\Schema::hasTable($table);
    echo '  ' . ($exists ? '✓' : '✗') . ' ' . $table . "\n";
}

echo "\nModule Integration:\n";
$urpaCall = new \App\Modules\Urpa\Models\UrpaPhoneCall;
echo '  ' . (method_exists($urpaCall, 'communicationCall') ? '✓' : '✗') . ' URPA integration' . "\n";

$coordCall = new \App\Modules\Coordinator\Models\CallLog;
echo '  ' . (method_exists($coordCall, 'communicationCall') ? '✓' : '✗') . ' Coordinator integration' . "\n";

echo "\nMigrations Registered:\n";
$providerContent = file_get_contents(app_path('Providers/AppServiceProvider.php'));
echo '  ' . (strpos($providerContent, 'Communications/Migrations') !== false ? '✓' : '✗') . ' AppServiceProvider' . "\n";

echo "\nRoutes:\n";
$routes = \Illuminate\Support\Facades\Route::getRoutes();
$commRoutes = array_filter($routes->getRoutes(), function($route) {
    return strpos($route->uri(), 'communications') !== false;
});
echo '  ✓ ' . count($commRoutes) . ' communication routes registered' . "\n";

echo "\nAWS SDK:\n";
try {
    $sdk = new \Aws\S3\S3Client(['version' => 'latest', 'region' => 'us-east-1']);
    echo '  ✓ AWS SDK loaded' . "\n";
} catch (\Exception $e) {
    echo '  ✗ AWS SDK error: ' . $e->getMessage() . "\n";
}

echo "\n=== VERIFICATION COMPLETE ===\n";

