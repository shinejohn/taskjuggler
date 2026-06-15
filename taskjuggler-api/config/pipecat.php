<?php

return [
    'enabled' => env('PIPECAT_ENABLED', false),

    /** Pipecat agent service base URL */
    'agent_url' => env('PIPECAT_AGENT_URL'),

    /** Shared secret for Laravel ↔ Pipecat webhooks */
    'webhook_secret' => env('PIPECAT_WEBHOOK_SECRET'),

    /** When true, URPA outbound calls route to Pipecat instead of Vapi */
    'replace_vapi' => env('PIPECAT_REPLACE_VAPI', false),

    'deepgram_api_key' => env('DEEPGRAM_API_KEY'),
    'elevenlabs_api_key' => env('ELEVENLABS_API_KEY'),
];
