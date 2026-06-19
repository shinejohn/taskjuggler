<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Social publishing providers
    |--------------------------------------------------------------------------
    | Per-user (per-business) social accounts URPA can read engagement from and
    | publish/schedule posts to. Each provider is an OAuth app; credentials are
    | stored encrypted per account. Facebook + Instagram share one Meta app.
    */

    'graph_version' => env('FACEBOOK_GRAPH_VERSION', 'v21.0'),

    // Where providers redirect back after OAuth, e.g.
    // https://ai-tools-api-production-2c1e.up.railway.app/api/urpa/social/oauth
    'redirect_base' => env('SOCIAL_OAUTH_REDIRECT_BASE'),

    // Frontend URL the callback bounces back to after connecting an account.
    'frontend_return_url' => env('SOCIAL_OAUTH_RETURN_URL'),

    'providers' => [
        'facebook' => [
            'client_id' => env('FACEBOOK_APP_ID'),
            'client_secret' => env('FACEBOOK_APP_SECRET'),
            'authorize_url' => 'https://www.facebook.com/v21.0/dialog/oauth',
            'token_url' => 'https://graph.facebook.com/v21.0/oauth/access_token',
            'scopes' => [
                'pages_show_list',
                'pages_read_engagement',
                'pages_manage_posts',
                'pages_manage_engagement',
                'read_page_mailboxes',
            ],
        ],

        'instagram' => [
            // Instagram Graph publishing runs through the same Meta app.
            'client_id' => env('FACEBOOK_APP_ID'),
            'client_secret' => env('FACEBOOK_APP_SECRET'),
            'authorize_url' => 'https://www.facebook.com/v21.0/dialog/oauth',
            'token_url' => 'https://graph.facebook.com/v21.0/oauth/access_token',
            'scopes' => [
                'instagram_basic',
                'instagram_content_publish',
                'instagram_manage_comments',
                'pages_show_list',
            ],
        ],

        'twitter' => [
            'client_id' => env('TWITTER_CLIENT_ID'),
            'client_secret' => env('TWITTER_CLIENT_SECRET'),
            'authorize_url' => 'https://twitter.com/i/oauth2/authorize',
            'token_url' => 'https://api.twitter.com/2/oauth2/token',
            'scopes' => [
                'tweet.read',
                'tweet.write',
                'users.read',
                'offline.access',
            ],
        ],

        'linkedin' => [
            'client_id' => env('LINKEDIN_CLIENT_ID'),
            'client_secret' => env('LINKEDIN_CLIENT_SECRET'),
            'authorize_url' => 'https://www.linkedin.com/oauth/v2/authorization',
            'token_url' => 'https://www.linkedin.com/oauth/v2/accessToken',
            'scopes' => [
                'r_liteprofile',
                'w_member_social',
            ],
        ],
    ],
];
