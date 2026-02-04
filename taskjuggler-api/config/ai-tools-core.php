<?php

return [
    'platform' => 'taskjuggler',

    'default_model' => [
        env('AI_TOOLS_PROVIDER', 'openrouter'),
        env('AI_TOOLS_MODEL', 'anthropic/claude-3-sonnet'),
    ],

    'timeout' => 120,

    'tables' => [
        'allowed' => [
            // Projects & Tasks
            'projects',
            'tasks',
            'subtasks',

            // Teams
            'teams',
            'team_members',
            'users',

            // Time tracking
            'time_entries',

            // Collaboration
            'comments',
            'attachments',
            'task_messages',

            // Workflows
            'workflows',
            'workflow_steps',

            // Resources
            'resources',
            'allocations',
        ],

        'writable' => [
            'tasks',
            'subtasks',
            'time_entries',
            'comments',
            'task_messages',
        ],

        'excluded_columns' => [
            'password',
            'remember_token',
            'api_token',
            'stripe_customer_id',
            'push_token',
        ],

        'searchable' => [
            'tasks' => ['title', 'description'],
            'projects' => ['name', 'description'],
            'teams' => ['name'],
            'users' => ['name', 'email'],
            'task_messages' => ['body'],
        ],
    ],
];
