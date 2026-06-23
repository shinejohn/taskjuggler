<?php

declare(strict_types=1);

return [
    /*
    |--------------------------------------------------------------------------
    | Admin Emails
    |--------------------------------------------------------------------------
    |
    | Comma-separated allowlist of email addresses that are treated as platform
    | administrators. Matching is case-insensitive. Used by the `admin`
    | middleware and the User `is_admin` accessor. No roles package required.
    |
    */
    'emails' => array_filter(array_map('trim', explode(',', (string) env('ADMIN_EMAILS', 'john.m.shine@gmail.com,john_shine@hotmail.com')))),
];
