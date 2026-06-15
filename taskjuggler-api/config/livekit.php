<?php

return [
    'enabled' => env('LIVEKIT_ENABLED', false),

    /** WebSocket URL for clients, e.g. wss://livekit.example.com */
    'url' => env('LIVEKIT_URL'),

    'api_key' => env('LIVEKIT_API_KEY'),
    'api_secret' => env('LIVEKIT_API_SECRET'),

    /** Token TTL in seconds */
    'token_ttl' => (int) env('LIVEKIT_TOKEN_TTL', 3600),
];
