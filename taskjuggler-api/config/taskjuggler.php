<?php

return [
    'tef' => [
        'version' => '1.0',
        'mime_type' => 'application/vnd.taskjuggler.tef+json',
        'extension' => 'tef',
    ],
    
    'invitations' => [
        'expiry_days' => 7,
        'max_per_task' => 10,
    ],
    
    'channels' => [
        'email' => [
            'enabled' => true,
        ],
        'sms' => [
            'enabled' => env('TWILIO_ACCOUNT_SID') !== null,
        ],
        'slack' => [
            'enabled' => env('SLACK_BOT_TOKEN') !== null,
        ],
    ],
    
    'frontend_url' => env('FRONTEND_URL', env('APP_URL')),
];
