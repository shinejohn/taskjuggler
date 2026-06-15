<?php

return [
    'path' => app_path('Modules'),

    'enabled' => [
        'core' => true,
        'tasks' => env('MODULE_TASKS_ENABLED', true),
        'processes' => env('MODULE_PROCESSES_ENABLED', true),
        'projects' => env('MODULE_PROJECTS_ENABLED', true),
    ],

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

    /*
    | Mobile app module entitlements by subscription plan.
    | Module IDs match backend module names and taskjuggler-app/config/modules.ts.
    */
    'mobile_entitlements' => [
        'tasks' => ['free', 'starter', 'pro', 'business', 'enterprise'],
        'processes' => ['pro', 'business', 'enterprise'],
        'projects' => ['business', 'enterprise'],
        'coordinator' => ['business', 'enterprise'],
        'sitehealth' => ['pro', 'business', 'enterprise'],
        'urpa' => ['starter', 'pro', 'business', 'enterprise'],
        'ideacircuit' => ['starter', 'pro', 'business', 'enterprise'],
        'officialnotice' => ['enterprise'],
    ],
];
