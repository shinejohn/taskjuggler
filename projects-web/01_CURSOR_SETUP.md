# 01 - Cursor Setup Guide

Complete setup instructions for 4 Projects.ai.

---

## Step 1: Create Laravel Project

```bash
# Create new Laravel 11 project
composer create-project laravel/laravel 4projects
cd 4projects

# Verify PHP version (need 8.2+)
php -v
```

---

## Step 2: Install Composer Dependencies

```bash
# Core Laravel packages
composer require laravel/horizon
composer require laravel/reverb
composer require laravel/sanctum

# Permissions & Media
composer require spatie/laravel-permission
composer require spatie/laravel-medialibrary

# External Services
composer require twilio/sdk
composer require laravel/slack-notification-channel

# Excel Export (for reports)
composer require maatwebsite/excel

# UUID support
composer require ramsey/uuid
```

---

## Step 3: Install NPM Dependencies

```bash
# Vue 3 + Vite
npm install vue@3 @vitejs/plugin-vue

# State Management & Routing
npm install pinia vue-router@4

# Utilities
npm install @vueuse/core axios dayjs

# TailwindCSS
npm install -D tailwindcss postcss autoprefixer
npm install -D @tailwindcss/forms @tailwindcss/typography

# UI Components
npm install @headlessui/vue @heroicons/vue

# Charts
npm install chart.js vue-chartjs

# Real-time
npm install pusher-js laravel-echo

# Drag & Drop (for Kanban)
npm install @vueuse/integrations sortablejs
```

---

## Step 4: Configure Vite

**vite.config.js**
```javascript
import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.js'],
            refresh: true,
        }),
        vue({
            template: {
                transformAssetUrls: {
                    base: null,
                    includeAbsolute: false,
                },
            },
        }),
    ],
    resolve: {
        alias: {
            '@': '/resources/js',
        },
    },
});
```

---

## Step 5: Configure TailwindCSS

**tailwind.config.js**
```javascript
/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './resources/**/*.blade.php',
        './resources/**/*.js',
        './resources/**/*.vue',
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    50: '#eff6ff',
                    100: '#dbeafe',
                    200: '#bfdbfe',
                    300: '#93c5fd',
                    400: '#60a5fa',
                    500: '#3b82f6',
                    600: '#2563eb',
                    700: '#1d4ed8',
                    800: '#1e40af',
                    900: '#1e3a8a',
                    950: '#172554',
                },
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            },
        },
    },
    plugins: [
        require('@tailwindcss/forms'),
        require('@tailwindcss/typography'),
    ],
};
```

**postcss.config.js**
```javascript
export default {
    plugins: {
        tailwindcss: {},
        autoprefixer: {},
    },
};
```

**resources/css/app.css**
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
    html {
        @apply antialiased;
    }
    
    body {
        @apply bg-gray-50 text-gray-900;
    }
}

@layer components {
    .btn {
        @apply inline-flex items-center justify-center px-4 py-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed;
    }
    
    .btn-primary {
        @apply bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500;
    }
    
    .btn-secondary {
        @apply bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 focus:ring-primary-500;
    }
    
    .btn-danger {
        @apply bg-red-600 text-white hover:bg-red-700 focus:ring-red-500;
    }
    
    .input {
        @apply block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500;
    }
    
    .label {
        @apply block text-sm font-medium text-gray-700 mb-1;
    }
    
    .card {
        @apply bg-white rounded-lg shadow-sm border border-gray-200;
    }
}
```

---

## Step 6: Environment Configuration

**.env**
```env
APP_NAME="4 Projects.ai"
APP_ENV=local
APP_KEY=
APP_DEBUG=true
APP_TIMEZONE=UTC
APP_URL=http://localhost:8000

# Logging
LOG_CHANNEL=stack
LOG_LEVEL=debug

# Database - PostgreSQL
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=4projects
DB_USERNAME=postgres
DB_PASSWORD=secret

# Redis
REDIS_CLIENT=phpredis
REDIS_HOST=127.0.0.1
REDIS_PASSWORD=null
REDIS_PORT=6379

# Cache & Session
CACHE_STORE=redis
SESSION_DRIVER=redis
SESSION_LIFETIME=120

# Queue
QUEUE_CONNECTION=redis

# Broadcasting
BROADCAST_CONNECTION=reverb

# Reverb (WebSockets)
REVERB_APP_ID=4projects
REVERB_APP_KEY=4projects-key
REVERB_APP_SECRET=4projects-secret
REVERB_HOST=localhost
REVERB_PORT=8080
REVERB_SCHEME=http

VITE_REVERB_APP_KEY="${REVERB_APP_KEY}"
VITE_REVERB_HOST="${REVERB_HOST}"
VITE_REVERB_PORT="${REVERB_PORT}"
VITE_REVERB_SCHEME="${REVERB_SCHEME}"

# OpenRouter AI
OPENROUTER_API_KEY=sk-or-v1-your-key-here
OPENROUTER_BASE_URL=https://openrouter.ai/api/v1
OPENROUTER_DEFAULT_MODEL=anthropic/claude-3.5-sonnet

# Twilio (SMS/Voice)
TWILIO_SID=AC-your-sid
TWILIO_TOKEN=your-token
TWILIO_PHONE=+15551234567

# Slack
SLACK_BOT_TOKEN=xoxb-your-token
SLACK_SIGNING_SECRET=your-secret

# Mail
MAIL_MAILER=smtp
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=null
MAIL_PASSWORD=null
MAIL_ENCRYPTION=null
MAIL_FROM_ADDRESS="noreply@4projects.ai"
MAIL_FROM_NAME="${APP_NAME}"
```

---

## Step 7: Configure Services

**config/services.php** - Add these entries:
```php
<?php

return [
    // ... existing services ...

    'openrouter' => [
        'api_key' => env('OPENROUTER_API_KEY'),
        'base_url' => env('OPENROUTER_BASE_URL', 'https://openrouter.ai/api/v1'),
        'default_model' => env('OPENROUTER_DEFAULT_MODEL', 'anthropic/claude-3.5-sonnet'),
    ],

    'twilio' => [
        'sid' => env('TWILIO_SID'),
        'token' => env('TWILIO_TOKEN'),
        'phone' => env('TWILIO_PHONE'),
    ],

    'slack' => [
        'bot_token' => env('SLACK_BOT_TOKEN'),
        'signing_secret' => env('SLACK_SIGNING_SECRET'),
    ],
];
```

---

## Step 8: Publish Configurations

```bash
# Sanctum
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"

# Horizon
php artisan vendor:publish --provider="Laravel\Horizon\HorizonServiceProvider"

# Reverb
php artisan install:broadcasting
php artisan vendor:publish --provider="Laravel\Reverb\ReverbServiceProvider"
```

---

## Step 9: Create Database

```bash
# Using psql
createdb 4projects

# Or using PostgreSQL client
psql -U postgres
CREATE DATABASE "4projects";
\q
```

---

## Step 10: Create All Migrations

Run these commands to create migration files:

```bash
php artisan make:migration create_organizations_table
php artisan make:migration enhance_users_table
php artisan make:migration create_projects_table
php artisan make:migration create_tasks_table
php artisan make:migration create_task_actions_table
php artisan make:migration create_task_messages_table
php artisan make:migration create_task_dependencies_table
php artisan make:migration create_questions_table
php artisan make:migration create_problems_table
php artisan make:migration create_sprints_milestones_table
```

---

## Migration 1: Organizations

```php
<?php
// database/migrations/xxxx_create_organizations_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('organizations', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('plan')->default('free');
            $table->integer('max_users')->default(5);
            $table->integer('max_projects')->default(3);
            $table->jsonb('features')->nullable();
            $table->jsonb('settings')->nullable();
            $table->timestamp('trial_ends_at')->nullable();
            $table->timestamps();
            $table->softDeletes();
            
            $table->index('slug');
            $table->index('plan');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('organizations');
    }
};
```

---

## Migration 2: Enhance Users

```php
<?php
// database/migrations/xxxx_enhance_users_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // First, change id to UUID
        Schema::table('users', function (Blueprint $table) {
            // Drop existing primary key
            $table->dropPrimary();
        });

        // Change column type (PostgreSQL specific)
        DB::statement('ALTER TABLE users ALTER COLUMN id TYPE uuid USING id::uuid');

        Schema::table('users', function (Blueprint $table) {
            // Re-add primary key
            $table->primary('id');
            
            // Add new columns
            $table->uuid('organization_id')->nullable()->after('id');
            $table->string('phone', 50)->nullable();
            $table->boolean('phone_verified')->default(false);
            $table->string('timezone', 100)->default('UTC');
            $table->string('avatar')->nullable();
            $table->jsonb('notification_preferences')->nullable();
            $table->jsonb('skills')->nullable();
            $table->integer('capacity_hours_per_week')->default(40);
            $table->string('slack_user_id', 100)->nullable();
            $table->timestamp('last_active_at')->nullable();
            $table->softDeletes();

            $table->foreign('organization_id')
                ->references('id')
                ->on('organizations')
                ->onDelete('cascade');

            $table->index('organization_id');
            $table->index('phone');
            $table->index('slack_user_id');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['organization_id']);
            $table->dropColumn([
                'organization_id',
                'phone',
                'phone_verified',
                'timezone',
                'avatar',
                'notification_preferences',
                'skills',
                'capacity_hours_per_week',
                'slack_user_id',
                'last_active_at',
                'deleted_at',
            ]);
        });
    }
};
```

---

## Migration 3: Projects

```php
<?php
// database/migrations/xxxx_create_projects_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('projects', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('organization_id');
            $table->uuid('owner_id');
            $table->string('name');
            $table->string('code', 10)->nullable();
            $table->text('description')->nullable();
            $table->string('methodology', 50)->default('hybrid');
            $table->string('status', 50)->default('active');
            $table->string('priority', 50)->default('medium');
            $table->date('start_date')->nullable();
            $table->date('target_end_date')->nullable();
            $table->date('actual_end_date')->nullable();
            $table->decimal('budget', 12, 2)->nullable();
            $table->decimal('budget_spent', 12, 2)->default(0);
            $table->jsonb('settings')->nullable();
            $table->jsonb('tags')->nullable();
            $table->integer('health_score')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('organization_id')
                ->references('id')
                ->on('organizations')
                ->onDelete('cascade');

            $table->foreign('owner_id')
                ->references('id')
                ->on('users')
                ->onDelete('restrict');

            $table->index(['organization_id', 'status']);
            $table->index('code');
        });

        Schema::create('project_members', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('project_id');
            $table->uuid('user_id');
            $table->string('role', 50)->default('member');
            $table->integer('allocation_percentage')->default(100);
            $table->timestamps();

            $table->foreign('project_id')
                ->references('id')
                ->on('projects')
                ->onDelete('cascade');

            $table->foreign('user_id')
                ->references('id')
                ->on('users')
                ->onDelete('cascade');

            $table->unique(['project_id', 'user_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('project_members');
        Schema::dropIfExists('projects');
    }
};
```

---

## Migration 4: Tasks

```php
<?php
// database/migrations/xxxx_create_tasks_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tasks', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('organization_id');
            $table->uuid('project_id');
            $table->uuid('requestor_id');
            $table->uuid('owner_id')->nullable();
            $table->uuid('parent_id')->nullable();
            
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('state', 50)->default('pending');
            $table->string('source_channel', 50);
            $table->jsonb('source_metadata')->nullable();
            $table->string('priority', 50)->default('medium');
            
            $table->timestamp('due_date')->nullable();
            $table->timestamp('started_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->integer('estimated_hours')->nullable();
            $table->decimal('actual_hours', 8, 2)->default(0);
            
            $table->uuid('sprint_id')->nullable();
            $table->uuid('milestone_id')->nullable();
            
            $table->decimal('overdue_risk_score', 5, 2)->nullable();
            $table->jsonb('ai_suggestions')->nullable();
            $table->jsonb('extracted_entities')->nullable();
            $table->jsonb('tags')->nullable();
            $table->jsonb('custom_fields')->nullable();
            $table->integer('position')->default(0);
            
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('organization_id')
                ->references('id')
                ->on('organizations')
                ->onDelete('cascade');

            $table->foreign('project_id')
                ->references('id')
                ->on('projects')
                ->onDelete('cascade');

            $table->foreign('requestor_id')
                ->references('id')
                ->on('users')
                ->onDelete('restrict');

            $table->foreign('owner_id')
                ->references('id')
                ->on('users')
                ->onDelete('set null');

            $table->foreign('parent_id')
                ->references('id')
                ->on('tasks')
                ->onDelete('cascade');

            $table->index(['project_id', 'state']);
            $table->index(['owner_id', 'state']);
            $table->index(['requestor_id', 'state']);
            $table->index(['due_date', 'state']);
            $table->index('source_channel');
            $table->index('priority');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tasks');
    }
};
```

---

## Migration 5: Task Actions

```php
<?php
// database/migrations/xxxx_create_task_actions_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('task_actions', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('task_id');
            $table->uuid('user_id')->nullable();
            
            $table->string('action_type', 100);
            $table->string('from_state', 50)->nullable();
            $table->string('to_state', 50)->nullable();
            $table->jsonb('changes')->nullable();
            $table->text('comment')->nullable();
            $table->string('channel', 50)->nullable();
            
            $table->timestamp('created_at');

            $table->foreign('task_id')
                ->references('id')
                ->on('tasks')
                ->onDelete('cascade');

            $table->foreign('user_id')
                ->references('id')
                ->on('users')
                ->onDelete('set null');

            $table->index(['task_id', 'created_at']);
            $table->index('action_type');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('task_actions');
    }
};
```

---

## Migration 6: Task Messages

```php
<?php
// database/migrations/xxxx_create_task_messages_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('task_messages', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('task_id');
            $table->uuid('user_id');
            $table->text('content');
            $table->string('channel', 50)->default('web');
            $table->jsonb('mentions')->nullable();
            $table->uuid('reply_to_id')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('task_id')
                ->references('id')
                ->on('tasks')
                ->onDelete('cascade');

            $table->foreign('user_id')
                ->references('id')
                ->on('users')
                ->onDelete('cascade');

            $table->foreign('reply_to_id')
                ->references('id')
                ->on('task_messages')
                ->onDelete('set null');

            $table->index(['task_id', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('task_messages');
    }
};
```

---

## Migration 7: Task Dependencies

```php
<?php
// database/migrations/xxxx_create_task_dependencies_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('task_dependencies', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('task_id');
            $table->uuid('depends_on_id');
            $table->string('type', 50)->default('finish_to_start');
            $table->integer('lag_days')->default(0);
            $table->timestamps();

            $table->foreign('task_id')
                ->references('id')
                ->on('tasks')
                ->onDelete('cascade');

            $table->foreign('depends_on_id')
                ->references('id')
                ->on('tasks')
                ->onDelete('cascade');

            $table->unique(['task_id', 'depends_on_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('task_dependencies');
    }
};
```

---

## Migration 8: Questions & Answers

```php
<?php
// database/migrations/xxxx_create_questions_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('questions', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('organization_id');
            $table->uuid('project_id');
            $table->uuid('author_id');
            $table->uuid('accepted_answer_id')->nullable();
            $table->uuid('converted_task_id')->nullable();
            
            $table->string('title');
            $table->text('body');
            $table->string('status', 50)->default('open');
            $table->string('priority', 50)->default('medium');
            $table->jsonb('tags')->nullable();
            $table->integer('view_count')->default(0);
            $table->integer('vote_count')->default(0);
            
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('organization_id')
                ->references('id')
                ->on('organizations')
                ->onDelete('cascade');

            $table->foreign('project_id')
                ->references('id')
                ->on('projects')
                ->onDelete('cascade');

            $table->foreign('author_id')
                ->references('id')
                ->on('users')
                ->onDelete('cascade');

            $table->index(['project_id', 'status']);
        });

        Schema::create('answers', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('question_id');
            $table->uuid('author_id');
            $table->text('body');
            $table->integer('vote_count')->default(0);
            $table->boolean('is_ai_suggested')->default(false);
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('question_id')
                ->references('id')
                ->on('questions')
                ->onDelete('cascade');

            $table->foreign('author_id')
                ->references('id')
                ->on('users')
                ->onDelete('cascade');
        });

        // Add foreign key for accepted_answer after answers table exists
        Schema::table('questions', function (Blueprint $table) {
            $table->foreign('accepted_answer_id')
                ->references('id')
                ->on('answers')
                ->onDelete('set null');

            $table->foreign('converted_task_id')
                ->references('id')
                ->on('tasks')
                ->onDelete('set null');
        });

        Schema::create('question_votes', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('user_id');
            $table->string('voteable_type');
            $table->uuid('voteable_id');
            $table->smallInteger('value');
            $table->timestamps();

            $table->foreign('user_id')
                ->references('id')
                ->on('users')
                ->onDelete('cascade');

            $table->unique(['user_id', 'voteable_type', 'voteable_id']);
            $table->index(['voteable_type', 'voteable_id']);
        });
    }

    public function down(): void
    {
        Schema::table('questions', function (Blueprint $table) {
            $table->dropForeign(['accepted_answer_id']);
            $table->dropForeign(['converted_task_id']);
        });
        Schema::dropIfExists('question_votes');
        Schema::dropIfExists('answers');
        Schema::dropIfExists('questions');
    }
};
```

---

## Migration 9: Problems

```php
<?php
// database/migrations/xxxx_create_problems_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('problems', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('organization_id');
            $table->uuid('project_id');
            $table->uuid('reporter_id');
            $table->uuid('assignee_id')->nullable();
            
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('type', 50);
            $table->string('severity', 50);
            $table->string('status', 50)->default('open');
            
            $table->integer('impact_score')->nullable();
            $table->integer('likelihood_score')->nullable();
            
            $table->text('root_cause')->nullable();
            $table->text('resolution')->nullable();
            $table->timestamp('resolved_at')->nullable();
            
            $table->jsonb('related_task_ids')->nullable();
            $table->jsonb('tags')->nullable();
            
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('organization_id')
                ->references('id')
                ->on('organizations')
                ->onDelete('cascade');

            $table->foreign('project_id')
                ->references('id')
                ->on('projects')
                ->onDelete('cascade');

            $table->foreign('reporter_id')
                ->references('id')
                ->on('users')
                ->onDelete('cascade');

            $table->foreign('assignee_id')
                ->references('id')
                ->on('users')
                ->onDelete('set null');

            $table->index(['project_id', 'status', 'severity']);
            $table->index('type');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('problems');
    }
};
```

---

## Migration 10: Sprints & Milestones

```php
<?php
// database/migrations/xxxx_create_sprints_milestones_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('sprints', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('project_id');
            $table->string('name');
            $table->text('goal')->nullable();
            $table->date('start_date');
            $table->date('end_date');
            $table->string('status', 50)->default('planning');
            $table->integer('velocity')->nullable();
            $table->timestamps();

            $table->foreign('project_id')
                ->references('id')
                ->on('projects')
                ->onDelete('cascade');

            $table->index(['project_id', 'status']);
        });

        Schema::create('milestones', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('project_id');
            $table->string('name');
            $table->text('description')->nullable();
            $table->date('target_date');
            $table->date('completed_date')->nullable();
            $table->string('status', 50)->default('pending');
            $table->timestamps();

            $table->foreign('project_id')
                ->references('id')
                ->on('projects')
                ->onDelete('cascade');

            $table->index(['project_id', 'status']);
        });

        // Add foreign keys to tasks table for sprint and milestone
        Schema::table('tasks', function (Blueprint $table) {
            $table->foreign('sprint_id')
                ->references('id')
                ->on('sprints')
                ->onDelete('set null');

            $table->foreign('milestone_id')
                ->references('id')
                ->on('milestones')
                ->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::table('tasks', function (Blueprint $table) {
            $table->dropForeign(['sprint_id']);
            $table->dropForeign(['milestone_id']);
        });
        Schema::dropIfExists('milestones');
        Schema::dropIfExists('sprints');
    }
};
```

---

## Step 11: Run Migrations

```bash
php artisan migrate
```

---

## Step 12: Create Blade Template

**resources/views/app.blade.php**
```blade
<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    
    <title>{{ config('app.name', '4 Projects.ai') }}</title>
    
    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=inter:400,500,600,700" rel="stylesheet" />
    
    <!-- Scripts -->
    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>
<body class="font-sans antialiased">
    <div id="app"></div>
</body>
</html>
```

---

## Step 13: Configure Routes

**routes/web.php**
```php
<?php

use Illuminate\Support\Facades\Route;

Route::get('/{any}', function () {
    return view('app');
})->where('any', '.*');
```

---

## Step 14: Run Development Servers

Open 4 terminal windows:

```bash
# Terminal 1: Laravel
php artisan serve

# Terminal 2: Vite
npm run dev

# Terminal 3: Horizon (queue worker)
php artisan horizon

# Terminal 4: Reverb (WebSockets)
php artisan reverb:start
```

---

## ✅ Setup Complete Checklist

- [ ] Laravel project created
- [ ] All Composer packages installed
- [ ] All NPM packages installed
- [ ] Vite configured with Vue
- [ ] TailwindCSS configured
- [ ] Environment variables set
- [ ] Services configuration added
- [ ] PostgreSQL database created
- [ ] All migrations run successfully
- [ ] Blade template created
- [ ] Routes configured
- [ ] Development servers running
