# 4 Projects.ai - Cursor Master Instructions

## 🎯 Master Cursor Prompt

Copy this entire prompt into Cursor's AI settings or use at the start of each session:

```
You are building 4 Projects.ai, an AI-driven enterprise project management platform with multi-channel task capture via the "Task Juggler" engine.

TECH STACK:
- Backend: Laravel 11, PHP 8.3
- Frontend: Vue 3, Vite, Pinia, TailwindCSS
- Database: PostgreSQL
- Cache/Queue: Redis
- Queue Dashboard: Laravel Horizon
- WebSockets: Laravel Reverb
- AI: OpenRouter API (Claude/GPT models)
- SMS/Voice: Twilio
- Deployment: Railway

CORE CONCEPTS:
1. Task Juggler Engine - Multi-channel task creation (web, mobile, email, SMS, voice, Slack)
2. Requestor/Owner Model - Every task has a requestor (who asks) and owner (who executes)
3. Task Exchange Format (TEF) - Open JSON standard for task portability
4. Question Forum - Built-in uncertainty capture with voting
5. Known Problems - Separate tracking for bugs, risks, impediments

TASK STATE MACHINE:
pending → accepted → in_progress → completed
       ↘ declined
                  ↘ cancelled
                  ↘ overdue → in_progress/cancelled

DATABASE: PostgreSQL with UUID primary keys
CODING STYLE: 
- Use PHP 8.3 features (enums, typed properties, match expressions)
- Laravel best practices (service classes, form requests, resources)
- Vue 3 Composition API with <script setup>
- TypeScript-style JSDoc comments in Vue

FILE LOCATIONS:
- Models: app/Models/
- Services: app/Services/
- Controllers: app/Http/Controllers/Api/
- Vue Components: resources/js/components/
- Vue Views: resources/js/views/
- Stores: resources/js/stores/

When generating code:
1. Always use UUIDs for primary keys
2. Always include soft deletes on main models
3. Always create corresponding TaskAction audit entries for task changes
4. Always broadcast events for real-time updates
5. Use enums for status/type fields
```

---

## 📋 7-Phase Build Plan

### Phase 1: Project Setup & Configuration
- [ ] Create Laravel 11 project
- [ ] Install all Composer dependencies
- [ ] Install all NPM dependencies
- [ ] Configure environment variables
- [ ] Setup Vite with Vue 3
- [ ] Configure TailwindCSS
- [ ] Setup PostgreSQL database
- [ ] Configure Redis connection
- [ ] Install and configure Horizon
- [ ] Install and configure Reverb

### Phase 2: Database Schema
- [ ] Create UUID trait
- [ ] Create all enums
- [ ] Migration: organizations
- [ ] Migration: users (enhance)
- [ ] Migration: projects & project_members
- [ ] Migration: tasks
- [ ] Migration: task_actions (audit)
- [ ] Migration: task_messages
- [ ] Migration: task_dependencies
- [ ] Migration: questions, answers, votes
- [ ] Migration: problems
- [ ] Migration: sprints & milestones
- [ ] Create all model factories
- [ ] Create database seeders

### Phase 3: Models & Relationships
- [ ] Organization model
- [ ] User model (enhanced)
- [ ] Project model
- [ ] ProjectMember model
- [ ] Task model with state machine
- [ ] TaskAction model
- [ ] TaskMessage model
- [ ] TaskDependency model
- [ ] Question model
- [ ] Answer model
- [ ] Problem model
- [ ] Sprint model
- [ ] Milestone model

### Phase 4: Services Layer
- [ ] TaskJugglerService (core task operations)
- [ ] TaskStateMachine (state transitions)
- [ ] OpenRouterService (AI API wrapper)
- [ ] NLPExtractor (parse raw text to tasks)
- [ ] TaskAssignmentAI (smart owner suggestions)
- [ ] TEFExporter (Task Exchange Format)
- [ ] Channel handlers (Email, SMS, Voice, Slack)

### Phase 5: API Layer
- [ ] AuthController (register, login, logout)
- [ ] ProjectController (CRUD + stats)
- [ ] TaskController (CRUD + state transitions)
- [ ] QuestionController (CRUD + voting + convert)
- [ ] ProblemController (CRUD + resolve)
- [ ] TeamController (members, invite, roles)
- [ ] TEFController (import/export)
- [ ] WebhookController (email, SMS, voice, Slack)
- [ ] DashboardController (stats, activity)
- [ ] All Form Requests
- [ ] All API Resources

### Phase 6: Frontend
- [ ] Vue app entry point
- [ ] Router configuration
- [ ] Auth store (Pinia)
- [ ] Projects store
- [ ] Tasks store
- [ ] WebSocket service
- [ ] API service
- [ ] Layout components
- [ ] Dashboard view
- [ ] Project views (list, detail, settings)
- [ ] Task views (list, detail, kanban, gantt)
- [ ] Question Forum views
- [ ] Problems views
- [ ] Settings views

### Phase 7: Deployment & Testing
- [ ] Railway configuration
- [ ] Environment variables setup
- [ ] Horizon configuration
- [ ] Reverb configuration
- [ ] Feature tests for tasks
- [ ] Feature tests for auth
- [ ] Feature tests for projects
- [ ] Browser tests (optional)

---

## 🗄️ Complete Database Schema

### Table: organizations
```
id              UUID PRIMARY KEY
name            VARCHAR(255)
slug            VARCHAR(255) UNIQUE
plan            VARCHAR(50) DEFAULT 'free'  -- free, team, business, enterprise
max_users       INTEGER DEFAULT 5
max_projects    INTEGER DEFAULT 3
features        JSONB                        -- enabled features
settings        JSONB
trial_ends_at   TIMESTAMP
created_at      TIMESTAMP
updated_at      TIMESTAMP
deleted_at      TIMESTAMP
```

### Table: users
```
id                      UUID PRIMARY KEY
organization_id         UUID REFERENCES organizations
name                    VARCHAR(255)
email                   VARCHAR(255) UNIQUE
email_verified_at       TIMESTAMP
password                VARCHAR(255)
phone                   VARCHAR(50)
phone_verified          BOOLEAN DEFAULT FALSE
timezone                VARCHAR(100) DEFAULT 'UTC'
avatar                  VARCHAR(255)
notification_preferences JSONB
skills                  JSONB                    -- for AI assignment
capacity_hours_per_week INTEGER DEFAULT 40
slack_user_id           VARCHAR(100)
last_active_at          TIMESTAMP
remember_token          VARCHAR(100)
created_at              TIMESTAMP
updated_at              TIMESTAMP
deleted_at              TIMESTAMP
```

### Table: projects
```
id                  UUID PRIMARY KEY
organization_id     UUID REFERENCES organizations
owner_id            UUID REFERENCES users
name                VARCHAR(255)
code                VARCHAR(10)              -- short code like "PROJ"
description         TEXT
methodology         VARCHAR(50) DEFAULT 'hybrid'  -- agile, waterfall, hybrid
status              VARCHAR(50) DEFAULT 'active'  -- planning, active, on_hold, completed, archived
priority            VARCHAR(50) DEFAULT 'medium'
start_date          DATE
target_end_date     DATE
actual_end_date     DATE
budget              DECIMAL(12,2)
budget_spent        DECIMAL(12,2) DEFAULT 0
settings            JSONB
tags                JSONB
health_score        INTEGER                  -- 0-100 AI-calculated
created_at          TIMESTAMP
updated_at          TIMESTAMP
deleted_at          TIMESTAMP
```

### Table: project_members
```
id                      UUID PRIMARY KEY
project_id              UUID REFERENCES projects
user_id                 UUID REFERENCES users
role                    VARCHAR(50) DEFAULT 'member'  -- owner, admin, member, viewer
allocation_percentage   INTEGER DEFAULT 100
created_at              TIMESTAMP
updated_at              TIMESTAMP
UNIQUE(project_id, user_id)
```

### Table: tasks
```
id                  UUID PRIMARY KEY
organization_id     UUID REFERENCES organizations
project_id          UUID REFERENCES projects
requestor_id        UUID REFERENCES users        -- who requested
owner_id            UUID REFERENCES users        -- who executes
parent_id           UUID REFERENCES tasks        -- for subtasks
title               VARCHAR(255)
description         TEXT
state               VARCHAR(50) DEFAULT 'pending'
source_channel      VARCHAR(50)                  -- web, mobile, email, sms, voice, slack
source_metadata     JSONB
priority            VARCHAR(50) DEFAULT 'medium'
due_date            TIMESTAMP
started_at          TIMESTAMP
completed_at        TIMESTAMP
estimated_hours     INTEGER
actual_hours        DECIMAL(8,2) DEFAULT 0
sprint_id           UUID REFERENCES sprints
milestone_id        UUID REFERENCES milestones
overdue_risk_score  DECIMAL(5,2)                 -- 0-100
ai_suggestions      JSONB
extracted_entities  JSONB
tags                JSONB
custom_fields       JSONB
position            INTEGER DEFAULT 0
created_at          TIMESTAMP
updated_at          TIMESTAMP
deleted_at          TIMESTAMP
```

### Table: task_actions (Audit Trail)
```
id              UUID PRIMARY KEY
task_id         UUID REFERENCES tasks
user_id         UUID REFERENCES users    -- NULL for system actions
action_type     VARCHAR(100)             -- created, assigned, accepted, declined, started, completed, etc.
from_state      VARCHAR(50)
to_state        VARCHAR(50)
changes         JSONB
comment         TEXT
channel         VARCHAR(50)
created_at      TIMESTAMP
```

### Table: task_messages
```
id              UUID PRIMARY KEY
task_id         UUID REFERENCES tasks
user_id         UUID REFERENCES users
content         TEXT
channel         VARCHAR(50) DEFAULT 'web'
mentions        JSONB
reply_to_id     UUID REFERENCES task_messages
created_at      TIMESTAMP
updated_at      TIMESTAMP
deleted_at      TIMESTAMP
```

### Table: task_dependencies
```
id              UUID PRIMARY KEY
task_id         UUID REFERENCES tasks
depends_on_id   UUID REFERENCES tasks
type            VARCHAR(50) DEFAULT 'finish_to_start'
lag_days        INTEGER DEFAULT 0
created_at      TIMESTAMP
updated_at      TIMESTAMP
UNIQUE(task_id, depends_on_id)
```

### Table: questions
```
id                  UUID PRIMARY KEY
organization_id     UUID REFERENCES organizations
project_id          UUID REFERENCES projects
author_id           UUID REFERENCES users
accepted_answer_id  UUID REFERENCES answers
converted_task_id   UUID REFERENCES tasks
title               VARCHAR(255)
body                TEXT
status              VARCHAR(50) DEFAULT 'open'  -- open, answered, resolved, closed
priority            VARCHAR(50) DEFAULT 'medium'
tags                JSONB
view_count          INTEGER DEFAULT 0
vote_count          INTEGER DEFAULT 0
created_at          TIMESTAMP
updated_at          TIMESTAMP
deleted_at          TIMESTAMP
```

### Table: answers
```
id              UUID PRIMARY KEY
question_id     UUID REFERENCES questions
author_id       UUID REFERENCES users
body            TEXT
vote_count      INTEGER DEFAULT 0
is_ai_suggested BOOLEAN DEFAULT FALSE
created_at      TIMESTAMP
updated_at      TIMESTAMP
deleted_at      TIMESTAMP
```

### Table: question_votes
```
id              UUID PRIMARY KEY
user_id         UUID REFERENCES users
voteable_type   VARCHAR(255)
voteable_id     UUID
value           SMALLINT                -- 1 or -1
created_at      TIMESTAMP
updated_at      TIMESTAMP
UNIQUE(user_id, voteable_type, voteable_id)
```

### Table: problems
```
id                  UUID PRIMARY KEY
organization_id     UUID REFERENCES organizations
project_id          UUID REFERENCES projects
reporter_id         UUID REFERENCES users
assignee_id         UUID REFERENCES users
title               VARCHAR(255)
description         TEXT
type                VARCHAR(50)          -- bug, risk, impediment, dependency
severity            VARCHAR(50)          -- critical, high, medium, low
status              VARCHAR(50) DEFAULT 'open'
impact_score        INTEGER              -- 1-10
likelihood_score    INTEGER              -- 1-10 (for risks)
root_cause          TEXT
resolution          TEXT
resolved_at         TIMESTAMP
related_task_ids    JSONB
tags                JSONB
created_at          TIMESTAMP
updated_at          TIMESTAMP
deleted_at          TIMESTAMP
```

### Table: sprints
```
id              UUID PRIMARY KEY
project_id      UUID REFERENCES projects
name            VARCHAR(255)
goal            TEXT
start_date      DATE
end_date        DATE
status          VARCHAR(50) DEFAULT 'planning'  -- planning, active, completed
velocity        INTEGER
created_at      TIMESTAMP
updated_at      TIMESTAMP
```

### Table: milestones
```
id              UUID PRIMARY KEY
project_id      UUID REFERENCES projects
name            VARCHAR(255)
description     TEXT
target_date     DATE
completed_date  DATE
status          VARCHAR(50) DEFAULT 'pending'  -- pending, in_progress, completed, missed
created_at      TIMESTAMP
updated_at      TIMESTAMP
```

---

## 📁 Directory Structure

```
4projects/
├── app/
│   ├── Enums/
│   │   ├── TaskState.php
│   │   ├── TaskPriority.php
│   │   ├── TaskChannel.php
│   │   ├── ProjectStatus.php
│   │   ├── ProjectMethodology.php
│   │   ├── ProblemType.php
│   │   ├── ProblemSeverity.php
│   │   ├── QuestionStatus.php
│   │   └── MemberRole.php
│   ├── Events/
│   │   ├── TaskCreated.php
│   │   ├── TaskStateChanged.php
│   │   ├── TaskAssigned.php
│   │   ├── MessageAdded.php
│   │   └── QuestionAnswered.php
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── Api/
│   │   │   │   ├── AuthController.php
│   │   │   │   ├── DashboardController.php
│   │   │   │   ├── ProjectController.php
│   │   │   │   ├── TaskController.php
│   │   │   │   ├── QuestionController.php
│   │   │   │   ├── ProblemController.php
│   │   │   │   ├── TeamController.php
│   │   │   │   ├── TEFController.php
│   │   │   │   ├── SprintController.php
│   │   │   │   └── WebhookController.php
│   │   │   └── Controller.php
│   │   ├── Requests/
│   │   │   ├── CreateTaskRequest.php
│   │   │   ├── UpdateTaskRequest.php
│   │   │   ├── CreateProjectRequest.php
│   │   │   ├── CreateQuestionRequest.php
│   │   │   └── CreateProblemRequest.php
│   │   └── Resources/
│   │       ├── TaskResource.php
│   │       ├── TaskCollection.php
│   │       ├── ProjectResource.php
│   │       ├── QuestionResource.php
│   │       ├── ProblemResource.php
│   │       └── UserResource.php
│   ├── Jobs/
│   │   ├── ProcessIncomingEmail.php
│   │   ├── ProcessIncomingSMS.php
│   │   ├── ProcessVoiceTranscription.php
│   │   ├── ProcessSlackEvent.php
│   │   ├── AnalyzeTaskRisk.php
│   │   └── SuggestTaskOwner.php
│   ├── Models/
│   │   ├── Concerns/
│   │   │   └── HasUuid.php
│   │   ├── Organization.php
│   │   ├── User.php
│   │   ├── Project.php
│   │   ├── ProjectMember.php
│   │   ├── Task.php
│   │   ├── TaskAction.php
│   │   ├── TaskMessage.php
│   │   ├── TaskDependency.php
│   │   ├── Question.php
│   │   ├── Answer.php
│   │   ├── QuestionVote.php
│   │   ├── Problem.php
│   │   ├── Sprint.php
│   │   └── Milestone.php
│   ├── Notifications/
│   │   ├── TaskAssigned.php
│   │   ├── TaskStateChanged.php
│   │   └── MentionedInTask.php
│   ├── Policies/
│   │   ├── ProjectPolicy.php
│   │   ├── TaskPolicy.php
│   │   └── QuestionPolicy.php
│   └── Services/
│       ├── AI/
│       │   ├── OpenRouterService.php
│       │   ├── NLPExtractor.php
│       │   ├── TaskAssignmentAI.php
│       │   └── PredictiveAnalytics.php
│       └── TaskJuggler/
│           ├── TaskJugglerService.php
│           ├── TaskStateMachine.php
│           ├── TEFExporter.php
│           └── Channels/
│               ├── ChannelInterface.php
│               ├── WebChannel.php
│               ├── EmailChannel.php
│               ├── SMSChannel.php
│               ├── VoiceChannel.php
│               └── SlackChannel.php
├── config/
│   ├── horizon.php
│   ├── reverb.php
│   └── services.php (add openrouter, twilio, slack)
├── database/
│   ├── factories/
│   │   ├── OrganizationFactory.php
│   │   ├── ProjectFactory.php
│   │   ├── TaskFactory.php
│   │   └── UserFactory.php
│   ├── migrations/
│   │   ├── 0001_create_organizations_table.php
│   │   ├── 0002_enhance_users_table.php
│   │   ├── 0003_create_projects_table.php
│   │   ├── 0004_create_tasks_table.php
│   │   ├── 0005_create_task_actions_table.php
│   │   ├── 0006_create_task_messages_table.php
│   │   ├── 0007_create_task_dependencies_table.php
│   │   ├── 0008_create_questions_table.php
│   │   ├── 0009_create_problems_table.php
│   │   └── 0010_create_sprints_milestones_table.php
│   └── seeders/
│       ├── DatabaseSeeder.php
│       └── DemoDataSeeder.php
├── resources/
│   ├── css/
│   │   └── app.css
│   ├── js/
│   │   ├── app.js
│   │   ├── bootstrap.js
│   │   ├── components/
│   │   │   ├── common/
│   │   │   │   ├── AppButton.vue
│   │   │   │   ├── AppModal.vue
│   │   │   │   ├── AppDropdown.vue
│   │   │   │   ├── UserAvatar.vue
│   │   │   │   └── LoadingSpinner.vue
│   │   │   ├── tasks/
│   │   │   │   ├── TaskCard.vue
│   │   │   │   ├── TaskList.vue
│   │   │   │   ├── TaskDetail.vue
│   │   │   │   ├── TaskStateBadge.vue
│   │   │   │   ├── TaskPriorityBadge.vue
│   │   │   │   ├── TaskChannelIcon.vue
│   │   │   │   ├── CreateTaskModal.vue
│   │   │   │   └── TaskDetailSlideOver.vue
│   │   │   ├── kanban/
│   │   │   │   ├── KanbanBoard.vue
│   │   │   │   └── KanbanColumn.vue
│   │   │   ├── projects/
│   │   │   │   ├── ProjectCard.vue
│   │   │   │   └── ProjectSelector.vue
│   │   │   └── questions/
│   │   │       ├── QuestionCard.vue
│   │   │       └── AnswerCard.vue
│   │   ├── composables/
│   │   │   ├── useApi.js
│   │   │   ├── useAuth.js
│   │   │   ├── useWebSocket.js
│   │   │   └── useToast.js
│   │   ├── layouts/
│   │   │   ├── AppLayout.vue
│   │   │   ├── AuthLayout.vue
│   │   │   └── ProjectLayout.vue
│   │   ├── router/
│   │   │   └── index.js
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   └── websocket.js
│   │   ├── stores/
│   │   │   ├── auth.js
│   │   │   ├── projects.js
│   │   │   ├── tasks.js
│   │   │   ├── questions.js
│   │   │   └── ui.js
│   │   └── views/
│   │       ├── auth/
│   │       │   ├── Login.vue
│   │       │   └── Register.vue
│   │       ├── Dashboard.vue
│   │       ├── MyTasks.vue
│   │       ├── MyRequests.vue
│   │       ├── projects/
│   │       │   ├── ProjectList.vue
│   │       │   ├── ProjectLayout.vue
│   │       │   ├── ProjectOverview.vue
│   │       │   ├── ProjectSettings.vue
│   │       │   ├── tasks/
│   │       │   │   ├── TaskList.vue
│   │       │   │   └── TaskDetail.vue
│   │       │   ├── KanbanBoard.vue
│   │       │   ├── GanttChart.vue
│   │       │   └── questions/
│   │       │       └── QuestionList.vue
│   │       ├── Team.vue
│   │       └── Settings.vue
│   └── views/
│       └── app.blade.php
├── routes/
│   ├── api.php
│   ├── channels.php
│   └── web.php
├── tests/
│   └── Feature/
│       ├── TaskTest.php
│       ├── ProjectTest.php
│       └── AuthTest.php
├── .env.example
├── composer.json
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── nixpacks.toml
├── Procfile
└── railway.json
```

---

## 🚀 Railway Deployment Configuration

### railway.json
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "numReplicas": 1,
    "startCommand": "php artisan config:cache && php artisan route:cache && php artisan view:cache && php artisan migrate --force && php artisan serve --host=0.0.0.0 --port=$PORT",
    "healthcheckPath": "/api/health",
    "healthcheckTimeout": 100
  }
}
```

### Required Railway Services
1. **PostgreSQL** - Main database
2. **Redis** - Cache, sessions, queues
3. **Web Service** - Laravel app
4. **Worker Service** - Horizon queue worker
5. **Reverb Service** - WebSocket server (optional, can use Pusher)

### Environment Variables for Railway
```
APP_NAME="4 Projects.ai"
APP_ENV=production
APP_KEY=base64:...
APP_DEBUG=false
APP_URL=https://your-app.railway.app

DB_CONNECTION=pgsql
DATABASE_URL=${POSTGRES_URL}

REDIS_URL=${REDIS_URL}
CACHE_DRIVER=redis
SESSION_DRIVER=redis
QUEUE_CONNECTION=redis

BROADCAST_DRIVER=reverb
REVERB_APP_ID=4projects
REVERB_APP_KEY=your-key
REVERB_APP_SECRET=your-secret

OPENROUTER_API_KEY=sk-or-...
OPENROUTER_DEFAULT_MODEL=anthropic/claude-3.5-sonnet

TWILIO_SID=AC...
TWILIO_TOKEN=...
TWILIO_PHONE=+1...

SLACK_BOT_TOKEN=xoxb-...
SLACK_SIGNING_SECRET=...
```

---

## ⚡ Quick Commands Reference

### Initial Setup
```bash
# Create project
composer create-project laravel/laravel 4projects
cd 4projects

# Install PHP dependencies
composer require laravel/horizon laravel/reverb laravel/sanctum
composer require spatie/laravel-permission spatie/laravel-medialibrary
composer require twilio/sdk laravel/slack-notification-channel

# Install JS dependencies
npm install vue@3 @vitejs/plugin-vue pinia vue-router@4
npm install @vueuse/core axios dayjs
npm install -D tailwindcss postcss autoprefixer @tailwindcss/forms @tailwindcss/typography
npm install @headlessui/vue @heroicons/vue
npm install chart.js vue-chartjs pusher-js laravel-echo
```

### Development
```bash
# Run migrations
php artisan migrate

# Start all services (separate terminals)
php artisan serve
php artisan horizon
php artisan reverb:start
npm run dev

# Generate code
php artisan make:model Task -mf
php artisan make:controller Api/TaskController --api
php artisan make:request CreateTaskRequest
php artisan make:resource TaskResource
php artisan make:event TaskStateChanged
php artisan make:job ProcessIncomingEmail
```

### Testing
```bash
php artisan test
php artisan test --filter=TaskTest
php artisan test --coverage
```

### Deployment
```bash
# Build for production
npm run build
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Deploy to Railway
railway up
```

---

## ✅ Success Checklist

### Core Functionality
- [ ] User can register and login
- [ ] User can create organizations
- [ ] User can create projects
- [ ] User can create tasks via web interface
- [ ] Tasks follow state machine rules
- [ ] Audit trail records all task actions
- [ ] Real-time updates via WebSocket

### Multi-Channel (Task Juggler)
- [ ] Tasks created from web UI
- [ ] Tasks created from email
- [ ] Tasks created from SMS
- [ ] Tasks created from voice
- [ ] Tasks created from Slack
- [ ] Channel source tracked on each task

### AI Features
- [ ] AI extracts task details from raw text
- [ ] AI suggests task owners
- [ ] AI calculates overdue risk score

### Question Forum
- [ ] Users can post questions
- [ ] Users can answer questions
- [ ] Voting on questions/answers works
- [ ] Questions can be converted to tasks

### Known Problems
- [ ] Users can report problems
- [ ] Problems categorized by type/severity
- [ ] Problems can be resolved
- [ ] Root cause tracking works

### Task Exchange Format
- [ ] Single task export to TEF JSON
- [ ] Project export to TEF JSON
- [ ] TEF import creates tasks
