<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Default MQTT Connection
    |--------------------------------------------------------------------------
    |
    | This option controls the default MQTT connection that will be used
    | for publishing and subscribing to MQTT topics.
    |
    */

    'default_connection' => env('MQTT_DEFAULT_CONNECTION', 'default'),

    /*
    |--------------------------------------------------------------------------
    | MQTT Connections
    |--------------------------------------------------------------------------
    |
    | Here you may configure the connection settings for each MQTT broker
    | that is used by your application. Multiple connections may be configured
    | for different brokers or environments.
    |
    */

    'connections' => [
        'default' => [
            'host' => env('MQTT_HOST', 'localhost'),
            'port' => (int) env('MQTT_PORT', 1883),
            'username' => env('MQTT_USERNAME'),
            'password' => env('MQTT_PASSWORD'),
            'client_id' => env('MQTT_CLIENT_ID', 'taskjuggler-' . uniqid()),
            'protocol' => env('MQTT_PROTOCOL', 'mqtt'), // mqtt, mqtts, ws, wss
            'clean_session' => (bool) env('MQTT_CLEAN_SESSION', true),
            'keep_alive' => (int) env('MQTT_KEEP_ALIVE', 60),
            'timeout' => (int) env('MQTT_TIMEOUT', 30),
            'tls' => [
                'enabled' => (bool) env('MQTT_TLS_ENABLED', false),
                'verify_peer' => (bool) env('MQTT_TLS_VERIFY_PEER', true),
                'ca_file' => env('MQTT_TLS_CA_FILE'),
                'cert_file' => env('MQTT_TLS_CERT_FILE'),
                'key_file' => env('MQTT_TLS_KEY_FILE'),
            ],
        ],

        'public' => [
            'host' => env('MQTT_PUBLIC_HOST', 'test.mosquitto.org'),
            'port' => (int) env('MQTT_PUBLIC_PORT', 1883),
            'client_id' => env('MQTT_PUBLIC_CLIENT_ID', 'taskjuggler-public-' . uniqid()),
            'protocol' => 'mqtt',
            'clean_session' => true,
            'keep_alive' => 60,
            'timeout' => 30,
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | MQTT Topics
    |--------------------------------------------------------------------------
    |
    | Default topic patterns for IoT device communication
    |
    */

    'topics' => [
        'device_registration' => 'taskjuggler/devices/register/+',
        'device_tasks' => 'taskjuggler/devices/{device_id}/tasks',
        'device_ack' => 'taskjuggler/devices/{device_id}/ack',
        'device_status' => 'taskjuggler/devices/{device_id}/status',
    ],
];
