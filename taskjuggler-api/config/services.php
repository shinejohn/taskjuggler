<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'postmark' => [
        'key' => env('POSTMARK_API_KEY'),
    ],

    'resend' => [
        'key' => env('RESEND_API_KEY'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'slack' => [
        'bot_token' => env('SLACK_BOT_TOKEN'),
        'signing_secret' => env('SLACK_SIGNING_SECRET'),
        'notifications' => [
            'bot_user_oauth_token' => env('SLACK_BOT_USER_OAUTH_TOKEN'),
            'channel' => env('SLACK_BOT_USER_DEFAULT_CHANNEL'),
        ],
    ],

    'twilio' => [
        'sid' => env('TWILIO_ACCOUNT_SID'),
        'token' => env('TWILIO_AUTH_TOKEN'),
        'verify_signature' => env('TWILIO_VERIFY_SIGNATURE', true),
    ],

    'sendgrid' => [
        'api_key' => env('SENDGRID_API_KEY'),
        'inbound_domain' => env('SENDGRID_INBOUND_DOMAIN', 'assistant.taskjuggler.com'),
        'webhook_secret' => env('SENDGRID_WEBHOOK_SECRET'),
    ],

    'openrouter' => [
        'api_key' => env('OPENROUTER_API_KEY'),
        'base_url' => env('OPENROUTER_BASE_URL', 'https://openrouter.ai/api/v1'),
        'default_model' => env('OPENROUTER_DEFAULT_MODEL', 'openai/gpt-4o'),
        'extraction_model' => env('OPENROUTER_EXTRACTION_MODEL', 'openai/gpt-4o'),
    ],

    'stripe' => [
        'key' => env('STRIPE_KEY'),
        'secret' => env('STRIPE_SECRET'),
        'webhook_secret' => env('STRIPE_WEBHOOK_SECRET'),
    ],

    'google' => [
        'client_id' => env('GOOGLE_CLIENT_ID'),
        'client_secret' => env('GOOGLE_CLIENT_SECRET'),
        'redirect' => env('GOOGLE_REDIRECT_URI'),
    ],

    'vapi' => [
        'api_key' => env('VAPI_API_KEY'),
        'webhook_secret' => env('VAPI_WEBHOOK_SECRET'),
        'base_url' => env('VAPI_BASE_URL', 'https://api.vapi.ai'),
    ],

    'elevenlabs' => [
        'api_key' => env('ELEVENLABS_API_KEY'),
        'base_url' => env('ELEVENLABS_BASE_URL', 'https://api.elevenlabs.io/v1'),
        'default_voice_id' => env('ELEVENLABS_DEFAULT_VOICE_ID', '21m00Tcm4TlvDq8ikWAM'), // Rachel voice
        'model_id' => env('ELEVENLABS_MODEL_ID', 'eleven_multilingual_v2'),
    ],

    'aws' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'aws_connect' => [
        'instance_id' => env('AWS_CONNECT_INSTANCE_ID'),
        'contact_flow_id' => env('AWS_CONNECT_CONTACT_FLOW_ID'),
        'queue_id' => env('AWS_CONNECT_QUEUE_ID'),
        'webhook_url' => env('AWS_CONNECT_WEBHOOK_URL'),
    ],

    'aws_sns' => [
        'topic_arn' => env('AWS_SNS_TOPIC_ARN'),
        'sms_type' => env('AWS_SNS_SMS_TYPE', 'Transactional'),
        'sender_id' => env('AWS_SNS_SENDER_ID'),
    ],

    'aws_pinpoint' => [
        'application_id' => env('AWS_PINPOINT_APPLICATION_ID'),
        'sender_id' => env('AWS_PINPOINT_SENDER_ID'),
    ],

    'aws_s3' => [
        'bucket' => env('AWS_S3_BUCKET'),
        'region' => env('AWS_S3_REGION', env('AWS_DEFAULT_REGION', 'us-east-1')),
        'recordings_path' => env('AWS_S3_RECORDINGS_PATH', 'recordings'),
        'audio_path' => env('AWS_S3_AUDIO_PATH', 'audio'),
    ],

    'aws_transcribe' => [
        'language_code' => env('AWS_TRANSCRIBE_LANGUAGE_CODE', 'en-US'),
        'output_bucket' => env('AWS_TRANSCRIBE_OUTPUT_BUCKET', env('AWS_S3_BUCKET')),
        'output_key_prefix' => env('AWS_TRANSCRIBE_OUTPUT_KEY_PREFIX', 'transcriptions'),
    ],

    'phone_number' => [
        'provider' => env('PHONE_NUMBER_PROVIDER', 'twilio'), // 'twilio' or 'aws'
    ],

    'claude' => [
        'api_key' => env('ANTHROPIC_API_KEY', env('CLAUDE_API_KEY')),
    ],

];
