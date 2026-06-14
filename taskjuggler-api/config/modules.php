<?php

return [
    'path' => app_path('Modules'),

    'enabled' => [
        'core' => true,
        'tasks' => env('MODULE_TASKS_ENABLED', true),
        'processes' => env('MODULE_PROCESSES_ENABLED', false),
        'projects' => env('MODULE_PROJECTS_ENABLED', false),
    ],

    // Flat keys used by AppServiceProvider for conditional migration loading
    'tasks_enabled' => env('MODULE_TASKS_ENABLED', true),
    'projects_enabled' => env('MODULE_PROJECTS_ENABLED', false),
    'processes_enabled' => env('MODULE_PROCESSES_ENABLED', false),
    'communications_enabled' => env('MODULE_COMMUNICATIONS_ENABLED', false),

    'subscriptions' => [
        'free' => ['core', 'tasks'],
        'starter' => ['core', 'tasks'],
        'pro' => ['core', 'tasks', 'processes'],
        'business' => ['core', 'tasks', 'processes', 'projects'],
        'enterprise' => ['core', 'tasks', 'processes', 'projects'],
    ],

    'profile_limits' => [
        'free' => 1,
        'starter' => 1,
        'pro' => 3,
        'business' => 10,
        'enterprise' => -1, // unlimited
    ],
];
