<?php

/**
 * DATABASE CONFIGURATION - Railway Compatible
 * 
 * This configuration properly parses DATABASE_URL and REDIS_URL
 * that Railway provides automatically when you add database services.
 * 
 * Replace your existing config/database.php with this file.
 */

use Illuminate\Support\Str;

// Parse DATABASE_URL if present (Railway format)
$databaseUrl = env('DATABASE_URL');
$dbConfig = [
    'host' => env('DB_HOST', '127.0.0.1'),
    'port' => env('DB_PORT', '5432'),
    'database' => env('DB_DATABASE', 'laravel'),
    'username' => env('DB_USERNAME', 'laravel'),
    'password' => env('DB_PASSWORD', ''),
];

if ($databaseUrl) {
    $parsedUrl = parse_url($databaseUrl);
    if ($parsedUrl) {
        $dbConfig = [
            'host' => $parsedUrl['host'] ?? $dbConfig['host'],
            'port' => $parsedUrl['port'] ?? $dbConfig['port'],
            'database' => isset($parsedUrl['path']) ? ltrim($parsedUrl['path'], '/') : $dbConfig['database'],
            'username' => $parsedUrl['user'] ?? $dbConfig['username'],
            'password' => isset($parsedUrl['pass']) ? urldecode($parsedUrl['pass']) : $dbConfig['password'],
        ];
    }
}

// Parse REDIS_URL if present (Railway format)
$redisUrl = env('REDIS_URL');
$redisConfig = [
    'host' => env('REDIS_HOST', '127.0.0.1'),
    'port' => env('REDIS_PORT', '6379'),
    'password' => env('REDIS_PASSWORD'),
    'database' => env('REDIS_DB', '0'),
];

if ($redisUrl) {
    $parsedRedis = parse_url($redisUrl);
    if ($parsedRedis) {
        $redisConfig = [
            'host' => $parsedRedis['host'] ?? $redisConfig['host'],
            'port' => $parsedRedis['port'] ?? $redisConfig['port'],
            'password' => isset($parsedRedis['pass']) ? urldecode($parsedRedis['pass']) : $redisConfig['password'],
            'database' => env('REDIS_DB', '0'),
        ];
    }
}

return [

    /*
    |--------------------------------------------------------------------------
    | Default Database Connection Name
    |--------------------------------------------------------------------------
    */

    'default' => env('DB_CONNECTION', 'pgsql'),

    /*
    |--------------------------------------------------------------------------
    | Database Connections
    |--------------------------------------------------------------------------
    */

    'connections' => [

        'sqlite' => [
            'driver' => 'sqlite',
            'url' => env('DB_URL'),
            'database' => env('DB_DATABASE', database_path('database.sqlite')),
            'prefix' => '',
            'foreign_key_constraints' => env('DB_FOREIGN_KEYS', true),
            'busy_timeout' => null,
            'journal_mode' => null,
            'synchronous' => null,
        ],

        'pgsql' => [
            'driver' => 'pgsql',
            'url' => env('DATABASE_URL'),
            'host' => $dbConfig['host'],
            'port' => $dbConfig['port'],
            'database' => $dbConfig['database'],
            'username' => $dbConfig['username'],
            'password' => $dbConfig['password'],
            'charset' => env('DB_CHARSET', 'utf8'),
            'prefix' => '',
            'prefix_indexes' => true,
            'search_path' => 'public',
            'sslmode' => env('DB_SSLMODE', 'prefer'),
        ],

        'mysql' => [
            'driver' => 'mysql',
            'url' => env('DB_URL'),
            'host' => env('DB_HOST', '127.0.0.1'),
            'port' => env('DB_PORT', '3306'),
            'database' => env('DB_DATABASE', 'laravel'),
            'username' => env('DB_USERNAME', 'root'),
            'password' => env('DB_PASSWORD', ''),
            'unix_socket' => env('DB_SOCKET', ''),
            'charset' => env('DB_CHARSET', 'utf8mb4'),
            'collation' => env('DB_COLLATION', 'utf8mb4_unicode_ci'),
            'prefix' => '',
            'prefix_indexes' => true,
            'strict' => true,
            'engine' => null,
            'options' => extension_loaded('pdo_mysql') ? array_filter([
                PDO::MYSQL_ATTR_SSL_CA => env('MYSQL_ATTR_SSL_CA'),
            ]) : [],
        ],

    ],

    /*
    |--------------------------------------------------------------------------
    | Migration Repository Table
    |--------------------------------------------------------------------------
    */

    'migrations' => [
        'table' => 'migrations',
        'update_date_on_publish' => true,
    ],

    /*
    |--------------------------------------------------------------------------
    | Redis Databases
    |--------------------------------------------------------------------------
    */

    'redis' => [

        'client' => env('REDIS_CLIENT', 'predis'),

        'options' => [
            'cluster' => env('REDIS_CLUSTER', 'redis'),
            'prefix' => env('REDIS_PREFIX', Str::slug(env('APP_NAME', 'laravel'), '_').'_database_'),
        ],

        'default' => [
            'url' => env('REDIS_URL'),
            'host' => $redisConfig['host'],
            'password' => $redisConfig['password'],
            'port' => $redisConfig['port'],
            'database' => $redisConfig['database'],
        ],

        'cache' => [
            'url' => env('REDIS_URL'),
            'host' => $redisConfig['host'],
            'password' => $redisConfig['password'],
            'port' => $redisConfig['port'],
            'database' => env('REDIS_CACHE_DB', '1'),
        ],

        'queue' => [
            'url' => env('REDIS_URL'),
            'host' => $redisConfig['host'],
            'password' => $redisConfig['password'],
            'port' => $redisConfig['port'],
            'database' => env('REDIS_QUEUE_DB', '2'),
        ],

        'session' => [
            'url' => env('REDIS_URL'),
            'host' => $redisConfig['host'],
            'password' => $redisConfig['password'],
            'port' => $redisConfig['port'],
            'database' => env('REDIS_SESSION_DB', '3'),
        ],

    ],

];
