<?php

return [
    /*
    | Matrix / Dendrite homeserver integration (Phase 2 comms modernization).
    | Disabled by default — enable when matrix-dendrite Railway service is deployed.
    */
    'enabled' => env('MATRIX_ENABLED', false),

    /** Public client API base, e.g. https://matrix-dendrite.railway.internal or public URL */
    'homeserver_url' => env('MATRIX_HOMESERVER_URL'),

    /** Server name for MXIDs, e.g. fibonacco.ai */
    'server_name' => env('MATRIX_SERVER_NAME', 'fibonacco.ai'),

    /** Admin token for account provisioning (Dendrite/Synapse admin API) */
    'admin_token' => env('MATRIX_ADMIN_TOKEN'),

    /** Shared secret for registration (optional alternative to admin token) */
    'registration_shared_secret' => env('MATRIX_REGISTRATION_SHARED_SECRET'),

    /** Application service token for inbound message webhooks */
    'appservice_token' => env('MATRIX_APPSERVICE_TOKEN'),

    /** Laravel-only secret to validate inbound webhook calls */
    'webhook_secret' => env('MATRIX_WEBHOOK_SECRET'),

    /** Default room visibility: private | public */
    'room_visibility' => env('MATRIX_ROOM_VISIBILITY', 'private'),

    /** Per-request HTTP timeout (seconds) for homeserver calls — keeps a slow/down
     *  Dendrite from blocking task and message creation. */
    'http_timeout' => env('MATRIX_HTTP_TIMEOUT', 5),
];
