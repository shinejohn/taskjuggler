<?php

return [
    /*
    |--------------------------------------------------------------------------
    | MCP Server Configuration
    |--------------------------------------------------------------------------
    |
    | Configuration for Model Context Protocol (MCP) server integration
    | with AI agents.
    |
    */

    'enabled' => env('MCP_ENABLED', true),

    /*
    |--------------------------------------------------------------------------
    | MCP Server Endpoint
    |--------------------------------------------------------------------------
    |
    | The base URL where the MCP server is accessible
    |
    */

    'server_url' => env('MCP_SERVER_URL', env('APP_URL') . '/mcp'),

    /*
    |--------------------------------------------------------------------------
    | MCP Transport
    |--------------------------------------------------------------------------
    |
    | Transport method for MCP communication:
    | - 'http': HTTP/REST API
    | - 'stdio': Standard input/output
    | - 'websocket': WebSocket connection
    |
    */

    'transport' => env('MCP_TRANSPORT', 'http'),

    /*
    |--------------------------------------------------------------------------
    | MCP Tools
    |--------------------------------------------------------------------------
    |
    | Available MCP tools that AI agents can use
    |
    */

    'tools' => [
        'create_task' => [
            'enabled' => true,
            'description' => 'Create a new task',
        ],
        'get_task' => [
            'enabled' => true,
            'description' => 'Get task details',
        ],
        'list_tasks' => [
            'enabled' => true,
            'description' => 'List tasks with filters',
        ],
        'update_task_status' => [
            'enabled' => true,
            'description' => 'Update task status',
        ],
        'accept_task' => [
            'enabled' => true,
            'description' => 'Accept a task assignment',
        ],
        'complete_task' => [
            'enabled' => true,
            'description' => 'Mark task as completed',
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | AI Agent Authentication
    |--------------------------------------------------------------------------
    |
    | Authentication method for AI agents connecting via MCP
    |
    */

    'authentication' => [
        'method' => env('MCP_AUTH_METHOD', 'api_key'),
        'api_key_header' => env('MCP_API_KEY_HEADER', 'X-API-Key'),
    ],
];
