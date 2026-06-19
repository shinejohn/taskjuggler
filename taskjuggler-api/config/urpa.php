<?php

return [
    /** Shared secret for openclaw-connector → Laravel channel webhooks (and Laravel → connector /send) */
    'channel_webhook_secret' => env('URPA_CHANNEL_WEBHOOK_SECRET'),

    /** Base URL of the openclaw-connector sidecar, e.g. https://openclaw-connector-production.up.railway.app */
    'connector_url' => env('URPA_CONNECTOR_URL'),

    /** When true, inbound channel messages trigger an AI reply sent back over the same channel */
    'auto_reply' => (bool) env('URPA_CHANNEL_AUTO_REPLY', true),

    /** Channels the assistant can send/receive on */
    'channels' => [
        'telegram',
        'whatsapp',
        'signal',
        'slack',
        'discord',
        'google_chat',
        'imessage',
    ],
];
